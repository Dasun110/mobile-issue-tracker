import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { IssueListScreen } from '../screens/IssueListScreen';
import { useAuthStore } from '../store/useAuthStore';
import { useIssueStore } from '../store/useIssueStore';

describe('IssueListScreen', () => {
  beforeEach(() => {
    useAuthStore.setState({
      email: 'test@example.com',
      token: 'token',
      isAuthenticated: true,
    });

    useIssueStore.setState({
      issues: [
        {
          id: 'ISS-1',
          title: 'Sample issue',
          description: 'desc',
          priority: 'High',
          status: 'Open',
          assignee: 'Team',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
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

  it('navigates to create issue form', () => {
    const navigation = {
      navigate: jest.fn(),
    } as any;

    const route = { key: 'IssueList', name: 'IssueList' } as any;

    const { getByText } = render(<IssueListScreen navigation={navigation} route={route} />);

    fireEvent.press(getByText('New Issue'));

    expect(navigation.navigate).toHaveBeenCalledWith('IssueForm', { mode: 'create' });
    expect(getByText('Sample issue')).toBeTruthy();
  });
});

