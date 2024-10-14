import { Request, Response, NextFunction } from "express";
import { Schema } from "mongoose";
import BusRoutes from "../models/busRoutes.model";
import { WSInterface, GPSData } from "../interface/ws.interface";
import { commonResponseJson } from "../middlewares/commonResponse";
import logger from "../utils/logs";
import { gpsDeviceDataListen } from "../socket_server";
export async function startTrack(
  req: Request,
  res: Response,
  next: NextFunction,
  ws: WSInterface
) {
  try {
    // const result = await Schools.findById({ _id: req.params.schoolId });
    // if (!result) {
    //   const error = createError(404, "School not found!");
    //   const _responseJson = commonResponseJson(
    //     404,
    //     "School not found!",
    //     null,
    //     error
    //   );
    //   res.status(404).json({ ..._responseJson });
    //   return;
    // }
    // const { schoolid, busid } = req.params;
    if (ws.net.listening) {
      const data = new BusRoutes({ ...req.body });
      const result = await data.save();
      const deviceData = gpsDeviceDataListen(ws.netSocket, ws.ws, () => {
        if (deviceData) {
          updateDevideDBData(deviceData, result._id);
        }
      });
    }
    const responseJson = commonResponseJson(
      200,
      "Creation of routes has been started",
      [],
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

export async function stopTrack(
  req: Request,
  res: Response,
  next: NextFunction,
  ws: WSInterface
) {
  try {
    // const result = await Schools.findById({ _id: req.params.schoolId });
    // if (!result) {
    //   const error = createError(404, "School not found!");
    //   const _responseJson = commonResponseJson(
    //     404,
    //     "School not found!",
    //     null,
    //     error
    //   );
    //   res.status(404).json({ ..._responseJson });
    //   return;
    // }
    const responseJson = commonResponseJson(
      200,
      "Routes has been created Succesfully",
      [],
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

const updateDevideDBData = async (
  data: GPSData,
  busRouteId: Schema.Types.ObjectId
) => {
  const newCoordinate = { lat: data.latitude, long: data.longitude }; // Example coordinate
  await BusRoutes.findByIdAndUpdate(
    busRouteId, // The ID of the bus route document you want to update
    {
      $push: { route_coordinates: newCoordinate },
    },
    { new: true } // Option to return the updated document
  );
};
