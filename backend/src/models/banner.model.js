const { Schema, model } = require("mongoose");
const { paginate } = require("./plugins");

const bannerSchema = new Schema({
  image: {
    type: String,
    required: true,
  },
});

bannerSchema.plugin(paginate);

const BannerImage = model("BannerImage", bannerSchema);

module.exports = BannerImage;
