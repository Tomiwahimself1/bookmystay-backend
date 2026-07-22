const express = require('express');
const router = express.Router();
const {
  getHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
} = require('../controllers/hotelController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/')
  .get(getHotels)
  .post(protect, adminOnly, createHotel);

router.route('/:id')
  .get(getHotelById)
  .put(protect, adminOnly, updateHotel)
  .delete(protect, adminOnly, deleteHotel);

module.exports = router;