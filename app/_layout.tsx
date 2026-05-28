import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MissionProvider } from '../context/MissionContext';

export default function Layout() {
  return (
    <MissionProvider>
      <Tabs
        screenOptions={{
          tabBarStyle: { backgroundColor: '#0a0a1a', borderTopColor: '#1a1a3a' },
          tabBarActiveTintColor: '#00d4ff',
          tabBarInactiveTintColor: '#555',
          headerStyle: { backgroundColor: '#0a0a1a' },
          headerTintColor: '#00d4ff',
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <Ionicons name="planet" size={22} color={color} />,
          }}
        />
        <Tabs.Screen
          name="sensores"
          options={{
            title: 'Sensores',
            tabBarIcon: ({ color }) => <Ionicons name="pulse" size={22} color={color} />,
          }}
        />
        <Tabs.Screen
          name="energia"
          options={{
            title: 'Energia',
            tabBarIcon: ({ color }) => <Ionicons name="flash" size={22} color={color} />,
          }}
        />
        <Tabs.Screen
          name="comunicacao"
          options={{
            title: 'Comunicação',
            tabBarIcon: ({ color }) => <Ionicons name="wifi" size={22} color={color} />,
          }}
        />
        <Tabs.Screen
          name="alertas"
          options={{
            title: 'Alertas',
            tabBarIcon: ({ color }) => <Ionicons name="warning" size={22} color={color} />,
          }}
        />
        <Tabs.Screen
          name="configuracoes"
          options={{
            title: 'Config',
            tabBarIcon: ({ color }) => <Ionicons name="settings" size={22} color={color} />,
          }}
        />
      </Tabs>
    </MissionProvider>
  );
}