import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import VideoListScreen from '../screens/VideoListScreen';
import AudioListScreen from '../screens/AudioListScreen';
import SettingsScreen from '../screens/SettingsScreen';
import PlayerScreen from '../screens/PlayerScreen';
import { View, Text } from 'react-native';
import { LucideIcon, Video, Music, Settings, PlayCircle } from 'lucide-react-native';

const Drawer = createDrawerNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Drawer.Navigator
                screenOptions={{
                    headerStyle: { backgroundColor: '#111827' },
                    headerTintColor: '#fff',
                    drawerStyle: { backgroundColor: '#1f2937' },
                    drawerActiveTintColor: '#60a5fa',
                    drawerInactiveTintColor: '#9ca3af',
                }}
            >
                <Drawer.Screen
                    name="Videos"
                    component={VideoListScreen}
                    options={{
                        drawerIcon: ({ color, size }) => <Video color={color} size={size} />
                    }}
                />
                <Drawer.Screen
                    name="Audio"
                    component={AudioListScreen}
                    options={{
                        drawerIcon: ({ color, size }) => <Music color={color} size={size} />
                    }}
                />
                <Drawer.Screen
                    name="Settings"
                    component={SettingsScreen}
                    options={{
                        drawerIcon: ({ color, size }) => <Settings color={color} size={size} />
                    }}
                />
                <Drawer.Screen
                    name="Player"
                    component={PlayerScreen}
                    options={{
                        drawerItemStyle: { display: 'none' }, // Hide from drawer, accessed via navigation
                        headerShown: false,
                    }}
                />
            </Drawer.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
