import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Wallet, CircleDollarSign, MessageSquareText, Settings, LayoutGrid as Layout, Coins } from 'lucide-react-native';
import { BlurView } from 'expo-blur';

export default function TabLayout() {
  const { colors, currentTheme } = useTheme();

  const styles = StyleSheet.create({
    tabBarLabel: {
      fontFamily: 'Inter-Medium',
      fontSize: 12,
    },
    tabBar: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 80,
      borderTopWidth: 0,
    },
    tabBarBlur: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
  });

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: currentTheme === 'dark' ? 'rgba(28, 28, 30, 0.7)' : 'rgba(255, 255, 255, 0.7)',
            borderTopColor: colors.border,
          },
        ],
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.subText,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarBackground: () => (
          <BlurView
            intensity={80}
            tint={currentTheme === 'dark' ? 'dark' : 'light'}
            style={styles.tabBarBlur}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Wallet',
          tabBarIcon: ({ color, size }) => <Wallet size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="swap"
        options={{
          title: 'Swap',
          tabBarIcon: ({ color, size }) => <CircleDollarSign size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="mint"
        options={{
          title: 'Mint',
          tabBarIcon: ({ color, size }) => <Coins size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="dapps"
        options={{
          title: 'DApps',
          tabBarIcon: ({ color, size }) => <Layout size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="assistant"
        options={{
          title: 'Chat AI',
          tabBarIcon: ({ color, size }) => <MessageSquareText size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}