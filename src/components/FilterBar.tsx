import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, useColorScheme, View } from 'react-native';
import { IssueFilters, IssuePriority, IssueStatus } from '../types/issue';
import { getPalette } from '../theme/palette';

type Props = {
  filters: IssueFilters;
  onChange: (filters: Partial<IssueFilters>) => void;
};

const statuses: Array<'All' | IssueStatus> = ['All', 'Open', 'In Progress', 'Resolved', 'Closed'];
const priorities: Array<'All' | IssuePriority> = ['All', 'Low', 'Medium', 'High'];

export const FilterBar = ({ filters, onChange }: Props): JSX.Element => {
  const palette = getPalette(useColorScheme());

  return (
    <View
      style={[
        styles.wrapper,
        {
          backgroundColor: palette.surface,
          borderColor: palette.border,
          shadowColor: palette.shadow,
        },
      ]}
    >
      <Text style={[styles.groupTitle, { color: palette.text }]}>Filters</Text>
      <TextInput
        style={[
          styles.input,
          {
            borderColor: palette.border,
            color: palette.text,
            backgroundColor: palette.background,
          },
        ]}
        placeholder="Search by title"
        placeholderTextColor={palette.textMuted}
        value={filters.query}
        onChangeText={(value) => onChange({ query: value })}
      />
      <View style={styles.row}>
        <Text style={[styles.label, { color: palette.textMuted }]}>Status</Text>
        <View style={styles.chipsRow}>
          {statuses.map((status) => (
            <Pressable
              key={status}
              style={({ pressed }) => [
                styles.chip,
                {
                  borderColor: filters.status === status ? palette.accent : palette.border,
                  backgroundColor: filters.status === status ? palette.accentSoft : palette.surface,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
              onPress={() => onChange({ status })}
            >
              <Text
                style={[
                  styles.chipText,
                  {
                    color: filters.status === status ? palette.accent : palette.textMuted,
                    fontWeight: filters.status === status ? '700' : '600',
                  },
                ]}
              >
                {status}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
      <View style={styles.row}>
        <Text style={[styles.label, { color: palette.textMuted }]}>Priority</Text>
        <View style={styles.chipsRow}>
          {priorities.map((priority) => (
            <Pressable
              key={priority}
              style={({ pressed }) => [
                styles.chip,
                {
                  borderColor: filters.priority === priority ? palette.accent : palette.border,
                  backgroundColor: filters.priority === priority ? palette.accentSoft : palette.surface,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
              onPress={() => onChange({ priority })}
            >
              <Text
                style={[
                  styles.chipText,
                  {
                    color: filters.priority === priority ? palette.accent : palette.textMuted,
                    fontWeight: filters.priority === priority ? '700' : '600',
                  },
                ]}
              >
                {priority}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
      <Pressable
        style={({ pressed }) => [
          styles.clearButton,
          {
            borderColor: palette.border,
            backgroundColor: palette.surfaceAlt,
            opacity: pressed ? 0.9 : 1,
          },
        ]}
        onPress={() => onChange({ query: '', status: 'All', priority: 'All' })}
      >
        <Text style={[styles.clearButtonText, { color: palette.text }]}>Reset Filters</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 14,
    gap: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 15,
  },
  row: {
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  chipText: {
    fontSize: 13,
  },
  clearButton: {
    marginTop: 2,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 10,
  },
  clearButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
});

