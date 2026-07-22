const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a hotel name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    address: {
      type: String,
      required: [true, 'Please add an address'],
    },
    city: {
      type: String,
      required: [true, 'Please add a city'],
    },
    country: {
      type: String,
      required: [true, 'Please add a country'],
    },
    images: [
      {
        type: String, // Cloudinary URLs
      },
    ],
    rating: {
      type: Number,
      default: 0,
    },
    location: {
      latitude: {
        type: Number,
        default: null,
      },
      longitude: {
        type: Number,
        default: null,
      },
      formattedAddress: {
        type: String,
        default: '',
      },
      mapUrl: {
        type: String,
        default: '',
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Hotel', hotelSchema);