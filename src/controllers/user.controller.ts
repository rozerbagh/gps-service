import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import {
  passwordComparing,
  generateToken,
  passwordHashing,
} from "../middlewares/auth.middleware";
import { generateOtp, sendEmail } from "../common/common";
import Users, { UserDoc } from "../models/user.model";
import Buses from "../models/buses.model";
import { commonResponseJson } from "../middlewares/commonResponse";
// userlogin
const userLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ email });
    if (user) {
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
        const responseJson = commonResponseJson(
          200,
          "Login successfully",
          userData
        );
        res.status(200).json({
          ...responseJson,
        });
      } else {
        const er = createError(402, "password didn't match");
        const responseJson = commonResponseJson(
          402,
          "password didn't match",
          null,
          er
        );
        res.status(402).json({
          ...responseJson,
        });
      }
    }
  } catch (error) {
    const er = createError(404, "User not found");
    const responseJson = commonResponseJson(404, "User not found", null, er);
    res.status(401).json({ ...responseJson });
  }
};

// addusers
const addUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const exitingUser = await Users.find({ email: req.body.email });

    if (exitingUser.length > 0) {
      const er = createError(500, "Unable to signup, email already exit");
      const responseJson = commonResponseJson(
        500,
        "Unable to signup, email already exit",
        null,
        er
      );
      res.status(500).json({
        ...responseJson,
      });
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
    const responseJson = commonResponseJson(
      200,
      email + " has been registered successfully",
      userData,
      null
    );
    res.status(200).json({ ...responseJson });
  } catch (error) {
    const responseJson = commonResponseJson(
      401,
      "Unable to signup! Internal server error",
      null,
      error
    );
    res.status(401).json({ ...responseJson });
  }
};
// getallusers
const getallUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await Users.find({}).select("-password");
    const responseJson = commonResponseJson(
      200,
      "Lists of all users",
      users,
      null
    );
    res.status(200).json({ ...responseJson });
  } catch (error) {
    const er = createError(501, "Unable to get users");
    const responseJson = commonResponseJson(
      501,
      "Unable to get users",
      null,
      er
    );
    res.status(501).json({ ...responseJson });
  }
};

const getUserDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await Users.findById({ _id: req.params.id });
    const responseJson = commonResponseJson(200, "User details", [user], null);
    res.status(200).json({ ...responseJson });
  } catch (error) {
    const er = createError(501, "Unable to get user details");
    const responseJson = commonResponseJson(
      501,
      "Unable to get user details",
      null,
      er
    );
    res.status(501).json({ ...responseJson });
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
    let responseJson = {};
    if (!getuser) {
      const er = createError(501, "Unable update");
      responseJson = commonResponseJson(501, "Unable update", null, er);
      res.status(501).json({ ...responseJson });
      return;
    }
    responseJson = commonResponseJson(
      200,
      "Your details has been updated",
      [getuser],
      null
    );
    res.status(200).json({ ...responseJson });
  } catch (error) {
    const er = createError(501, "Unable update");
    const responseJson = commonResponseJson(501, "Unable update", null, er);
    res.status(501).json({ ...responseJson });
  }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await Users.findByIdAndDelete({ _id: req.params.id });
    const responseJson = commonResponseJson(
      200,
      "Your details has been removed",
      user,
      null
    );
    res.status(200).json({ ...responseJson });
  } catch (error) {
    const er = createError(500, "Unable Delete");
    const responseJson = commonResponseJson(500, "Unable Delete", null, er);
    res.status(500).json({ ...responseJson });
    return;
  }
};

const sendOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const OTP = generateOtp();
    await sendEmail({
      from: "rozerbagh@gmail.com",
      to: email,
      subject: "OTP for password reset",
      text: `The OTP for resetting your password is ${OTP}`,
    });
    // const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${FAST2SMS_APIKEY}&route=otp&variables_values=${OTP}&flash=1&numbers=${phoneNumber}`;
    // const otpResponse = await fetch(url);
    const data = await Users.findOneAndUpdate(
      { email },
      {
        otp: OTP,
      }
    );
    res.status(200).json({
      data,
      message: "OTP has been send succesfully to your email",
      statusCode: 200,
    });
  } catch (error) {
    res
      .status(401)
      .json({ error, message: "Unable to send OTP", statusCode: 500 });
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
