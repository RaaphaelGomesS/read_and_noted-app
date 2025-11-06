import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Stack, Tabs } from "expo-router";
import React from "react";

export default function AdminDashboardLayout() {
  return (
    <>
      <Stack.Screen options={{ headerShown: true }} />

      <Tabs
        screenOptions={{
          tabBarLabelStyle: {
            fontSize: 12,
          },
          headerShown: false,
          tabBarActiveTintColor: Colors.accent,
          tabBarInactiveTintColor: Colors.textSecondary,
          tabBarStyle: {
            backgroundColor: Colors.surface,
            borderTopWidth: 0,
            paddingTop: 5,
          },
        }}
      >
        <Tabs.Screen
          name="templates"
          options={{
            title: "Templates",
            tabBarIcon: ({ color, size }) => <Ionicons name="document" size={size} color={color} />,
          }}
        />

        <Tabs.Screen
          name="suggestions"
          options={{
            title: "Sugestões",
            tabBarIcon: ({ color, size }) => <Ionicons name="bulb" size={size} color={color} />,
          }}
        />

        <Tabs.Screen name="index" options={{ href: null, tabBarStyle: { display: 'none' } }} />
        <Tabs.Screen name="template/[id]" options={{ href: null, tabBarStyle: { display: 'none' } }} />
        <Tabs.Screen name="template-form" options={{ href: null, tabBarStyle: { display: 'none' } }} />
        <Tabs.Screen name="suggestion/[id]" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      </Tabs>
    </>
  );
}
