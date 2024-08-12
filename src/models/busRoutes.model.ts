import mongoose, { Model, Schema } from "mongoose";
interface RouteCoordinate {
  lat: number;
  long: number;
}
// interface Route {
//   route_coordinates: RouteCoordinate[];
// }
const RouteCoordinateSchema = new Schema<RouteCoordinate>({
  lat: { type: Number, required: true },
  long: { type: Number, required: true },
});
interface IBusRoutes {
  schoolId: mongoose.Types.ObjectId;
  busId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  routes: string;
  startLat: string;
  startLng: string;
  endLat: string;
  endLng: string;
  default: boolean;
}
interface BusRoutesDoc extends mongoose.Document {
  schoolId: mongoose.Types.ObjectId;
  busId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  routes: string;
  startLat: string;
  startLng: string;
  endLat: string;
  endLng: string;
  default: boolean;
}
export interface BusRoutesModelInterface extends Model<BusRoutesDoc> {
  build(attr: IBusRoutes): BusRoutesDoc;
}
const busesRoutesSchema = new Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "schools",
      require: true,
    },
    busId: {
      type: Schema.Types.ObjectId,
      ref: "buses",
      require: true,
    },
    route_name: { type: String, require: true },
    route_coordinates: { type: [RouteCoordinateSchema], required: true },
    startLat: { type: Number, require: true },
    startLng: { type: Number, require: true },
    endLat: { type: Number, require: true },
    endLng: { type: Number, require: true },
    default: { type: Boolean, require: false },
  },
  { timestamps: true }
);
const BusRoutes = mongoose.model<BusRoutesDoc, BusRoutesModelInterface>(
  "busRoutes",
  busesRoutesSchema
);
busesRoutesSchema.statics.build = (attr: IBusRoutes) => {
  return new BusRoutes(attr);
};
export default BusRoutes;
