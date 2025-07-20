import { useAuth } from "@/services/auth-context";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState(""); // <-- new name state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { signIn, signUp } = useAuth();

  const handleAuth = async () => {
    if (!email || !password || (isSignUp && !name.trim())) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Passwords must be at least 6 characters long.");
      return;
    }

    setError(null);

    if (isSignUp) {
      const error = await signUp(email, password, name.trim());
      if (error) {
        setError(error);
        return;
      }
      router.replace("/");
    } else {
      const error = await signIn(email, password);
      if (error) {
        setError(error);
        return;
      }
      router.replace("/");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <BlurView intensity={60} tint="dark" style={styles.blurContainer}>
        <Text accessibilityRole="header" style={styles.headerText}>
          {isSignUp ? "Create Account" : "Welcome Back"}
        </Text>

        {isSignUp && (
          <TextInput
            placeholder="Name (optional)"
            autoCapitalize="words"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#ffa500aa"
            style={styles.input}
          />
        )}

        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#ffa500aa"
          style={styles.input}
        />

        <TextInput
          placeholder="Password"
          secureTextEntry
          autoCapitalize="none"
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#ffa500aa"
          style={styles.input}
        />

        {error && <Text style={styles.errorText}>{error}</Text>}

        <Pressable
          onPress={handleAuth}
          style={({ pressed }) => [styles.button, pressed && { opacity: 0.8 }]}
          android_ripple={{ color: "#ffa50033" }}
        >
          <View style={styles.textBox}>
            <Text style={styles.buttonText}>
              {isSignUp ? "Sign Up" : "Sign In"}
            </Text>
          </View>
        </Pressable>

        <Pressable
          onPress={() => {
            setIsSignUp((prev) => !prev);
            setError(null);
          }}
          style={styles.switchContainer}
        >
          <Text style={styles.switchText}>
            {isSignUp
              ? "Already have an account? Sign In"
              : "Don't have an account? Sign Up"}
          </Text>
        </Pressable>
      </BlurView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", // deep dark background
  },
  blurContainer: {
    flex: 1,
    marginHorizontal: 24,
    marginVertical: 40,
    borderRadius: 24,
    padding: 32,
    justifyContent: "center",
    backgroundColor: "rgba(20, 20, 20, 0.5)", // dark translucent glass
    borderWidth: 1,
    borderColor: "rgba(255, 165, 0, 0.25)", // subtle orange tint border
  },
  headerText: {
    color: "#ffa500", // modern orange
    fontSize: 30,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 28,
    letterSpacing: 0.6,
  },
  input: {
    backgroundColor: "rgba(255, 165, 0, 0.15)", // light orange tint
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 20,
    color: "#fff",
    fontWeight: "400",
    fontSize: 16,
  },
  errorText: {
    color: "#ff6b6b",
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "600",
  },
  button: {
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 8,
  },
  textBox: {
    borderColor: "#ffa500",
    borderWidth: 2,
    borderRadius: 30,
    paddingVertical: 8,
    paddingHorizontal: 32,
    backgroundColor: "rgba(255, 165, 0, 0.1)",
    shadowColor: "#ffa500",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#ffa500",
    fontWeight: "700",
    fontSize: 18,
    letterSpacing: 1.2,
    textAlign: "center",
  },
  switchContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  switchText: {
    color: "#ffb347",
    fontWeight: "500",
    textDecorationLine: "underline",
    fontSize: 14,
    textAlign: "center",
  },
});
