const mongoose = require("mongoose");
const passportLocalMongoose =
  require("passport-local-mongoose").default;

mongoose.connect("mongodb://127.0.0.1:27017/PintrestClone");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    dp: {
      type: String,
      default: "",
    },

    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);