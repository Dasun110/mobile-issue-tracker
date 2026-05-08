import React, { useEffect, useMemo } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppLogo } from '../components/AppLogo';
import { DashboardSummary } from '../components/DashboardSummary';
import { FilterBar } from '../components/FilterBar';
import { IssueCard } from '../components/IssueCard';
import { exportIssuesAsCsv, exportIssuesAsJson } from '../services/exportIssues';
import { useAuthStore } from '../store/useAuthStore';
import { applyFilters, getDashboardCounts, useIssueStore } from '../store/useIssueStore';
import { getPalette } from '../theme/palette';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'IssueList'>;

export const IssueListScreen = ({ navigation }: Props): JSX.Element => {
  const colorScheme = useColorScheme();
  const palette = getPalette(colorScheme);
  const [showFilters, setShowFilters] = React.useState(false);
  const logout = useAuthStore((state) => state.logout);
  const {
    issues,
    filters,
    pendingActions,
    loading,
    refreshing,
    error,
    initializeIssues,
    refreshFromApi,
    setFilters,
    syncQueue,
    clearError,
  } = useIssueStore((state) => state);

  useEffect(() => {
    initializeIssues();
  }, [initializeIssues]);

  const filteredIssues = useMemo(() => applyFilters(issues, filters), [issues, filters]);
  const dashboard = useMemo(() => getDashboardCounts(issues), [issues]);

  const runSync = async (): Promise<void> => {
    await syncQueue();
    if (useIssueStore.getState().pendingActions.length === 0) {
      Alert.alert('Synced', 'All pending actions synced successfully.');
      clearError();
    }
  };

  const onExportJson = async (): Promise<void> => {
    try {
      await exportIssuesAsJson(issues);
    } catch (e) {
      Alert.alert('Export failed', e instanceof Error ? e.message : 'Could not export JSON');
    }
  };

  const onExportCsv = async (): Promise<void> => {
    try {
      await exportIssuesAsCsv(issues);
    } catch (e) {
      Alert.alert('Export failed', e instanceof Error ? e.message : 'Could not export CSV');
    }
  };

  const listHeader = (
    <View>
      <View style={styles.topRow}>
        <View>
          <AppLogo colorScheme={colorScheme} compact />
          <Text style={[styles.heading, { color: palette.text }]}>Issues</Text>
          <Text style={[styles.headingSub, { color: palette.textMuted }]}>
            Track, filter and resolve issues quickly
          </Text>
        </View>
        <View style={styles.topActions}>
          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              styles.topButton,
              { backgroundColor: palette.surface, borderColor: palette.border, opacity: pressed ? 0.9 : 1 },
            ]}
            onPress={logout}
          >
            <Text style={[styles.secondaryText, { color: palette.text }]}>Logout</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              styles.topButton,
              { backgroundColor: palette.accent, opacity: pressed ? 0.9 : 1 },
            ]}
            onPress={() => navigation.navigate('IssueForm', { mode: 'create' })}
          >
            <Text style={[styles.primaryText, { color: palette.textOnAccent }]}>New Issue</Text>
          </Pressable>
        </View>
      </View>

      <DashboardSummary
        open={dashboard.Open}
        inProgress={dashboard['In Progress']}
        resolved={dashboard.Resolved}
      />

      <View style={styles.filterToggleRow}>
        <Pressable
          style={({ pressed }) => [
            styles.secondaryButton,
            styles.filterToggleButton,
            {
              backgroundColor: palette.surface,
              borderColor: palette.border,
              opacity: pressed ? 0.9 : 1,
            },
          ]}
          onPress={() => setShowFilters((prev) => !prev)}
        >
          <Ionicons name="filter" size={16} color={palette.text} />
          <Text style={[styles.secondaryText, { color: palette.text }]}>
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Text>
        </Pressable>
      </View>

      {showFilters ? <FilterBar filters={filters} onChange={setFilters} /> : null}

      <View style={styles.bannerRow}>
        <Pressable
          style={({ pressed }) => [
            styles.secondaryButton,
            styles.flexButton,
            { backgroundColor: palette.surface, borderColor: palette.border, opacity: pressed ? 0.9 : 1 },
          ]}
          onPress={refreshFromApi}
        >
          <Text style={[styles.secondaryText, { color: palette.text }]}>Refresh API</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.secondaryButton,
            styles.flexButton,
            { backgroundColor: palette.surface, borderColor: palette.border, opacity: pressed ? 0.9 : 1 },
          ]}
          onPress={runSync}
        >
          <Text style={[styles.secondaryText, { color: palette.text }]}>Sync Queue ({pendingActions.length})</Text>
        </Pressable>
      </View>

      <View style={styles.bannerRow}>
        <Pressable
          style={({ pressed }) => [
            styles.secondaryButton,
            styles.flexButton,
            { backgroundColor: palette.surface, borderColor: palette.border, opacity: pressed ? 0.9 : 1 },
          ]}
          onPress={onExportJson}
        >
          <Text style={[styles.secondaryText, { color: palette.text }]}>Export JSON</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.secondaryButton,
            styles.flexButton,
            { backgroundColor: palette.surface, borderColor: palette.border, opacity: pressed ? 0.9 : 1 },
          ]}
          onPress={onExportCsv}
        >
          <Text style={[styles.secondaryText, { color: palette.text }]}>Export CSV</Text>
        </Pressable>
      </View>

      {error ? <Text style={[styles.error, { color: palette.danger }]}>{error}</Text> : null}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView edges={['top']} style={[styles.centered, { backgroundColor: palette.background }]}>
        <ActivityIndicator size="large" color={palette.accent} />
        <Text style={[styles.muted, { color: palette.textMuted }]}>Loading issues...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: palette.background }]}>
      <FlatList
        data={filteredIssues}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={listHeader}
        ListHeaderComponentStyle={styles.listHeader}
        ListEmptyComponent={
          <View style={[styles.emptyState, { borderColor: palette.border, backgroundColor: palette.surface }]}>
            <Text style={[styles.muted, { color: palette.textMuted }]}>No issues match your filters.</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshFromApi}
            tintColor={palette.accent}
          />
        }
        renderItem={({ item }) => (
          <IssueCard
            issue={item}
            onPress={(issueId) => navigation.navigate('IssueDetail', { issueId })}
          />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  listHeader: {
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 22,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  heading: {
    fontSize: 32,
    fontWeight: '700',
  },
  headingSub: {
    marginTop: 4,
    fontSize: 13,
  },
  topRow: {
    marginTop: 8,
    marginBottom: 14,
    gap: 10,
  },
  topActions: {
    flexDirection: 'row',
    gap: 8,
  },
  topButton: {
    flex: 1,
    alignItems: 'center',
  },
  primaryButton: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  primaryText: {
    fontWeight: '700',
  },
  secondaryButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  secondaryText: {
    fontWeight: '600',
    fontSize: 13,
  },
  bannerRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  filterToggleRow: {
    marginBottom: 10,
  },
  filterToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 9,
  },
  flexButton: {
    flex: 1,
    alignItems: 'center',
  },
  error: {
    marginBottom: 8,
  },
  emptyState: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
  },
  muted: {
    fontSize: 14,
  },
});

