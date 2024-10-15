import { Request, Response, NextFunction } from "express";
import net from "net";
import { Schema } from "mongoose";
import BusRoutes from "../models/busRoutes.model";
import { WSInterface, GPSData } from "../interface/ws.interface";
import { commonResponseJson } from "../middlewares/commonResponse";
import logger from "../utils/logs";
import { gpsDeviceDataListen } from "../socket_server";
let gpsClient: net.Socket | null = null;
export const startGpsClient = (busRoutesId: Schema.Types.ObjectId) => {
  if (gpsClient) {
    logger.log({ level: "info", message: "GPS client already started" });
  } else {
    gpsClient = new net.Socket();
  }
  gpsClient?.connect(3005, "174.138.123.193", () => {
    // Use the actual GPS device IP and port
    logger.log({ level: "info", message: "GPS DEVICE CONNECTED IPWISE" });
  });
  gpsClient?.on("data", async (data: Buffer) => {
    const gpsData = data.toString("utf8");
    const fields = gpsData.split(",");

    // const identifier = fields[1];
    const latitude = fields[5];
    const longitude = fields[7];
    // const speed = fields[8];
    // const date = fields[3];
    // const time = fields[9];
    logger.log({
      level: "info",
      message: `Received GPS Data: Lat: ${latitude}, Long: ${longitude}`,
    });
    await BusRoutes.findOneAndUpdate(
      { _id: busRoutesId },
      {
        $push: { route_coordinates: { latitude, longitude } },
      },
      { new: true }
    );
    // gpsClient?.write("Hello from client");
  });

  gpsClient.on("end", () => {
    console.log("GPS client disconnected");
  });

  gpsClient.on("error", (err) => {
    console.error("GPS client error:", err);
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
    startGpsClient(result._id);
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
export const stopGpsClient = async (busId: Schema.Types.ObjectId, routename: string) => {
  if (!gpsClient) {
    return;
  }

  // Close the client connection
  gpsClient.end();
  gpsClient = null;

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
    const route_id = new Schema.Types.ObjectId(routeId);
    stopGpsClient(route_id, routeName);
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
