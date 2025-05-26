import React, { useState, useRef, useEffect } from 'react';

const AudioRecorder = ({ onTranscribe, isLoading }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      const chunks = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        streamRef.current.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Erreur lors du démarrage de l\'enregistrement:', error);
      alert('Impossible d\'accéder au microphone. Vérifiez les permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const handleTranscribe = () => {
    if (audioBlob) {
      const audioFile = new File([audioBlob], 'recording.webm', {
        type: 'audio/webm'
      });
      onTranscribe(audioFile);
    }
  };

  const clearRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="audio-recorder">
      <div className="recording-controls">
        {!isRecording ? (
          <button 
            onClick={startRecording}
            className="record-button"
            disabled={isLoading}
          >
            🎤 Commencer l'enregistrement
          </button>
        ) : (
          <div className="recording-active">
            <button 
              onClick={stopRecording}
              className="stop-button"
            >
              ⏹️ Arrêter ({formatTime(recordingTime)})
            </button>
            <div className="recording-indicator">
              <span className="recording-dot"></span>
              Enregistrement en cours...
            </div>
          </div>
        )}
      </div>

      {audioUrl && !isRecording && (
        <div className="audio-preview">
          <audio controls src={audioUrl} />
          <div className="audio-actions">
            <button 
              onClick={handleTranscribe}
              className="transcribe-button"
              disabled={isLoading}
            >
              {isLoading ? '⏳ Transcription...' : '📝 Transcrire'}
            </button>
            <button 
              onClick={clearRecording}
              className="clear-button"
            >
              🗑️ Supprimer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;