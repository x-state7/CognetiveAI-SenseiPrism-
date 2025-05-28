import os
import json
import whisper
import pytesseract
from PIL import Image
import cv2
import subprocess
import tempfile
import sys
from transformers import pipeline
import subprocess
import json
# - feedback (personalized behavioral suggestion)


# Create the sentiment analysis pipeline once
classifier = pipeline("text-classification", model="j-hartmann/emotion-english-distilroberta-base")

# Logging helper (stderr only)
def log(msg):
    print(msg, file=sys.stderr)

# Transcribes audio files (mp3, wav) using Whisper
def transcribe_audio(file_path):
    model = whisper.load_model("base")
    result = model.transcribe(file_path, language="en")
    return result["text"]

# Extracts text from image using Tesseract OCR
def extract_text_from_image(image_path):
    return pytesseract.image_to_string(Image.open(image_path))

# Extracts audio from video using ffmpeg and transcribes it
def extract_audio_from_video(video_path):
    temp_audio = tempfile.NamedTemporaryFile(delete=False, suffix=".mp3")
    audio_path = temp_audio.name
    temp_audio.close()

    command = [
        "ffmpeg", "-y",
        "-i", video_path,
        "-q:a", "0",
        "-map", "a",
        audio_path
    ]

    subprocess.run(command, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    transcript = transcribe_audio(audio_path)
    os.remove(audio_path)
    return transcript

# Detect topic using keywords
def detect_topic(text):
    entertainment_keywords = ["youtube", "game", "music", "movie"]
    educational_keywords = ["python", "course", "tutorial", "learn", "study"]

    text = text.lower()
    if any(word in text for word in entertainment_keywords):
        return "Entertainment"
    elif any(word in text for word in educational_keywords):
        return "Educational"
    return "General"

# Detect emotion using sentiment analysis
def detect_emotion(text):
    try:
        result = classifier(text[:512])[0]  # Limiting to first 512 chars
        return result["label"]
    except:
        return "Unknown"

# Analyzes a file and returns structured output
def analyze_file(file_path):
    ext = os.path.splitext(file_path)[-1].lower()
    result = {
        "file": os.path.basename(file_path),
        "type": "unknown",
        "text": "",
        "topic": "Unknown",
        "emotion": "Unknown"
    }

    if ext in ['.mp3', '.wav', '.m4a']:
        result["type"] = "audio"
        result["text"] = transcribe_audio(file_path)
    elif ext in ['.png', '.jpg', '.jpeg']:
        result["type"] = "image"
        result["text"] = extract_text_from_image(file_path)
    elif ext in ['.mp4', '.mkv', '.avi']:
        result["type"] = "video"
        result["text"] = extract_audio_from_video(file_path)
    else:
        result["text"] = "Unsupported file format"
        return result

    # Analyze the content of the extracted text
    result["topic"] = detect_topic(result["text"])
    result["emotion"] = detect_emotion(result["text"])
    return result



def generate_cognitive_insight(text):
    prompt = f"""
You are an expert cognitive and behavioral analyst AI.

Given the following content:

\"\"\"{text}\"\"\"

1. Analyze the overall emotional and cognitive effects this type of content might have on an average person.
2. Detect whether the content is more educational, entertainment, or mixed.
3. Identify how this media consumption could affect attention span, emotional health, or learning.
4. Based on the analysis, write a short, personalized feedback message like:
   "Your recent media is entertainment-heavy. This may increase dopamine craving and reduce long-term focus. Consider balancing it with educational content."

Return your response in JSON format with these keys:
- cognitive_insight
- emotional_impact
- summary
- content_type (e.g., Educational, Entertainment, Mixed)
- stimulation_level (e.g., High, Moderate, Low)
"""

    process = subprocess.Popen(
        ["ollama", "run", "gemma:2b"],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )
    stdout, stderr = process.communicate(input=prompt)

    if stderr:
        print("Ollama error:", stderr, file=sys.stderr)

    try:
        return json.loads(stdout)
    except json.JSONDecodeError:
        # Return fallback structure if model replies in natural language
        return {
            "cognitive_insight": stdout.strip(),
            "emotional_impact": "",
            "summary": "",
            "content_type": "",
            "stimulation_level": "",
            "feedback": "Unable to generate structured feedback. Try with clearer content."
        }

def summarize_and_map_cognition(results):
    combined_text = " ".join(r["text"] for r in results if r["text"])
    insight = generate_cognitive_insight(combined_text)
    return insight


# Processes all files in the folder
def process_folder(folder_path):
    results = []
    for file_name in os.listdir(folder_path):
        file_path = os.path.join(folder_path, file_name)
        if os.path.isfile(file_path):
            log(f"Analyzing file: {file_path}")
            results.append(analyze_file(file_path))
    return results

if __name__ == "__main__":
    folder_path = "../server/controller/files"
    log("Processing files in folder: " + folder_path)
    results = process_folder(folder_path)

    # Generate overall cognitive summary
    summary = summarize_and_map_cognition(results)

    # Output both detailed analysis and overall insight
    output = {
        "files_analysis": results,
        "cognitive_summary": summary
    }

    print(json.dumps(output, indent=4, ensure_ascii=False))