// getting the model
// const File = require("../models/File")

// local file uplaod handler function
exports.localFileUpload = async (req, res) => {
  try {
    // to keep track of uploaded files
    const uploadedFiles = []

    //  expected file field names
    const fileFields = ['audio', 'image', 'video']

    // const uploadedData = req.files.file

    // iterating over each expected file field
    for (const field of fileFields) {
      // get the uplaoded files for this field
      const file = req.files?.[field];
      if (!file) {
        // if expected file is missing return error
        return res.status(400).json({
          success: 'false',
          message: `${field} is missing`
        })
      }
      // support for multiple files per field
      const filesArray = Array.isArray(file) ? file : [file]
      // loop thriugh  all files under this field
      for (const f of filesArray) {
        let uploadPath = __dirname + "/files/" + Date.now() + `.${f.name.split('.').pop()}`
        uploadedFiles.push({
          // audio image or video
          field,
          path: uploadPath,
          name: f.name
        })
        // move files to the destination path
        await f.mv(uploadPath)

        console.log(`${field} uploadedData to: ${uploadPath}`)

      }
    }

    // if (uploadedData.length > 1) {
    //   for (let i = 0; i < uploadedData.length; i++) {

    //     // printing the content of the file
    //     console.log("File Content-->", uploadedData[i])
    //     // path to which i want to store the file let path

    //     res.filePath = uploadedFiles

    //   }
    // }
    // move function is very important for file upload(add path to the function)
    // uploadedData[i].mv(uploadPath, (err) => {
    //   console.log(err)
    // })

    // else if file has one type
    // else {
    //   // for single image
    //   let uploadPath = __dirname + "/files/" + Date.now() + `.${uploadedData.name.split('.')[1]}`
    //   uploadedFiles.push(uploadPath)
    //   res.filePath = uploadedFiles
    //   uploadedData.mv(uploadPath, (err) => {
    //     console.log(err)
    //   })
    // }

    // send response


    return res.status(200).json({
      success: true,
      message: "Local file uploaded successfully",
      files: uploadedFiles
    })
  }
  catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Failed to upload file locally"
    })
  }
}