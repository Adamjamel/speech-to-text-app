import React, { useState, useEffect } from 'react';
import AudioRecorder from './components/AudioRecorder';
import FileUpload from './components/FileUpload';
import TranscriptionDisplay from './components/TranscriptionDisplay';
import { speechAPI } from './services/api';
import './App.css';

function App() {
  const [transcriptions, setTranscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState('checking');

  useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      await speechAPI.healthCheck();
      setBackendStatus('connected');
    } catch (error) {
      setBackendStatus('disconnected');
      setError('Impossible de se connecter au backend');
    }
  };

  const handleTranscription = async (audioFile, withTimestamps = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = withTimestamps 
        ? await speechAPI.transcribeWithTimestamps(audioFile)
        : await speechAPI.transcribeAudio(audioFile);

      const newTranscription = {
        id: Date.now(),
        text: result.transcription,
        filename: result.filename || 'Enregistrement audio',
        timestamp: result.timestamp,
        duration: result.duration,
        words: result.words || null
      };

      setTranscriptions(prev => [newTranscription, ...prev]);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const clearTranscriptions = () => {
    setTranscriptions([]);
    setError(null);
  };

  const StatusIndicator = () => (
    <div className={`status-indicator ${backendStatus}`}>
      <span className="status-dot"></span>
      <span className="status-text">
        {backendStatus === 'connected' && 'Backend connecté'}
        {backendStatus === 'disconnected' && 'Backend déconnecté'}
        {backendStatus === 'checking' && 'Vérification...'}
      </span>
    </div>
  );

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚗 Speech-to-Text Automobile</h1>
        <StatusIndicator />
      </header>

      <main className="App-main">
        {error && (
          <div className="error-banner">
            <span>❌ {error}</span>
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        <div className="controls-section">
          <div className="control-group">
            <h2>📹 Enregistrement en direct</h2>
            <AudioRecorder 
              onTranscribe={handleTranscription}
              isLoading={isLoading}
            />
          </div>

          <div className="control-group">
            <h2>📁 Upload de fichier</h2>
            <FileUpload 
              onTranscribe={handleTranscription}
              isLoading={isLoading}
            />
          </div>
        </div>

        <div className="transcriptions-section">
          <div className="transcriptions-header">
            <h2>📝 Transcriptions ({transcriptions.length})</h2>
            {transcriptions.length > 0 && (
              <button 
                onClick={clearTranscriptions}
                className="clear-button"
              >
                Effacer tout
              </button>
            )}
          </div>

          <TranscriptionDisplay 
            transcriptions={transcriptions}
            isLoading={isLoading}
          />
        </div>
      </main>
    </div>
  );
}

export default App;