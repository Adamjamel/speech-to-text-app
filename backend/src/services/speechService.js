const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

class SpeechService {
  async transcribeAudio(filePath) {
    try {
      console.log('📝 Début de la transcription pour:', filePath);
      
      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(filePath),
        model: "whisper-1",
        language: "fr", // Français par défaut, peut être modifié
        response_format: "json",
        temperature: 0.2
      });

      console.log('✅ Transcription terminée');
      return {
        text: transcription.text,
        duration: transcription.duration || null
      };
    } catch (error) {
      console.error('❌ Erreur lors de la transcription:', error.message);
      throw new Error(`Erreur de transcription: ${error.message}`);
    }
  }

  async transcribeWithTimestamps(filePath) {
    try {
      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(filePath),
        model: "whisper-1",
        response_format: "verbose_json",
        timestamp_granularities: ["word"]
      });

      return {
        text: transcription.text,
        words: transcription.words,
        duration: transcription.duration
      };
    } catch (error) {
      console.error('❌ Erreur lors de la transcription avec timestamps:', error.message);
      throw new Error(`Erreur de transcription: ${error.message}`);
    }
  }
}

module.exports = new SpeechService();