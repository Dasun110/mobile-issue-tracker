import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { fetchInitialIssues, syncPendingAction } from '../services/mockApi';
import { Issue, IssueFilters, IssueInput, PendingAction, PendingActionType } from '../types/issue';

const defaultFilters: IssueFilters = {
  query: '',
  status: 'All',
  priority: 'All',
};

type IssueState = {
  issues: Issue[];
  filters: IssueFilters;
  pendingActions: PendingAction[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  initialized: boolean;
  setFilters: (filters: Partial<IssueFilters>) => void;
  initializeIssues: () => Promise<void>;
  refreshFromApi: () => Promise<void>;
  createIssue: (input: IssueInput) => Issue;
  updateIssue: (issueId: string, input: IssueInput) => void;
  resolveIssue: (issueId: string) => void;
  closeIssue: (issueId: string) => void;
  syncQueue: () => Promise<void>;
  clearError: () => void;
};

const generateIssueId = (): string => `ISS-${Date.now().toString().slice(-6)}`;

const enqueueAction = (
  queue: PendingAction[],
  type: PendingActionType,
  issueId: string,
  payload?: Partial<Issue>
): PendingAction[] => [
  ...queue,
  {
    id: `ACT-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    issueId,
    payload,
    createdAt: new Date().toISOString(),
    retryCount: 0,
  },
];

export const applyFilters = (issues: Issue[], filters: IssueFilters): Issue[] => {
  const normalized = filters.query.trim().toLowerCase();

  return issues.filter((issue) => {
    const matchesQuery = normalized
      ? issue.title.toLowerCase().includes(normalized)
      : true;
    const matchesStatus = filters.status === 'All' || issue.status === filters.status;
    const matchesPriority =
      filters.priority === 'All' || issue.priority === filters.priority;

    return matchesQuery && matchesStatus && matchesPriority;
  });
};

export const getDashboardCounts = (issues: Issue[]): Record<'Open' | 'In Progress' | 'Resolved', number> => ({
  Open: issues.filter((issue) => issue.status === 'Open').length,
  'In Progress': issues.filter((issue) => issue.status === 'In Progress').length,
  Resolved: issues.filter((issue) => issue.status === 'Resolved').length,
});

export const useIssueStore = create<IssueState>()(
  persist(
    (set, get) => ({
      issues: [],
      filters: defaultFilters,
      pendingActions: [],
      loading: false,
      refreshing: false,
      error: null,
      initialized: false,
      setFilters: (filters) =>
        set((state) => ({
          filters: {
            ...state.filters,
            ...filters,
          },
        })),
      clearError: () => set({ error: null }),
      initializeIssues: async () => {
        if (get().initialized || get().issues.length > 0) {
          set({ initialized: true });
          return;
        }

        set({ loading: true, error: null });
        try {
          const data = await fetchInitialIssues();
          set({
            issues: data,
            loading: false,
            initialized: true,
          });
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch issues',
            initialized: true,
          });
        }
      },
      refreshFromApi: async () => {
        set({ refreshing: true, error: null });
        try {
          const remote = await fetchInitialIssues();
          const localById = new Map(get().issues.map((issue) => [issue.id, issue]));

          // Preserve locally created/edited issues by merging remote seed with current records.
          const merged = remote.map((issue) => localById.get(issue.id) ?? issue);
          const localOnly = get().issues.filter(
            (issue) => !remote.some((remoteIssue) => remoteIssue.id === issue.id)
          );

          set({
            issues: [...merged, ...localOnly],
            refreshing: false,
          });
        } catch (error) {
          set({
            refreshing: false,
            error: error instanceof Error ? error.message : 'Refresh failed',
          });
        }
      },
      createIssue: (input) => {
        const now = new Date().toISOString();
        const issue: Issue = {
          id: generateIssueId(),
          ...input,
          assignee: input.assignee?.trim() || undefined,
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          issues: [issue, ...state.issues],
          pendingActions: enqueueAction(state.pendingActions, 'create', issue.id, issue),
        }));

        return issue;
      },
      updateIssue: (issueId, input) => {
        const now = new Date().toISOString();
        set((state) => ({
          issues: state.issues.map((issue) =>
            issue.id === issueId
              ? {
                  ...issue,
                  ...input,
                  assignee: input.assignee?.trim() || undefined,
                  updatedAt: now,
                }
              : issue
          ),
          pendingActions: enqueueAction(state.pendingActions, 'update', issueId, {
            ...input,
            updatedAt: now,
          }),
        }));
      },
      resolveIssue: (issueId) => {
        const now = new Date().toISOString();
        set((state) => ({
          issues: state.issues.map((issue) =>
            issue.id === issueId
              ? {
                  ...issue,
                  status: 'Resolved',
                  updatedAt: now,
                }
              : issue
          ),
          pendingActions: enqueueAction(state.pendingActions, 'resolve', issueId, {
            status: 'Resolved',
            updatedAt: now,
          }),
        }));
      },
      closeIssue: (issueId) => {
        const now = new Date().toISOString();
        set((state) => ({
          issues: state.issues.map((issue) =>
            issue.id === issueId
              ? {
                  ...issue,
                  status: 'Closed',
                  updatedAt: now,
                }
              : issue
          ),
          pendingActions: enqueueAction(state.pendingActions, 'close', issueId, {
            status: 'Closed',
            updatedAt: now,
          }),
        }));
      },
      syncQueue: async () => {
        const queue = [...get().pendingActions];
        if (!queue.length) {
          return;
        }

        const remaining: PendingAction[] = [];

        for (const action of queue) {
          try {
            await syncPendingAction();
          } catch (error) {
            remaining.push({
              ...action,
              retryCount: action.retryCount + 1,
              lastError: error instanceof Error ? error.message : 'Sync failed',
            });
          }
        }

        set({
          pendingActions: remaining,
          error: remaining.length ? 'Some actions are still pending sync' : null,
        });
      },
    }),
    {
      name: 'issue-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        issues: state.issues,
        pendingActions: state.pendingActions,
      }),
    }
  )
);

