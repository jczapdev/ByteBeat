export type MediaType = 'video' | 'audio';

export interface MediaFile {
    id: string;
    name: string;
    path: string;
    type: MediaType;
    size: number;
    duration?: number; // In seconds
    dateAdded: number; // Timestamp
    parentFolder: string;
}

export interface Folder {
    name: string;
    path: string;
    files: MediaFile[];
}

export interface MediaState {
    videos: Folder[];
    audios: Folder[];
    isScanning: boolean;
    scanError: string | null;
    customDirectories: string[];
    settings: {
        playbackSpeed: number;
        volumeNormalization: boolean;
        darkMode: boolean;
    };
}
