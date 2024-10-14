import { Server as NetServer, Socket } from "net";
import { Server as WSServer } from "ws";
export interface WSInterface {
  net: NetServer;
  ws: WSServer;
  broadcast: (message: string) => void;
  netSocket: Socket;
}

export interface GPSData {
  identifier: string;
  latitude: string;
  longitude: string;
  speed: string;
  date: string;
  time: string;
  fields: string[];
}
