import { Request, Response, NextFunction } from "express";
import WebSocket, { Server } from "ws";
import { Schema } from "mongoose";
import BusRoutes from "../models/busRoutes.model";
import { WSInterface, GPSData } from "../interface/ws.interface";
import { commonResponseJson } from "../middlewares/commonResponse";
import logger from "../utils/logs";
import { GPS_DATA_EVENT } from "../utils/socketEvents";
export const startGpsClient = (
  busRoutesId: Schema.Types.ObjectId,
  gpsid: string,
  wss: WSInterface
) => {
  wss.ws.on(GPS_DATA_EVENT, (data: any) => {
    const fields = data.split(",");
    const identifier = fields[1];
    const latitude = fields[5];
    const longitude = fields[7];
    // const speed = fields[8];
    // const date = fields[3];
    // const time = fields[9];
    logger.log({
      level: "info",
      message: `Custom event received: ${data}`,
    });
    if (gpsid === identifier){
      logger.log({
        level: "debug",
        message: "Saving the data into DB",
      });
      BusRoutes.findOneAndUpdate(
        { _id: busRoutesId },
        {
          $push: { route_coordinates: { lat: latitude, long: longitude } },
        },
        { new: true }
      );
    }

  });
};
export async function startTrack(
  req: Request,
  res: Response,
  next: NextFunction,
  ws: WSInterface
) {
  try {
    // const { schoolid, busid } = req.params;
    // if (ws.net.listening) {
    //   const data = new BusRoutes({ ...req.body });
    //   const result = await data.save();
    //   const deviceData = gpsDeviceDataListen(ws.netSocket, ws.ws);
    //   if (deviceData) {
    //     updateDevideDBData(deviceData, result._id);
    //   }
    // }
    const data = new BusRoutes({ ...req.body });
    const result = await data.save();
    startGpsClient(result._id, result.gpsId, ws);
    const responseJson = commonResponseJson(
      200,
      "Creation of routes has been started",
      [result],
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
export const stopGpsClient = async (
  busId: Schema.Types.ObjectId,
  routename: string
) => {
  await BusRoutes.findOneAndUpdate(
    { _id: busId },
    { $set: { route_name: routename } },
    // {
    //   $push: {
    //     route_coordinates: { $each: gpsDataStore }, // Store all accumulated coordinates
    //   },
    // },
    { new: true }
  );
};
export async function stopTrack(
  req: Request,
  res: Response,
  next: NextFunction,
  ws: WSInterface
) {
  try {
    // Close the client connection
    const { routeId } = req.params;
    const { routeName } = req.body;
    const routeid = new Schema.Types.ObjectId(routeId);
    stopGpsClient(routeid, routeName);
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

export const updateDevideDBData = async (
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
