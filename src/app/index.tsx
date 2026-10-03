import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { CardItem } from '../components/CardItem';
import { useCards } from '../hooks/useCards';
import type { Card, CardType } from '../types/card';
import { DEFAULT_QUERY, filterCards, type CardQuery, type SortOrder } from '../utils/filterCards';

const TYPE_OPTIONS: { value: CardType | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'automated', label: 'Automated' },
  { value: 'active', label: 'Active' },
  { value: 'event', label: 'Events' },
  { value: 'corporation', label: 'Corps' },
  { value: 'prelude', label: 'Preludes' },
  { value: 'colony', label: 'Colonies' },
  { value: 'globalEvent', label: 'Globals' },
];

const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: 'id', label: 'ID' },
  { value: 'costAsc', label: 'MC ↑' },
  { value: 'costDesc', label: 'MC ↓' },
];

export default function CardListScreen() {
  const router = useRouter();
  const { cards, error, loading } = useCards();
  const [query, setQuery] = useState<CardQuery>(DEFAULT_QUERY);

  const visible = useMemo(() => filterCards(cards, query), [cards, query]);

  const openCard = (card: Card) => router.push(`/card/${card.id}`);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Could not load cards: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <TextInput
        value={query.search}
        onChangeText={(search) => setQuery((q) => ({ ...q, search }))}
        placeholder="Search name or text"
        accessibilityLabel="Search cards"
        clearButtonMode="while-editing"
        autoCorrect={false}
        style={styles.search}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {TYPE_OPTIONS.map((opt) => (
          <Chip
            key={opt.value}
            label={opt.label}
            selected={query.type === opt.value}
            onPress={() => setQuery((q) => ({ ...q, type: opt.value }))}
          />
        ))}
      </ScrollView>

      <View style={styles.sortRow}>
        <Text style={styles.count}>
          {visible.length} / {cards.length}
        </Text>
        <View style={styles.sortGroup}>
          {SORT_OPTIONS.map((opt) => (
            <Chip
              key={opt.value}
              label={opt.label}
              selected={query.sort === opt.value}
              onPress={() => setQuery((q) => ({ ...q, sort: opt.value }))}
            />
          ))}
        </View>
      </View>

      <FlatList
        data={visible}
        keyExtractor={(card) => card.id}
        renderItem={({ item }) => <CardItem card={item} onPress={openCard} />}
        ListEmptyComponent={<Text style={styles.empty}>No cards match these filters.</Text>}
        contentContainerStyle={styles.listContent}
        initialNumToRender={15}
      />
    </View>
  );
}

function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f6f8fa' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  error: { color: '#cf222e', textAlign: 'center' },
  search: {
    margin: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: '#ffffff',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#d0d7de',
  },
  chips: { paddingHorizontal: 16, gap: 8, paddingBottom: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#d0d7de',
  },
  chipSelected: { backgroundColor: '#0b3d91', borderColor: '#0b3d91' },
  chipText: { fontSize: 13, color: '#1f2328' },
  chipTextSelected: { color: '#ffffff', fontWeight: '600' },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  sortGroup: { flexDirection: 'row', gap: 6 },
  count: { fontSize: 13, color: '#656d76' },
  listContent: { paddingBottom: 24 },
  empty: { textAlign: 'center', marginTop: 40, color: '#656d76' },
});
