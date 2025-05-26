// const OpenAI = require('openai');
// const fs = require('fs');
// const path = require('path');

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });

// class SpeechService {
//   async transcribeAudio(filePath) {
//     try {
//       console.log('📝 Début de la transcription pour:', filePath);
      
//       const transcription = await openai.audio.transcriptions.create({
//         file: fs.createReadStream(filePath),
//         model: "whisper-1",
//         language: "fr", // Français par défaut, peut être modifié
//         response_format: "json",
//         temperature: 0.2
//       });

//       console.log('✅ Transcription terminée');
//       return {
//         text: transcription.text,
//         duration: transcription.duration || null
//       };
//     } catch (error) {
//       console.error('❌ Erreur lors de la transcription:', error.message);
//       throw new Error(`Erreur de transcription: ${error.message}`);
//     }
//   }

//   async transcribeWithTimestamps(filePath) {
//     try {
//       const transcription = await openai.audio.transcriptions.create({
//         file: fs.createReadStream(filePath),
//         model: "whisper-1",
//         response_format: "verbose_json",
//         timestamp_granularities: ["word"]
//       });

//       return {
//         text: transcription.text,
//         words: transcription.words,
//         duration: transcription.duration
//       };
//     } catch (error) {
//       console.error('❌ Erreur lors de la transcription avec timestamps:', error.message);
//       throw new Error(`Erreur de transcription: ${error.message}`);
//     }
//   }
// }

// module.exports = new SpeechService();
const { spawn } = require('child_process');
const path = require('path');

class SpeechService {
  async transcribeAudio(filePath) {
    try {
      console.log('📝 Début de la transcription locale pour:', filePath);

      const result = await this.runPythonScript('transcribe.py', filePath);
      return {
        text: result,
        duration: null // Tu peux calculer la durée avec ffmpeg si nécessaire
      };
    } catch (error) {
      console.error('❌ Erreur de transcription locale:', error);
      throw new Error(`Erreur de transcription locale: ${error}`);
    }
  }

  async transcribeWithTimestamps(filePath) {
    try {
      const result = await this.runPythonScript('transcribe_with_timestamps.py', filePath);
      const parsed = JSON.parse(result);

      return {
        text: parsed.text,
        words: parsed.segments?.flatMap(seg => seg.words) || [],
        duration: parsed.segments?.slice(-1)[0]?.end || null
      };
    } catch (error) {
      console.error('❌ Erreur de transcription avec timestamps:', error);
      throw new Error(`Erreur de transcription avec timestamps locale: ${error}`);
    }
  }

  runPythonScript(scriptName, filePath) {
    return new Promise((resolve, reject) => {
      const scriptPath = path.join(__dirname, '../../', scriptName);
      const process = spawn('python3', [scriptPath, filePath]);

      let output = '';
      let errorOutput = '';

      process.stdout.on('data', (data) => output += data.toString());
      process.stderr.on('data', (data) => errorOutput += data.toString());

      process.on('close', (code) => {
        if (code === 0) {
          resolve(output.trim());
        } else {
          reject(errorOutput || `Script terminé avec le code ${code}`);
        }
      });
    });
  }
}

module.exports = new SpeechService();
