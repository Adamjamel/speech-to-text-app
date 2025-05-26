import React, { useState, useRef } from 'react';

const FileUpload = ({ onTranscribe, isLoading }) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const acceptedTypes = [
    'audio/wav',
    'audio/mp3', 
    'audio/mpeg',
    'audio/mp4',
    'audio/webm',
    'audio/ogg'
  ];

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const audioFile = files.find(file => acceptedTypes.includes(file.type));
    
    if (audioFile) {
      setSelectedFile(audioFile);
    } else {
      alert('Veuillez sélectionner un fichier audio valide (WAV, MP3, MP4, WebM, OGG)');
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && acceptedTypes.includes(file.type)) {
      setSelectedFile(file);
    } else {
      alert('Format de fichier non supporté');
    }
  };

  const handleTranscribe = (withTimestamps = false) => {
    if (selectedFile) {
      onTranscribe(selectedFile, withTimestamps);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="file-upload">
      <div 
        className={`drop-zone ${dragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        
        {!selectedFile ? (
          <div className="drop-content">
            <div className="drop-icon">📁</div>
            <p>Glissez un fichier audio ici ou cliquez pour sélectionner</p>
            <small>Formats supportés: WAV, MP3, MP4, WebM, OGG (max 25MB)</small>
          </div>
        ) : (
          <div className="file-selected">
            <div className="file-info">
              <div className="file-icon">🎵</div>
              <div className="file-details">
                <div className="file-name">{selectedFile.name}</div>
                <div className="file-size">{formatFileSize(selectedFile.size)}</div>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  clearFile();
                }}
                className="remove-file"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedFile && (
        <div className="transcribe-options">
          <button 
            onClick={() => handleTranscribe(false)}
            className="transcribe-button primary"
            disabled={isLoading}
          >
            {isLoading ? '⏳ Transcription...' : '📝 Transcrire'}
          </button>
          <button 
            onClick={() => handleTranscribe(true)}
            className="transcribe-button secondary"
            disabled={isLoading}
          >
            {isLoading ? '⏳ Transcription...' : '⏱️ Avec timestamps'}
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;