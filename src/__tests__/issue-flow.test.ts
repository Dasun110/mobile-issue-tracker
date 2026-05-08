import { applyFilters, getDashboardCounts, useIssueStore } from '../store/useIssueStore';

describe('issue core flow', () => {
  beforeEach(() => {
    useIssueStore.setState({
      issues: [],
      filters: {
        query: '',
        status: 'All',
        priority: 'All',
      },
      pendingActions: [],
      loading: false,
      refreshing: false,
      error: null,
      initialized: true,
    });
  });

  it('creates, updates, resolves, and filters issues', () => {
    const created = useIssueStore.getState().createIssue({
      title: 'Offline action test',
      description: 'Verify local issue lifecycle',
      priority: 'High',
      status: 'Open',
      assignee: 'Tester',
    });

    expect(useIssueStore.getState().issues).toHaveLength(1);

    useIssueStore.getState().updateIssue(created.id, {
      title: 'Offline action test v2',
      description: 'Updated details',
      priority: 'Medium',
      status: 'In Progress',
      assignee: 'Tester',
    });

    useIssueStore.getState().resolveIssue(created.id);

    const issues = useIssueStore.getState().issues;
    const target = issues.find((item) => item.id === created.id);

    expect(target?.status).toBe('Resolved');

    const counts = getDashboardCounts(issues);
    expect(counts.Resolved).toBe(1);

    const filtered = applyFilters(issues, {
      query: 'v2',
      status: 'Resolved',
      priority: 'All',
    });

    expect(filtered).toHaveLength(1);
    expect(useIssueStore.getState().pendingActions.length).toBe(3);
  });
});

