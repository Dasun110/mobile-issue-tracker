import React from 'react';
import { Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { Issue } from '../types/issue';
import { getPalette } from '../theme/palette';
import { formatDateTime } from '../utils/date';
import { StatusPill } from './StatusPill';

type Props = {
  issue: Issue;
  onPress: (id: string) => void;
};

export const IssueCard = ({ issue, onPress }: Props): JSX.Element => {
  const palette = getPalette(useColorScheme());

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: palette.surface,
          borderColor: palette.border,
          shadowColor: palette.shadow,
          transform: [{ scale: pressed ? 0.99 : 1 }],
        },
      ]}
      onPress={() => onPress(issue.id)}
    >
      <Text style={[styles.title, { color: palette.text }]}>{issue.title}</Text>
      <Text style={[styles.subtitle, { color: palette.textMuted }]}>Created {formatDateTime(issue.createdAt)}</Text>
      <View style={styles.metaRow}>
        <StatusPill label={issue.status} type="status" />
        <StatusPill label={issue.priority} type="priority" />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 13,
  },
  metaRow: {
    marginTop: 14,
    flexDirection: 'row',
    gap: 8,
  },
});

