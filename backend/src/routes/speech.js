const express = require('express');
const upload = require('../middleware/upload');
const speechController = require('../controllers/speechController');

const router = express.Router();

// Route pour transcription simple
router.post('/transcribe', upload.single('audio'), speechController.transcribeFile);

// Route pour transcription avec timestamps
router.post('/transcribe-timestamps', upload.single('audio'), speechController.transcribeWithTimestamps);

module.exports = router;

