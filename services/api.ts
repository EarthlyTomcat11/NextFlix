export const TMDB_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`,
  },
};

export const fetchMovies = async ({
  query,
}: {
  query: string;
}): Promise<Movie[]> => {
  const endpoint = query
    ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
    : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch movies: ${response.statusText}`);
  }

  const data = await response.json();
  return data.results;
};

export const fetchMovieTrailer = async (movieId: string): Promise<string | null> => {
  const response = await fetch(
    `${TMDB_CONFIG.BASE_URL}/movie/${movieId}/videos`,
    {
      method: "GET",
      headers: TMDB_CONFIG.headers,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch movie videos");
  }

  const data = await response.json();

  // Find the first official YouTube trailer
  const trailer = data.results.find(
    (video: any) =>
      video.type === "Trailer" &&
      video.site === "YouTube" &&
      video.official === true
  );

  // Fallback to any YouTube trailer
  if (!trailer) {
    return (
      data.results.find(
        (video: any) =>
          video.type === "Trailer" && video.site === "YouTube"
      )?.key || null
    );
  }

  return trailer.key || null;
};

export const fetchMovieDetails = async (
  movieId: string
): Promise<MovieDetails> => {
  const response = await fetch(
    `${TMDB_CONFIG.BASE_URL}/movie/${movieId}`,
    {
      method: "GET",
      headers: TMDB_CONFIG.headers,
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch movie details: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};
