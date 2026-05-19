const Gig = require("../models/gig.model");
const Payment = require("../models/payment.model");
const User = require("../models/user.model");

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const getTotalStatus = async () => {
  // Aggregation pipeline for users
  const userAggregation = [
    {
      $facet: {
        totalFreelancer: [
          { $match: { role: "freelancer" } },
          { $count: "count" }
        ],
        totalBuyer: [
          { $match: { role: "buyer" } },
          { $count: "count" }
        ]
      }
    },
    {
      $project: {
        totalFreelancer: { $arrayElemAt: ["$totalFreelancer.count", 0] },
        totalBuyer: { $arrayElemAt: ["$totalBuyer.count", 0] }
      }
    }
  ];

  const userResult = await User.aggregate(userAggregation);
  const totalFreelancer = userResult[0]?.totalFreelancer || 0;
  const totalBuyer = userResult[0]?.totalBuyer || 0;
  // Aggregation pipeline for gigs
  const totalGigs = await Gig.countDocuments();

  // Aggregation pipeline for payments
  const paymentAggregation = [
    {
      $unwind: "$items"
    },
    {
      $group: {
        _id: null,
        totalEarnings: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
      }
    }
  ];

  const paymentResult = await Payment.aggregate(paymentAggregation);
  const totalEarnings = paymentResult[0]?.totalEarnings || 0;

  return {
    totalEarnings,
    totalFreelancer,
    totalBuyer,
    totalGigs,
  };
};

const getIncomeRatio = async (year) => {
  // Aggregate payments to get the monthly earnings
  const payments = await Payment.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $unwind: '$items',
    },
    {
      $group: {
        _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
        totalEarnings: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
      },
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 },
    },
    {
      $project: {
        _id: 0,
        month: '$_id.month',
        totalEarnings: 1,
      },
    },
  ]);

  // Initialize an array with all months set to 0 earnings
  const monthlyIncomeRatio = monthNames.map((month, index) => ({
    month,
    totalEarnings: 0,
  }));

  // Update the array with actual earnings
  payments.forEach(payment => {
    monthlyIncomeRatio[payment.month - 1].totalEarnings = payment.totalEarnings;
  });

  return monthlyIncomeRatio;
};

const getUserRatio = async (month) => {
  let startDate, endDate;
  if (month) {
    // Convert the month parameter to a range of dates
    startDate = new Date(`${new Date().getFullYear()}-${month}-01`);
    endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
  } else {
    // If no month is provided, use the entire year
    startDate = new Date(`${new Date().getFullYear()}-01-01`);
    endDate = new Date(`${new Date().getFullYear()}-12-31`);
  }

  const freelancers = await User.countDocuments({
    role: "freelancer",
    createdAt: { $gte: startDate, $lte: endDate }
  });

  const buyers = await User.countDocuments({
    role: "buyer",
    createdAt: { $gte: startDate, $lte: endDate }
  });

  return {
    month: month ? monthNames[startDate.getMonth()] : "Yearly",
    totalFreelancers: freelancers,
    totalBuyers: buyers,
    ratio: buyers !== 0 ? freelancers / buyers : 0,
  };
};

const getRecentUsers = async (filter, options) => {

  filter["role"] = "freelancer";
  options.sortBy = "createdAt:desc";
  const users = await User.paginate(filter, options);
  return users;
}
const queryEarning = async (filter, options) => {
  options.populate = [
    { path: "gigId", populate: { path: "categoriesId" } },
    { path: "clientId" }
  ];

  const result = await Payment.paginate(filter, options);
  // Calculate total earnings
  let totalEarnings = 0;
  result.results.forEach((payment) => {
    payment.items.forEach((item) => {
      totalEarnings += item.price * item.quantity;
    });
  });

  return {
    ...result,
    totalEarnings,
  };
};

// Full platform orders (admin scope). Mirrors queryEarning but returns
// every payment, populated for the admin table.
const queryAllOrders = async (filter = {}, options = {}) => {
  options.populate = [
    { path: "gigId" },
    { path: "freelancerId" },
    { path: "clientId" },
  ];
  options.sortBy = options.sortBy || "createdAt:desc";
  if (!options.limit) options.limit = 50;
  const query = {};
  if (filter.status) query.status = filter.status;
  const result = await Payment.paginate(query, options);
  return result;
};

// Full platform gigs (admin scope). Skips the marketplace's
// "exclude own gigs" filter — the admin sees everything.
const queryAllGigs = async (filter = {}, options = {}) => {
  options.populate = [{ path: "userId" }, { path: "categoriesId" }];
  options.sortBy = options.sortBy || "createdAt:desc";
  if (!options.limit) options.limit = 50;
  const query = {};
  if (filter.title) query.title = { $regex: filter.title, $options: "i" };
  if (filter.categories) query.categoriesId = filter.categories;
  const result = await Gig.paginate(query, options);
  return result;
};

// Set/clear the ban state on a user. `reason` is shown on the sign-in
// page when the user tries to log in. Admins themselves can't be
// banned through this endpoint — protects the system from being locked
// out by a rogue admin action.
const banUser = async (userId, { reason = "" } = {}) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  if (user.role === "admin") throw new Error("Admins cannot be banned");
  user.isBan = true;
  user.banReason =
    (reason && reason.trim()) ||
    "Your account has been suspended by an administrator.";
  user.bannedAt = new Date();
  await user.save();
  return user;
};

const unbanUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  user.isBan = false;
  user.banReason = "";
  user.bannedAt = null;
  await user.save();
  return user;
};

module.exports = {
  getTotalStatus,
  getIncomeRatio,
  getUserRatio,
  getRecentUsers,
  queryEarning,
  queryAllOrders,
  queryAllGigs,
  banUser,
  unbanUser,
};
