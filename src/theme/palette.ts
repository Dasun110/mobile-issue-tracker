import { ColorSchemeName } from 'react-native';
import { IssuePriority, IssueStatus } from '../types/issue';

type PillColors = {
  status: Record<IssueStatus, string>;
  priority: Record<IssuePriority, string>;
};

export type Palette = {
  background: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textMuted: string;
  textOnAccent: string;
  border: string;
  accent: string;
  accentSoft: string;
  success: string;
  danger: string;
  warning: string;
  white: string;
  errorSoft: string;
  shadow: string;
  pillColors: PillColors;
};

const lightPalette: Palette = {
  background: '#f4f7fb',
  surface: '#ffffff',
  surfaceAlt: '#eef2ff',
  text: '#0f172a',
  textMuted: '#64748b',
  textOnAccent: '#ffffff',
  border: '#dbe2ea',
  accent: '#2563eb',
  accentSoft: '#dbeafe',
  success: '#16a34a',
  danger: '#dc2626',
  warning: '#d97706',
  white: '#ffffff',
  errorSoft: '#ef4444',
  shadow: 'rgba(15, 23, 42, 0.09)',
  pillColors: {
    status: {
      Open: '#dbeafe',
      'In Progress': '#ffedd5',
      Resolved: '#dcfce7',
      Closed: '#e2e8f0',
    },
    priority: {
      Low: '#e0f2fe',
      Medium: '#fef9c3',
      High: '#fee2e2',
    },
  },
};

const darkPalette: Palette = {
  background: '#0b1220',
  surface: '#111b2e',
  surfaceAlt: '#1a2740',
  text: '#e2e8f0',
  textMuted: '#94a3b8',
  textOnAccent: '#ffffff',
  border: '#26364f',
  accent: '#3b82f6',
  accentSoft: '#1e3a8a',
  success: '#22c55e',
  danger: '#f87171',
  warning: '#f59e0b',
  white: '#ffffff',
  errorSoft: '#f87171',
  shadow: 'rgba(0, 0, 0, 0.4)',
  pillColors: {
    status: {
      Open: '#1e3a8a',
      'In Progress': '#7c2d12',
      Resolved: '#14532d',
      Closed: '#334155',
    },
    priority: {
      Low: '#0c4a6e',
      Medium: '#713f12',
      High: '#7f1d1d',
    },
  },
};

export const getPalette = (scheme: ColorSchemeName): Palette =>
  scheme === 'dark' ? darkPalette : lightPalette;
