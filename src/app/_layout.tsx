import { Colors } from "@/constants/Colors";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { LibraryProvider } from "@/context/LibraryContext";
import { setSignOutCallback } from "@/service/ConnectionApi";
import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

function AuthGuard() {
  const { token, role, isLoading, signOut } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    setSignOutCallback(signOut);
  }, [signOut]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    SplashScreen.hideAsync();

    const inAuthGroup = segments[0] === "(auth)";

    if (!token && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (token && inAuthGroup && role !== "ADMIN") {
      router.replace("/(tabs)");
    } else if (token && inAuthGroup && role == "ADMIN") {
      router.replace("/(tabs)/admin/templates");
    }
  }, [isLoading, token, segments, router]);

  return (
    <LibraryProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />

        <Stack.Screen
          name="(full)/external-book-search"
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: Colors.background },
            headerTintColor: Colors.text,
            headerTitle: "Busca externa",
          }}
        />

        <Stack.Screen
          name="(full)/select-edition"
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: Colors.background },
            headerTintColor: Colors.text,
            headerTitle: "Selecione uma edição",
          }}
        />

        <Stack.Screen
          name="(full)/notes/[id]"
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: Colors.background },
            headerTintColor: Colors.text,
            headerTitle: "",
            headerShadowVisible: false,
          }}
        />

        <Stack.Screen
          name="(full)/book-form"
          options={{
            headerShown: true,
            title: "Adicionar livro",
            headerStyle: { backgroundColor: Colors.background },
            headerTintColor: Colors.text,
          }}
        />
        <Stack.Screen
          name="(full)/book-search"
          options={{
            headerShown: true,
            title: "Buscar template",
            headerStyle: { backgroundColor: Colors.background },
            headerTintColor: Colors.text,
          }}
        />

        <Stack.Screen
          name="(full)/books/[id]"
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: Colors.background },
            headerTintColor: Colors.text,
            headerTitle: "",
          }}
        />
        <Stack.Screen
          name="(full)/suggestion-form"
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: Colors.background },
            headerTintColor: Colors.text,
            headerTitle: "Sugerir alteração",
          }}
        />
      </Stack>
    </LibraryProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthGuard />
    </AuthProvider>
  );
}
