# Application Speech-to-Text pour l'Automobile

## Prérequis
- Docker et Docker Compose
- Clé API OpenAI

## Installation et démarrage

1. Cloner le projet
2. Créer le fichier .env avec votre clé OpenAI
3. Lancer l'application :

\```bash
docker-compose up --build
\```

## Accès
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Fonctionnalités
- Upload de fichiers audio
- Enregistrement audio en direct
- Transcription en temps réel
- Support formats: WAV, MP3, MP4, WebM