import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import {
  passwordComparing,
  generateToken,
  passwordHashing
} from "../middlewares/auth.middleware";
import {
  generateOtp, sendEmail
} from "../common/common";
import Users, { UserDoc } from "../models/user.model";
import Buses from "../models/buses.model";
import { CustomResponse } from "../interface/responseIntreface";
// userlogin
const userLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ email });
    if(user){
      const isMatch = await passwordComparing(password, user.password);
      if (isMatch) {
        const token = await generateToken({
          id: user._id.toString(),
          email: user.email,
        });
        const busid = user.busId;
        const bus = await Buses.findById(busid).exec();
        const userData = {
          userId: user._id,
          email: user.email,
          userName: user.fullname,
          phoneno: user.phoneno,
          role: user.role,
          subscribed: user.subscribed,
          gps_id: user.gps_id,
          token,
          expireTokenTime: new Date().getTime() + 60 * 24 * 60 * 60 * 1000,
          bus: bus
            ? bus
            : {
                _id: null,
                schoolId: null,
                busname: "",
                numberplate: "",
                drivername: "",
                driverphoneno: "",
                capacity: 0,
              },
        };
        res
          .status(200)
          .json({
            data: userData,
            message: "Login successfully",
            statusCode: 200,
          });
      } else {
        const er = createError(402, "password didn't match");
        res.status(402).json({error: er, message: "password didn't match", statusCode: 402});
      }
    }
  } catch (error) {
    const er = createError(404, "User not found");
    res.status(401).json({error: er, message: "User not found", statusCode: 404});
  }
};

// addusers
const addUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const exitingUser = await Users.find({ email: req.body.email });

    if (exitingUser.length > 0) {
      const er = createError(500, "Unable to signup, email already exit");
      res.status(500).json({er, message: "Unable to signup, email already exit", statusCode: 500});
      return;
    }
    const {
      busId,
      username,
      fullname,
      email,
      password,
      phoneno,
      address,
      role,
      status,
      image,
    } = req.body;
    const hashPassword = await passwordHashing(password);
    const user = new Users({
      busId,
      username,
      fullname,
      email,
      password: hashPassword,
      phoneno,
      address,
      role,
      status,
      image,
    });
    const data = await user.save();
    const token = await generateToken({
      id: data._id.toString(),
      email: data.email,
    });
    const userData = {
      userId: user._id,
      email: user.email,
      userName: user.fullname,
      phoneno: user.phoneno,
      role: user.role,
      token,
      expireTokenTime: new Date().getTime() + 60 * 24 * 60 * 60 * 1000,
    };
    res.status(200).json({
      data: userData,
      message: email + " has been registered successfully",
      statusCode: 200
    });
  } catch (error) {
    res.status(401).json({error, message: "Unable to signup! Internal server error", statusCode: 500});
  }
};
// getallusers
const getallUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await Users.find({}).select("-password");
    res
      .status(200)
      .json({ data: users, message: "Lists of all users", statusCode: 200 });
  } catch (error) {
    const er = createError(501, "Unable to get users");
    res.status(401).json({error: er, message: "Unable to get users", statusCode: 501});
  }
};

const getUserDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await Users.findById({ _id: req.params.id });
    res.status(200).json({data: [user], message: "User details", statusCode: 200});
  } catch (error) {
    const er = createError(501, "Unable to get user details");
    res.status(401).json({error: er, message: "Unable to get user details", statusCode: 501});
  }
};

const updateUserDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await Users.findByIdAndUpdate(req.params.id, req.body);
    const getuser = await Users.findById({ _id: req.params.id });
    if (!getuser) {
      const er = createError(500, "Unable update");
      res.status(401).json({error: er, message: "Unable update", statusCode: 500});
      return;
    }
    res.status(200).json({data: [getuser], message: "Your details has been updated", statusCode: 200});
  } catch (error) {
    const er = createError(500, "Unable update");
    res.status(401).json({error: er, message: "Unable update", statusCode: 500});
  }
};

const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await Users.findByIdAndDelete({ _id: req.params.id });
    res.status(200).json({data: user, message: "Your details has been updated", statusCode: 200});
  } catch (error) {
    const er = createError(500, "Unable Delete");
    res.status(401).json({error: er, message: "Unable Delete", statusCode: 500});
    return;
  }
};

const sendOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const OTP = generateOtp();
    await sendEmail(
      {
        from: "rozerbagh@gmail.com",
        to: email,
        subject: "OTP for password reset",
        text: `The OTP for resetting your password is ${OTP}`,
      }
    );
    // const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${FAST2SMS_APIKEY}&route=otp&variables_values=${OTP}&flash=1&numbers=${phoneNumber}`;
    // const otpResponse = await fetch(url);
    const data = await Users.findOneAndUpdate(
      { email },
      {
        otp: OTP,
      }
    );
    res
      .status(200)
      .json({data, message: "OTP has been send succesfully to your email", statusCode: 200});
  } catch (error) {
    res.status(401).json({error, message: "Unable to send OTP", statusCode: 500});
    return;
  }
};

export default {
  userLogin,
  getallUser,
  deleteUser,
  updateUserDetails,
  getUserDetails,
  addUser,
  sendOtp,
};
