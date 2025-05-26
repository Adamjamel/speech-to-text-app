const speechService = require('../services/speechService');
const fs = require('fs-extra');
const path = require('path');

class SpeechController {
  async transcribeFile(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: 'Aucun fichier audio fourni'
        });
      }

      const filePath = req.file.path;
      console.log('🎵 Fichier reçu:', req.file.originalname);

      // Transcription
      const result = await speechService.transcribeAudio(filePath);

      // Nettoyage du fichier temporaire
      await fs.remove(filePath);

      res.json({
        success: true,
        transcription: result.text,
        filename: req.file.originalname,
        duration: result.duration,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('❌ Erreur dans transcribeFile:', error);
      
      // Nettoyage en cas d'erreur
      if (req.file && req.file.path) {
        await fs.remove(req.file.path).catch(console.error);
      }

      res.status(500).json({
        error: 'Erreur lors de la transcription',
        details: error.message
      });
    }
  }

  async transcribeWithTimestamps(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: 'Aucun fichier audio fourni'
        });
      }

      const filePath = req.file.path;
      const result = await speechService.transcribeWithTimestamps(filePath);

      // Nettoyage
      await fs.remove(filePath);

      res.json({
        success: true,
        transcription: result.text,
        words: result.words,
        duration: result.duration,
        filename: req.file.originalname,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('❌ Erreur dans transcribeWithTimestamps:', error);
      
      if (req.file && req.file.path) {
        await fs.remove(req.file.path).catch(console.error);
      }

      res.status(500).json({
        error: 'Erreur lors de la transcription avec timestamps',
        details: error.message
      });
    }
  }
}

module.exports = new SpeechController();