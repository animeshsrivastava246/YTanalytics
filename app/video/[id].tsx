import { useLocalSearchParams } from 'expo-router';
import { VideoDetail } from '@/features/video/VideoDetail';

export default function VideoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <VideoDetail id={id as string} />;
}
