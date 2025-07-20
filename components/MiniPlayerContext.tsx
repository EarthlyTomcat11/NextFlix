import React, { createContext, useContext, useState } from "react";

interface MiniPlayerContextProps {
  videoUri: string;
  isVisible: boolean;
  showMiniPlayer: (uri: string) => void;
  hideMiniPlayer: () => void;
}

const MiniPlayerContext = createContext<MiniPlayerContextProps | undefined>(
  undefined
);

export const MiniPlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [videoUri, setVideoUri] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const showMiniPlayer = (uri: string) => {
    setVideoUri(uri);
    setIsVisible(true);
  };

  const hideMiniPlayer = () => {
    setVideoUri("");
    setIsVisible(false);
  };

  return (
    <MiniPlayerContext.Provider
      value={{ videoUri, isVisible, showMiniPlayer, hideMiniPlayer }}
    >
      {children}
    </MiniPlayerContext.Provider>
  );
};

export const useMiniPlayer = () => {
  const context = useContext(MiniPlayerContext);
  if (!context)
    throw new Error("useMiniPlayer must be used within MiniPlayerProvider");
  return context;
};
