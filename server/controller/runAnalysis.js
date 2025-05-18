
const { spawn } = require("child_process")
const fs = require("fs")
const path = require("path")

exports.runAnalysis = async (req, res) => {
  console.log("Analisis started..")
  try {
    // spawn the python script
    const pythonProcess = spawn("python3", ["../processor/analyze.py"])

    pythonProcess.stdout.on("data", (data) => {
      console.log(`Python stdout: ${data}`);
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`Python stderr: ${data}`);
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        return res.status(500)
          .json({ error: "Python script failsed" })
      }

      // Read and send output.json to frontend
      const outputPath = path.join(__dirname, ".././processor/output.json")
      fs.readFile(outputPath, "utf-8", (err, data) => {
        if (err) {
          return res.status(500).json({ error: "failed to read ouput.json" });
        }
        const jsonData = JSON.parse(data)
        // send back the result to frontend
        res.json(jsonData)
      })
    })
  }
  catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}