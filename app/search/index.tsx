import { useLocalSearchParams } from 'expo-router';
import { SearchUI } from '@/features/search/SearchUI';

export default function SearchScreen() {
  const { q } = useLocalSearchParams<{ q?: string }>();
  return <SearchUI initialQuery={q} />;
}
