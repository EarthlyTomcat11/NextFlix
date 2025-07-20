import { Link } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

import { icons } from "@/constants/icons";

const MovieCard = ({
  id,
  poster_path,
  title,
  vote_average,
  release_date,
}: Movie) => {
  return (
    <Link href={`/movie/${id}`} asChild>
      <TouchableOpacity className="w-[30%]">
        <Image
          source={{
            uri: poster_path
              ? `https://image.tmdb.org/t/p/w500${poster_path}`
              : "https://placehold.co/600x400/1a1a1a/FFFFFF.png",
          }}
          className="w-full h-52 rounded-lg"
          resizeMode="cover"
        />

        <Text
          className="text-sm font-bold mt-2"
          style={{ color: "#FFF8E7" }} // very light orange
          numberOfLines={1}
        >
          {title}
        </Text>

        <View className="flex-row items-center justify-start gap-x-1">
          <Image
            source={icons.star}
            className="size-4"
            style={{ tintColor: "#FFE8B2" }}
          />{" "}
          {/* very light orange star */}
          <Text
            className="text-xs font-bold uppercase"
            style={{ color: "#FFF8E7" }}
          >
            {Math.round(vote_average / 2)}
          </Text>
        </View>

        <View className="flex-row items-center justify-between">
          <Text
            className="text-xs font-medium mt-1"
            style={{ color: "#FFE8B2" }} // lighter light orange
          >
            {release_date?.split("-")[0]}
          </Text>
          <Text
            className="text-xs font-medium uppercase"
            style={{ color: "#FFE8B2" }}
          >
            Movie
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default MovieCard;
