import { Request, Response, NextFunction } from "express";
import mongoose, { Model, Document, Schema } from "mongoose";
import Schools from "../models/schools.model";
import createError from "http-errors";
import MBConfigs from "../models/mapboxconfigs.model";
import BusRoutes from "../models/busRoutes.model";
import Users from "../models/user.model";
import { commonResponseJson } from "../middlewares/commonResponse";
export async function getSchoolWithBuses(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await Schools.findById({ _id: req.params.schoolId });
    if (!result) {
      const error = createError(404, "School not found!");
      const _responseJson = commonResponseJson(404, "School not found!", null, error);
      res.status(404).json({ ..._responseJson });
      return;
    }
    const schoolsBuses = await result?.getSchoolWithBuses();
    const responseJson = commonResponseJson(
      200,
      "List of buses for the selected Schools",
      [{ ...schoolsBuses._doc, buses: schoolsBuses.buses }],
      null
    );
    res.status(200).json({ ...responseJson });
  } catch (err) {
    const responseJson = commonResponseJson(
      500,
      "Internal Server error",
      null,
      err
    );
    res.status(500).json({ ...responseJson });
    return;
  }
}
// export async function sendNotification(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   try {
//     const sent = await pushNotification();
//     if (sent) {
//       res.successResponse({}, "Notification Send", 200);
//     } else {
//       const er = createError(501, "Internal server error");
//       res.status(500).json(er, "Internal server error", 501);
//     }
//   } catch (error) {
//     const er = createError(501, "Internal server error");
//     res.status(500).json(er, "Internal server error", 501);
//   }
// }

export async function showMabConfigs(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await MBConfigs.find();
    const responseJson = commonResponseJson(200, "Success", data[0], null);
    res.status(200).json({ ...responseJson });
  } catch (error) {
    const er = createError(500, "Internal server error");
    const responseJson = commonResponseJson(
      500,
      "Internal server error",
      null,
      er
    );
    res.status(500).json({ ...responseJson });
  }
}

export const fetchRespectiveBusRoutes = async <T extends Document> (
  model: Model<T>,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { schoolid, busid, userid } = req.params;
    const schoolObjectId = new mongoose.Types.ObjectId(schoolid);
    const busObjectId = new mongoose.Types.ObjectId(busid);
    const userObjectId = new mongoose.Types.ObjectId(userid);
    const data = await BusRoutes.find({
      schoolId: schoolObjectId,
      busId: busObjectId,
    });
    const responseJson = commonResponseJson(200, "Success", data, null);
    res.status(200).json({ ...responseJson });
  } catch (error) {
    const er = createError(500, "Internal server error");
    const responseJson = commonResponseJson(
      500,
      "Internal server error",
      null,
      er
    );
    res.status(500).json({ ...responseJson });
  }
}

export const fetchRespectiveSchoolsAllRoutes = async <T extends Document>(
  model: Model<T>,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { schoolid } = req.params;
    const schoolObjectId = new mongoose.Types.ObjectId(schoolid);
    const data = await BusRoutes.find({
      schoolId: schoolObjectId,
    });
    const responseJson = commonResponseJson(200, "Success", data, null);
    res.status(200).json({ ...responseJson });
  } catch (error) {
    const er = createError(500, "Internal server error");
    const responseJson = commonResponseJson(
      500,
      "Internal server error",
      null,
      er
    );
    res.status(500).json({ ...responseJson });
  }
};

export const fetchRoutes = async <T extends Document>(
  model: Model<T>,
  req: Request,
  res: Response,
  next: NextFunction,
  attr: {
    path: string;
    value: string;
  }
) => {
  try {
    const data = await model
      .find({})
      .select("-passwordHash")
      .populate(attr.path)
      .exec();

    const responseJson = commonResponseJson(
      200,
      "Succesfully fetched !",
      data,
      null
    );
    res.status(200).json({ ...responseJson });
  } catch (error) {
    const responseJson = commonResponseJson(
      500,
      "Unable to created !",
      null,
      error
    );
    res.status(500).json({ ...responseJson });
  }
};

export const updateRespectiveBusRoutes = async(
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { schoolid, busid } = req.body;
    const schoolObjectId = new mongoose.Types.ObjectId(schoolid);
    const busObjectId = new mongoose.Types.ObjectId(busid);
    BusRoutes.updateMany(
      {
        schoolId: schoolObjectId,
        busId: busObjectId,
      },
      {
        $set: { default: false },
      }
    );
    const data = await BusRoutes.findByIdAndUpdate(
      req.params.id, // The ID of the document to update
      { $set: { default: true } }, // The update operation
      { new: true } // Optional: Return the updated document
    );
    const responseJson = commonResponseJson(200, "Success", data, null);
    res.status(200).json({ ...responseJson });
  } catch (error) {
    console.log(error);
    const er = createError(500, "Internal server error");
    const responseJson = commonResponseJson(
      500,
      "Internal server error",
      null,
      er
    );
    res.status(500).json({ ...responseJson });
  }
};