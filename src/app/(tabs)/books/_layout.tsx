import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  const activeColor = '#8A2BE2';
  const inactiveColor = '#8e8e93';
  const bgColor = '#1C1C1E';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          backgroundColor: bgColor,
          borderTopWidth: 0,
        },
        headerStyle: {
          backgroundColor: bgColor,
        },
        headerTintColor: '#FFF',
        headerTitleAlign: 'center',
      }}>
      <Tabs.Screen
        name="reading"
        options={{
          title: 'Lendo',
          tabBarIcon: ({ color }) => (
            <Ionicons name="book" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="awaiting"
        options={{
          title: 'Aguardando',
          tabBarIcon: ({ color }) => (
            <Ionicons name="time-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="finished"
        options={{
          title: 'Finalizado',
          tabBarIcon: ({ color }) => (
            <Ionicons name="checkmark-done" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="dropped"
        options={{
          title: 'Parado',
          tabBarIcon: ({ color }) => (
            <Ionicons name="pause-circle-outline" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}