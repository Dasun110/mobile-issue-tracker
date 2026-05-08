import React from 'react';
import { StyleSheet, Text, useColorScheme, View } from 'react-native';
import { IssuePriority, IssueStatus } from '../types/issue';
import { getPalette } from '../theme/palette';

type Props = {
  label: IssueStatus | IssuePriority;
  type: 'status' | 'priority';
};

export const StatusPill = ({ label, type }: Props): JSX.Element => {
  const palette = getPalette(useColorScheme());
  const backgroundColor =
    type === 'status'
      ? palette.pillColors.status[label as IssueStatus]
      : palette.pillColors.priority[label as IssuePriority];

  return (
    <View style={[styles.pill, { backgroundColor, borderColor: palette.border }]}>
      <Text style={[styles.text, { color: palette.text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  pill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});

