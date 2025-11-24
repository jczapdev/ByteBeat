import React, { useEffect } from 'react';
import { View, Text, SectionList, ActivityIndicator, RefreshControl } from 'react-native';
import { useMediaStore } from '../store/useMediaStore';
import MediaItem from '../components/MediaItem';
import { useNavigation } from '@react-navigation/native';
import { MediaFile } from '../types';

const AudioListScreen = () => {
    const { audios, isScanning, scanFiles } = useMediaStore();
    const navigation = useNavigation();

    useEffect(() => {
        // Scan if empty or just on mount (store handles dedupe)
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

    if (isScanning && audios.length === 0) {
        return (
            <View className="flex-1 bg-gray-950 justify-center items-center">
                <ActivityIndicator size="large" color="#a78bfa" />
                <Text className="text-gray-400 mt-4">Scanning for audio...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-950">
            <SectionList
                sections={sections}
                keyExtractor={(item) => item.path}
                renderItem={({ item }) => (
                    <MediaItem file={item} onPress={handlePress} />
                )}
                renderSectionHeader={({ section: { title } }) => (
                    <View className="bg-gray-900 px-4 py-2 border-b border-gray-800">
                        <Text className="text-gray-300 font-bold uppercase text-xs tracking-wider">
                            {title}
                        </Text>
                    </View>
                )}
                refreshControl={
                    <RefreshControl refreshing={isScanning} onRefresh={scanFiles} tintColor="#a78bfa" />
                }
                ListEmptyComponent={
                    <View className="flex-1 justify-center items-center mt-20">
                        <Text className="text-gray-500">No audio files found</Text>
                    </View>
                }
            />
        </View>
    );
};

export default AudioListScreen;
