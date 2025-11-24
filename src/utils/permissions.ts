import { Platform } from 'react-native';
import { check, request, PERMISSIONS, RESULTS, PermissionStatus } from 'react-native-permissions';

export const checkAndRequestPermissions = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
        // For Android 13+ (SDK 33+)
        if (Platform.Version >= 33) {
            const videoStatus = await check(PERMISSIONS.ANDROID.READ_MEDIA_VIDEO);
            const audioStatus = await check(PERMISSIONS.ANDROID.READ_MEDIA_AUDIO);

            if (videoStatus === RESULTS.GRANTED && audioStatus === RESULTS.GRANTED) {
                return true;
            }

            const videoRequest = await request(PERMISSIONS.ANDROID.READ_MEDIA_VIDEO);
            const audioRequest = await request(PERMISSIONS.ANDROID.READ_MEDIA_AUDIO);

            return videoRequest === RESULTS.GRANTED && audioRequest === RESULTS.GRANTED;
        } else {
            // For Android < 13
            const status = await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
            if (status === RESULTS.GRANTED) {
                return true;
            }
            const requestStatus = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
            return requestStatus === RESULTS.GRANTED;
        }
    } else if (Platform.OS === 'ios') {
        // iOS permissions (Media Library)
        // Note: You also need to add NSAppleMusicUsageDescription to Info.plist
        const status = await check(PERMISSIONS.IOS.MEDIA_LIBRARY);
        if (status === RESULTS.GRANTED) {
            return true;
        }
        const requestStatus = await request(PERMISSIONS.IOS.MEDIA_LIBRARY);
        return requestStatus === RESULTS.GRANTED;
    }

    return true;
};
