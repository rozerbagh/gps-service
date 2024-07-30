import mongoose, { Model, Schema, Types } from "mongoose";
import Schools from "./schools.model";
import Buses from "./buses.model";
interface IStudent {
  schoolId: Types.ObjectId;
  busId: Types.ObjectId;
  userId: Types.ObjectId;
  fullname: string;
  class: string;
  description: string;
}
export interface StudentDoc extends mongoose.Document {
  schoolId: Types.ObjectId;
  busId: Types.ObjectId;
  userId: Types.ObjectId;
  fullname: string;
  class: string;
  description: string;
  getSchoolsBuses: () => any;
}
export interface StudentModelInterface extends Model<StudentDoc> {
  build(attr: IStudent): StudentDoc;
}
const studentSchema = new Schema(
  {
    schoolId: {
      type: Schema.Types.ObjectId,
      ref: "schools",
    },
    busId: {
      type: Schema.Types.ObjectId,
      ref: "buses",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    fullname: { type: String, require: true },
    class: { type: String, require: true },
    description: { type: String, require: true },
  },
  { timestamps: true }
);
const Student = mongoose.model<StudentDoc, StudentModelInterface>(
  "students",
  studentSchema
);
studentSchema.statics.build = (attr: IStudent) => {
  return new Student(attr);
};

studentSchema.methods.getSchoolsBuses = async function () {
  try {
    const studentid = this._id;
    const student = await Student.findById(studentid);
    if (!student) {
      return null;
    }
    const schools = await Schools.findById(student.schoolId);
    const buses = await Buses.findById(student.busId);
    const studentsSB = {
      ...student,
      schools,
      buses,
    };
    return studentsSB;
  } catch (error) {
    return null;
  }
};
export default Student;
