import RNFS from 'react-native-fs';
import { MediaFile, MediaType, Folder } from '../types';

const VIDEO_EXTENSIONS = ['.mp4', '.mkv', '.avi', '.mov'];
const AUDIO_EXTENSIONS = ['.mp3', '.wav', '.aac', '.flac', '.m4a'];

const isVideo = (filename: string) => VIDEO_EXTENSIONS.some(ext => filename.toLowerCase().endsWith(ext));
const isAudio = (filename: string) => AUDIO_EXTENSIONS.some(ext => filename.toLowerCase().endsWith(ext));

export const scanDirectory = async (dirPath: string): Promise<{ videos: MediaFile[], audios: MediaFile[] }> => {
    let videos: MediaFile[] = [];
    let audios: MediaFile[] = [];

    try {
        const items = await RNFS.readDir(dirPath);

        for (const item of items) {
            if (item.isDirectory()) {
                // Recursive scan
                const subResults = await scanDirectory(item.path);
                videos = [...videos, ...subResults.videos];
                audios = [...audios, ...subResults.audios];
            } else if (item.isFile()) {
                if (isVideo(item.name)) {
                    videos.push({
                        id: item.path, // Use path as ID for now
                        name: item.name,
                        path: item.path,
                        type: 'video',
                        size: Number(item.size),
                        dateAdded: item.mtime ? item.mtime.getTime() : Date.now(),
                        parentFolder: dirPath.split('/').pop() || 'Unknown',
                    });
                } else if (isAudio(item.name)) {
                    audios.push({
                        id: item.path,
                        name: item.name,
                        path: item.path,
                        type: 'audio',
                        size: Number(item.size),
                        dateAdded: item.mtime ? item.mtime.getTime() : Date.now(),
                        parentFolder: dirPath.split('/').pop() || 'Unknown',
                    });
                }
            }
        }
    } catch (error) {
        console.warn(`Failed to scan directory: ${dirPath}`, error);
    }

    return { videos, audios };
};

export const groupMediaByFolder = (files: MediaFile[]): Folder[] => {
    const groups: { [key: string]: Folder } = {};

    files.forEach(file => {
        if (!groups[file.parentFolder]) {
            groups[file.parentFolder] = {
                name: file.parentFolder,
                path: file.path.substring(0, file.path.lastIndexOf('/')),
                files: [],
            };
        }
        groups[file.parentFolder].files.push(file);
    });

    return Object.values(groups);
};
