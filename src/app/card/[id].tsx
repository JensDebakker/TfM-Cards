import { Stack, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { cardRepository } from '../../data/cardRepository';
import type { Card } from '../../types/card';

export default function CardDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [card, setCard] = useState<Card | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    cardRepository.getCard(id).then((result) => {
      if (!cancelled) {
        setCard(result);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!card) {
    return (
      <View style={styles.center}>
        <Text>Card “{id}” not found.</Text>
      </View>
    );
  }

  const production = card.production ? Object.entries(card.production) : [];

  return (
    <>
      <Stack.Screen options={{ title: card.name }} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.name}>{card.name}</Text>
        <Text style={styles.meta}>
          #{card.id} · {card.set} · {card.type}
        </Text>

        <Row label="Cost" value={`${card.cost} MC`} />
        {card.requirements ? <Row label="Requirements" value={card.requirements} /> : null}
        {card.vp !== undefined ? <Row label="Victory points" value={String(card.vp)} /> : null}
        {card.tags.length > 0 ? <Row label="Tags" value={card.tags.join(', ')} /> : null}
        {production.length > 0 ? (
          <Row
            label="Production"
            value={production.map(([res, n]) => `${n > 0 ? '+' : ''}${n} ${res}`).join(', ')}
          />
        ) : null}

        {card.text ? <Text style={styles.text}>{card.text}</Text> : null}
      </ScrollView>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 10, backgroundColor: '#f6f8fa' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  name: { fontSize: 24, fontWeight: '700', color: '#1f2328' },
  meta: { fontSize: 13, color: '#656d76', textTransform: 'capitalize' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#d0d7de',
  },
  label: { color: '#656d76' },
  value: { flexShrink: 1, textAlign: 'right', color: '#1f2328', fontWeight: '500' },
  text: { marginTop: 12, fontSize: 16, lineHeight: 22, color: '#1f2328' },
});
