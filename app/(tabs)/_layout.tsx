import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'rgb(233, 84, 47)',
        tabBarInactiveTintColor: 'rgb(223, 198, 160)',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            backgroundColor: 'rgb(53, 22, 22)',
          },
          default: { 
            backgroundColor: 'rgb(53, 22, 22)',
          },
        }),
        tabBarLabelStyle: {
          fontFamily: 'Draconis',
          fontSize: 14,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="sword-cross" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="criar"
        options={{
          title: 'Criar',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="shield-sword" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="sobre"
        options={{
          title: 'Sobre',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="castle" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="login"
        options={{
          title: 'Login',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="account" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="personagens"
        options={{
          title: 'Personagens',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="info" color={color} />,
        }}
      />
    </Tabs>
  );
}
