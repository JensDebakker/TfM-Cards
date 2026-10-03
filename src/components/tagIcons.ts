import type { ImageSourcePropType } from 'react-native';
import type { Tag } from '../types/card';

// Metro bundles images only from static require() calls, so every tag is listed here explicitly.
export const TAG_ICON: Record<Tag, ImageSourcePropType> = {
  building: require('../../assets/tags/building.png'),
  space: require('../../assets/tags/space.png'),
  science: require('../../assets/tags/science.png'),
  plant: require('../../assets/tags/plant.png'),
  microbe: require('../../assets/tags/microbe.png'),
  animal: require('../../assets/tags/animal.png'),
  power: require('../../assets/tags/power.png'),
  earth: require('../../assets/tags/earth.png'),
  jovian: require('../../assets/tags/jovian.png'),
  city: require('../../assets/tags/city.png'),
  venus: require('../../assets/tags/venus.png'),
  event: require('../../assets/tags/event.png'),
  wild: require('../../assets/tags/wild.png'),
};
