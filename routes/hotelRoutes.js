const { upload } = require('../config/cloudinary');
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
  // upload.single('image') handles the photo file right here!
  .post(protect, adminOnly, upload.single('image'), createHotel);

router.route('/:id')
  .get(getHotelById)
  // We can also add it to updateHotel if you want to allow updating the photo later
  .put(protect, adminOnly, upload.single('image'), updateHotel)
  .delete(protect, adminOnly, deleteHotel);

module.exports = router;