const axios = require('axios');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');

// @desc    Initialize Paystack Payment for a booking
// @route   POST /api/payments/initialize/:bookingId
// @access  Private
const initializePayment = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId).populate('user', 'email name');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized for this booking' });
    }

    if (booking.status === 'Paid' || booking.status === 'Confirmed') {
      return res.status(400).json({ message: 'Booking is already paid' });
    }

    const amountInKobo = Math.round(booking.totalAmount * 100);

    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email: booking.user.email,
        amount: amountInKobo,
        metadata: {
          bookingId: booking._id.toString(),
          userId: booking.user._id.toString(),
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.status(200).json({
      message: 'Payment initialized successfully',
      authorization_url: response.data.data.authorization_url,
      access_code: response.data.data.access_code,
      reference: response.data.data.reference,
    });
  } catch (error) {
    console.error('Paystack initialization error:', error.response?.data || error.message);
    res.status(500).json({
      message: 'Payment initialization failed',
      error: error.response?.data?.message || error.message,
    });
  }
};

// @desc    Verify Paystack Payment
// @route   GET /api/payments/verify/:reference
// @access  Private
const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;

    // 1. Verify transaction with Paystack API
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = response.data.data;

    if (data.status === 'success') {
      const bookingId = data.metadata.bookingId;

      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ message: 'Associated booking not found' });
      }

      // 2. Update booking status (matches Booking schema enum: 'Paid')
      booking.status = 'Paid'; 
      await booking.save();

      // 3. Create or update payment record
      let payment = await Payment.findOne({ transactionId: reference });

      if (!payment) {
        payment = new Payment({
          user: booking.user,
          booking: booking._id,
          amount: data.amount / 100, // convert kobo back to main currency unit
          paymentMethod: 'Paystack',
          transactionId: reference,
          paymentStatus: 'completed', // Matches Payment schema enum ['pending', 'completed', 'failed']
        });
        await payment.save();
      }

      return res.status(200).json({
        message: 'Payment verified successfully',
        booking,
        payment,
      });
    } else {
      return res.status(400).json({
        message: 'Payment verification failed or pending',
        paystackStatus: data.status,
      });
    }
  } catch (error) {
    console.error('Paystack verification error:', error.response?.data || error.message);
    res.status(500).json({
      message: 'Payment verification failed',
      error: error.response?.data?.message || error.message,
    });
  }
};

module.exports = {
  initializePayment,
  verifyPayment,
};