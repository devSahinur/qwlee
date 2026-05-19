const { Portfolio } = require("../src/models");
const images = require("./utils/images");
const { rand } = require("./utils/random");

// Schema is minimal — just image + userId. Give every seller 3–5 portfolio
// images so the freelancer profile page looks alive.
async function seedPortfolios({ sellers }) {
  const docs = [];
  for (const seller of sellers) {
    const count = rand(3, 5);
    for (let i = 0; i < count; i++) {
      docs.push({
        userId: seller._id,
        image: images.portfolio(seller.username, i),
      });
    }
  }
  const portfolios = await Portfolio.insertMany(docs);
  return { portfolios };
}

module.exports = { seedPortfolios };
