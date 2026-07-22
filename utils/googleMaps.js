const axios = require('axios');

/**
 * Get coordinates and Google Maps link from an address string
 * @param {string} address - The hotel address
 * @returns {object} { latitude, longitude, formattedAddress, mapUrl }
 */
const geocodeAddress = async (address) => {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    // Fallback if API key isn't provided yet
    if (!apiKey) {
      console.warn('GOOGLE_MAPS_API_KEY not found in .env. Skipping geocoding.');
      const encodedAddress = encodeURIComponent(address);
      return {
        latitude: null,
        longitude: null,
        formattedAddress: address,
        mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`,
      };
    }

    // Call Google Maps Geocoding API
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`;

    const response = await axios.get(url);

    if (response.data.status === 'OK' && response.data.results.length > 0) {
      const result = response.data.results[0];
      const { lat, lng } = result.geometry.location;
      const formattedAddress = result.formatted_address;

      return {
        latitude: lat,
        longitude: lng,
        formattedAddress,
        mapUrl: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
      };
    } else {
      console.warn('Geocoding failed or returned no results:', response.data.status);
      const encodedAddress = encodeURIComponent(address);
      return {
        latitude: null,
        longitude: null,
        formattedAddress: address,
        mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`,
      };
    }
  } catch (error) {
    console.error('Google Maps Geocoding error:', error.message);
    const encodedAddress = encodeURIComponent(address);
    return {
      latitude: null,
      longitude: null,
      formattedAddress: address,
      mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`,
    };
  }
};

module.exports = { geocodeAddress };