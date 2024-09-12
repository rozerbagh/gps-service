import mongoose, { Model, Schema } from "mongoose";
interface IDeviceData {
  bufferData: string;
  convertData: string;
}
interface DeviceDataDoc extends mongoose.Document {
  bufferData: string;
  convertData: string;
}
export interface DeviceDataModelInterface extends Model<DeviceDataDoc> {
  build(attr: IDeviceData): DeviceDataDoc;
}
const DeviceDataSchema = new Schema(
  {
    bufferData: { type: String, require: true },
    convertData: { type: String, require: true },
  },
  { timestamps: true }
);
const DeviceData = mongoose.model<DeviceDataDoc, DeviceDataModelInterface>(
  "deviceData",
  DeviceDataSchema
);
DeviceDataSchema.statics.build = (attr: IDeviceData) => {
  return new DeviceData(attr);
};
export default DeviceData;
