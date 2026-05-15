import { Tabs } from 'expo-router';

export default function Layout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: '🐾 Scanner' }} />
      <Tabs.Screen name="modal" options={{ title: 'ℹ️ About' }} />
    </Tabs>
  );
}