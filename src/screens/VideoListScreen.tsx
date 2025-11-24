import React, { useEffect } from 'react';
import { View, Text, SectionList, ActivityIndicator, RefreshControl } from 'react-native';
import { useMediaStore } from '../store/useMediaStore';
import MediaItem from '../components/MediaItem';
import { useNavigation } from '@react-navigation/native';
import { MediaFile } from '../types';

const VideoListScreen = () => {
    const { videos, isScanning, scanFiles } = useMediaStore();
    const navigation = useNavigation();

    useEffect(() => {
        scanFiles();
    }, []);

    const handlePress = (file: MediaFile) => {
        // @ts-ignore - Navigation types not fully set up yet
        navigation.navigate('Player', { file });
    };

    const sections = videos.map(folder => ({
        title: folder.name,
        data: folder.files,
    }));

    if (isScanning && videos.length === 0) {
        return (
            <View className="flex-1 bg-gray-950 justify-center items-center">
                <ActivityIndicator size="large" color="#60a5fa" />
                <Text className="text-gray-400 mt-4">Scanning for videos...</Text>
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
                    <RefreshControl refreshing={isScanning} onRefresh={scanFiles} tintColor="#60a5fa" />
                }
                ListEmptyComponent={
                    <View className="flex-1 justify-center items-center mt-20">
                        <Text className="text-gray-500">No videos found</Text>
                    </View>
                }
            />
        </View>
    );
};

export default VideoListScreen;
