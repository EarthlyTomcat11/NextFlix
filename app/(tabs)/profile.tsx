import { useAuth } from "@/services/auth-context";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Profile() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  useEffect(() => {
    if (!user) {
      router.replace("/auth");
    }
  }, [user, router]);

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" />
      <View style={styles.background} />
      <BlurView intensity={80} tint="dark" style={styles.container}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.username}>
          {user?.name || user?.email || "User"}!
        </Text>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </BlurView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    position: "relative",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#7B2D26", // deep dark orange base
  },
  container: {
    flex: 1,
    margin: 20,
    borderRadius: 30,
    padding: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)", // glassy overlay
    overflow: "hidden",
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  username: {
    fontSize: 20,
    color: "#F8E4C9",
    marginBottom: 30,
  },
  logoutButton: {
    backgroundColor: "#FFA260",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  logoutText: {
    color: "#3E1E0D",
    fontSize: 16,
    fontWeight: "600",
  },
});
