const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const speechRoutes = require('./routes/speech');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/speech', speechRoutes);

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend speech-to-text opérationnel' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Serveur backend démarré sur le port ${PORT}`);
});

module.exports = app;