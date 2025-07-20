import { ResizeMode, Video } from "expo-av";
import React, { useEffect, useRef } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { useMiniPlayer } from "./MiniPlayerContext";

const { width } = Dimensions.get("window");

const MiniVideoPlayer = () => {
  const videoRef = useRef(null);
  const { videoUri, isVisible, hideMiniPlayer } = useMiniPlayer();

  useEffect(() => {
    if (videoRef.current && isVisible) {
      // @ts-ignore
      videoRef.current.playAsync();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{ uri: videoUri }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        style={styles.video}
        shouldPlay
      />
      <Pressable onPress={hideMiniPlayer} style={styles.closeButton}>
        <Text style={{ color: "white", fontSize: 16 }}>✕</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    width,
    backgroundColor: "black",
    zIndex: 9999,
    elevation: 9999,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  video: {
    width: width * 0.95,
    height: 200,
  },
  closeButton: {
    position: "absolute",
    top: 5,
    right: 10,
    padding: 5,
    zIndex: 10,
  },
});

export default MiniVideoPlayer;
