const express = require('express')
const router = express.Router()

const { localFileUpload } = require("../controller/fileUpload")
// const { callName } = require("../controller/testScript")
const { runAnalysis } = require('../controller/runAnalysis')


// creating API Route
router.post("/analyze", localFileUpload)
router.get("/result", runAnalysis)
// router.get("/name", callName)

module.exports = router