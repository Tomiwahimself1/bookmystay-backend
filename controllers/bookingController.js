const Booking = require('../models/Booking');
const Room = require('../models/Room');
const sendEmail = require('../utils/sendEmail');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { room: roomId, checkInDate, checkOutDate, totalPrice } = req.body;

    const room = await Room.findById(roomId).populate('hotel');
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (!room.isAvailable) {
      return res.status(400).json({ message: 'Room is currently not available' });
    }

    const booking = await Booking.create({
      user: req.user._id,
      room: roomId,
      hotel: room.hotel._id,
      checkInDate,
      checkOutDate,
      totalPrice,
      paymentStatus: 'pending',
    });

    // Send Confirmation Email asynchronously
    try {
      const emailContent = `
        <h1>Booking Confirmation - BookMyStay</h1>
        <p>Dear ${req.user.name},</p>
        <p>Thank you for choosing <strong>BookMyStay</strong>!</p>
        <h3>Booking Details:</h3>
        <ul>
          <li><strong>Booking ID:</strong> ${booking._id}</li>
          <li><strong>Hotel:</strong> ${room.hotel ? room.hotel.name : 'N/A'}</li>
          <li><strong>Room Type:</strong> ${room.roomType}</li>
          <li><strong>Check-In Date:</strong> ${new Date(checkInDate).toDateString()}</li>
          <li><strong>Check-Out Date:</strong> ${new Date(checkOutDate).toDateString()}</li>
          <li><strong>Total Amount:</strong> ₦${totalPrice}</li>
        </ul>
        <p>We look forward to hosting you!</p>
      `;

      await sendEmail({
        email: req.user.email,
        subject: 'Your Booking Confirmation - BookMyStay',
        message: `Thank you for your booking! Booking ID: ${booking._id}`,
        html: emailContent,
      });
    } catch (emailErr) {
      console.error('Email notification failed to send:', emailErr.message);
      // We don't throw an error here so the booking process still completes
    }

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user bookings
// @route   GET /api/bookings/mybookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('hotel', 'name address city')
      .populate('room', 'roomType roomNumber price');

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
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email')
      .populate('hotel', 'name address city')
      .populate('room', 'roomType roomNumber price');

    if (booking) {
      res.json(booking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
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

    // Check ownership or admin
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    booking.bookingStatus = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully', booking });
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