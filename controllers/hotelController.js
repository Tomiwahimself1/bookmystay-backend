const Hotel = require('../models/Hotel');
const { geocodeAddress } = require('../utils/googleMaps');

// @desc    Get all hotels
// @route   GET /api/hotels
// @access  Public
const getHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find({});
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get hotel by ID
// @route   GET /api/hotels/:id
// @access  Public
const getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a hotel
// @route   POST /api/hotels
// @access  Private/Admin
const createHotel = async (req, res) => {
  try {
    const { name, description, address, city, state, country, amenities, images } = req.body;

    // 1. Geocode address using Google Maps utility
    const fullAddress = `${address}, ${city}${state ? `, ${state}` : ''}${country ? `, ${country}` : ''}`;
    const locationData = await geocodeAddress(fullAddress);

    // 2. Instantiate hotel model with location object included
    const hotel = new Hotel({
      name,
      description,
      address,
      city,
      state,
      country,
      amenities,
      images,
      location: locationData,
    });

    const createdHotel = await hotel.save();
    res.status(201).json(createdHotel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a hotel
// @route   PUT /api/hotels/:id
// @access  Private/Admin
const updateHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    // Assign standard fields
    Object.assign(hotel, req.body);

    // If address, city, or country was updated, recalculate location data
    if (req.body.address || req.body.city || req.body.country) {
      const fullAddress = `${hotel.address}, ${hotel.city}${hotel.country ? `, ${hotel.country}` : ''}`;
      hotel.location = await geocodeAddress(fullAddress);
    }

    const updatedHotel = await hotel.save();
    res.json(updatedHotel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a hotel
// @route   DELETE /api/hotels/:id
// @access  Private/Admin
const deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    await hotel.deleteOne();
    res.json({ message: 'Hotel removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
};