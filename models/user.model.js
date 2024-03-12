const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserRoleEnum = Object.freeze({
  ADMIN: 1,
  MODERATOR: 2,
  USER: 3,
});
const userSchema = new Schema(
  {
    username: {
      type: String,
    },
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneno: {
      type: String,
      required: true,
    },
    address: new Array({
      street: String,
      houseno: String,
      landmark: String,
      town: String,
      pincode: Number,
      district: String,
      state: String,
      country: String,
    }),
    role: {
      type: Number,
      require: true,
      default: UserRoleEnum.USER,
    },
    status: {
      type: Number,
      default: 1,
    }, // 0 -inactive , 1-active, 2-hold
    image: {
      type: String,
      default: "",
    },
    otp: {
      type: Number,
      default: "",
    },
    subscribed: {
      type: Boolean,
      default: false,
    },
    gps_id: {
      type: String,
      default: "9172159029",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", userSchema);
