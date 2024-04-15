const common = require("../config/common");
const userModel = require("../models/user.model");
const busModel = require("../models/buses.model")
const User = require("../models/user.model");
const createError = require("http-errors");
//userlogin
const userLogin = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    console.log(user);
    const isMatch = await common.passwordComparing(
      req.body.password,
      user.password
    );
    if (isMatch) {
      const token = await common.generateToken({
        id: user._id.toString(),
        email: user.email,
      });
      const succesmsg = "Login successfully";
      const bus_id  =  user.busId;
      const bus = await busModel.findById(bus_id).exec();
      console.log(bus);
      const userData = {
        userId: user._id,
        email: user.email,
        userName: user.fullname,
        phoneno: user.phoneno,
        role: user.role,
        subscribed: user.subscribed,
        gps_id: user.gps_id,
        token: token,
        expireTokenTime: new Date().getTime() + 60 * 24 * 60 * 60 * 1000,
        bus:bus ? bus : null,
      };
      res.successResponse(userData, succesmsg, 200);
    } else {
      const er = createError(401, "password didn't match");
      res.errorResponse(er, "password didn't match", 401);
    }
  } catch (error) {
    const er = createError(404, "User not found");
    res.errorResponse(er, "User not found", 404);
  }
};

//addusers
const addUser = async (req, res, next) => {
  try {
    const exitingUser = await User.find({ email: req.body.email });

    if (exitingUser.length > 0) {
      const er = createError(500, "Nnable to signup, email already exit");
      res.errorResponse(er, "User not found", 500);
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
    const hashPassword = await common.passwordHashing(password);
    const user = new User({
      busId: busId,
      username: username,
      fullname: fullname,
      email: email,
      password: hashPassword,
      phoneno: phoneno,
      address: address,
      role: role,
      status: status,
      image: image,
    });
    const data = await user.save();
    const token = await common.generateToken({
      id: data._id.toString(),
      email: data.email,
    });
    const userData = {
      userId: user._id,
      email: user.email,
      userName: user.fullname,
      phoneno: user.phoneno,
      role: user.role,
      token: token,
      expireTokenTime: new Date().getTime() + 60 * 24 * 60 * 60 * 1000,
    };
    res.successResponse(
      userData,
      email + "has been registered successfully",
      200
    );
  } catch (error) {
    res.errorResponse(error, "Unable to signup! Internal server error", 500);
  }
};
//getallusers
const getallUser = async (req, res) => {
  const admin = parseInt(req.query.admin);
  try {
    const users = await User.find({}).select("-password");

    if (admin === 1) {
      // res.successResponse(users, "Lists of all users", 200);
      res.status(200).send(users);
    } else {
      res.successResponse({ admin: false }, "Lists of all users", 200);
    }
  } catch (error) {
    const er = createError(501, "Unable to get users");
    res.errorResponse(er, "Unable to get users", 501);
  }
};

const getUserDetails = async (req, res) => {
  try {
    const admin = parseInt(req.query.admin);
    const user = await User.findById({ _id: req.params.id });
    if (admin === 1) {
      res.status(200).send(user);
    } else {
      res.successResponse([users], "User details", 200);
    }
  } catch (error) {
    const er = createError(501, "Unable to get user details");
    res.errorResponse(er, "Unable to get user details", 501);
  }
};

const updateUserDetails = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, req.body);
    const getuser = await User.findById({ _id: req.params.id });
    if (!getuser) {
      const er = createError(500, "Unable update");
      res.errorResponse(er, "Unable update", 500);
      return;
    }
    res.successResponse([getuser], "Your details has been updated", 200);
  } catch (error) {
    const er = createError(500, "Unable update");
    res.errorResponse(er, "Unable update", 500);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete({ _id: req.params.id });
    res.successResponse(user, "Your details has been updated", 200);
  } catch (error) {
    const er = createError(500, "Unable Delete");
    res.errorResponse(er, "Unable Delete", 500);
    return;
  }
};

const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const OTP = common.generateOtp();
    await common.sendEmail(
      {
        from: "rozerbagh@gmail.com",
        to: email,
        subject: "OTP for password reset",
        text: `The OTP for resetting your password is ${OTP}`,
      },
      OTP
    );
    // const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${FAST2SMS_APIKEY}&route=otp&variables_values=${OTP}&flash=1&numbers=${phoneNumber}`;
    // const otpResponse = await fetch(url);
    await userModel.updateOne(
      { email: email },
      {
        otp: OTP,
      }
    );
    res.successResponse({}, "OTP has been send succesfully to your email", 200);
  } catch (error) {
    res.errorResponse(error, "Unable to send OTP", 500);
    return;
  }
};

module.exports = {
  userLogin,
  getallUser,
  deleteUser,
  updateUserDetails,
  getUserDetails,
  addUser,
  sendOtp,
};
