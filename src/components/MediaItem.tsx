import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MediaFile } from '../types';
import { PlayCircle, Music } from 'lucide-react-native';

interface MediaItemProps {
    file: MediaFile;
    onPress: (file: MediaFile) => void;
}

const MediaItem: React.FC<MediaItemProps> = ({ file, onPress }) => {
    const formatSize = (bytes: number) => {
        const mb = bytes / (1024 * 1024);
        return `${mb.toFixed(2)} MB`;
    };

    return (
        <TouchableOpacity
            className="flex-row items-center p-4 border-b border-gray-800 bg-gray-900 active:bg-gray-800"
            onPress={() => onPress(file)}
        >
            <View className="w-12 h-12 bg-gray-800 rounded-lg justify-center items-center mr-4">
                {file.type === 'video' ? (
                    <PlayCircle color="#60a5fa" size={24} />
                ) : (
                    <Music color="#a78bfa" size={24} />
                )}
            </View>
            <View className="flex-1">
                <Text className="text-white font-medium text-base" numberOfLines={1}>
                    {file.name}
                </Text>
                <Text className="text-gray-400 text-sm mt-1">
                    {formatSize(file.size)}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export default MediaItem;
