import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// API setup
const API_URL = 'http://api.aviationstack.com/v1/flights';
const API_KEY = process.env.AVIATIONSTACK_API_KEY;

// Check if API key is present
if (!API_KEY) {
  throw new Error('Missing AVIATIONSTACK_API_KEY in environment variables.');
}

// Mapping city names to IATA airport codes
const cityToIATA = {
  'Copenhagen (DK)': 'CPH',
  'Barcelona (ES)': 'BCN',
};

export async function getFlightSuggestions(fromCity, toCity, date) {
  const originCode = cityToIATA[fromCity];
  const destCode = cityToIATA[toCity];

  if (!originCode || !destCode) {
    throw new Error('Invalid city provided. Check city name and try again.');
  }

  try {
    const response = await axios.get(API_URL, {
      params: {
        access_key: API_KEY,
        limit: 100,
      },
    });

    const flights = response.data.data || [];

    // Filter flights manually due to free plan limitations
    const filtered = flights.filter(f =>
      f.departure?.iata === originCode &&
      f.arrival?.iata === destCode &&
      f.flight_date === date &&
      ['scheduled', 'active'].includes(f.flight_status)
    );

    return filtered.map(f => ({
      airline: f.airline?.name,
      flightNo: f.flight?.number,
      departureTime: f.departure?.scheduled,
      arrivalTime: f.arrival?.scheduled,
      date: f.flight_date,
    }));
  } catch (err) {
    console.error('Error fetching flight data:', err.message || err);
    throw err;
  }
}

// ✅ Uncomment this to test directly from the file
/*
getFlightSuggestions('Copenhagen (DK)', 'Barcelona (ES)', '2025-08-17')
  .then(console.log)
  .catch(console.error);
*/
