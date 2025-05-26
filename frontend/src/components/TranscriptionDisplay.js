import React, { useState } from 'react';

const TranscriptionDisplay = ({ transcriptions, isLoading }) => {
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const toggleExpanded = (id) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Texte copié dans le presse-papiers !');
    });
  };

  const exportTranscriptions = () => {
    const data = transcriptions.map(t => ({
      fichier: t.filename,
      transcription: t.text,
      horodatage: t.timestamp,
      duree: t.duration
    }));
    
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcriptions_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredTranscriptions = transcriptions.filter(t =>
    t.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('fr-FR');
  };

  const highlightSearchTerm = (text, term) => {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  };

  if (isLoading) {
    return (
      <div className="transcription-loading">
        <div className="loading-spinner"></div>
        <p>Transcription en cours...</p>
        <small>Cela peut prendre quelques secondes selon la taille du fichier</small>
      </div>
    );
  }

  return (
    <div className="transcription-display">
      {transcriptions.length > 0 && (
        <div className="transcription-controls">
          <div className="search-bar">
            <input
              type="text"
              placeholder="🔍 Rechercher dans les transcriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="clear-search"
              >
                ×
              </button>
            )}
          </div>
          <button 
            onClick={exportTranscriptions}
            className="export-button"
          >
            📁 Exporter JSON
          </button>
        </div>
      )}

      {filteredTranscriptions.length === 0 && transcriptions.length > 0 && (
        <div className="no-results">
          <p>Aucun résultat pour "{searchTerm}"</p>
        </div>
      )}

      {transcriptions.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🎤</div>
          <h3>Aucune transcription</h3>
          <p>Enregistrez un audio ou uploadez un fichier pour commencer</p>
        </div>
      )}

      <div className="transcriptions-list">
        {filteredTranscriptions.map((transcription) => {
          const isExpanded = expandedIds.has(transcription.id);
          const previewText = transcription.text.length > 150 
            ? transcription.text.substring(0, 150) + '...'
            : transcription.text;

          return (
            <div key={transcription.id} className="transcription-card">
              <div className="transcription-header">
                <div className="transcription-meta">
                  <h4>{transcription.filename}</h4>
                  <div className="transcription-info">
                    <span className="timestamp">{formatTimestamp(transcription.timestamp)}</span>
                    {transcription.duration && (
                      <span className="duration">⏱️ {Math.round(transcription.duration)}s</span>
                    )}
                    <span className="word-count">
                      📝 {transcription.text.split(' ').length} mots
                    </span>
                  </div>
                </div>
                <div className="transcription-actions">
                  <button
                    onClick={() => copyToClipboard(transcription.text)}
                    className="action-button"
                    title="Copier"
                  >
                    📋
                  </button>
                  {transcription.text.length > 150 && (
                    <button
                      onClick={() => toggleExpanded(transcription.id)}
                      className="action-button"
                      title={isExpanded ? "Réduire" : "Développer"}
                    >
                      {isExpanded ? "▲" : "▼"}
                    </button>
                  )}
                </div>
              </div>

              <div className="transcription-content">
                <div 
                  className="transcription-text"
                  dangerouslySetInnerHTML={{
                    __html: highlightSearchTerm(
                      isExpanded ? transcription.text : previewText,
                      searchTerm
                    )
                  }}
                />

                {transcription.words && isExpanded && (
                  <div className="word-timestamps">
                    <h5>Mots avec timestamps:</h5>
                    <div className="words-grid">
                      {transcription.words.map((word, index) => (
                        <span 
                          key={index}
                          className="word-timestamp"
                          title={`${word.start}s - ${word.end}s`}
                        >
                          {word.word}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TranscriptionDisplay;