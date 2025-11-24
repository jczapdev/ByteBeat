import React, { useEffect } from 'react';
import { View, Text, SectionList, ActivityIndicator, RefreshControl, StyleSheet } from 'react-native';
import { useMediaStore } from '../store/useMediaStore';
import MediaItem from '../components/MediaItem';
import { useNavigation } from '@react-navigation/native';
import { MediaFile } from '../types';
import { Music, FolderOpen } from 'lucide-react-native';

const AudioListScreen = () => {
    const { audios, isScanning, scanFiles } = useMediaStore();
    const navigation = useNavigation();

    useEffect(() => {
        if (audios.length === 0) {
            scanFiles();
        }
    }, []);

    const handlePress = (file: MediaFile) => {
        // @ts-ignore
        navigation.navigate('Player', { file });
    };

    const sections = audios.map(folder => ({
        title: folder.name,
        data: folder.files,
    }));

    const totalFiles = audios.reduce((acc, folder) => acc + folder.files.length, 0);

    if (isScanning && audios.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <View style={styles.loadingContent}>
                    <ActivityIndicator size="large" color="#a78bfa" />
                    <Text style={styles.loadingText}>Scanning for audio files...</Text>
                    <Text style={styles.loadingSubtext}>This may take a moment</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header Stats */}
            {totalFiles > 0 && (
                <View style={styles.headerStats}>
                    <Music color="#a78bfa" size={20} />
                    <Text style={styles.headerStatsText}>
                        {totalFiles} audio file{totalFiles !== 1 ? 's' : ''} in {audios.length} folder{audios.length !== 1 ? 's' : ''}
                    </Text>
                </View>
            )}

            <SectionList
                sections={sections}
                keyExtractor={(item) => item.path}
                renderItem={({ item }) => (
                    <MediaItem file={item} onPress={handlePress} />
                )}
                renderSectionHeader={({ section: { title, data } }) => (
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionHeaderContent}>
                            <FolderOpen color="#a78bfa" size={18} />
                            <Text style={styles.sectionTitle}>{title}</Text>
                        </View>
                        <View style={styles.sectionBadge}>
                            <Text style={styles.sectionBadgeText}>{data.length}</Text>
                        </View>
                    </View>
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={isScanning}
                        onRefresh={scanFiles}
                        tintColor="#a78bfa"
                        colors={['#a78bfa']}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Music color="#4b5563" size={64} />
                        <Text style={styles.emptyTitle}>No Audio Files Found</Text>
                        <Text style={styles.emptySubtitle}>
                            Pull down to scan for audio files{'\n'}or add custom directories in Settings
                        </Text>
                    </View>
                }
                contentContainerStyle={totalFiles === 0 ? styles.emptyList : undefined}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#030712',
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#030712',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContent: {
        alignItems: 'center',
    },
    loadingText: {
        color: '#9ca3af',
        fontSize: 16,
        marginTop: 16,
        fontWeight: '500',
    },
    loadingSubtext: {
        color: '#6b7280',
        fontSize: 14,
        marginTop: 8,
    },
    headerStats: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#111827',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#1f2937',
        gap: 8,
    },
    headerStatsText: {
        color: '#d1d5db',
        fontSize: 14,
        fontWeight: '500',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#111827',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#1f2937',
    },
    sectionHeaderContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flex: 1,
    },
    sectionTitle: {
        color: '#e5e7eb',
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    sectionBadge: {
        backgroundColor: '#8b5cf6',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
    },
    sectionBadgeText: {
        color: '#ffffff',
        fontSize: 11,
        fontWeight: '700',
    },
    emptyList: {
        flexGrow: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingTop: 100,
    },
    emptyTitle: {
        color: '#9ca3af',
        fontSize: 20,
        fontWeight: '600',
        marginTop: 24,
        marginBottom: 8,
    },
    emptySubtitle: {
        color: '#6b7280',
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
    },
});

export default AudioListScreen;