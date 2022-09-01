const { mongoose } = require("mongoose");
const { Schema } = mongoose;

const NotesSchema = new Schema({
  title: {
    type: String,
    required:true 
  },

  description: {
    type: String,
    required:true 

  },

  tag: {
    type: String,
    default: "Generic",

  },

  date: {
    type: Date,
    default: Date.now,
  },
});
