// app/_layout.tsx
import { AuthProvider, useAuth } from "@/services/auth-context";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import "./globals.css";

function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const { user, isLoadingUser } = useAuth();

  useEffect(() => {
    const inAuthGroup = segments[0] === "auth";

    if (!isLoadingUser) {
      if (!user && !inAuthGroup) {
        router.replace("/auth");
      } else if (user && inAuthGroup) {
        router.replace("/");
      }
    }
  }, [user, isLoadingUser, segments, router]);

  // Show nothing while loading or if redirecting
  if (isLoadingUser) return null;
  if (!user && segments[0] !== "auth") return null;

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <>
        <StatusBar hidden />
        {/* <RouteGuard> */}
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="movie/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="auth" options={{ headerShown: false }} />
        </Stack>
        {/* </RouteGuard> */}
      </>
    </AuthProvider>
  );
}
