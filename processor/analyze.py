import os
import json
import whisper
import pytesseract
from PIL import Image
import cv2
import subprocess
import tempfile


# Transcribes audio files (mp3, wav) using Whisper with Hindi language support
def transcribe_audio(file_path):
  # Load Whisper model
  model=whisper.load_model("base")
  # Transcribe in Hindi
  result=model.transcribe(file_path,language="en") 
   # Return the extracted text
  return result["text"]


# Extracts text from image using Tesseract OCR
def extract_text_from_image(image_path):
  # OCR image
  return pytesseract.image_to_string(Image.open(image_path))


# Extracts audio from video using ffmpeg and transcribes it
def extract_audio_from_video(video_path):
    # Create a temporary file for the extracted audio
    temp_audio = tempfile.NamedTemporaryFile(delete=False, suffix=".mp3")
    audio_path = temp_audio.name
    temp_audio.close()  # Close the file so ffmpeg can write to it

    # Use ffmpeg to extract audio
    command = [
        "ffmpeg", "-y",  # Overwrite if needed
        "-i", video_path,  # Input file
        "-q:a", "0",       # Quality setting
        "-map", "a",       # Select audio stream
        audio_path         # Output path
    ]

    # Run ffmpeg and capture errors silently
    subprocess.run(command, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    # Transcribe the audio and return text
    transcript = transcribe_audio(audio_path)
    # Optionally delete the audio file
    os.remove(audio_path)
    return transcript


# Determines the file type and applies the correct processing function
def analyze_file(file_path):
  # Get file extension
  ext=os.path.splitext(file_path)[-1].lower()
  # Dictionary to hold result
  output={}

  # Audio processing
  if ext in ['.mp3','.wav','.m4a']:
    output["type"]="audio"
    output["text"]=transcribe_audio(file_path)

  # image processing  
  elif ext in ['.png','.jpg','.jpeg']:
    output["type"]="image"
    output["text"]=extract_text_from_image(file_path)

  # Video processing
  elif ext in ['.mp4','mkv','.avi']:
    output["type"]="video"
    output["text"]=extract_audio_from_video(file_path)

  # Unsupported file type
  else:
    output["type"]="unknown"
    output["text"]="unsupported file format"

  # Save filename in output and return the result
  output["file"]=os.path.basename(file_path)
  return output


# Iterates through a folder and analyzes all supported files
def process_folder(folder_path):
  # List to store results
  results=[]
  # Loop through files in the folder
  for file_name in os.listdir(folder_path):
    file_path=os.path.join(folder_path,file_name)
    # Skip subfolders
    if os.path.isfile(file_path):
      print(f"Processing:{file_path}")
      results.append(analyze_file(file_path))
  return results

# MAIN EXECUTION
if __name__=="__main__":
  # Path to folder with files
  folder_path="../server/controller/files"
  # Process files and collect results
  output=process_folder(folder_path)

  # save or send JSON to frontend
  with open("output.json","w",encoding="utf-8") as f:
    json.dump(output,f,indent=4,ensure_ascii=False)
    print("analyse complete. Output has been saved to your output.json")
