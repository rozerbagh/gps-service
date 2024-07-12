import mongoose, { Model, Schema } from "mongoose";
const mbConfigsSchema = new Schema({
  timestamps: { type: String },
  mapbox_access_token: { type: String },
  mode_of_transport: { type: String },
});
const MBConfigs = mongoose.model("mapboxconfigs", mbConfigsSchema);
export default MBConfigs;
