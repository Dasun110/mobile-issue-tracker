import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useIssueStore } from './src/store/useIssueStore';

export default function App(): JSX.Element {
  const syncQueue = useIssueStore((state) => state.syncQueue);

  useEffect(() => {
    // Best-effort sync attempt when app starts.
    syncQueue();
  }, [syncQueue]);

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}

