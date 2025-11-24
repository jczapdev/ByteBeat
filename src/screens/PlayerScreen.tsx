import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Video, { VideoRef } from 'react-native-video';
import TrackPlayer, { State, usePlaybackState, useProgress } from 'react-native-track-player';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { MediaFile } from '../types';
import { Play, Pause, SkipBack, SkipForward, X, Minimize2 } from 'lucide-react-native';
import Slider from '@react-native-community/slider';

import { useMediaStore } from '../store/useMediaStore';

type ParamList = {
    Player: { file: MediaFile };
};

const PlayerScreen = () => {
    const route = useRoute<RouteProp<ParamList, 'Player'>>();
    const navigation = useNavigation();
    const { file } = route.params;
    const { settings } = useMediaStore();
    const videoRef = useRef<VideoRef>(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isReady, setIsReady] = useState(false);

    // Audio specific hooks
    const playbackState = usePlaybackState();
    const progress = useProgress();

    const isVideo = file.type === 'video';

    useEffect(() => {
        const setupPlayer = async () => {
            try {
                if (!isVideo) {
                    await TrackPlayer.reset();
                    await TrackPlayer.add({
                        id: file.id,
                        url: file.path,
                        title: file.name,
                        artist: 'Unknown Artist',
                        artwork: require('../assets/placeholder_art.png'), // You might need a placeholder image
                    });
                    await TrackPlayer.setRate(settings.playbackSpeed);
                    await TrackPlayer.play();
                    setIsPlaying(true);
                }
            } catch (error) {
                console.error('Error setting up player:', error);
            }
        };

        setupPlayer();

        return () => {
            if (!isVideo) {
                TrackPlayer.reset();
            }
        };
    }, [file, isVideo]);

    const togglePlayback = async () => {
        if (isVideo) {
            setIsPlaying(!isPlaying);
        } else {
            const state = await TrackPlayer.getState();
            if (state === State.Playing) {
                await TrackPlayer.pause();
                setIsPlaying(false);
            } else {
                await TrackPlayer.play();
                setIsPlaying(true);
            }
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <View className="flex-1 bg-black">
            {/* Header */}
            <View className="absolute top-10 left-4 z-10">
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 bg-black/50 rounded-full">
                    <X color="white" size={24} />
                </TouchableOpacity>
            </View>

            {/* Content */}
            <View className="flex-1 justify-center items-center">
                {isVideo ? (
                    <Video
                        ref={videoRef}
                        source={{ uri: file.path }}
                        style={StyleSheet.absoluteFill}
                        resizeMode="contain"
                        paused={!isPlaying}
                        rate={settings.playbackSpeed}
                        onLoad={() => setIsReady(true)}
                        controls={true} // Use native controls for now for better stability
                    />
                ) : (
                    <View className="items-center">
                        <View className="w-64 h-64 bg-gray-800 rounded-2xl justify-center items-center mb-8 shadow-lg shadow-purple-500/20">
                            <Text className="text-6xl">🎵</Text>
                        </View>
                        <Text className="text-white text-2xl font-bold mb-2 text-center px-4">{file.name}</Text>
                        <Text className="text-gray-400 text-lg">Audio Playback</Text>
                    </View>
                )}
            </View>

            {/* Custom Audio Controls (only for audio) */}
            {!isVideo && (
                <View className="pb-12 px-6 w-full">
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-gray-400">{formatTime(progress.position)}</Text>
                        <Text className="text-gray-400">{formatTime(progress.duration)}</Text>
                    </View>

                    <Slider
                        style={{ width: '100%', height: 40 }}
                        minimumValue={0}
                        maximumValue={progress.duration}
                        value={progress.position}
                        onSlidingComplete={async (value: number) => await TrackPlayer.seekTo(value)}
                        minimumTrackTintColor="#a78bfa"
                        maximumTrackTintColor="#4b5563"
                        thumbTintColor="#a78bfa"
                    />

                    <View className="flex-row justify-center items-center mt-6 space-x-8">
                        <TouchableOpacity onPress={() => TrackPlayer.seekTo(progress.position - 10)}>
                            <SkipBack color="white" size={32} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={togglePlayback}
                            className="w-16 h-16 bg-purple-500 rounded-full justify-center items-center"
                        >
                            {isPlaying ? (
                                <Pause color="white" size={32} fill="white" />
                            ) : (
                                <Play color="white" size={32} fill="white" />
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => TrackPlayer.seekTo(progress.position + 10)}>
                            <SkipForward color="white" size={32} />
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
};

export default PlayerScreen;
