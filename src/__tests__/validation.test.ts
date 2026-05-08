import { validateEmail, validateIssue, validatePassword } from '../utils/validation';

describe('validation helpers', () => {
  it('validates email and password inputs', () => {
    expect(validateEmail('')).toBe('Email is required');
    expect(validateEmail('bad-email')).toBe('Email format is invalid');
    expect(validateEmail('test@example.com')).toBeNull();

    expect(validatePassword('')).toBe('Password is required');
    expect(validatePassword('123')).toBe('Password must have at least 6 characters');
    expect(validatePassword('123456')).toBeNull();
  });

  it('validates issue form fields', () => {
    const errors = validateIssue({
      title: '',
      description: '',
      priority: 'High',
      status: 'Open',
      assignee: '',
    });

    expect(errors.title).toBe('Title is required');
    expect(errors.description).toBe('Description is required');
  });
});

