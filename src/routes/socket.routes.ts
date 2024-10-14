import { Request, Response, NextFunction, Router } from "express";
import { startTrack, stopTrack } from "../controllers/sockets.controller";
import { WSInterface } from "../interface/ws.interface";
import logger from "../utils/logs";
const router = Router();
// const status = ["ordered", "dispatched", "shipped", "delivered"];
export const allScoketsRoutes = (ws: WSInterface) => {
  router.post(
    "/start/school/bus/:schoolid/:busid",
    (req: Request, res: Response, next: NextFunction) => {
      startTrack(req, res, next, ws);
    }
  );

  router.get(
    "/stop/school/bus/:schoolid/:busid",
    (req: Request, res: Response, next: NextFunction) => {
      stopTrack(req, res, next, ws);
    }
  );
  return router;
};

export default allScoketsRoutes;
