const Room = require('../models/Room');

// @desc    Get all rooms for a specific hotel
// @route   GET /api/rooms/hotel/:hotelId
// @access  Public
const getRoomsByHotel = async (req, res) => {
  try {
    const rooms = await Room.find({ hotel: req.params.hotelId });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single room details
// @route   GET /api/rooms/:id
// @access  Public
const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate('hotel', 'name city');
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a room
// @route   POST /api/rooms
// @access  Private/Admin
const createRoom = async (req, res) => {
  try {
    const { hotel, roomType, pricePerNight, maxOccupancy, isAvailable, images } = req.body;

    const room = new Room({
      hotel,
      roomType,
      pricePerNight,
      maxOccupancy,
      isAvailable,
      images: images || [],
    });

    const createdRoom = await room.save();
    res.status(201).json(createdRoom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a room
// @route   PUT /api/rooms/:id
// @access  Private/Admin
const updateRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (room) {
      room.roomType = req.body.roomType || room.roomType;
      room.pricePerNight = req.body.pricePerNight || room.pricePerNight;
      room.maxOccupancy = req.body.maxOccupancy || room.maxOccupancy;
      room.isAvailable = req.body.isAvailable !== undefined ? req.body.isAvailable : room.isAvailable;
      room.images = req.body.images || room.images;

      const updatedRoom = await room.save();
      res.json(updatedRoom);
    } else {
      res.status(404).json({ message: 'Room not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a room
// @route   DELETE /api/rooms/:id
// @access  Private/Admin
const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (room) {
      await room.deleteOne();
      res.json({ message: 'Room removed' });
    } else {
      res.status(404).json({ message: 'Room not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRoomsByHotel,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
};