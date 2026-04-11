const express = require('express');
const router = express.Router();

const {
    processRisk,   
    getDeliveries
} = require('../controllers/deliveryController');

// URL: POST http://localhost:5000/api/delivery

router.post('/delivery', processRisk); 

// URL: GET http://localhost:5000/api/deliveries
// This fetches the list for the map
router.get('/deliveries', getDeliveries);

module.exports = router;