import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import  _conf from "../common/general";
import Users from "../models/user.model";
import { CustomResponse } from "../interface/responseIntreface";
import bcrypt from "bcryptjs";
interface CRequest extends Request {
  payload?: any;
}
const expiringTime: number = new Date().getTime() + 60 * 24 * 60 * 60 * 1000;
export async function generateToken(data: any): Promise<string> {
  const token = jwt.sign({ id: data.id, email: data.email }, _conf.secretKey, {
    expiresIn: expiringTime,
  });
  return token;
}

export const checkToken = async (
  req: CRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string =
      (req.headers["x-access-token"] as string) ||
      (req.headers["authorization"] as string) ||
      (req.headers["Authorization"] as string); // Express headers are auto converted to lowercase
    if (token) {
      if (token.startsWith("Bearer ") || token.startsWith("bearer ")) {
        token = token.slice(7, token.length);
        const decoded = jwt.verify(token, _conf.secretKey) as any;

        const user = await Users.findById({ _id: decoded.id });
        if (!user)
          return res.status(404).json({
            statuscode: "404",
            status: false,
            error: "err",
            message: "Unauthorised Token",
          });
        req.payload = decoded;
        next();
      } else {
        return res.status(401).json({
          statuscode: "401",
          status: false,
          error: 401,
          message: "Unauthorised Process",
        });
      }
    } else {
      return res.status(402).json({
        statuscode: "402",
        status: false,
        error: 402,
        message: "Authentication parameters are missing",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      statuscode: "404",
      status: false,
      error: err,
      message: "Invalid Token!",
    });
  }
};

export const checkAdminToken = async (
  req: CRequest,
  res: Response,
  next: NextFunction
) => {
  // req.body.token || req.query.token ||
  // invalid token - synchronous
  try {
    var token =
      (req.headers["x-access-token"] as string) ||
      (req.headers["authorization"] as string); // Express headers are auto converted to lowercase
    if (token) {
      if (token.startsWith("Bearer ")) {
        token = token.slice(7, token.length);
      }
      const decoded = jwt.verify(token, _conf.secretKey) as any;
      // console.log(decoded.data)
      const user = await Users.findById({ _id: decoded.data._id });
      if (!user)
        return res.status(404).json({
          statuscode: "404",
          status: false,
          error: null,
          message: "Unauthorised Token",
        });
      next();
    }
  } catch (err) {
    return res.status(404).json({
      statuscode: "404",
      status: false,
      error: err,
      message: "Invalid Token",
    });
  }
};

export const validateEmail = (email: string): boolean => {
  var re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};
export async function passwordHashing(password: string): Promise<string> {
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync("B4c0//", salt);
  var passwordHash = await bcrypt.hash(password, 8);
  return passwordHash;
}
export async function passwordComparing(
  password: string,
  hashPassword: string
): Promise<boolean> {
  try{
  var isMatch = await bcrypt.compare(password, hashPassword);
  return isMatch;
  } catch(er){
    console.log(er)
    return false
  }
}
