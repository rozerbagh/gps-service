import mongoose, { Model, Schema } from "mongoose";
import Buses from "./buses.model";
type Address = {
  street: string;
  landmark: string;
  district: string;
  state: string;
  pincode: string;
  country: string;
};
interface ISchools {
  name: string;
  address: Address;
  status: number;
}
interface SchoolsDoc extends mongoose.Document {
  name: string;
  address: Address;
  status: number;
  getSchoolWithBuses: () => any;
}
export interface SchoolsModelInterface extends Model<SchoolsDoc> {
  build(attr: ISchools): SchoolsDoc;
}
const addressSchema = new Schema({
  street: { type: String, require: true },
  landmark: { type: String },
  district: { type: String, require: true },
  state: { type: String, require: true },
  pincode: { type: Number, require: true },
  country: { type: String, require: true },
  // Other address fields
});
const schoolSchema = new Schema(
  {
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
    },
    status: {
      type: Number,
      default: 1,
    }, // 0 -inactive , 1-active, 2-hold
    // Other school fields
  },
  { timestamps: true }
);

const Schools = mongoose.model<SchoolsDoc, SchoolsModelInterface>(
  "schools",
  schoolSchema
);
schoolSchema.statics.build = (attr: ISchools) => {
  return new Schools(attr);
};

schoolSchema.methods.getSchoolWithBuses = async function () {
  try {
    const schoolId = this._id; // Assuming this method is called on an instance of School
    const school = await Schools.findById(schoolId);
    if (!school) {
      return null;
    }
    const buses = await Buses.find({ schoolId });
    const schoolWithBuses = {
      ...school,
      buses,
    };
    return schoolWithBuses;
  } catch (error) {
    return null;
  }
};

export default Schools;
