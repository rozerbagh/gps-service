import { Request, Response, NextFunction } from "express";
import mongoose, { Model, Document, Schema } from "mongoose";
import { commonResponseJson } from "../middlewares/commonResponse";
import Buses from "../models/buses.model";
export const fetchRespectiveSchoolsBuses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { schoolid } = req.params;
    const schoolObjectId = new mongoose.Types.ObjectId(schoolid);
    const data = await Buses.find({
      schoolId: schoolObjectId,
    });
    const responseJson = commonResponseJson(200, "Success", data, null);
    res.status(200).json({ ...responseJson });
  } catch (error) {
    console.log(error)
    const responseJson = commonResponseJson(
      500,
      "Internal server error",
      null,
      error
    );
    res.status(500).json({ ...responseJson });
  }
};
