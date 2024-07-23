import mongoose, { Model, Schema } from "mongoose";
const UserRoleEnum = Object.freeze({
  ADMIN: 1,
  USER: 2,
  DRIVER: 3,
  MODERATOR: 4,
});
export interface IUser {
  schoolId: mongoose.Schema.Types.ObjectId;
  busId: mongoose.Schema.Types.ObjectId;
  username: string;
  fullname: string;
  email: string;
  password: string;
  phoneno: string;
  role: number;
  status: number;
  image: string;
  otp: number;
  subscribed: boolean;
  gps_id: string;
  isSchoolUser: boolean;
  students: Schema.Types.ObjectId[];
}
export interface UserDoc extends mongoose.Document {
  schoolId: mongoose.Schema.Types.ObjectId;
  busId: mongoose.Schema.Types.ObjectId;
  username: string;
  fullname: string;
  email: string;
  password: string;
  phoneno: string;
  role: number;
  status: number;
  image: string;
  otp: number;
  subscribed: boolean;
  gps_id: string;
  isSchoolUser: boolean;
  students: Schema.Types.ObjectId[];
}
export interface UserModelInterface extends Model<UserDoc> {
  build(attr: IUser): UserDoc;
}
const userSchema = new Schema(
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
    username: {
      type: String,
    },
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneno: {
      type: String,
      required: true,
    },
    address: new Array({
      street: String,
      houseno: String,
      landmark: String,
      town: String,
      pincode: Number,
      district: String,
      state: String,
      country: String,
    }),
    role: {
      type: Number,
      require: true,
      default: UserRoleEnum.USER,
    },
    status: {
      type: Number,
      default: 1,
    }, // 0 -inactive , 1-active, 2-hold
    image: {
      type: String,
      default: "",
    },
    otp: {
      type: Number,
      default: "",
    },
    subscribed: {
      type: Boolean,
      default: false,
    },
    gps_id: {
      type: String,
      default: "9172159029",
    },
    isSchoolUser: {
      type: Boolean,
      default: false,
    },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "students" }],
  },
  { timestamps: true }
);
const Users = mongoose.model<UserDoc, UserModelInterface>(
  "users",
  userSchema
);
userSchema.statics.build = (attr: IUser) => {
  return new Users(attr);
};
export default Users;
