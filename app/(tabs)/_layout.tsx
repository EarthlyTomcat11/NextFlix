import { Tabs } from "expo-router";
import { Image, Text, View } from "react-native";

import { icons } from "@/constants/icons";

function TabIcon({
  focused,
  icon,
  title,
}: {
  focused: boolean;
  icon: any;
  title: string;
}) {
  if (focused) {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          minWidth: 112,
          minHeight: 52,
          marginTop: 12,
          paddingHorizontal: 20,
          borderRadius: 50,
          backgroundColor: "#FF8000", // bright orange background
          shadowColor: "#FF8000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.6,
          shadowRadius: 6,
          elevation: 6,
        }}
      >
        <Image
          source={icon}
          tintColor="#1A1200"
          style={{ width: 20, height: 20 }}
          resizeMode="contain"
        />
        <Text
          style={{
            color: "#1A1200",
            fontWeight: "700",
            fontSize: 16,
            marginLeft: 10,
          }}
        >
          {title}
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        width: 44,
        height: 44,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 16,
        borderRadius: 22,
      }}
    >
      <Image
        source={icon}
        tintColor="#FFA500"
        style={{ width: 20, height: 20, opacity: 0.7 }}
        resizeMode="contain"
      />
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarStyle: {
          backgroundColor: "#1A1200", // dark warm background
          borderRadius: 50,
          marginHorizontal: 20,
          marginBottom: 36,
          height: 52,
          position: "absolute",
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "#FFA500", // orange border
          shadowColor: "#FFA500",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.8,
          shadowRadius: 8,
          elevation: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.home} title="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.search} title="Search" />
          ),
        }}
      />
      <Tabs.Screen
        name="save"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.save} title="Save" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.person} title="Profile" />
          ),
        }}
      />
    </Tabs>
  );
}
