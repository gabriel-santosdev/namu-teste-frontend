import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ContentDetailScreen } from '../features/content-detail/screens/ContentDetailScreen';
import { ContentsScreen } from '../features/contents/screens/ContentsScreen';
import { FavoritesHeaderButton } from '../features/favorites/components/FavoritesHeaderButton';
import { FavoritesScreen } from '../features/favorites/screens/FavoritesScreen';
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
        options={{
          title: 'Conteúdos',
          headerRight: FavoritesHeaderButton,
        }}
      />
      <Stack.Screen
        name="ContentDetail"
        component={ContentDetailScreen}
        options={{ title: 'Detalhes' }}
      />
      <Stack.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ title: 'Favoritos' }}
      />
    </Stack.Navigator>
  );
}
