import { React, useEffect, useState } from 'react'

const AnalysisViewer = () => {

  const [result, setResult] = useState(null);
  useEffect(() => {
    // fetch the result from backend
    fetch("http://localhost:4000/api/v1/upload/result", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then((res) => res.json())
      .then((data) => {
        // step 2 handle rsposne
        console.log("Analysis Result:", data)
        setResult(data)
      })
      .catch((err) => {
        console.log("Wrror Fetching analysis result:", err)
      })
  }, [])
  return (
    <div>
      <h2>Analysis Output</h2>
      {result ? (
        <pre>{JSON.stringify(result, null, 2)}</pre>) : (<p>Loading analysis</p>)
      }
    </div>
  )
}

export default AnalysisViewer