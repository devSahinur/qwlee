const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const portfolioSchema = mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
      default:
        "https://i.ibb.co/x5DCTS7/qwlee-portfolio-placeholder.png",
    },
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
portfolioSchema.plugin(paginate);

const Portfolio = mongoose.model("Portfolio", portfolioSchema);

module.exports = Portfolio;
