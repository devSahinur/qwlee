// Category icon renderer.
//
// Two resolution paths:
//   1. If the category record carries an `icon` key (set by the admin
//      via the picker), look it up in the shared categoryIcons map.
//   2. Otherwise fall back to a hand-curated name → component map for
//      backwards compatibility with old seed data.
//
// Pass either a category object via `category={c}` or a plain `name`
// string for legacy callers.

import { iconForKey } from "@/utils/categoryIcons";
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
} from "react-icons/io5";

function normalise(name) {
  return String(name || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

const NAME_MAP = {
  "web development": IoCodeSlashOutline,
  "mobile development": IoPhonePortraitOutline,
  "ui/ux design": IoColorPaletteOutline,
  "graphic design": IoBrushOutline,
  "video editing": IoVideocamOutline,
  "digital marketing": IoMegaphoneOutline,
  "writing & translation": IoPencilOutline,
  "ai services": IoSparklesOutline,
  "music & audio": IoMusicalNotesOutline,
  "business consulting": IoBriefcaseOutline,
  photography: IoCameraOutline,
  ecommerce: IoStorefrontOutline,
  "e-commerce": IoStorefrontOutline,
  "game development": IoGameControllerOutline,
  "data & analytics": IoCalculatorOutline,
  data: IoCalculatorOutline,
  "voice over": IoMicOutline,
  "programming & tech": IoCodeSlashOutline,
  marketing: IoMegaphoneOutline,
  seo: IoTrendingUpOutline,
  finance: IoCalculatorOutline,
  research: IoLibraryOutline,
  translation: IoEarthOutline,
};

export default function CategoryIcon({
  category,
  name,
  className = "",
  size = 22,
}) {
  // Prefer the admin-picked key when present.
  if (category?.icon) {
    const Icon = iconForKey(category.icon);
    return <Icon className={className} size={size} aria-hidden="true" />;
  }
  const resolvedName = category?.name || name || "";
  const Icon = NAME_MAP[normalise(resolvedName)] || IoAppsOutline;
  return <Icon className={className} size={size} aria-hidden="true" />;
}

export function hasIcon(category) {
  if (category?.icon) return true;
  return Boolean(NAME_MAP[normalise(category?.name)]);
}
