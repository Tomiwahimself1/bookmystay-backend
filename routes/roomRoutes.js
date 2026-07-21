const express = require('express');
const router = express.Router();
const {
  getRoomsByHotel,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
} = require('../controllers/roomController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/hotel/:hotelId', getRoomsByHotel);

router.route('/')
  .post(protect, adminOnly, createRoom);

router.route('/:id')
  .get(getRoomById)
  .put(protect, adminOnly, updateRoom)
  .delete(protect, adminOnly, deleteRoom);

module.exports = router;