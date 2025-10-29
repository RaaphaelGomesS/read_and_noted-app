import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  const activeColor = Colors.accent;
  const inactiveColor = Colors.textSecondary;
  const bgColor = Colors.background;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          backgroundColor: bgColor,
          borderTopWidth: 0,
        }
      }}>
      <Tabs.Screen
        name="reading"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="book" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="awaiting"
        options={{
          tabBarLabel: 'Aguardando',
          tabBarIcon: ({ color }) => (
            <Ionicons name="time-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="finished"
        options={{
          tabBarLabel: 'Finalizados',
          tabBarIcon: ({ color }) => (
            <Ionicons name="checkmark-done" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="dropped"
        options={{
          tabBarLabel: 'Parados',
          tabBarIcon: ({ color }) => (
            <Ionicons name="pause-circle-outline" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}