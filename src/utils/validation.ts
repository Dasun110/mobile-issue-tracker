import { IssueInput } from '../types/issue';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateEmail = (email: string): string | null => {
  if (!email.trim()) {
    return 'Email is required';
  }
  if (!emailRegex.test(email.trim().toLowerCase())) {
    return 'Email format is invalid';
  }
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password.trim()) {
    return 'Password is required';
  }
  if (password.trim().length < 6) {
    return 'Password must have at least 6 characters';
  }
  return null;
};

export const validateIssue = (input: IssueInput): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!input.title.trim()) {
    errors.title = 'Title is required';
  }
  if (!input.description.trim()) {
    errors.description = 'Description is required';
  }
  if (!input.priority) {
    errors.priority = 'Priority is required';
  }
  if (!input.status) {
    errors.status = 'Status is required';
  }

  return errors;
};

