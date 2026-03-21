import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { GlassSurface } from '@/components/GlassSurface';
import { Home, ListVideo, Settings } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          borderTopWidth: 0,
          elevation: 0,
          backgroundColor: 'transparent',
        },
        tabBarBackground: () => (
          <GlassSurface type="primary" style={StyleSheet.absoluteFill} />
        ),
        tabBarActiveTintColor: '#FF3B30', // accentPrimary
        tabBarInactiveTintColor: '#8E8E93', // textMuted
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="combos"
        options={{
          title: 'Combos',
          tabBarIcon: ({ color, size }) => (
            <ListVideo color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Settings color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
