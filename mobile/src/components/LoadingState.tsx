import { ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';
import { FeedbackState } from './FeedbackState';

interface LoadingStateProps {
  title: string;
}

export function LoadingState({ title }: LoadingStateProps) {
  return (
    <FeedbackState
      title={title}
      icon={<ActivityIndicator size="large" color={colors.primary} />}
    />
  );
}
