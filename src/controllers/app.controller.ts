import { Request, Response, NextFunction } from "express";
import mongoose, { Model, Document } from "mongoose";
import { UserModelInterface } from "../models/user.model";
import { BusesModelInterface } from "../models/buses.model";
import { SchoolsModelInterface } from "../models/schools.model";
import { BusRoutesModelInterface } from "../models/busRoutes.model";
import { StudentModelInterface } from "../models/students.model";
import { commonResponseJson } from "../middlewares/commonResponse";

type ModelsInteface =
  | UserModelInterface
  | BusesModelInterface
  | SchoolsModelInterface
  | BusRoutesModelInterface
  | StudentModelInterface;

export const create = async (
  model: ModelsInteface,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = new model({ ...req.body });
    await data.save();
    const responseJson = commonResponseJson(
      200,
      "Succesfully created / added !",
      data,
      null
    );
    res.status(200).json({ ...responseJson });
  } catch (error) {
    const responseJson = commonResponseJson(
      500,
      "Unable to created / added !",
      null,
      error
    );
    res.status(500).json({ ...responseJson });
  }
};

export const index = async <T extends Document>(
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

export const show = async (
  model: ModelsInteface,
  req: Request,
  res: Response,
  next: NextFunction,
  attr: {
    path: string;
    value: string;
  }
) => {
  try {
    const data = await model.findById(req.params.id).populate(attr.path);
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
      "Unable to fetched !",
      null,
      error
    );
    res.status(500).json({ ...responseJson });
  }
};

export const update = async <T extends Document>(
  model: Model<T>,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await model.findByIdAndUpdate({
      where: { id: req.params.id },
    });
    const responseJson = commonResponseJson(
      200,
      "Succesfully updated !",
      data,
      null
    );
    res.status(200).json({ ...responseJson });
  } catch (error) {
    const responseJson = commonResponseJson(
      500,
      "Unable to update !",
      null,
      error
    );
    res.status(500).json({ ...responseJson });
  }
};

export const destroy = async (
  model: ModelsInteface,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await model.findByIdAndRemove({
      where: { id: req.params.id },
    });
    const responseJson = commonResponseJson(
      200,
      "Succesfully removed !",
      data,
      null
    );
    res.status(200).json({ ...responseJson });
  } catch (error) {
    const responseJson = commonResponseJson(
      500,
      "Unable to removed !",
      null,
      error
    );
    res.status(500).json({ ...responseJson });
  }
};
