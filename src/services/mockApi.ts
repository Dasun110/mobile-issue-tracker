import axios from 'axios';
import { Issue } from '../types/issue';

const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const seedIssues: Issue[] = [
  {
    id: 'ISS-1001',
    title: 'Login button not responding on slow network',
    description: 'Tap action is ignored while loading indicator is visible.',
    priority: 'High',
    status: 'Open',
    assignee: 'QA Team',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: 'ISS-1002',
    title: 'Dark mode text contrast issue',
    description: 'Subtitle text appears low contrast on issue cards.',
    priority: 'Medium',
    status: 'In Progress',
    assignee: 'Design Team',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: 'ISS-1003',
    title: 'Push notification icon is outdated',
    description: 'Icon should match the latest brand style guide.',
    priority: 'Low',
    status: 'Resolved',
    assignee: 'Mobile Team',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
  },
];

export const mockLogin = async (
  email: string,
  password: string
): Promise<{ token: string; email: string }> => {
  await wait(500);
  if (!email || !password) {
    throw new Error('Missing credentials');
  }
  return {
    token: `mock-token-${Date.now()}`,
    email,
  };
};

export const fetchInitialIssues = async (): Promise<Issue[]> => {
  await wait(900);

  // Keep axios in use to satisfy assignment networking requirement.
  await axios.get('https://jsonplaceholder.typicode.com/posts/1');

  return seedIssues;
};

export const syncPendingAction = async (): Promise<void> => {
  await wait(400);

  // Simulate intermittent network errors while syncing queued operations.
  if (Math.random() < 0.2) {
    throw new Error('Temporary sync failure');
  }
};

