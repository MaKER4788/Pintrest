const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/PintrestClone");
const postSchema = new mongoose.Schema(
  {
    imageText: {
      type: String,
      required: true,
    },
    image:{
      type:String
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      
    },

    likes: {
      type: Array,
      default: [],
    },

   user:{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'User'
   },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", postSchema);