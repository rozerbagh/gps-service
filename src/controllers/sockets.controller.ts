import { Request, Response, NextFunction } from "express";
import net from "net";
import { Schema } from "mongoose";
import BusRoutes from "../models/busRoutes.model";
import { WSInterface, GPSData } from "../interface/ws.interface";
import { commonResponseJson } from "../middlewares/commonResponse";
import logger from "../utils/logs";
import { gpsDeviceDataListen } from "../socket_server";
let gpsClient: net.Socket | null = null;
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
    if (gpsClient) {
      logger.log({ level: "info", message: "GPS client already started" });
    } else {
      gpsClient = new net.Socket();
    }
    gpsClient?.connect(3005, "174.138.123.193", () => {
      // Use the actual GPS device IP and port
      logger.log({ level: "info", message: "GPS DEVICE CONNECTED IPWISE" });
    });
    gpsClient?.connect(3005, "127.0.0.1", () => {
      // Use the actual GPS device IP and port
      logger.log({ level: "info", message: "GPS DEVICE CONNECTED LOCALLY" });
    });
    gpsClient?.on("data", async (data: Buffer) => {
      const gpsData = data.toString("utf8");
      const parsedData = JSON.parse(gpsData);
      const { lat, long } = parsedData;
      logger.log({
        level: "info",
        message: `Received GPS Data: Lat: ${lat}, Long: ${long}`,
      });
      gpsClient?.write("Hello from client");
    });
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
    // Close the client connection
    gpsClient?.end();
    gpsClient = null;
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
