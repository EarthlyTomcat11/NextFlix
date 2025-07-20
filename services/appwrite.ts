import { Movie, SavedMovie, TrendingMovie } from "@/interfaces/interfaces";
import { Account, Client, Databases, ID, Query } from "react-native-appwrite";

// Environment variables
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!; // Trending movies
const SAVED_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_SAVED_COLLECTION_ID!;
const ENDPOINT = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!;
const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!;

// Initialize Appwrite client
export const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID);

const database = new Databases(client);
export const account = new Account(client);

// --- Auth ---

export const signUp = async (email: string, password: string, name?: string) => {
  try {
    return await account.create(ID.unique(), email, password, name);
  } catch (error) {
    console.error("Sign Up Error:", error);
    throw error;
  }
};

export const login = async (email: string, password: string) => {
  try {
    return await account.createSession(email, password);
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await account.deleteSession("current");
  } catch (error) {
    console.error("Logout Error:", error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    return await account.get();
  } catch (error) {
    console.error("Get Current User Error:", error);
    return null;
  }
};

// --- Saved Movies ---

// ✅ Save movie for current user (only saves movieId and userId)
export const saveMovieForUser = async (
  movie_Id: number,
  title: string,
  poster_url: string
) => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("User not logged in");

    const userId = user.$id;

    // Check if movie is already saved
    const existing = await database.listDocuments(DATABASE_ID, SAVED_COLLECTION_ID, [
      Query.equal("userId", userId),
      Query.equal("movie_Id", movie_Id),
    ]);

    if (existing.documents.length > 0) {
      return existing.documents[0]; // Already saved
    }

    return await database.createDocument(
      DATABASE_ID,
      SAVED_COLLECTION_ID,
      ID.unique(),
      {
        userId,
        movie_Id,
        title,
        poster_url,
      }
    );
  } catch (error) {
    console.error("Error saving movie for user:", error);
    throw error;
  }
};


export const getSavedMoviesForUser = async (): Promise<SavedMovie[]> => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("User not logged in");

    const result = await database.listDocuments(DATABASE_ID, SAVED_COLLECTION_ID, [
      Query.equal("userId", user.$id),
    ]);

    return result.documents.map((doc) => ({
      $id: doc.$id,
      movie_Id: doc.movie_Id,
      userId: doc.userId,
      title: doc.title,
      poster_url: doc.poster_url,
    }));
  } catch (error) {
    console.error("Error fetching saved movies for user:", error);
    return [];
  }
};


export const getSavedMovieIdsForUser = async (): Promise<number[]> => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("User not logged in");

    const result = await database.listDocuments(DATABASE_ID, SAVED_COLLECTION_ID, [
      Query.equal("userId", user.$id),
    ]);

    // Return only movie IDs from saved movies
    return result.documents.map((doc) => doc.movie_Id);
  } catch (error) {
    console.error("Error fetching saved movie IDs for user:", error);
    return [];
  }
};


// ✅ Remove a saved movie by document ID
export const removeSavedMovie = async (documentId: string) => {
  try {
    await database.deleteDocument(DATABASE_ID, SAVED_COLLECTION_ID, documentId);
  } catch (error) {
    console.error("Error removing saved movie:", error);
    throw error;
  }
};

// --- Trending Movies ---

// 🔁 Increase count or create a new trending movie entry
export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", query),
    ]);

    if (result.documents.length > 0) {
      const existing = result.documents[0];
      await database.updateDocument(DATABASE_ID, COLLECTION_ID, existing.$id, {
        count: existing.count + 1,
      });
    } else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm: query,
        movie_Id: movie.id,
        title: movie.title,
        count: 1,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
    }
  } catch (error) {
    console.error("Error updating search count:", error);
    throw error;
  }
};

// ✅ Get top 5 trending movies
export const getTrendingMovies = async (): Promise<
  TrendingMovie[] | undefined
> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]);

    return result.documents as unknown as TrendingMovie[];
  } catch (error) {
    console.error(error);
    return undefined;
  }
};
