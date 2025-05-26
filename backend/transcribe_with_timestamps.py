import whisper
import sys
import json

model = whisper.load_model("base")
result = model.transcribe(sys.argv[1], language="fr", word_timestamps=True)
print(json.dumps(result, ensure_ascii=False))
