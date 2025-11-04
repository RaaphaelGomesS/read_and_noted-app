import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";
import React from "react";

export default function TabLayout() {

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="tabs" />
      <Stack.Screen
        name="form"
        options={{
          headerShown: true,
          title: "Adicionar livro",
          presentation: "modal",
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.text,
        }}
      />
      <Stack.Screen
        name="search"
        options={{
          headerShown: true,
          title: "Buscar template",
          presentation: "modal",
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.text,
        }}
      />
    </Stack>
  );
}
