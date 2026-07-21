const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

// @desc    Process a booking payment (Stripe / Paystack Integration Simulation)
// @route   POST /api/payments
// @access  Private
const processPayment = async (req, res) => {
  try {
    const { bookingId, paymentMethod, transactionId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status === 'confirmed') {
      return res.status(400).json({ message: 'Booking is already paid and confirmed' });
    }

    // Create payment entry
    const payment = new Payment({
      booking: booking._id,
      user: req.user._id,
      amount: booking.totalAmount,
      paymentMethod: paymentMethod || 'Stripe/Paystack',
      paymentStatus: 'completed',
      transactionId: transactionId || `TXN_${Date.now()}`,
    });

    const savedPayment = await payment.save();

    // Update booking status to confirmed
    booking.status = 'confirmed';
    await booking.save();

    res.status(201).json({
      message: 'Payment successful and booking confirmed',
      payment: savedPayment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get payment details by booking ID
// @route   GET /api/payments/booking/:bookingId
// @access  Private
const getPaymentByBooking = async (req, res) => {
  try {
    const payment = await Payment.findOne({ booking: req.params.bookingId }).populate('booking');
    if (!payment) {
      return res.status(404).json({ message: 'Payment details not found' });
    }
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  processPayment,
  getPaymentByBooking,
};