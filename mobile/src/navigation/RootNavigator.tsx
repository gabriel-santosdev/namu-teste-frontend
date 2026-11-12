import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ContentsScreen } from '../features/contents/screens/ContentsScreen';
import { colors } from '../theme/colors';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: colors.primaryDark,
        headerTitleStyle: { fontWeight: '700', color: colors.text },
        headerStyle: { backgroundColor: colors.surface },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="Contents"
        component={ContentsScreen}
        options={{ title: 'Conteúdos' }}
      />
    </Stack.Navigator>
  );
}
