import { useLocalSearchParams } from 'expo-router';
import { PlaylistDetail } from '@/features/playlist/PlaylistDetail';

export default function PlaylistScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <PlaylistDetail id={id as string} />;
}
