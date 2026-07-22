const Booking = require('../models/Booking');
const Room = require('../models/Room');

// @desc    Create new booking with overlapping availability check
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate } = req.body;

    // 1. Find the room
    const roomDetails = await Room.findById(room);
    if (!roomDetails) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (!roomDetails.isAvailable) {
      return res.status(400).json({ message: 'Room is currently disabled for bookings' });
    }

    // 2. Validate dates
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime()) || nights <= 0) {
      return res.status(400).json({ message: 'Invalid check-in/check-out dates' });
    }

    // 3. OVERLAPPING BOOKING CHECK
    // Find active bookings for the same room where dates overlap
    const existingBooking = await Booking.findOne({
      room: roomDetails._id,
      status: { $ne: 'cancelled' }, // Ignore cancelled bookings
      checkInDate: { $lt: checkOut },
      checkOutDate: { $gt: checkIn },
    });

    if (existingBooking) {
      return res.status(400).json({
        message: 'Room is already booked for the selected dates',
      });
    }

    // 4. Calculate total amount
    const totalAmount = nights * roomDetails.pricePerNight;

    // 5. Create booking
    const booking = new Booking({
      user: req.user._id,
      room: roomDetails._id,
      hotel: roomDetails.hotel,
      checkInDate,
      checkOutDate,
      totalAmount,
      status: 'pending',
    });

    const createdBooking = await booking.save();
    res.status(201).json(createdBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user's bookings (Booking History)
// @route   GET /api/bookings/mybookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('hotel', 'name city address')
      .populate('room', 'roomType pricePerNight');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('hotel', 'name city address')
      .populate('room', 'roomType pricePerNight')
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Ensure only booking owner or admin can view
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
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

    // Verify ownership or admin
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('user', 'name email')
      .populate('hotel', 'name')
      .populate('room', 'roomType');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
};