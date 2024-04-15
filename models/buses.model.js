const mongoose = require("mongoose");
const busesSchema = new mongoose.Schema({
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
  },
  busname: { type: String, require: true },
  numberplate: { type: String, require: true, unique: true },
  drivername: { type: String, require: true },
  driverphoneno: { type: String, require: true },
  capacity: { type: Number, require: true },
});
const Buses = mongoose.model("buses", busesSchema);
module.exports = Buses;
