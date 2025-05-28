import React, { useState } from 'react';

const AnalysisViewer = () => {
  const [result, setResult] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFetchAnalysis = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/v1/upload/result');
      const data = await response.json();

      console.log("Full Response:", data);

      if (data && typeof data === 'object') {
        const analysisArray = data.files_analysis;
        const cognitiveSummary = data.cognitive_summary;
        if (Array.isArray(analysisArray)) {
          setResult(analysisArray);
        } else {
          setResult([]);
        }
        setSummary(cognitiveSummary);
      } else {
        alert("Unexpected data format");
        setResult([]);
        setSummary(null);
      }
    } catch (err) {
      console.error("Error fetching analysis result:", err);
      setResult([]);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">🧠 Cognitive Insight Analysis</h2>
      <button
        onClick={handleFetchAnalysis}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        disabled={loading}
      >
        {loading ? 'Loading...' : 'View Analysis'}
      </button>

      {summary && (
        <div className="bg-gray-700 p-4 rounded-md mt-4 border border-gray-300">
          <h3 className="text-xl font-semibold mb-2">Overall Cognitive Summary</h3>

          <p><strong>Cognitive Insight:</strong> {summary.cognitive_insight}</p><br />
          <p><strong>Emotional Impact:</strong> {summary.emotional_impact}</p><br />
          <p><strong>Summary:</strong> {summary.summary}</p><br />
          <p><strong>Content Type:</strong> {summary.content_type}</p><br />
          <p><strong>Cognitive Stimulation Level:</strong> {summary.stimulation_level}</p><br />
          {/* <p className="text-yellow-300"><strong>🧠 Personalized Feedback:</strong> {summary.feedback}</p> */}
        </div>
      )}



      {result.length > 0 && (
        <div className="space-y-4 mt-4">
          {result.map((item, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">File: {item.file}</span>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${item.type === "audio"
                    ? "bg-green-100 text-green-800"
                    : item.type === "image"
                      ? "bg-yellow-100 text-yellow-800"
                      : item.type === "video"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                >
                  {(item.type ?? 'unknown').toUpperCase()}
                </span>
              </div>
              <p className="whitespace-pre-wrap text-gray-800">{item.text}</p>
              <div className="mt-2 text-sm text-gray-600">
                <strong>Topic:</strong> {item.topic} <br />
                <strong>Emotion:</strong> {item.emotion}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnalysisViewer;
