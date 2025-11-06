import { Colors } from '@/constants/Colors';
import { Stack } from 'expo-router';

export default function NotesLayout() {
  return (
    <Stack screenOptions={{ 
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background }
    }}>
        <Stack.Screen name="index" />
    </Stack>
  );
}