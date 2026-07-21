const Hotel = require('../models/Hotel');

// @desc    Get all hotels (with search/city filter)
// @route   GET /api/hotels
// @access  Public
const getHotels = async (req, res) => {
  try {
    const { city, name } = req.query;
    let query = {};

    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }
    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    const hotels = await Hotel.find(query);
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single hotel by ID
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
    const { name, description, address, city, country, images, rating } = req.body;

    // 1. Check if a photo was uploaded via Cloudinary
    let hotelImages = images ? (Array.isArray(images) ? images : [images]) : [];
    if (req.file) {
      hotelImages.push(req.file.path); // Add Cloudinary URL to images array
    }

    // 2. Create the hotel record
    const hotel = new Hotel({
      name,
      description,
      address,
      city,
      country,
      images: hotelImages,
      rating: rating || 0,
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

    if (hotel) {
      hotel.name = req.body.name || hotel.name;
      hotel.description = req.body.description || hotel.description;
      hotel.address = req.body.address || hotel.address;
      hotel.city = req.body.city || hotel.city;
      hotel.country = req.body.country || hotel.country;
      hotel.rating = req.body.rating || hotel.rating;

      // Update images if a new file is uploaded
      if (req.file) {
        hotel.images.push(req.file.path);
      } else if (req.body.images) {
        hotel.images = req.body.images;
      }

      const updatedHotel = await hotel.save();
      res.json(updatedHotel);
    } else {
      res.status(404).json({ message: 'Hotel not found' });
    }
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

    if (hotel) {
      await hotel.deleteOne();
      res.json({ message: 'Hotel removed' });
    } else {
      res.status(404).json({ message: 'Hotel not found' });
    }
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