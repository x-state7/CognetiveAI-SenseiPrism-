
// const { spawn } = require("child_process")
// const fs = require("fs")
// const path = require("path")

// exports.runAnalysis = async (req, res) => {
//   console.log("Analysis started..")
//   try {
//     // spawn the python script
//     const pythonPath = "/home/mitsuha_/Documents/codes/Projects/Cognitive-AI/CognetiveAI-SenseiPrism-/processor/env/bin/python3"
//     const pythonScript = path.join(__dirname, "../../processor/analyze.py");
//     const pythonProcess = spawn(pythonPath, [pythonScript]);

//     pythonProcess.stdout.on("data", (data) => {
//       console.log(`Python stdout: ${data}`);
//     });

//     pythonProcess.stderr.on("data", (data) => {
//       console.error(`Python stderr: ${data}`);
//     });

//     pythonProcess.on("close", (code) => {
//       if (code !== 0) {
//         return res.status(500)
//           .json({ error: "Python script failsed" })
//       }

//       // Read and send output.json to frontend
//       const outputPath = path.join(__dirname, "../processor/output.json")
//       fs.readFile(outputPath, "utf-8", (err, data) => {
//         if (err) {
//           return res.status(500).json({ error: "failed to read ouput.json" });
//         }
//         const jsonData = JSON.parse(data)
//         // send back the result to frontend
//         res.json(jsonData)
//       })
//     })
//   }
//   catch (err) {
//     console.error("Server error:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// }
// ✅ Define path to Python binary and script

// const path = require("path");
// const { spawn } = require("child_process");

// exports.runAnalysis = async (req, res) => {
//   console.log("✅ Endpoint /result hit");

//   try {
//     const pythonPath = "/home/mitsuha_/Documents/codes/Projects/Cognitive-AI/CognetiveAI-SenseiPrism-/processor/env/bin/python3";
//     const pythonScript = path.join(__dirname, "../../processor/analyze.py");

//     console.log("🔁 Spawning Python process...");
//     const pythonProcess = spawn(pythonPath, [pythonScript], {
//       env: { ...process.env, PYTHONUNBUFFERED: "1" },
//     });

//     let outputData = "";

//     pythonProcess.stdout.on("data", (data) => {
//       outputData += data.toString();
//       console.log(`📤 Python stdout chunk: ${data.toString()}`);
//     });

//     pythonProcess.stderr.on("data", (data) => {
//       console.error(`❌ Python stderr: ${data.toString()}`);
//     });

//     pythonProcess.on("close", (code) => {
//       console.log(`✅ Python script exited with code ${code}`);

//       if (code !== 0) {
//         return res.status(500).json({ error: "Python script failed" });
//       }

//       try {
//         const jsonData = JSON.parse(outputData);
//         console.log("📦 Sending JSON data to frontend...");
//         return res.json(jsonData);
//       } catch (parseErr) {
//         console.error("❌ JSON parse error:", parseErr);
//         return res.status(500).json({ error: "Invalid JSON format from Python output" });
//       }
//     });
//   } catch (err) {
//     console.error("🔥 Server error:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };




// const path = require("path");
// const { spawn } = require("child_process");

// exports.runAnalysis = async (req, res) => {
//   console.log("✅ Endpoint /result hit");

//   try {
//     const pythonPath = "/home/mitsuha_/Documents/codes/Projects/Cognitive-AI/CognetiveAI-SenseiPrism-/processor/env/bin/python3";
//     const pythonScript = path.join(__dirname, "../../processor/analyze.py");

//     console.log("🔁 Spawning Python process...");
//     const pythonProcess = spawn(pythonPath, [pythonScript], {
//       env: { ...process.env, PYTHONUNBUFFERED: "1" },
//     });

//     let outputData = "";

//     pythonProcess.stdout.on("data", (data) => {
//       outputData += data.toString();
//     });

//     pythonProcess.stderr.on("data", (data) => {
//       console.error(`❌ Python stderr: ${data.toString()}`);
//     });

//     pythonProcess.on("close", (code) => {
//       console.log(`✅ Python script exited with code ${code}`);

//       if (code !== 0) {
//         return res.status(500).json({ error: "Python script failed" });
//       }

//       // DEBUG: Optional - show raw output
//       console.log("🧾 Raw Python output:", outputData);

//       try {
//         const jsonData = JSON.parse(outputData.trim()); // Trim to remove extra line breaks
//         console.log("📦 Sending JSON data to frontend...");
//         return res.json(jsonData);
//       } catch (parseErr) {
//         console.error("❌ JSON parse error:", parseErr.message);
//         return res.status(500).json({ error: "Invalid JSON format from Python output" });
//       }
//     });
//   } catch (err) {
//     console.error("🔥 Server error:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };




const path = require("path");
const { spawn } = require("child_process");

exports.runAnalysis = async (req, res) => {
  console.log("✅ Endpoint /result hit");

  try {
    // Absolute path to Python in your venv
    const pythonPath = path.join(
      __dirname,
      "../../processor/env/bin/python3"
    );

    // Absolute path to your Python script
    const scriptPath = path.join(__dirname, "../../processor/analyze.py");

    // Log
    console.log("🔁 Spawning Python process...");

    // Start Python process
    const pythonProcess = spawn(pythonPath, [scriptPath], {
      env: { ...process.env, PYTHONUNBUFFERED: "1" },
    });

    let outputData = "";

    // Accumulate output
    pythonProcess.stdout.on("data", (data) => {
      outputData += data.toString();
    });

    // Log errors if Python script throws
    pythonProcess.stderr.on("data", (data) => {
      console.error(`❌ Python stderr:\n${data.toString()}`);
    });

    // When Python process finishes
    pythonProcess.on("close", (code) => {
      console.log(`✅ Python script exited with code ${code}`);
      if (code !== 0) {
        return res.status(500).json({ error: "Python script failed" });
      }

      try {
        const parsed = JSON.parse(outputData.trim());

        // Send full array or object, do not take first element
        return res.status(200).json(parsed);
      } catch (err) {
        console.error("Failed to parse JSON:", err.message);
        return res.status(500).json({ error: "Invalid JSON from Python script" });
      }
    });

  } catch (err) {
    console.error("🔥 Server error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
