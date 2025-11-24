import { create } from 'zustand';
import { MediaFile, Folder, MediaState } from '../types';
import { scanDirectory, groupMediaByFolder } from '../utils/fileScanner';
import { checkAndRequestPermissions } from '../utils/permissions';
import RNFS from 'react-native-fs';

interface MediaStore extends MediaState {
    scanFiles: () => Promise<void>;
    addCustomDirectory: (path: string) => void;
    removeCustomDirectory: (path: string) => void;
    settings: {
        playbackSpeed: number;
        volumeNormalization: boolean;
        darkMode: boolean;
    };
    updateSettings: (settings: Partial<MediaStore['settings']>) => void;
}

const DEFAULT_DIRECTORIES = [
    RNFS.ExternalStorageDirectoryPath + '/Download',
    RNFS.ExternalStorageDirectoryPath + '/Movies',
    RNFS.ExternalStorageDirectoryPath + '/Music',
    RNFS.ExternalStorageDirectoryPath + '/DCIM',
    RNFS.ExternalStorageDirectoryPath + '/Documents',
];

export const useMediaStore = create<MediaStore>((set, get) => ({
    videos: [],
    audios: [],
    isScanning: false,
    scanError: null,
    customDirectories: [],
    settings: {
        playbackSpeed: 1.0,
        volumeNormalization: false,
        darkMode: true,
    },

    updateSettings: (newSettings) => {
        set(state => ({
            settings: { ...state.settings, ...newSettings }
        }));
    },

    scanFiles: async () => {
        set({ isScanning: true, scanError: null });
        try {
            const hasPermissions = await checkAndRequestPermissions();
            if (!hasPermissions) {
                set({ isScanning: false, scanError: 'Permissions not granted' });
                return;
            }

            const directoriesToScan = [...DEFAULT_DIRECTORIES, ...get().customDirectories];
            let allVideos: MediaFile[] = [];
            let allAudios: MediaFile[] = [];

            // Remove duplicates from directories list if any
            const uniqueDirs = [...new Set(directoriesToScan)];

            for (const dir of uniqueDirs) {
                const { videos, audios } = await scanDirectory(dir);
                allVideos = [...allVideos, ...videos];
                allAudios = [...allAudios, ...audios];
            }

            // Deduplicate files based on path
            const uniqueVideos = Array.from(new Map(allVideos.map(item => [item.path, item])).values());
            const uniqueAudios = Array.from(new Map(allAudios.map(item => [item.path, item])).values());

            set({
                videos: groupMediaByFolder(uniqueVideos),
                audios: groupMediaByFolder(uniqueAudios),
                isScanning: false,
            });
        } catch (error) {
            console.error('Scan error:', error);
            let errorMessage = 'Failed to scan files';

            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (typeof error === 'string') {
                errorMessage = error;
            }

            set({ isScanning: false, scanError: errorMessage });
        }
    },

    addCustomDirectory: (path: string) => {
        set(state => ({
            customDirectories: [...state.customDirectories, path],
        }));
        get().scanFiles();
    },

    removeCustomDirectory: (path: string) => {
        set(state => ({
            customDirectories: state.customDirectories.filter(d => d !== path),
        }));
        get().scanFiles();
    },
}));
