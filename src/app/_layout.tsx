import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'TfM Cards' }} />
      <Stack.Screen name="card/[id]" options={{ title: 'Card' }} />
    </Stack>
  );
}
