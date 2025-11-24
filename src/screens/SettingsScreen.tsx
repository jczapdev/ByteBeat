import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, StyleSheet, Switch } from 'react-native';
import { useMediaStore } from '../store/useMediaStore';
import { FolderPlus, Trash2, RefreshCw, Folder, Music, Video, Settings as SettingsIcon } from 'lucide-react-native';
import RNFS from 'react-native-fs';

const SettingsScreen = () => {
    const {
        customDirectories,
        addCustomDirectory,
        removeCustomDirectory,
        scanFiles,
        isScanning,
        settings,
        updateSettings,
        videos,
        audios
    } = useMediaStore();
    const [newPath, setNewPath] = useState('');

    const handleAddDirectory = async () => {
        if (!newPath.trim()) {
            Alert.alert('Error', 'Please enter a directory path');
            return;
        }

        try {
            const exists = await RNFS.exists(newPath);
            if (!exists) {
                Alert.alert('Error', 'Directory does not exist');
                return;
            }

            addCustomDirectory(newPath);
            setNewPath('');
            Alert.alert('Success', 'Directory added successfully');
        } catch (error) {
            Alert.alert('Error', 'Invalid path or unable to access directory');
        }
    };

    const totalVideos = videos.reduce((acc, folder) => acc + folder.files.length, 0);
    const totalAudios = audios.reduce((acc, folder) => acc + folder.files.length, 0);

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <SettingsIcon color="#a78bfa" size={32} />
                <Text style={styles.headerTitle}>Settings</Text>
            </View>

            {/* Library Stats Card */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Library Overview</Text>
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <View style={styles.statIconContainer}>
                            <Video color="#8b5cf6" size={24} />
                        </View>
                        <Text style={styles.statNumber}>{totalVideos}</Text>
                        <Text style={styles.statLabel}>Videos</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <View style={styles.statIconContainer}>
                            <Music color="#8b5cf6" size={24} />
                        </View>
                        <Text style={styles.statNumber}>{totalAudios}</Text>
                        <Text style={styles.statLabel}>Audio Files</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <View style={styles.statIconContainer}>
                            <Folder color="#8b5cf6" size={24} />
                        </View>
                        <Text style={styles.statNumber}>{videos.length + audios.length}</Text>
                        <Text style={styles.statLabel}>Folders</Text>
                    </View>
                </View>
            </View>

            {/* Custom Directories Section */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.sectionTitle}>Custom Directories</Text>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{customDirectories.length}</Text>
                    </View>
                </View>

                {customDirectories.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Folder color="#6b7280" size={48} />
                        <Text style={styles.emptyStateText}>No custom directories</Text>
                        <Text style={styles.emptyStateSubtext}>Add folders to scan for media files</Text>
                    </View>
                ) : (
                    <View style={styles.directoryList}>
                        {customDirectories.map((dir, index) => (
                            <View key={index} style={styles.directoryItem}>
                                <View style={styles.directoryInfo}>
                                    <Folder color="#8b5cf6" size={20} />
                                    <Text style={styles.directoryPath} numberOfLines={2}>
                                        {dir}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => {
                                        Alert.alert(
                                            'Remove Directory',
                                            'Are you sure you want to remove this directory?',
                                            [
                                                { text: 'Cancel', style: 'cancel' },
                                                {
                                                    text: 'Remove',
                                                    style: 'destructive',
                                                    onPress: () => removeCustomDirectory(dir)
                                                }
                                            ]
                                        );
                                    }}
                                >
                                    <Trash2 color="#ef4444" size={20} />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                )}

                {/* Add Directory Input */}
                <View style={styles.addDirectoryContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g., /storage/emulated/0/Music"
                        placeholderTextColor="#6b7280"
                        value={newPath}
                        onChangeText={setNewPath}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={handleAddDirectory}
                    >
                        <FolderPlus color="white" size={24} />
                    </TouchableOpacity>
                </View>

                {/* Rescan Button */}
                <TouchableOpacity
                    style={[styles.rescanButton, isScanning && styles.rescanButtonDisabled]}
                    onPress={() => scanFiles()}
                    disabled={isScanning}
                >
                    <RefreshCw
                        color={isScanning ? "#6b7280" : "#60a5fa"}
                        size={20}
                    />
                    <Text style={[styles.rescanButtonText, isScanning && styles.rescanButtonTextDisabled]}>
                        {isScanning ? 'Scanning Library...' : 'Rescan Library'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Playback Settings */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Playback Settings</Text>

                {/* Playback Speed */}
                <View style={styles.settingItem}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingLabel}>Default Playback Speed</Text>
                        <Text style={styles.settingDescription}>
                            Adjust default video/audio playback speed
                        </Text>
                    </View>
                    <View style={styles.speedSelector}>
                        {[0.5, 1.0, 1.5, 2.0].map((speed) => (
                            <TouchableOpacity
                                key={speed}
                                onPress={() => updateSettings({ playbackSpeed: speed })}
                                style={[
                                    styles.speedButton,
                                    settings.playbackSpeed === speed && styles.speedButtonActive
                                ]}
                            >
                                <Text style={[
                                    styles.speedButtonText,
                                    settings.playbackSpeed === speed && styles.speedButtonTextActive
                                ]}>
                                    {speed}x
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Volume Normalization */}
                <View style={styles.settingItem}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingLabel}>Volume Normalization</Text>
                        <Text style={styles.settingDescription}>
                            Normalize audio levels across files
                        </Text>
                    </View>
                    <Switch
                        value={settings.volumeNormalization}
                        onValueChange={(value) => updateSettings({ volumeNormalization: value })}
                        trackColor={{ false: '#374151', true: '#8b5cf6' }}
                        thumbColor={settings.volumeNormalization ? '#a78bfa' : '#9ca3af'}
                    />
                </View>

                {/* Dark Mode */}
                <View style={styles.settingItem}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingLabel}>Dark Mode</Text>
                        <Text style={styles.settingDescription}>
                            Use dark theme for the app
                        </Text>
                    </View>
                    <Switch
                        value={settings.darkMode}
                        onValueChange={(value) => updateSettings({ darkMode: value })}
                        trackColor={{ false: '#374151', true: '#8b5cf6' }}
                        thumbColor={settings.darkMode ? '#a78bfa' : '#9ca3af'}
                    />
                </View>
            </View>

            {/* App Info Footer */}
            <View style={styles.footer}>
                <Text style={styles.footerTitle}>ByteBeat Media Player</Text>
                <Text style={styles.footerVersion}>Version 1.0.0</Text>
                <Text style={styles.footerCopyright}>© 2024 All rights reserved</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#030712',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        paddingTop: 24,
        gap: 12,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    card: {
        backgroundColor: '#111827',
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 16,
    },
    badge: {
        backgroundColor: '#8b5cf6',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '600',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#1f2937',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#9ca3af',
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: '#374151',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    emptyStateText: {
        fontSize: 16,
        color: '#9ca3af',
        marginTop: 12,
        fontWeight: '500',
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: '#6b7280',
        marginTop: 4,
    },
    directoryList: {
        marginBottom: 16,
    },
    directoryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        backgroundColor: '#1f2937',
        borderRadius: 12,
        marginBottom: 8,
    },
    directoryInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    directoryPath: {
        color: '#d1d5db',
        fontSize: 14,
        flex: 1,
    },
    deleteButton: {
        padding: 8,
    },
    addDirectoryContainer: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 12,
    },
    input: {
        flex: 1,
        backgroundColor: '#1f2937',
        color: '#ffffff',
        padding: 14,
        borderRadius: 12,
        fontSize: 14,
        borderWidth: 1,
        borderColor: '#374151',
    },
    addButton: {
        backgroundColor: '#8b5cf6',
        width: 52,
        height: 52,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rescanButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1f2937',
        padding: 14,
        borderRadius: 12,
        gap: 8,
        borderWidth: 1,
        borderColor: '#374151',
    },
    rescanButtonDisabled: {
        opacity: 0.5,
    },
    rescanButtonText: {
        color: '#60a5fa',
        fontSize: 15,
        fontWeight: '600',
    },
    rescanButtonTextDisabled: {
        color: '#6b7280',
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#1f2937',
    },
    settingInfo: {
        flex: 1,
        marginRight: 16,
    },
    settingLabel: {
        fontSize: 16,
        color: '#ffffff',
        fontWeight: '500',
        marginBottom: 4,
    },
    settingDescription: {
        fontSize: 13,
        color: '#9ca3af',
    },
    speedSelector: {
        flexDirection: 'row',
        backgroundColor: '#1f2937',
        borderRadius: 8,
        padding: 4,
        gap: 4,
    },
    speedButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    speedButtonActive: {
        backgroundColor: '#8b5cf6',
    },
    speedButtonText: {
        fontSize: 13,
        color: '#9ca3af',
        fontWeight: '600',
    },
    speedButtonTextActive: {
        color: '#ffffff',
    },
    footer: {
        alignItems: 'center',
        paddingVertical: 32,
        paddingBottom: 40,
    },
    footerTitle: {
        fontSize: 16,
        color: '#6b7280',
        fontWeight: '600',
    },
    footerVersion: {
        fontSize: 13,
        color: '#4b5563',
        marginTop: 4,
    },
    footerCopyright: {
        fontSize: 12,
        color: '#374151',
        marginTop: 8,
    },
});

export default SettingsScreen;