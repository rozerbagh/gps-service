const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Buses = require("./buses.model");
const addressSchema = new Schema({
  street: { type: String, require: true },
  landmark: { type: String },
  district: { type: String, require: true },
  state: { type: String, require: true },
  pincode: { type: Number, require: true, unique: true },
  country: { type: String, require: true },
  // Other address fields
});
const schoolSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: addressSchema,
    required: true,
    default: {
      street: "",
      landmark: "",
      district: "",
      state: "",
      pincode: 0,
      country: "INDIA",
    },
    unique: true,
  },
  status: {
    type: Number,
    default: 1,
  }, // 0 -inactive , 1-active, 2-hold
  // Other school fields
});

schoolSchema.methods.getSchoolWithBuses = async function () {
  try {
    const schoolId = this._id; // Assuming this method is called on an instance of School
    const school = await Schools.findById(schoolId);
    console.log(schoolId, school);
    if (!school) {
      console.log("School not found");
      return null;
    }

    const buses = await Buses.find({ schoolId: schoolId });

    const schoolWithBuses = {
      ...school,
      buses: buses,
    };

    return schoolWithBuses;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};
const Schools = mongoose.model("schools", schoolSchema);
module.exports = Schools;
