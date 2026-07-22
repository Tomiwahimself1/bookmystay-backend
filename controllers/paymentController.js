const axios = require('axios');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');

// @desc    Initialize Paystack Payment
// @route   POST /api/payments/initialize
// @access  Private
const initializePayment = async (req, res) => {
  try {
    const { bookingId } = req.body;

    // 1. Find booking details
    const booking = await Booking.findById(bookingId).populate('user', 'email name');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Paystack takes amount in kobo/cents (multiply by 100)
    const amountInKobo = booking.totalAmount * 100;

    // 2. Call Paystack API to initialize transaction
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email: booking.user.email,
        amount: amountInKobo,
        metadata: {
          bookingId: booking._id.toString(),
          userId: req.user._id.toString(),
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const { authorization_url, reference } = response.data.data;

    // 3. Save initial pending payment record in DB
    await Payment.create({
      user: req.user._id,
      booking: booking._id,
      amount: booking.totalAmount,
      paymentMethod: 'Paystack',
      status: 'Pending',
      transactionId: reference,
    });

    res.status(200).json({
      message: 'Payment initialized successfully',
      authorization_url, // Link user opens to pay
      reference,
    });
  } catch (error) {
    res.status(500).json({ message: error.response?.data?.message || error.message });
  }
};

// @desc    Verify Paystack Payment
// @route   GET /api/payments/verify/:reference
// @access  Private
const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;

    // 1. Call Paystack API to verify reference
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

      // 2. Update Payment record to Paid
      await Payment.findOneAndUpdate(
        { transactionId: reference },
        { status: 'Completed' }
      );

      // 3. Update Booking status to confirmed
      await Booking.findByIdAndUpdate(bookingId, { status: 'confirmed' });

      return res.status(200).json({
        message: 'Payment verified successfully. Booking confirmed!',
        data,
      });
    } else {
      await Payment.findOneAndUpdate(
        { transactionId: reference },
        { status: 'Failed' }
      );
      return res.status(400).json({ message: 'Payment verification failed' });
    }
  } catch (error) {
    res.status(500).json({ message: error.response?.data?.message || error.message });
  }
};

module.exports = {
  initializePayment,
  verifyPayment,
};