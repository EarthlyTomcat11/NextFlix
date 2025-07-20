import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

import { icons } from "@/constants/icons";
import { fetchMovieDetails, fetchMovieTrailer } from "@/services/api";
import useFetch from "@/services/usefetch";

// Import your Appwrite save function
import { saveMovieForUser } from "@/services/appwrite";

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
  <View style={styles.movieInfoContainer}>
    <Text style={styles.movieInfoLabel}>{label}</Text>
    <Text style={styles.movieInfoValue}>{value || "N/A"}</Text>
  </View>
);

// Helper function to convert MovieDetails → Movie type
function mapMovieDetailsToMovie(details: MovieDetails): Movie {
  return {
    id: details.id,
    title: details.title,
    adult: details.adult,
    backdrop_path: details.backdrop_path ?? "",
    genre_ids: details.genres.map((g) => g.id),
    original_language: details.original_language,
    original_title: details.original_title,
    overview: details.overview ?? "",
    popularity: details.popularity,
    poster_path: details.poster_path ?? "",
    release_date: details.release_date,
    video: details.video,
    vote_average: details.vote_average,
    vote_count: details.vote_count,
  };
}

const Details = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const { data: movie, loading } = useFetch(() =>
    fetchMovieDetails(id as string)
  );

  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      fetchMovieTrailer(id as string).then(setTrailerKey);
    }
  }, [id]);

  const handleSaveMovie = async () => {
    if (!movie) return;

    try {
      setSaving(true);
      await saveMovieForUser(
        movie.id,
        movie.title,
        `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      ); // ✅ just pass movie.id as number
      Alert.alert("Success", "Movie saved to your list!");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to save the movie.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFA500" />
      </SafeAreaView>
    );

  return (
    <View style={styles.container}>
      {/* Mini Player pinned at the top if visible */}
      {showTrailer && trailerKey && (
        <View style={styles.miniPlayerSticky}>
          <WebView
            style={styles.miniWebview}
            source={{
              uri: `https://www.youtube.com/embed/${trailerKey}?autoplay=1&controls=1`,
            }}
            allowsFullscreenVideo
            javaScriptEnabled
          />
          <TouchableOpacity
            style={styles.closeMiniPlayer}
            onPress={() => setShowTrailer(false)}
            accessibilityLabel="Close trailer player"
          >
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
        style={showTrailer ? { paddingTop: 220 } : undefined}
      >
        <View>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
            }}
            style={styles.posterImage}
            resizeMode="stretch"
          />

          {trailerKey && (
            <TouchableOpacity
              style={styles.playButton}
              onPress={() => setShowTrailer((prev) => !prev)}
              accessibilityLabel="Toggle trailer player"
            >
              <Image
                source={icons.play}
                style={styles.playIcon}
                resizeMode="stretch"
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{movie?.title}</Text>
          <View style={styles.releaseRow}>
            <Text style={styles.releaseText}>
              {movie?.release_date?.split("-")[0]} •
            </Text>
            <Text style={styles.releaseText}>{movie?.runtime}m</Text>
          </View>

          <View style={styles.ratingContainer}>
            <Image source={icons.star} style={styles.starIcon} />
            <Text style={styles.ratingText}>
              {Math.round(movie?.vote_average ?? 0)}/10
            </Text>
            <Text style={styles.voteCountText}>
              ({movie?.vote_count} votes)
            </Text>
          </View>

          <MovieInfo label="Overview" value={movie?.overview} />
          <MovieInfo
            label="Genres"
            value={movie?.genres?.map((g) => g.name).join(" • ") || "N/A"}
          />

          <View style={styles.budgetRevenueRow}>
            <MovieInfo
              label="Budget"
              value={`$${(movie?.budget ?? 0) / 1_000_000} million`}
            />
            <MovieInfo
              label="Revenue"
              value={`$${Math.round(
                (movie?.revenue ?? 0) / 1_000_000
              )} million`}
            />
          </View>

          <MovieInfo
            label="Production Companies"
            value={
              movie?.production_companies?.map((c) => c.name).join(" • ") ||
              "N/A"
            }
          />
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.goBackHalf} onPress={router.back}>
          <Text style={styles.goBackText}>{"<"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveHalf, saving && { opacity: 0.6 }]}
          onPress={handleSaveMovie}
          disabled={saving}
        >
          <Text style={styles.saveText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1200",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#1a1200",
    justifyContent: "center",
    alignItems: "center",
  },
  posterImage: {
    width: "100%",
    height: 670,
  },
  playButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#FFA500",
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FFA500",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  playIcon: {
    width: 24,
    height: 28,
    marginLeft: 3,
  },
  detailsContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    color: "#FFA500",
    fontWeight: "bold",
    fontSize: 24,
  },
  releaseRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  releaseText: {
    color: "#ffb347",
    fontSize: 14,
  },
  ratingContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 165, 0, 0.15)",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: "center",
    gap: 8,
    marginTop: 12,
  },
  starIcon: {
    width: 16,
    height: 16,
  },
  ratingText: {
    color: "#FFA500",
    fontWeight: "700",
    fontSize: 14,
  },
  voteCountText: {
    color: "#ffb347",
    fontSize: 12,
  },
  movieInfoContainer: {
    marginTop: 20,
    alignItems: "flex-start",
  },
  movieInfoLabel: {
    color: "#ffb347",
    fontSize: 14,
    fontWeight: "400",
  },
  movieInfoValue: {
    color: "#fff8dc",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 6,
  },
  budgetRevenueRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "50%",
    marginTop: 20,
  },
  buttonRow: {
    flexDirection: "row",
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    gap: 10,
  },
  goBackHalf: {
    flex: 1,
    backgroundColor: "#FF8C00",
    borderRadius: 14,
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#A0522D",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  saveHalf: {
    flex: 1,
    backgroundColor: "#FFA500",
    borderRadius: 14,
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FFA500",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  goBackText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  saveText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 25,
  },
  miniPlayerSticky: {
    position: "absolute",
    top: 40,
    left: 20,
    right: 20,
    height: 200,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#000",
    zIndex: 1000,
  },
  miniWebview: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  closeMiniPlayer: {
    position: "absolute",
    top: 6,
    right: 6,
    zIndex: 1001,
    backgroundColor: "#000a",
    borderRadius: 14,
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  closeText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Details;
