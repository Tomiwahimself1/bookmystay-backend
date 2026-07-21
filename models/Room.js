const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true,
    },
    roomType: {
      type: String,
      required: [true, 'Please add a room type (e.g. Single, Double, Suite)'],
    },
    pricePerNight: {
      type: Number,
      required: [true, 'Please add price per night'],
    },
    maxOccupancy: {
      type: Number,
      required: [true, 'Please add max occupancy'],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    images: [
      {
        type: String, // Cloudinary URLs
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Room', roomSchema);