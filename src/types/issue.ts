export type IssueStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';

export type IssuePriority = 'Low' | 'Medium' | 'High';

export type Issue = {
  id: string;
  title: string;
  description: string;
  priority: IssuePriority;
  status: IssueStatus;
  assignee?: string;
  createdAt: string;
  updatedAt: string;
};

export type IssueInput = {
  title: string;
  description: string;
  priority: IssuePriority;
  status: IssueStatus;
  assignee?: string;
};

export type IssueFilters = {
  query: string;
  status: 'All' | IssueStatus;
  priority: 'All' | IssuePriority;
};

export type PendingActionType = 'create' | 'update' | 'resolve' | 'close';

export type PendingAction = {
  id: string;
  type: PendingActionType;
  issueId: string;
  payload?: Partial<Issue>;
  createdAt: string;
  retryCount: number;
  lastError?: string;
};

