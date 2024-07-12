import { Request, Response, NextFunction } from "express";
import mongoose, { Model, Document } from "mongoose";
import { UserModelInterface } from "../models/user.model";
import { BusesModelInterface } from "../models/buses.model";
import { SchoolsModelInterface } from "../models/schools.model";
import { BusRoutesModelInterface } from "../models/busRoutes.model";
import { CustomResponse } from "../interface/responseIntreface";

type ModelsInteface =
  | UserModelInterface
  | BusesModelInterface
  | SchoolsModelInterface
  | BusRoutesModelInterface;
  
export const create = async (
  model: ModelsInteface,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = new  model({ ...req.body });
    await data.save();
    res.status(200).json({
      data: data,
      message: "Succesfully created / added !",
      statusCode: 200,
    });
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ error, message: "Unable to created !", statusCode: 500 });
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
      .exec();;
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

export const show = async (
  model: ModelsInteface,
  req: Request,
  res: Response,
  next: NextFunction,
  attr: {
    path: string;
    value: string;
  },
) => {
  console.log(mongoose.Types.ObjectId.isValid(req.params.id));
  try {
    let data = await model.findById(req.params.id).populate(attr.path);
    res
      .status(200)
      .json({ data, message: "Succesfull!", statusCode: 200 });
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ error, message: "Unable to fetched !", statusCode: 500 });
  }
};

export const update = async <T extends Document> (
  model: Model<T>,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await model.findByIdAndUpdate({ where: { id: req.params.id } });
    res
      .status(200)
      .json({ data, message: "Succesfully updated !", statusCode: 200 });
  } catch (error) {
    next();
    res
      .status(500)
      .json({ error, message: "Unable to update !", statusCode: 500 });
  }
};


export const destroy = async (
  model: ModelsInteface,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await model.findByIdAndRemove({ where: { id: req.params.id } });
    res
      .status(200)
      .json({ data, message: "Succesfully removed !", statusCode: 200 });
  } catch (error) {
    next();
    res
      .status(500)
      .json({ error, message: "Unable to removed !", statusCode: 500 });
  }
};