const { GigLove } = require("../src/models");
const { pickMany, rand } = require("./utils/random");

// Each buyer "loves" 2–5 random gigs. Drives the favorites/wishlist views.
async function seedGigLoves({ buyers, gigs }) {
  const docs = [];
  for (const buyer of buyers) {
    const favs = pickMany(gigs, rand(2, 5));
    for (const gig of favs) {
      docs.push({ userId: buyer._id, gigId: gig._id });
    }
  }
  const gigLoves = await GigLove.insertMany(docs);
  return { gigLoves };
}

module.exports = { seedGigLoves };
