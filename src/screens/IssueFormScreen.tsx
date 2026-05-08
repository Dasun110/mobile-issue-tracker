import React, { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IssueInput, IssuePriority, IssueStatus } from '../types/issue';
import { RootStackParamList } from '../types/navigation';
import { validateIssue } from '../utils/validation';
import { useIssueStore } from '../store/useIssueStore';
import { getPalette } from '../theme/palette';

type Props = NativeStackScreenProps<RootStackParamList, 'IssueForm'>;

const priorities: IssuePriority[] = ['Low', 'Medium', 'High'];
const statuses: IssueStatus[] = ['Open', 'In Progress', 'Resolved', 'Closed'];

const baseInput: IssueInput = {
  title: '',
  description: '',
  priority: 'Medium',
  status: 'Open',
  assignee: '',
};

export const IssueFormScreen = ({ navigation, route }: Props): JSX.Element => {
  const palette = getPalette(useColorScheme());
  const createIssue = useIssueStore((state) => state.createIssue);
  const updateIssue = useIssueStore((state) => state.updateIssue);
  const issue = useIssueStore((state) => {
    if (route.params.mode !== 'edit') {
      return undefined;
    }
    return state.issues.find((item) => item.id === route.params.issueId);
  });

  const initialInput = useMemo<IssueInput>(() => {
    if (!issue) {
      return baseInput;
    }

    return {
      title: issue.title,
      description: issue.description,
      priority: issue.priority,
      status: issue.status,
      assignee: issue.assignee ?? '',
    };
  }, [issue]);

  const [input, setInput] = useState<IssueInput>(initialInput);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = (): void => {
    const foundErrors = validateIssue(input);
    setErrors(foundErrors);

    if (Object.keys(foundErrors).length) {
      return;
    }

    if (route.params.mode === 'create') {
      const created = createIssue(input);
      navigation.replace('IssueDetail', { issueId: created.id });
      return;
    }

    if (!issue) {
      Alert.alert('Cannot update issue', 'This issue no longer exists.');
      navigation.goBack();
      return;
    }

    updateIssue(issue.id, input);
    navigation.replace('IssueDetail', { issueId: issue.id });
  };

  return (
    <SafeAreaView edges={['bottom']} style={[styles.container, { backgroundColor: palette.background }]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[
            styles.card,
            {
              backgroundColor: palette.surface,
              borderColor: palette.border,
              shadowColor: palette.shadow,
            },
          ]}
        >
          <Text style={[styles.heading, { color: palette.text }]}>
            {route.params.mode === 'create' ? 'Create Issue' : 'Edit Issue'}
          </Text>

      <Text style={[styles.label, { color: palette.textMuted }]}>Title</Text>
      <TextInput
        style={[
          styles.input,
          { borderColor: palette.border, color: palette.text, backgroundColor: palette.background },
          errors.title ? { borderColor: palette.danger } : null,
        ]}
        placeholderTextColor={palette.textMuted}
        value={input.title}
        onChangeText={(value) => setInput((prev) => ({ ...prev, title: value }))}
      />
      {errors.title ? <Text style={[styles.error, { color: palette.danger }]}>{errors.title}</Text> : null}

      <Text style={[styles.label, { color: palette.textMuted }]}>Description</Text>
      <TextInput
        multiline
        style={[
          styles.input,
          styles.textArea,
          { borderColor: palette.border, color: palette.text, backgroundColor: palette.background },
          errors.description ? { borderColor: palette.danger } : null,
        ]}
        placeholderTextColor={palette.textMuted}
        value={input.description}
        onChangeText={(value) => setInput((prev) => ({ ...prev, description: value }))}
      />
      {errors.description ? (
        <Text style={[styles.error, { color: palette.danger }]}>{errors.description}</Text>
      ) : null}

      <Text style={[styles.label, { color: palette.textMuted }]}>Priority</Text>
      <View style={styles.segmentRow}>
        {priorities.map((priority) => (
          <Pressable
            key={priority}
            style={({ pressed }) => [
              styles.segment,
              {
                borderColor: input.priority === priority ? palette.accent : palette.border,
                backgroundColor: input.priority === priority ? palette.accentSoft : palette.surface,
                opacity: pressed ? 0.9 : 1,
              },
            ]}
            onPress={() => setInput((prev) => ({ ...prev, priority }))}
          >
            <Text
              style={[
                styles.segmentText,
                {
                  color: input.priority === priority ? palette.accent : palette.textMuted,
                  fontWeight: input.priority === priority ? '700' : '600',
                },
              ]}
            >
              {priority}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={[styles.label, { color: palette.textMuted }]}>Status</Text>
      <View style={styles.segmentRow}>
        {statuses.map((status) => (
          <Pressable
            key={status}
            style={({ pressed }) => [
              styles.segment,
              {
                borderColor: input.status === status ? palette.accent : palette.border,
                backgroundColor: input.status === status ? palette.accentSoft : palette.surface,
                opacity: pressed ? 0.9 : 1,
              },
            ]}
            onPress={() => setInput((prev) => ({ ...prev, status }))}
          >
            <Text
              style={[
                styles.segmentText,
                {
                  color: input.status === status ? palette.accent : palette.textMuted,
                  fontWeight: input.status === status ? '700' : '600',
                },
              ]}
            >
              {status}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={[styles.label, { color: palette.textMuted }]}>Assignee (optional)</Text>
      <TextInput
        style={[styles.input, { borderColor: palette.border, color: palette.text, backgroundColor: palette.background }]}
        placeholderTextColor={palette.textMuted}
        value={input.assignee}
        onChangeText={(value) => setInput((prev) => ({ ...prev, assignee: value }))}
      />

          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              { backgroundColor: palette.accent, opacity: pressed ? 0.9 : 1 },
            ]}
            onPress={submit}
          >
            <Text style={[styles.primaryText, { color: palette.textOnAccent }]}>
              {route.params.mode === 'create' ? 'Create Issue' : 'Save Changes'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 24,
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
  heading: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
  },
  label: {
    marginTop: 10,
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  textArea: {
    minHeight: 110,
    textAlignVertical: 'top',
  },
  error: {
    marginTop: 6,
  },
  segmentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  segment: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  segmentText: {
    fontSize: 12,
  },
  primaryButton: {
    marginTop: 20,
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 13,
  },
  primaryText: {
    fontWeight: '700',
    fontSize: 15,
  },
});

