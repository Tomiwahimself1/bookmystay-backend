const Booking = require('../models/Booking');
const Room = require('../models/Room');
const sendEmail = require('../utils/sendEmail');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate, totalPrice } = req.body;

    const booking = await Booking.create({
      user: req.user._id,
      room,
      checkInDate,
      checkOutDate,
      totalPrice,
    });

    // Send confirmation email
    try {
      await sendEmail({
        email: req.user.email,
        subject: 'BookMyStay - Reservation Confirmation',
        message: `Hello ${req.user.name},\n\nYour booking (ID: ${booking._id}) has been successfully created!\n\nCheck-In: ${checkInDate}\nCheck-Out: ${checkOutDate}\nTotal Price: $${totalPrice}\n\nThank you for choosing BookMyStay!`,
      });
    } catch (emailError) {
      console.error('Email confirmation error:', emailError.message);
    }

    res.status(201).json({
      success: true,
      booking,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get logged in user bookings
// @route   GET /api/bookings/mybookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('room');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('room');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to cancel this booking' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ success: true, message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
};