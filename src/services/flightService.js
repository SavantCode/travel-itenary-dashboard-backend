import axios from 'axios';

const API_URL = 'http://api.aviationstack.com/v1/flights';
const API_KEY = process.env.AVIATIONSTACK_API_KEY;

const cityToIATA = {
  'Copenhagen (DK)': 'CPH',
  'Barcelona (ES)': 'BCN',
};

async function getFlightSuggestions(fromCity, toCity, date) {
  const originCode = cityToIATA[fromCity];
  const destCode = cityToIATA[toCity];

  if (!originCode || !destCode) throw new Error('Invalid city');

  const response = await axios.get(API_URL, {
    params: { access_key: API_KEY, limit: 100 },
  });

  const flights = response.data.data || [];

  // Manual filtering because free plan doesn’t support filtering params
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
}

// Test
getFlightSuggestions('Copenhagen (DK)', 'Barcelona (ES)', '2025-08-17')
  .then(console.log)
  .catch(console.error);
