import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusPill } from '../components/StatusPill';
import { useIssueStore } from '../store/useIssueStore';
import { getPalette } from '../theme/palette';
import { RootStackParamList } from '../types/navigation';
import { formatDateTime } from '../utils/date';

type Props = NativeStackScreenProps<RootStackParamList, 'IssueDetail'>;

export const IssueDetailScreen = ({ route, navigation }: Props): JSX.Element => {
  const palette = getPalette(useColorScheme());
  const { issueId } = route.params;
  const issue = useIssueStore((state) => state.issues.find((item) => item.id === issueId));
  const resolveIssue = useIssueStore((state) => state.resolveIssue);
  const closeIssue = useIssueStore((state) => state.closeIssue);

  if (!issue) {
    return (
      <View style={[styles.centered, { backgroundColor: palette.background }]}>
        <Text style={{ color: palette.text }}>Issue not found.</Text>
      </View>
    );
  }

  const onResolve = (): void => {
    Alert.alert('Resolve issue?', 'This will mark the issue as resolved.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Resolve',
        onPress: () => {
          resolveIssue(issue.id);
        },
      },
    ]);
  };

  const onClose = (): void => {
    Alert.alert('Close issue?', 'This issue will be moved to closed status.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Close',
        style: 'destructive',
        onPress: () => {
          closeIssue(issue.id);
        },
      },
    ]);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: palette.background }]} contentContainerStyle={styles.content}>
      <View
        style={[
          styles.card,
          { backgroundColor: palette.surface, borderColor: palette.border, shadowColor: palette.shadow },
        ]}
      >
        <Text style={[styles.title, { color: palette.text }]}>{issue.title}</Text>
        <View style={styles.metaRow}>
          <StatusPill label={issue.status} type="status" />
          <StatusPill label={issue.priority} type="priority" />
        </View>

        <View style={[styles.section, { backgroundColor: palette.background, borderColor: palette.border }]}>
          <Text style={[styles.label, { color: palette.textMuted }]}>Description</Text>
          <Text style={[styles.value, { color: palette.text }]}>{issue.description}</Text>
        </View>

        <View style={[styles.section, { backgroundColor: palette.background, borderColor: palette.border }]}>
          <Text style={[styles.label, { color: palette.textMuted }]}>Assignee</Text>
          <Text style={[styles.value, { color: palette.text }]}>{issue.assignee || 'Unassigned'}</Text>
        </View>

        <View style={[styles.section, { backgroundColor: palette.background, borderColor: palette.border }]}>
          <Text style={[styles.label, { color: palette.textMuted }]}>Created</Text>
          <Text style={[styles.value, { color: palette.text }]}>{formatDateTime(issue.createdAt)}</Text>
        </View>

        <View style={[styles.section, { backgroundColor: palette.background, borderColor: palette.border }]}>
          <Text style={[styles.label, { color: palette.textMuted }]}>Last Updated</Text>
          <Text style={[styles.value, { color: palette.text }]}>{formatDateTime(issue.updatedAt)}</Text>
        </View>

        <View style={styles.actionRow}>
          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              { borderColor: palette.border, backgroundColor: palette.surfaceAlt, opacity: pressed ? 0.9 : 1 },
            ]}
            onPress={() => navigation.navigate('IssueForm', { mode: 'edit', issueId: issue.id })}
          >
            <Text style={[styles.secondaryText, { color: palette.text }]}>Edit</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              { backgroundColor: palette.success, opacity: pressed ? 0.9 : 1 },
            ]}
            onPress={onResolve}
          >
            <Text style={[styles.primaryText, { color: palette.textOnAccent }]}>Resolve</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.dangerButton,
              { backgroundColor: palette.danger, opacity: pressed ? 0.9 : 1 },
            ]}
            onPress={onClose}
          >
            <Text style={[styles.primaryText, { color: palette.textOnAccent }]}>Close</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingTop: 20,
  },
  card: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 18,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 3,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    lineHeight: 36,
  },
  metaRow: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  section: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
  value: {
    marginTop: 6,
    fontSize: 17,
    fontWeight: '500',
    lineHeight: 24,
  },
  actionRow: {
    marginTop: 18,
    flexDirection: 'row',
    gap: 8,
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 11,
  },
  secondaryText: {
    fontWeight: '600',
  },
  primaryButton: {
    flex: 1,
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 11,
  },
  dangerButton: {
    flex: 1,
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 11,
  },
  primaryText: {
    fontWeight: '700',
  },
});

