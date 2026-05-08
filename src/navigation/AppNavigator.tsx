import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme } from 'react-native';
import { IssueDetailScreen } from '../screens/IssueDetailScreen';
import { IssueFormScreen } from '../screens/IssueFormScreen';
import { IssueListScreen } from '../screens/IssueListScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { useAuthStore } from '../store/useAuthStore';
import { getPalette } from '../theme/palette';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = (): JSX.Element => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const colorScheme = useColorScheme();
  const palette = getPalette(colorScheme);
  const navTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer
      theme={{
        ...navTheme,
        colors: {
          ...navTheme.colors,
          background: palette.background,
          card: palette.surface,
          text: palette.text,
          border: palette.border,
          primary: palette.accent,
        },
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: palette.surface,
          },
          headerTitleStyle: {
            color: palette.text,
            fontWeight: '700',
            fontSize: 22,
          },
          headerTintColor: palette.accent,
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="IssueList"
              component={IssueListScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="IssueDetail"
              component={IssueDetailScreen}
              options={{ title: 'Issue Details' }}
            />
            <Stack.Screen
              name="IssueForm"
              component={IssueFormScreen}
              options={{ title: 'Issue Editor' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

