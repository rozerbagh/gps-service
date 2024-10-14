import mongoose, { Model, Schema } from "mongoose";
interface IBuses {
  schoolId: mongoose.Types.ObjectId;
  busname: string;
  numberplate: string;
  capacity: number;
}
interface BusesDoc extends mongoose.Document {
  schoolId: mongoose.Types.ObjectId;
  busname: string;
  numberplate: string;
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
    capacity: { type: Number, require: true },
    gpsid: { type: String, require: false, unique: true },
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
