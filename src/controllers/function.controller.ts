import { Request, Response, NextFunction } from "express";
import { Model, Document } from "mongoose";
import Schools, { SchoolsModelInterface } from "../models/schools.model";
import createError from "http-errors";
import MBConfigs from "../models/mapboxconfigs.model";

export async function getSchoolWithBuses(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await Schools.findById({ _id: req.params.schoolId });
    if (!result) {
      const error = createError(404, "School not found!");
      res
        .status(404)
        .json({ error, message: "School not found!", statusCode: 404 });
      return;
    }
    const schoolsBuses = await result?.getSchoolWithBuses();
    res.status(200).json({
      data: [{ ...schoolsBuses._doc, buses: schoolsBuses.buses }],
      message: "List of buses for the selected Schools",
      statusCode: 200
    });
  } catch (err) {
    res
      .status(500)
      .json({
        err,
        message: "School not found! Internal server error",
        statusCode: 500,
      });
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

export async function showMabConfigs(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await MBConfigs.find();
    res.status(200).json(data[0]);
  } catch (error) {
    const er = createError(500, "Internal server error");
    res.status(500).json({er, messsage: "Internal server error", statusCode: 500});
  }
}

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
    res
      .status(200)
      .json({ data, message: "Succesfully fetched !", statusCode: 200 });
  } catch (error) {
    next();
    res
      .status(500)
      .json({ error, message: "Unable to created !", statusCode: 500 });
  }
};
