import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useMediaStore } from '../store/useMediaStore';
import { FolderPlus, Trash2, RefreshCw } from 'lucide-react-native';
import RNFS from 'react-native-fs';

const SettingsScreen = () => {
    const { customDirectories, addCustomDirectory, removeCustomDirectory, scanFiles, isScanning, settings, updateSettings } = useMediaStore();
    const [newPath, setNewPath] = useState('');

    const handleAddDirectory = async () => {
        if (!newPath.trim()) return;

        // Basic validation (check if path exists)
        try {
            const exists = await RNFS.exists(newPath);
            if (!exists) {
                Alert.alert('Error', 'Directory does not exist');
                return;
            }

            addCustomDirectory(newPath);
            setNewPath('');
        } catch (error) {
            Alert.alert('Error', 'Invalid path');
        }
    };

    return (
        <ScrollView className="flex-1 bg-gray-950 p-4">
            <Text className="text-white text-2xl font-bold mb-6">Settings</Text>

            {/* Media Management Section */}
            <View className="mb-8">
                <Text className="text-gray-400 text-sm uppercase font-bold mb-4 tracking-wider">Media Library</Text>

                <View className="bg-gray-900 rounded-xl p-4 mb-4">
                    <Text className="text-white font-medium mb-4">Custom Directories</Text>

                    {customDirectories.map((dir, index) => (
                        <View key={index} className="flex-row justify-between items-center py-3 border-b border-gray-800 last:border-0">
                            <Text className="text-gray-300 flex-1 mr-2" numberOfLines={1}>{dir}</Text>
                            <TouchableOpacity onPress={() => removeCustomDirectory(dir)}>
                                <Trash2 color="#ef4444" size={20} />
                            </TouchableOpacity>
                        </View>
                    ))}

                    {customDirectories.length === 0 && (
                        <Text className="text-gray-500 italic mb-2">No custom directories added</Text>
                    )}

                    <View className="flex-row items-center mt-4">
                        <TextInput
                            className="flex-1 bg-gray-950 text-white p-3 rounded-lg mr-2 border border-gray-800"
                            placeholder="/storage/emulated/0/MyMusic"
                            placeholderTextColor="#6b7280"
                            value={newPath}
                            onChangeText={setNewPath}
                        />
                        <TouchableOpacity
                            className="bg-purple-600 p-3 rounded-lg"
                            onPress={handleAddDirectory}
                        >
                            <FolderPlus color="white" size={24} />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity
                    className="bg-gray-900 rounded-xl p-4 flex-row items-center justify-center active:bg-gray-800"
                    onPress={() => scanFiles()}
                    disabled={isScanning}
                >
                    <RefreshCw color={isScanning ? "#6b7280" : "#60a5fa"} size={20} className={isScanning ? "animate-spin" : ""} />
                    <Text className={`font-medium ml-2 ${isScanning ? "text-gray-500" : "text-blue-400"}`}>
                        {isScanning ? 'Scanning...' : 'Rescan Library'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Playback Settings */}
            <View className="mb-8">
                <Text className="text-gray-400 text-sm uppercase font-bold mb-4 tracking-wider">Playback Settings</Text>
                <View className="bg-gray-900 rounded-xl p-4">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-white font-medium">Default Playback Speed</Text>
                        <View className="flex-row bg-gray-950 rounded-lg p-1">
                            {[0.5, 1.0, 1.5, 2.0].map((speed) => (
                                <TouchableOpacity
                                    key={speed}
                                    onPress={() => updateSettings({ playbackSpeed: speed })}
                                    className={`px-3 py-1 rounded-md ${settings.playbackSpeed === speed ? 'bg-purple-600' : ''}`}
                                >
                                    <Text className={`text-xs ${settings.playbackSpeed === speed ? 'text-white' : 'text-gray-400'}`}>
                                        {speed}x
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View className="flex-row justify-between items-center">
                        <Text className="text-white font-medium">Volume Normalization</Text>
                        <TouchableOpacity
                            onPress={() => updateSettings({ volumeNormalization: !settings.volumeNormalization })}
                            className={`w-12 h-6 rounded-full ${settings.volumeNormalization ? 'bg-purple-600' : 'bg-gray-700'} justify-center px-1`}
                        >
                            <View className={`w-4 h-4 rounded-full bg-white ${settings.volumeNormalization ? 'self-end' : 'self-start'}`} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* App Info */}
            <View className="items-center mt-8">
                <Text className="text-gray-600 text-sm">ByteBeat Media Player</Text>
                <Text className="text-gray-700 text-xs mt-1">v1.0.0</Text>
            </View>
        </ScrollView>
    );
};

export default SettingsScreen;
