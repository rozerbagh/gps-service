import mongoose, { Model, Schema } from "mongoose";
interface IStudent {
  schoolId: Schema.Types.ObjectId;
  busId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  fullname: string;
  class: string;
  description: string;
}
export interface StudentDoc extends mongoose.Document {
  schoolId: Schema.Types.ObjectId;
  busId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  fullname: string;
  class: string;
  description: string;
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
export default Student;
