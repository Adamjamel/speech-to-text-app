import whisper

model = whisper.load_model("base")

result = model.transcribe(sys.argv[1], language="fr")  # ← Transcription avec fichier passé en argument (langue française)

#result = model.transcribe(r"C:\Users\adamj\speech-to-text-app\backend\Hi I m calling becau.mp3")

print(result["text"])

