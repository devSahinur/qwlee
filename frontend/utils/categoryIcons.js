// Category icon catalogue (website side).
//
// Mirrors admin/src/common/categoryIcons.js — when the admin saves an
// `icon` key on a category (e.g. "code", "music"), we render the
// matching react-icon here. Keep the two files in sync.

import {
  IoCodeSlashOutline,
  IoPhonePortraitOutline,
  IoColorPaletteOutline,
  IoBrushOutline,
  IoVideocamOutline,
  IoMegaphoneOutline,
  IoPencilOutline,
  IoSparklesOutline,
  IoMusicalNotesOutline,
  IoBriefcaseOutline,
  IoCameraOutline,
  IoStorefrontOutline,
  IoGameControllerOutline,
  IoCalculatorOutline,
  IoLibraryOutline,
  IoEarthOutline,
  IoMicOutline,
  IoTrendingUpOutline,
  IoAppsOutline,
  IoCartOutline,
  IoBookOutline,
  IoCogOutline,
  IoConstructOutline,
  IoCloudOutline,
  IoLockClosedOutline,
  IoBuildOutline,
  IoMedkitOutline,
  IoFitnessOutline,
  IoLeafOutline,
  IoRestaurantOutline,
  IoCarOutline,
  IoAirplaneOutline,
  IoFlashOutline,
  IoHeadsetOutline,
  IoChatbubblesOutline,
  IoPeopleOutline,
  IoBulbOutline,
  IoRocketOutline,
  IoLayersOutline,
  IoNewspaperOutline,
  IoTrophyOutline,
  IoHomeOutline,
  IoGiftOutline,
  IoMagnetOutline,
  IoMapOutline,
  IoColorWandOutline,
} from "react-icons/io5";

const ICON_MAP = {
  code: IoCodeSlashOutline,
  phone: IoPhonePortraitOutline,
  palette: IoColorPaletteOutline,
  brush: IoBrushOutline,
  video: IoVideocamOutline,
  megaphone: IoMegaphoneOutline,
  pencil: IoPencilOutline,
  sparkles: IoSparklesOutline,
  music: IoMusicalNotesOutline,
  briefcase: IoBriefcaseOutline,
  camera: IoCameraOutline,
  storefront: IoStorefrontOutline,
  game: IoGameControllerOutline,
  calculator: IoCalculatorOutline,
  library: IoLibraryOutline,
  earth: IoEarthOutline,
  mic: IoMicOutline,
  trending: IoTrendingUpOutline,
  apps: IoAppsOutline,
  cart: IoCartOutline,
  book: IoBookOutline,
  cog: IoCogOutline,
  construct: IoConstructOutline,
  cloud: IoCloudOutline,
  lock: IoLockClosedOutline,
  build: IoBuildOutline,
  medkit: IoMedkitOutline,
  fitness: IoFitnessOutline,
  leaf: IoLeafOutline,
  restaurant: IoRestaurantOutline,
  car: IoCarOutline,
  airplane: IoAirplaneOutline,
  flash: IoFlashOutline,
  headset: IoHeadsetOutline,
  chat: IoChatbubblesOutline,
  people: IoPeopleOutline,
  bulb: IoBulbOutline,
  rocket: IoRocketOutline,
  layers: IoLayersOutline,
  newspaper: IoNewspaperOutline,
  trophy: IoTrophyOutline,
  home: IoHomeOutline,
  gift: IoGiftOutline,
  magnet: IoMagnetOutline,
  map: IoMapOutline,
  wand: IoColorWandOutline,
};

// Resolve a category record (with possible `.icon` key) → component.
// Falls back to the generic apps icon if the key isn't known or empty.
export function iconForCategory(category) {
  if (!category) return IoAppsOutline;
  const key = String(category.icon || "").toLowerCase();
  return ICON_MAP[key] || IoAppsOutline;
}

// Convenience for templates that just have the key.
export function iconForKey(key) {
  return ICON_MAP[String(key || "").toLowerCase()] || IoAppsOutline;
}

export const DEFAULT_ICON_KEY = "apps";
