import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Card } from '../types/card';

interface Props {
  card: Card;
  onPress: (card: Card) => void;
}

export function CardItem({ card, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${card.name}, cost ${card.cost}`}
      onPress={() => onPress(card)}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={styles.cost}>
        <Text style={styles.costText}>{card.cost}</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.name} numberOfLines={1}>
            {card.name}
          </Text>
          <Text style={styles.id}>#{card.id}</Text>
        </View>
        <Text style={styles.meta} numberOfLines={1}>
          {card.type} · {card.tags.join(', ') || '—'}
        </Text>
        {card.text ? (
          <Text style={styles.text} numberOfLines={2}>
            {card.text}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#d0d7de',
  },
  pressed: { opacity: 0.7 },
  cost: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e6f4fe',
  },
  costText: { fontWeight: '700', color: '#0b3d91' },
  body: { flex: 1, gap: 2 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { flex: 1, fontSize: 16, fontWeight: '600', color: '#1f2328' },
  id: { marginLeft: 8, fontSize: 12, color: '#656d76' },
  meta: { fontSize: 12, color: '#656d76', textTransform: 'capitalize' },
  text: { fontSize: 13, color: '#1f2328' },
});
