import os
import json
import whisper
import pytesseract
from PIL import Image
import cv2
import subprocess
import tempfile
import sys

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

# Analyzes a file based on its extension
def analyze_file(file_path):
    ext = os.path.splitext(file_path)[-1].lower()
    output = {}

    if ext in ['.mp3', '.wav', '.m4a']:
        output["type"] = "audio"
        output["text"] = transcribe_audio(file_path)
    elif ext in ['.png', '.jpg', '.jpeg']:
        output["type"] = "image"
        output["text"] = extract_text_from_image(file_path)
    elif ext in ['.mp4', '.mkv', '.avi']:
        output["type"] = "video"
        output["text"] = extract_audio_from_video(file_path)
    else:
        output["type"] = "unknown"
        output["text"] = "unsupported file format"

    output["file"] = os.path.basename(file_path)
    return output

# Processes all files in a folder
def process_folder(folder_path):
    results = []
    for file_name in os.listdir(folder_path):
        file_path = os.path.join(folder_path, file_name)
        if os.path.isfile(file_path):
            log(f"Analyzing file: {file_path}")
            results.append(analyze_file(file_path))
    return results

# Main entry point
if __name__ == "__main__":
    folder_path = "../server/controller/files"
    log("Processing files in folder: " + folder_path)
    output = process_folder(folder_path)
    print(json.dumps(output, indent=4, ensure_ascii=False))
