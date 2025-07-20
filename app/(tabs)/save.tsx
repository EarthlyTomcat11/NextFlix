import { SavedMovie } from "@/interfaces/interfaces";
import { getSavedMoviesForUser, removeSavedMovie } from "@/services/appwrite";
import { useFocusEffect } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Save = () => {
  const router = useRouter();
  const [savedMovies, setSavedMovies] = useState<SavedMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const loadSavedMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      const saved = await getSavedMoviesForUser();
      setSavedMovies(saved);
    } catch (err) {
      console.error(err);
      setError("Failed to load saved movies.");
    } finally {
      setLoading(false);
    }
  };

  // Refresh every time this screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadSavedMovies();
    }, [])
  );

  const handleRemove = (docId: string) => {
    Alert.alert(
      "Remove Saved Movie",
      "Are you sure you want to remove this movie from your saved list?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              await removeSavedMovie(docId);
              loadSavedMovies();
            } catch {
              Alert.alert("Error", "Failed to remove the movie.");
            }
          },
        },
      ]
    );
  };

  const filteredMovies = savedMovies.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }: { item: SavedMovie }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/movie/[id]",
          params: { id: item.movie_Id.toString() },
        })
      }
      style={{
        flex: 1,
        margin: 8,
        borderRadius: 16,
        overflow: "hidden",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
      }}
    >
      <BlurView
        intensity={50}
        tint="dark"
        style={{
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        <Image
          source={{
            uri: item.poster_url
              ? item.poster_url
              : "https://via.placeholder.com/500x750?text=No+Image",
          }}
          style={{
            width: "100%",
            height: 200,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          }}
          resizeMode="cover"
        />
        <View
          style={{
            padding: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#FFD700",
              fontWeight: "600",
              fontSize: 14,
              flex: 1,
            }}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <TouchableOpacity onPress={() => handleRemove(item.$id)}>
            <Text
              style={{
                color: "#FF6B6B",
                fontWeight: "bold",
                fontSize: 18,
                paddingHorizontal: 8,
              }}
            >
              ✕
            </Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#1a1200",
        }}
      >
        <ActivityIndicator size="large" color="#FFA500" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#1a1200",
        }}
      >
        <Text style={{ color: "red", fontSize: 16 }}>{error}</Text>
      </SafeAreaView>
    );
  }

  if (filteredMovies.length === 0) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#1a1200",
          paddingHorizontal: 20,
        }}
      >
        <TextInput
          placeholder="Search saved movies..."
          placeholderTextColor="#ccc"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={{
            width: "100%",
            backgroundColor: "#333",
            borderRadius: 10,
            padding: 10,
            marginBottom: 20,
            color: "#fff",
          }}
        />
        <Text style={{ color: "#ffb347", fontSize: 16, textAlign: "center" }}>
          {searchQuery
            ? "No results match your search."
            : "You haven't saved any movies yet."}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#1a1200",
        paddingHorizontal: 16,
        paddingTop: 10,
      }}
    >
      <Text
        style={{
          fontSize: 28,
          color: "#FFA500",
          fontWeight: "bold",
          marginBottom: 10,
        }}
      >
        Saved
      </Text>

      <TextInput
        placeholder="Search saved movies..."
        placeholderTextColor="#ccc"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={{
          width: "100%",
          backgroundColor: "#333",
          borderRadius: 10,
          padding: 10,
          marginBottom: 10,
          color: "#fff",
        }}
      />

      <FlatList
        data={filteredMovies}
        keyExtractor={(item) => item.$id}
        renderItem={renderItem}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
};

export default Save;
