import { LinearGradient } from 'expo-linear-gradient';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Card, CardType } from '../types/card';
import { TAG_ICON } from './tagIcons';

interface Props {
  card: Card;
  onPress: (card: Card) => void;
}

// Colours copied from the reference site's .background-color-* rules.
const TYPE_COLOR: Record<CardType, string> = {
  automated: '#089108',
  active: '#208cdf',
  event: '#ec6a13',
  corporation: '#ffcc64',
  prelude: '#eb76ab',
  colony: '#9e9180',
  globalEvent: '#43afa5',
};

// Same 240x310 box as the reference .filterDiv
const CARD_WIDTH = 240;
const CARD_MIN_HEIGHT = 310;

export function CardItem({ card, onPress }: Props) {
  const color = TYPE_COLOR[card.type];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${card.name}, cost ${card.cost}`}
      onPress={() => onPress(card)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <LinearGradient
        colors={[color, `${color}88`, color]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        {card.cost > 0 ? (
          <View style={styles.price}>
            <Text style={styles.priceText}>{card.cost}</Text>
          </View>
        ) : null}
        <Text style={styles.title} numberOfLines={2}>
          {card.name}
        </Text>
      </LinearGradient>

      {card.tags.length > 0 ? (
        <View style={styles.tags}>
          {card.tags.map((tag) => (
            <Image key={tag} source={TAG_ICON[tag]} accessibilityLabel={tag} style={styles.tag} />
          ))}
        </View>
      ) : null}

      <View style={styles.content}>
        {card.requirements ? <Text style={styles.requirements}>{card.requirements}</Text> : null}
        {card.text ? <Text style={styles.description}>{card.text}</Text> : null}
      </View>

      <View style={styles.footer}>
        <Text style={styles.number}>#{card.id}</Text>
        {card.vp !== undefined ? <Text style={styles.vp}>{card.vp} VP</Text> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: 'center',
    width: CARD_WIDTH,
    minHeight: CARD_MIN_HEIGHT,
    marginVertical: 10,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#f3ead2',
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderTopColor: '#dddddd',
    borderLeftColor: '#dddddd',
    borderBottomColor: '#898989',
    borderRightColor: '#898989',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  pressed: { opacity: 0.8 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#888888',
  },
  price: {
    width: 50,
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#888888',
  },
  priceText: { fontSize: 26, fontWeight: '700', color: '#000000' },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    textTransform: 'uppercase',
    textAlign: 'center',
    color: '#ffffff',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 4,
    paddingTop: 6,
    paddingHorizontal: 8,
  },
  tag: { width: 22, height: 22 },
  content: {
    flexGrow: 1,
    padding: 10,
    gap: 6,
  },
  requirements: { fontSize: 14, lineHeight: 18, textAlign: 'center', color: '#000000', fontWeight: '600' },
  description: { fontSize: 14, lineHeight: 18, textAlign: 'center', color: '#000000' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 6,
  },
  number: { fontSize: 13, color: '#aaaaaa' },
  vp: { fontSize: 13, fontWeight: '700', color: '#000000' },
});
