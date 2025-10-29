import { Colors } from '@/constants/Colors';
import { Stack } from 'expo-router';

export default function NotesLayout() {
  return (
    <Stack screenOptions={{ 
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background }
    }}>
        <Stack.Screen name="index" />
        <Stack.Screen 
            name="[id]" 
            options={{ 
                headerShown: true,
                headerStyle: { backgroundColor: Colors.background },
                headerTintColor: Colors.text,
                headerTitle: "",
                // headerBackTitleVisible: false,
                headerShadowVisible: false
            }}
        />
        <Stack.Screen 
            name="form" 
            options={{ 
                headerShown: true,
                headerStyle: { backgroundColor: Colors.background },
                headerTintColor: Colors.text,
                headerTitle: "Nova nota",
                // headerBackTitleVisible: false,
                headerShadowVisible: false
            }}
        />
    </Stack>
  );
}