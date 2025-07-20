import { Image, StyleSheet, TextInput, View } from "react-native";

import { icons } from "@/constants/icons";

interface Props {
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onPress?: () => void;
}

const SearchBar = ({ placeholder, value, onChangeText, onPress }: Props) => {
  return (
    <View style={styles.container}>
      <Image
        source={icons.search}
        style={styles.icon}
        resizeMode="contain"
        // Use orange tint for the icon
        tintColor="#FFA500"
      />
      <TextInput
        onPressIn={onPress} // onPress does not work on TextInput, onPressIn is better for detecting tap
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
        placeholderTextColor="#FFB347" // soft orange for placeholder
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2E1B00", // dark warm background
    borderRadius: 9999, // fully rounded
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "#FFA500", // bright orange text
    fontSize: 16,
  },
});

export default SearchBar;
