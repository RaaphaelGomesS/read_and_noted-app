import { AuthProvider, useAuth } from "@/context/AuthContext";
import { LibraryProvider } from "@/context/LibraryContext";
import { setSignOutCallback } from "@/service/ConnectionApi";
import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

function AuthGuard() {
  const { token, isLoading, signOut } = useAuth();
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
    } else if (token && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [isLoading, token, segments, router]);

  return (
    <LibraryProvider>
      <Stack screenOptions={{ headerShown: false }} />
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
