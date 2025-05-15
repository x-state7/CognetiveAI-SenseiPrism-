// spawn is a method used to start an external process (like a Python script).
const spawn = require("child_process").spawn;

// Defines an asynchronous Express route/controller function.
// req and res are the standard request and response objects from Express.
exports.callName = async (req, res) => {
  try {
    // Spawning the Python process:
    // if the URL was like:
    // http://localhost:PORT/endpoint?firstname=Mike lastname=Kingdom
    // "python3" is the command to run the Python interpreter.

    // The array provides the Python script path and its arguments.
    const process = spawn("python3", [
      ".././processor/env/bin/analyze.py",
      req.query.firstname,
      req.query.lastname,
    ]);

    // Capturing stdout (standard output)
    // Listens for data from the Python script’s standard output Accumulates the output as a string.
    let output = "";
    process.stdout.on("data", (data) => {
      output += data.toString();
    });

    // Capturing stderr (standard error)
    // Logs any error output printed by the Python script 
    process.stderr.on("data", (data) => {
      console.error(`Python Error: ${data.toString()}`);
    });

    //Handling process completion
    // code is the exit code (0 means success)
    process.on("close", (code) => {
      console.log(`Python process exited with code ${code}`);
      res.send(output); // send only after script completes
    });

  } catch (error) {
    console.error("Node error:", error);
    res.status(500).send("Internal Server Error");
  }
};
