import { IssueInput } from './issue';

export type RootStackParamList = {
  Login: undefined;
  IssueList: undefined;
  IssueDetail: { issueId: string };
  IssueForm: { mode: 'create' } | { mode: 'edit'; issueId: string };
};

export type IssueFormDraft = IssueInput;

