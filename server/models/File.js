const mongoose = require("mongoose")
const fileSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
  },
  audioUrl: {
    type: String,
  },
  pastedText: {
    type: String,
  },

})