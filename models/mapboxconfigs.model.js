const mongoose = require("mongoose");
const mbConfigsSchema = new mongoose.Schema({
  timestamps: { type: String },
  mapbox_access_token: { type: String },
  mode_of_transport: { type: String },
});
const MBConfigs = mongoose.model("mapboxconfigs", mbConfigsSchema);
module.exports = MBConfigs;
