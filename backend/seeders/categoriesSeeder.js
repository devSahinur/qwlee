const { Categories } = require("../src/models");
const images = require("./utils/images");

// Generic top-level marketplace categories. Names are industry-standard
// (every freelance marketplace uses some form of these). No subcategory
// tree — the schema doesn't model parent/child relationships yet, and
// curating a hierarchy is its own product decision.
//
// The `type` field is omitted; the Mongoose default of "online" applies.
// Qwlee is online-only — the field is kept for back-compat.
// Category list with a paired icon *key*. Keys map to react-icon
// components on both the admin picker and the marketplace renderer
// (admin/src/common/categoryIcons.js and frontend/utils/categoryIcons.js).
const CATEGORIES = [
  { name: "Web Development", icon: "code" },
  { name: "Mobile Development", icon: "phone" },
  { name: "UI/UX Design", icon: "palette" },
  { name: "Graphic Design", icon: "brush" },
  { name: "Video Editing", icon: "video" },
  { name: "Digital Marketing", icon: "megaphone" },
  { name: "Writing & Translation", icon: "pencil" },
  { name: "AI Services", icon: "sparkles" },
  { name: "Music & Audio", icon: "music" },
  { name: "Business Consulting", icon: "briefcase" },
  { name: "Photography", icon: "camera" },
  { name: "Data & Analytics", icon: "calculator" },
  { name: "Game Development", icon: "game" },
  { name: "Finance & Accounting", icon: "trending" },
  { name: "E-Commerce", icon: "storefront" },
];

async function seedCategories() {
  const docs = CATEGORIES.map(({ name, icon }) => ({
    name,
    icon,
    image: images.category(name),
  }));
  const categories = await Categories.insertMany(docs);
  return { categories };
}

module.exports = { seedCategories };
