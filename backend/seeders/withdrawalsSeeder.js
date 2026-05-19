const { Withdrawal } = require("../src/models");
const { pick, rand } = require("./utils/random");

const BANKS = [
  "Commonwealth Bank",
  "Westpac",
  "ANZ",
  "NAB",
  "Chase",
  "Bank of America",
  "Deutsche Bank",
];
const ACCOUNT_TYPES = ["Checking", "Savings"];
const STATUSES = ["Pending", "Completed", "Completed", "Failed"];

// Each seller has 1–3 withdrawal records. Mostly completed, a few pending,
// the occasional failed one so admin moderation views are populated.
async function seedWithdrawals({ sellers }) {
  const docs = [];
  for (const seller of sellers) {
    const count = rand(1, 3);
    for (let i = 0; i < count; i++) {
      docs.push({
        userId: seller._id,
        bankName: pick(BANKS),
        accountNumber: String(rand(10000000, 99999999)),
        accountType: pick(ACCOUNT_TYPES),
        withdrawalAmount: rand(150, 5000),
        status: pick(STATUSES),
      });
    }
  }
  const withdrawals = await Withdrawal.insertMany(docs);
  return { withdrawals };
}

module.exports = { seedWithdrawals };
