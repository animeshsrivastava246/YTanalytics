import { useLocalSearchParams } from 'expo-router';
import { ChannelDetail } from '@/features/channel/ChannelDetail';

export default function ChannelScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ChannelDetail id={id as string} />;
}
