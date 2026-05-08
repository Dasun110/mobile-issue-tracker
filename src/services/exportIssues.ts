import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Issue } from '../types/issue';

const toCsv = (issues: Issue[]): string => {
  const headers = ['id', 'title', 'description', 'priority', 'status', 'assignee', 'createdAt', 'updatedAt'];
  const rows = issues.map((issue) =>
    [
      issue.id,
      issue.title,
      issue.description,
      issue.priority,
      issue.status,
      issue.assignee ?? '',
      issue.createdAt,
      issue.updatedAt,
    ]
      .map((value) => `"${String(value).replace(/"/g, '""')}"`)
      .join(',')
  );

  return [headers.join(','), ...rows].join('\n');
};

export const exportIssuesAsJson = async (issues: Issue[]): Promise<void> => {
  const path = `${FileSystem.cacheDirectory}issues-${Date.now()}.json`;
  await FileSystem.writeAsStringAsync(path, JSON.stringify(issues, null, 2));
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(path);
  }
};

export const exportIssuesAsCsv = async (issues: Issue[]): Promise<void> => {
  const path = `${FileSystem.cacheDirectory}issues-${Date.now()}.csv`;
  await FileSystem.writeAsStringAsync(path, toCsv(issues));
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(path);
  }
};

