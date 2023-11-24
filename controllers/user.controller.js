// var jwt = require("jsonwebtoken");
var common = require("../config/common");
const userModel = require("../models/user.model");
var User = require("../models/user.model");

//userlogin
const userLogin = async (req, res) => {
  // console.log(req.body);

  try {
    const user = await User.findOne({ email: req.body.email });
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
      console.log(token);
      res.status(200).send({
        status: true,
        userId: user._id,
        email: user.email,
        userName: user.fullname,
        phoneno: user.phoneno,
        role: user.role,
        statuscode: 200,
        message: "Login successfully",
        token: token,
        expireTokenTime: new Date().getTime() + 60 * 24 * 60 * 60 * 1000,
      });
    } else {
      res.status(401).send({
        message: "password didn't match",
      });
    }
  } catch (error) {
    res.status(400).send({ error: error, message: "User not Found" });
  }
};

//addusers
const addUser = async (req, res, next) => {
  try {
    const exitingUser = await User.find({ email: req.body.email });

    if (exitingUser.length > 0) {
      res.status(503).send({
        message: "unable to signup, email already exit",
        statuscode: 503,
        success: false,
      });
      return;
    }
    const {
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
    res.status(200).send({
      success: true,
      statuscode: 200,
      message: email + "has been registered successfully",
      userId: user._id,
      email: user.email,
      userName: user.fullname,
      phoneno: user.phoneno,
      role: user.role,
      token: token,
      expireTokenTime: new Date().getTime() + 60 * 24 * 60 * 60 * 1000,
    });
  } catch (error) {
    console.log(error);
    res
      .status(501)
      .send({ message: "Unable to signup", statuscode: 500, success: false });
  }
};
//getallusers
const getallUser = async (req, res) => {
  const admin = parseInt(req.query.admin);
  try {
    const users = await User.find({});
    if (admin === 1) {
      res.status(200).send(users);
    } else {
      res.status(200).send({
        status: "success",
        statuscode: 200,
        message: "get all users",
        data: users,
      });
    }
  } catch (error) {
    res.status(500).send({
      status: "failed",
      statuscode: "500",
      error: error,
      message: "unable to get users",
    });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const admin = parseInt(req.query.admin);
    const user = await User.findById({ _id: req.params.id });
    if (admin === 1) {
      res.status(200).send(user);
    } else {
      res.status(200).send({
        status: "success",
        statuscode: 200,
        message: "get user details",
        data: [user],
      });
    }
  } catch (error) {
    res.status(500).send({
      status: "failed",
      statuscode: "500",
      error: error,
      message: "unable to get user details",
    });
  }
};

const updateUserDetails = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body);
    const getuser = await User.findById({ _id: req.params.id });
    if (!getuser)
      return res.status(400).send({
        status: "failed",
        statuscode: 400,
        message: "unable to updated",
      });

    return res.status(200).send({
      status: "susccess",
      statuscode: 200,
      message: "user updated",
      data: [getuser],
    });
  } catch (error) {
    return res.status(500).send({
      status: "failed",
      statuscode: 500,
      message: "unable to updated",
      error: error,
    });
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const admin = parseInt(req.query.admin);
    const user = await User.findByIdAndDelete({ _id: req.params.id });
    if (admin === 1) {
      res.status(200).send({
        status: "success",
        statuscode: 200,
        message: "deleted succesfully",
        data: user,
      });
    } else {
      res.status(200).send({
        status: "success",
        statuscode: 200,
        message: "deleted succesfully",
      });
    }
  } catch (error) {
    res.status(500).send({
      status: "success",
      statuscode: "500",
      error: error,
      message: "unable to delete users",
    });
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
    const user = await userModel.updateOne(
      { email: email },
      {
        otp: OTP,
      }
    );
    res.status(200).send({
      status: "success",
      statuscode: 200,
      message: "otp send successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "success",
      statuscode: "500",
      error: error,
      message: "unable to set otp",
    });
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
