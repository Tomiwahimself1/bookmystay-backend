const User = require('../models/User');
const Hotel = require('../models/Hotel');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');

// @desc    Get Admin Dashboard Stats & Analytics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalHotels = await Hotel.countDocuments();
    const totalBookings = await Booking.countDocuments();
    
    // Total revenue from successful payments
    const revenueData = await Payment.aggregate([
      { $match: { status: 'success' } },
      { $group: { _id: null, totalRevenue: { $sum: '$amount' } } },
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    // Recent bookings breakdown
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email')
      .populate('hotel', 'name');

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalHotels,
        totalBookings,
        totalRevenue,
      },
      recentBookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAdminStats,
};