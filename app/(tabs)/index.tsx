import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { fetchMovies } from "@/services/api";
import { getTrendingMovies } from "@/services/appwrite";
import useFetch from "@/services/usefetch";

import { icons } from "@/constants/icons";
import { images } from "@/constants/images";

import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import TrendingCard from "@/components/TrendingCard";

const Index = () => {
  const router = useRouter();

  const {
    data: trendingMovies,
    loading: trendingLoading,
    error: trendingError,
  } = useFetch(getTrendingMovies);

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
  } = useFetch(() => fetchMovies({ query: "" }));

  return (
    <View style={styles.container}>
      <Image
        source={images.bg}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Image source={icons.logo} style={styles.logo} />

        {moviesLoading || trendingLoading ? (
          <ActivityIndicator
            size="large"
            color="#FFA500" // orange color
            style={styles.activityIndicator}
          />
        ) : moviesError || trendingError ? (
          <Text style={styles.errorText}>
            Error: {moviesError?.message || trendingError?.message}
          </Text>
        ) : (
          <View style={styles.contentContainer}>
            <SearchBar
              onPress={() => {
                router.push("/search");
              }}
              placeholder="Search for a movie"
            />

            {trendingMovies && (
              <View style={styles.trendingSection}>
                <Text style={styles.sectionTitle}>Trending Movies</Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.trendingList}
                  data={trendingMovies}
                  contentContainerStyle={styles.trendingContent}
                  renderItem={({ item, index }) => (
                    <TrendingCard movie={item} index={index} />
                  )}
                  keyExtractor={(item) => item.movie_id.toString()}
                  ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
                />
              </View>
            )}

            <>
              <Text style={styles.sectionTitle}>Latest Movies</Text>

              <FlatList
                data={movies}
                renderItem={({ item }) => <MovieCard {...item} />}
                keyExtractor={(item) => item.id.toString()}
                numColumns={3}
                columnWrapperStyle={styles.movieRow}
                style={styles.latestList}
                scrollEnabled={false}
              />
            </>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1200", // very dark brownish for warm orange theme
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 0,
    opacity: 0.2, // subtle background
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    minHeight: "100%",
    paddingBottom: 20,
    paddingTop: 60,
  },
  logo: {
    width: 48,
    height: 40,
    alignSelf: "center",
    marginBottom: 16,
  },
  activityIndicator: {
    marginTop: 40,
    alignSelf: "center",
  },
  errorText: {
    color: "#ff6b6b",
    textAlign: "center",
    marginTop: 40,
    fontWeight: "600",
  },
  contentContainer: {
    flex: 1,
    marginTop: 10,
  },
  trendingSection: {
    marginTop: 20,
  },
  sectionTitle: {
    color: "#FFA500",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  trendingList: {
    marginBottom: 10,
  },
  trendingContent: {
    paddingLeft: 2,
    paddingRight: 2,
    gap: 12,
  },
  movieRow: {
    justifyContent: "flex-start",
    gap: 16,
    paddingRight: 5,
    marginBottom: 12,
  },
  latestList: {
    marginTop: 8,
    paddingBottom: 40,
  },
});

export default Index;
