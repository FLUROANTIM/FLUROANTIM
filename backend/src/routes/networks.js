const express = require('express');
const { analyzeReading } = require('../controllers/quimicaController');

const router = express.Router();

router.post('/networks', analyzeReading);

module.exports = router;
