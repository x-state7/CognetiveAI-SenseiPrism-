# 🧠 SenseiPrism: Cognitive Insight Assistant

**SenseiPrism** is a cognitive-aware AI assistant designed to analyze multimedia content (video, audio, images) in real-time. It extracts text, detects emotional sentiment, and categorizes the topic using natural language processing and machine learning — helping users become more aware of their screen-time and content consumption.

---

## 🚀 Features

- 🎥 Analyze Videos (extract audio → transcribe)
- 🎧 Analyze Audio files (speech-to-text using OpenAI Whisper)
- 🖼️ Analyze Images (OCR using Tesseract)
- 📚 Detect Topic: Educational, Entertainment, or General
- 😃 Detect Emotion: JOY, SADNESS, ANGER, etc. using HuggingFace Transformers
- 📦 Returns structured JSON result for easy visualization
- 🌐 Clean React frontend + Node.js backend integration
- 🐍 Python microservice for ML & processing logic
- ✅ Real-time analysis triggered via UI

---

## 🛠️ Technologies Used

| Layer            | Tech Stack                                                                |
|------------------|---------------------------------------------------------------------------|
| **Frontend**      | React.js, Tailwind CSS, Axios, React-Hook-Form                            |
| **Backend**       | Node.js, Express.js, Multer, Child Process                                |
| **Python Engine** | Whisper (OpenAI), Tesseract, HuggingFace Transformers, OpenCV             |
| **Transpilers**   | Babel, Vite                                                               |
| **Hosting**       | GitHub (Demo), Local Setup (in development)                               |

---

## 📁 Folder Structure

```bash
SenseiPrism/
│
├── client/                   # React frontend
│   ├── App.jsx
│   └── AnalysisViewer.jsx
│
├── server/                   # Express backend
│   ├── controller/
│   │   ├── FileUpload.js
│   │   └── runAnalysis.js
│   ├── routes/
│   │   └── FileRoutes.js
│   └── index.js
│
├── processor/                # Python ML engine
│   ├── analyze.py            # Main analyzer script
│   └── env/                  # Python virtual environment (ignored in Git)
│
└── README.md                 # This file
```

## ⚙️ Installation & Setup

1. Clone the Repository
```bash 
git clone https://github.com/x-state7/SenseiPrism-CognetiveAI-.git
cd SenseiPrism-CognetiveAI-
```

2. Python Environment (Inside processor/)
```bash
cd processor
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
```
3. Install Node Modules
``` bash
cd ../server
npm install

cd ../client
npm install
```
4. Start the Application
In separate terminals:
```bash
# Terminal 1
cd server
npm run dev

# Terminal 2
cd client
npm start
```
## 🔍 API Endpoints

### POST /api/v1/upload/analyze
**Uploads**: audio, image, and video files

**Triggers**: Python processing

**Returns**: JSON output including text, topic, and emotion

### GET /api/v1/upload/result
Returns: Latest analysis JSON result from the backend


## 🧼 To Do
 * Add user authentication

 * Add support for live screen capture

 * Cloud deployment (Render/Vercel/EC2)

 * Improve topic classification using ML models

## 🤝 Contributors
Hemant Kumar – Full Stack Developer & ML Engineer

Mitsuha (My System) – Infra, Debugging, System Design

## 📜 License
This project is licensed under the MIT License.