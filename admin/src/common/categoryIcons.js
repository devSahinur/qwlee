// Shared catalogue of category icons.
//
// Each entry is `{ key, label, Icon }` — the `key` is a short, stable
// string that gets saved in the category's `icon` field. The website
// looks up by that key too, so what the admin picks here is what
// shows up on the marketplace.
//
// Add to the list to expand the picker. Renames are breaking — only
// append, never change existing keys.

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

export const CATEGORY_ICONS = [
  { key: "code", label: "Code", Icon: IoCodeSlashOutline },
  { key: "phone", label: "Phone", Icon: IoPhonePortraitOutline },
  { key: "palette", label: "Palette", Icon: IoColorPaletteOutline },
  { key: "brush", label: "Brush", Icon: IoBrushOutline },
  { key: "video", label: "Video", Icon: IoVideocamOutline },
  { key: "megaphone", label: "Megaphone", Icon: IoMegaphoneOutline },
  { key: "pencil", label: "Pencil", Icon: IoPencilOutline },
  { key: "sparkles", label: "Sparkles", Icon: IoSparklesOutline },
  { key: "music", label: "Music", Icon: IoMusicalNotesOutline },
  { key: "briefcase", label: "Briefcase", Icon: IoBriefcaseOutline },
  { key: "camera", label: "Camera", Icon: IoCameraOutline },
  { key: "storefront", label: "Storefront", Icon: IoStorefrontOutline },
  { key: "game", label: "Game", Icon: IoGameControllerOutline },
  { key: "calculator", label: "Calculator", Icon: IoCalculatorOutline },
  { key: "library", label: "Library", Icon: IoLibraryOutline },
  { key: "earth", label: "Earth", Icon: IoEarthOutline },
  { key: "mic", label: "Microphone", Icon: IoMicOutline },
  { key: "trending", label: "Trending", Icon: IoTrendingUpOutline },
  { key: "apps", label: "Apps", Icon: IoAppsOutline },
  { key: "cart", label: "Cart", Icon: IoCartOutline },
  { key: "book", label: "Book", Icon: IoBookOutline },
  { key: "cog", label: "Settings", Icon: IoCogOutline },
  { key: "construct", label: "Construct", Icon: IoConstructOutline },
  { key: "cloud", label: "Cloud", Icon: IoCloudOutline },
  { key: "lock", label: "Lock", Icon: IoLockClosedOutline },
  { key: "build", label: "Build", Icon: IoBuildOutline },
  { key: "medkit", label: "Medical", Icon: IoMedkitOutline },
  { key: "fitness", label: "Fitness", Icon: IoFitnessOutline },
  { key: "leaf", label: "Leaf", Icon: IoLeafOutline },
  { key: "restaurant", label: "Restaurant", Icon: IoRestaurantOutline },
  { key: "car", label: "Car", Icon: IoCarOutline },
  { key: "airplane", label: "Airplane", Icon: IoAirplaneOutline },
  { key: "flash", label: "Flash", Icon: IoFlashOutline },
  { key: "headset", label: "Headset", Icon: IoHeadsetOutline },
  { key: "chat", label: "Chat", Icon: IoChatbubblesOutline },
  { key: "people", label: "People", Icon: IoPeopleOutline },
  { key: "bulb", label: "Idea", Icon: IoBulbOutline },
  { key: "rocket", label: "Rocket", Icon: IoRocketOutline },
  { key: "layers", label: "Layers", Icon: IoLayersOutline },
  { key: "newspaper", label: "Newspaper", Icon: IoNewspaperOutline },
  { key: "trophy", label: "Trophy", Icon: IoTrophyOutline },
  { key: "home", label: "Home", Icon: IoHomeOutline },
  { key: "gift", label: "Gift", Icon: IoGiftOutline },
  { key: "magnet", label: "Magnet", Icon: IoMagnetOutline },
  { key: "map", label: "Map", Icon: IoMapOutline },
  { key: "wand", label: "Wand", Icon: IoColorWandOutline },
];

const BY_KEY = Object.fromEntries(CATEGORY_ICONS.map((e) => [e.key, e]));

// Resolve a saved icon key to its react-icon component (or a fallback).
export function iconForKey(key) {
  return BY_KEY[key]?.Icon || IoAppsOutline;
}

// Default key used when no icon was picked yet.
export const DEFAULT_ICON_KEY = "apps";
