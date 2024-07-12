import mongoose, { Model, Schema } from "mongoose";
interface IBuses {
  schoolId: Schema.Types.ObjectId;
  description: string;
  busname: string;
  numberplate: string;
  drivername: string;
  driverphoneno: string;
  capacity: number;
}
interface BusesDoc extends mongoose.Document {
  schoolId: Schema.Types.ObjectId;
  description: string;
  busname: string;
  numberplate: string;
  drivername: string;
  driverphoneno: string;
  capacity: number;
}
export interface BusesModelInterface extends Model<BusesDoc> {
  build(attr: IBuses): BusesDoc;
}
const busesSchema = new Schema(
  {
    schoolId: {
      type: Schema.Types.ObjectId,
      ref: "schools",
    },
    busname: { type: String, require: true },
    numberplate: { type: String, require: true, unique: true },
    drivername: { type: String, require: true },
    driverphoneno: { type: String, require: true },
    capacity: { type: Number, require: true },
  },
  { timestamps: true }
);
const Buses = mongoose.model<BusesDoc, BusesModelInterface>(
  "buses",
  busesSchema
);
busesSchema.statics.build = (attr: IBuses) => {
  return new Buses(attr);
};
export default Buses;
