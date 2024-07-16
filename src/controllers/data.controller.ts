import { Request, Response, NextFunction } from "express";
export const create = async (
  model: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description } = req.body;
    const data = new model.build({ title, description });
    await data.save();
    res
      .status(201)
      .send({ data, message: "Succesfully created !", statusCode: 200 });
  } catch (error) {
    next();
    res
      .status(500)
      .send({ error, message: "Unable to created !", statusCode: 500 });
  }
};

export const index = async (
  model: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await model.findAll({ where: {} });
    await data.save();
    res
      .status(201)
      .send({ data, message: "Succesfully created !", statusCode: 200 });
  } catch (error) {
    next();
    res
      .status(500)
      .send({ error, message: "Unable to created !", statusCode: 500 });
  }
};

export const show = async (
  model: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await model.find({ where: { id: req.params.id } });
    await data.save();
    res
      .status(201)
      .send({ data, message: "Succesfully created !", statusCode: 200 });
  } catch (error) {
    next();
    res
      .status(500)
      .send({ error, message: "Unable to created !", statusCode: 500 });
  }
};
