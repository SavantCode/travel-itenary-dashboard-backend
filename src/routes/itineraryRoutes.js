import express from 'express';
import {
  createItinerary,
  suggestFlights,
  selectFlight,
  getItinerary,
} from '../controllers/itineraryController.js';

const router = express.Router();

router.post('/itineraries', createItinerary);
router.post('/itineraries/:id/suggest-flights', suggestFlights);
router.post('/itineraries/:id/select-flight', selectFlight);
router.get('/itineraries/:id', getItinerary);

export default router;
