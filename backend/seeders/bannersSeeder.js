const mongoose = require("mongoose");
const BannerImage = mongoose.model("BannerImage");
const images = require("./utils/images");

const SEEDS = ["hero-developers", "hero-designers", "hero-creators", "hero-ai"];

async function seedBanners() {
  const docs = SEEDS.map((s) => ({ image: images.banner(s) }));
  const banners = await BannerImage.insertMany(docs);
  return { banners };
}

module.exports = { seedBanners };
