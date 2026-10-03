import { useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { CardItem } from '../components/CardItem';
import { useCards } from '../hooks/useCards';
import type { Card } from '../types/card';

export default function CardListScreen() {
  const router = useRouter();
  const { cards, error, loading } = useCards();

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
      <Text style={styles.count}>{cards.length} cards</Text>

      <FlatList
        data={cards}
        keyExtractor={(card) => card.id}
        renderItem={({ item }) => <CardItem card={item} onPress={openCard} />}
        ListEmptyComponent={<Text style={styles.empty}>No cards loaded.</Text>}
        contentContainerStyle={styles.listContent}
        initialNumToRender={15}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f6f8fa' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  error: { color: '#cf222e', textAlign: 'center' },
  count: { paddingHorizontal: 16, paddingVertical: 12, fontSize: 13, color: '#656d76' },
  listContent: { paddingBottom: 24 },
  empty: { textAlign: 'center', marginTop: 40, color: '#656d76' },
});
