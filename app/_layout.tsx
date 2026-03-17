import { Stack } from 'expo-router';
import { StyleSheet, Alert } from 'react-native';
import { QueryClient, QueryClientProvider, QueryCache } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { tokens } from '@/constants/tokens';
import { QuotaExceededError } from '@/services/youtube.types';

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: any) => {
      if (error?.name === 'QuotaExceededError') {
        Alert.alert(
          'API Limit Reached',
          'Oops! YouTube API daily limit reached. Please try again later.'
        );
      }
    },
  }),
});

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: tokens.theme.colors.surfaceBg },
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="search" options={{ presentation: 'modal' }} />
          </Stack>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
