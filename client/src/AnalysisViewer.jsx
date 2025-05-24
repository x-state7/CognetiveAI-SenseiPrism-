import React, { useState } from 'react';

const AnalysisViewer = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFetchAnalysis = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/v1/upload/result');

      const data = await response.json();
      console.log("Analysis Result:", data);
      setResult(data);
    } catch (err) {
      console.error("Error fetching analysis result:", err);
    } finally {
      setLoading(false);
    }
  };

  // return (
  //   <div>
  //     <h2>Analysis Output</h2>
  //     <button onClick={handleFetchAnalysis}>View Analysis</button>
  //     {loading && <p>Loading analysis...</p>}
  //     {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
  //   </div>
  // );
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">🧠 Cognitive Insight Analysis</h2>
      <button
        onClick={handleFetchAnalysis}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        View Analysis
      </button>

      {loading && <p className="text-gray-500">Loading analysis...</p>}

      {result && (
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
                  {item.type.toUpperCase()}
                </span>
              </div>
              <p className="whitespace-pre-wrap text-gray-800">{item.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnalysisViewer;
