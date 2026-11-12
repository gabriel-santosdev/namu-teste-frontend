import { Platform } from 'react-native';

const API_PORT = 3333;
const API_HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

export const API_URL = `http://${API_HOST}:${API_PORT}`;
