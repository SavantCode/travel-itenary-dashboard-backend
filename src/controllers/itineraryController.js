import Itinerary from '../models/Itinerary.js';
import * as flightService from '../services/flightService.js';
import {
  validateItineraryCreate,
  validateFlightSuggest,
  validateFlightSelect,
} from '../utils/validators.js';

export const createItinerary = async (req, res, next) => {
  try {
    const { error } = validateItineraryCreate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const itinerary = new Itinerary(req.body);
    await itinerary.save();
    res.status(201).json({ success: true, message: 'Itinerary created', itinerary });
  } catch (err) {
    next(err);
  }
};

export const suggestFlights = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fromCity, toCity, date } = req.body;
    const { error } = validateFlightSuggest(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const itinerary = await Itinerary.findById(id);
    if (!itinerary) return res.status(404).json({ success: false, message: 'Itinerary not found' });

    if (date < itinerary.startDate || date > itinerary.endDate) {
      return res.status(400).json({ success: false, message: 'Flight date must be between itinerary start and end dates' });
    }

    const suggestions = await flightService.getFlightSuggestions(fromCity, toCity, date);
    if (!suggestions.length) {
      return res.status(200).json({
        success: false,
        message: 'No flights available for these dates and cities. Try adjusting your search.',
      });
    }

    res.json({ success: true, suggestions });
  } catch (err) {
    next(err);
  }
};

export const selectFlight = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { legIndex, selectedFlight } = req.body;
    const { error } = validateFlightSelect(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const itinerary = await Itinerary.findById(id);
    if (!itinerary) return res.status(404).json({ success: false, message: 'Itinerary not found' });

    if (legIndex < 0) return res.status(400).json({ success: false, message: 'Invalid leg index' });

    if (legIndex >= itinerary.journeyLegs.length) {
      itinerary.journeyLegs.push({ modeOfTravel: 'Flight', ...selectedFlight });
    } else {
      itinerary.journeyLegs[legIndex] = { ...itinerary.journeyLegs[legIndex], ...selectedFlight };
    }

    await itinerary.save();
    res.json({ success: true, message: 'Flight selected and saved', selected: selectedFlight, itinerary });
  } catch (err) {
    next(err);
  }
};

export const getItinerary = async (req, res, next) => {
  try {
    const { id } = req.params;
    const itinerary = await Itinerary.findById(id);
    if (!itinerary) return res.status(404).json({ success: false, message: 'Itinerary not found' });
    res.json({ success: true, itinerary });
  } catch (err) {
    next(err);
  }
};
