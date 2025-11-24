import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import VideoListScreen from '../screens/VideoListScreen';
import AudioListScreen from '../screens/AudioListScreen';
import SettingsScreen from '../screens/SettingsScreen';
import PlayerScreen from '../screens/PlayerScreen';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Video, Music, Settings, PlayCircle, Disc3 } from 'lucide-react-native';

const Drawer = createDrawerNavigator();

// Custom Drawer Content
const CustomDrawerContent = (props: any) => {
    return (
        <DrawerContentScrollView {...props} style={styles.drawerContainer}>
            {/* Header/Logo Section */}
            <View style={styles.drawerHeader}>
                <View style={styles.logoContainer}>
                    <Disc3 color="#a78bfa" size={40} />
                </View>
                <Text style={styles.appTitle}>ByteBeat</Text>
                <Text style={styles.appSubtitle}>Media Player</Text>
            </View>

            {/* Drawer Items */}
            <View style={styles.drawerItems}>
                <DrawerItemList {...props} />
            </View>

            {/* Footer */}
            <View style={styles.drawerFooter}>
                <View style={styles.footerDivider} />
                <Text style={styles.footerText}>Version 1.0.0</Text>
                <Text style={styles.footerCopyright}>© 2024 ByteBeat</Text>
            </View>
        </DrawerContentScrollView>
    );
};

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Drawer.Navigator
                drawerContent={(props) => <CustomDrawerContent {...props} />}
                screenOptions={{
                    headerStyle: styles.header,
                    headerTintColor: '#ffffff',
                    headerTitleStyle: styles.headerTitle,
                    drawerStyle: styles.drawer,
                    drawerActiveTintColor: '#a78bfa',
                    drawerInactiveTintColor: '#9ca3af',
                    drawerActiveBackgroundColor: '#1f2937',
                    drawerInactiveBackgroundColor: 'transparent',
                    drawerLabelStyle: styles.drawerLabel,
                    drawerItemStyle: styles.drawerItem,
                }}
            >
                <Drawer.Screen
                    name="Videos"
                    component={VideoListScreen}
                    options={{
                        title: 'Video Library',
                        drawerIcon: ({ color, size, focused }) => (
                            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
                                <Video color={color} size={size - 2} />
                            </View>
                        ),
                    }}
                />
                <Drawer.Screen
                    name="Audio"
                    component={AudioListScreen}
                    options={{
                        title: 'Audio Library',
                        drawerIcon: ({ color, size, focused }) => (
                            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
                                <Music color={color} size={size - 2} />
                            </View>
                        ),
                    }}
                />
                <Drawer.Screen
                    name="Settings"
                    component={SettingsScreen}
                    options={{
                        drawerIcon: ({ color, size, focused }) => (
                            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
                                <Settings color={color} size={size - 2} />
                            </View>
                        ),
                    }}
                />
                <Drawer.Screen
                    name="Player"
                    component={PlayerScreen}
                    options={{
                        drawerItemStyle: { display: 'none' },
                        headerShown: false,
                    }}
                />
            </Drawer.Navigator>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    drawerContainer: {
        backgroundColor: '#030712',
    },
    drawerHeader: {
        padding: 24,
        paddingTop: 48,
        paddingBottom: 24,
        backgroundColor: '#111827',
        borderBottomWidth: 1,
        borderBottomColor: '#1f2937',
        alignItems: 'center',
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#1f2937',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 2,
        borderColor: '#8b5cf6',
    },
    appTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 4,
    },
    appSubtitle: {
        fontSize: 14,
        color: '#9ca3af',
        fontWeight: '500',
    },
    drawerItems: {
        flex: 1,
        paddingTop: 16,
    },
    drawerFooter: {
        padding: 20,
        paddingBottom: 32,
        borderTopWidth: 1,
        borderTopColor: '#1f2937',
        alignItems: 'center',
    },
    footerDivider: {
        width: '100%',
        height: 1,
        backgroundColor: '#1f2937',
        marginBottom: 16,
    },
    footerText: {
        fontSize: 12,
        color: '#6b7280',
        marginBottom: 4,
    },
    footerCopyright: {
        fontSize: 11,
        color: '#4b5563',
    },
    header: {
        backgroundColor: '#111827',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        borderBottomWidth: 1,
        borderBottomColor: '#1f2937',
    },
    headerTitle: {
        fontWeight: '600',
        fontSize: 18,
    },
    drawer: {
        backgroundColor: '#030712',
        width: 280,
    },
    drawerLabel: {
        fontSize: 16,
        fontWeight: '500',
        marginLeft: -16,
    },
    drawerItem: {
        borderRadius: 12,
        marginHorizontal: 8,
        marginVertical: 2,
        paddingVertical: 4,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#1f2937',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainerActive: {
        backgroundColor: '#8b5cf6',
    },
});

export default AppNavigator;