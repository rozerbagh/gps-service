import { Request, Response, NextFunction, Router } from "express";

import {
  create,
  update,
  index,
  show,
  destroy,
} from "../controllers/app.controller";
import { fetchRespectiveSchoolsBuses } from "../controllers/data.controller";
import {
  fetchRespectiveBusRoutes,
  getSchoolWithBuses,
  showMabConfigs,
  fetchRespectiveSchoolsAllRoutes,
  updateRespectiveBusRoutes,
} from "../controllers/function.controller";
import Schools from "../models/schools.model";
import Buses from "../models/buses.model";
import BusRoutes from "../models/busRoutes.model";
import Students from "../models/students.model";
import MBConfigs from "../models/mapboxconfigs.model";
import { checkToken } from "../middlewares/auth.middleware";
const router = Router();
// const status = ["ordered", "dispatched", "shipped", "delivered"];
router.post(
  "/school/add",
  checkToken,
  (req: Request, res: Response, next: NextFunction) => {
    create(Schools, req, res, next);
  }
);
router.patch(
  "/school/update/:id",
  checkToken,
  (req: Request, res: Response, next: NextFunction) =>
    update(Schools, req, res, next)
);
router.get(
  "/school/all",
  checkToken,
  (req: Request, res: Response, next: NextFunction) =>
    index(Schools, req, res, next, { path: "", value: "" })
);
router.get(
  "/school/bus/all/:schoolid",
  checkToken,
  (req: Request, res: Response, next: NextFunction) =>
    fetchRespectiveSchoolsBuses(req, res, next)
);
router.get(
  "/school/get/:id",
  checkToken,
  (req: Request, res: Response, next: NextFunction) =>
    show(Schools, req, res, next, { path: "", value: "" })
);
router.get(
  "/school/getSchoolWithBuses/:schoolId",
  checkToken,
  (req: Request, res: Response, next: NextFunction) =>
    getSchoolWithBuses(req, res, next)
);
router.delete(
  "/school/delete/:id",
  checkToken,
  (req: Request, res: Response, next: NextFunction) =>
    destroy(Schools, req, res, next)
);

// Buses
router.post(
  "/bus/add",
  checkToken,
  (req: Request, res: Response, next: NextFunction) => {
    create(Buses, req, res, next);
  }
);
router.get(
  "/school/getbyschoolid/:schoolid",
  checkToken,
  (req: Request, res: Response, next: NextFunction) =>
    show(Buses, req, res, next, { path: "", value: "" })
);

// router.post(
//   "/push/notification",
//   (req: Request, res: Response, next: NextFunction) => {}
// );
// router.post(
//   "/mapbox-configs/create",
//   (req: Request, res: Response, next: NextFunction) =>
//     create(MBConfigs, req, res, next)
// );
router.get(
  "/mapbox-configs/get",
  (req: Request, res: Response, next: NextFunction) =>
    showMabConfigs(req, res, next)
);

// Bus Routing routes
router.post(
  "/busroutes/create",
  checkToken,
  (req: Request, res: Response, next: NextFunction) =>
    create(BusRoutes, req, res, next)
);

router.get(
  "/busroutes/lists",
  (req: Request, res: Response, next: NextFunction) =>
    index(BusRoutes, req, res, next, { path: "buses", value: "" })
);

router.get(
  "/busroutes/list/:id",
  checkToken,
  (req: Request, res: Response, next: NextFunction) =>
    show(BusRoutes, req, res, next, { path: "buses", value: "" })
);

router.get(
  "/busroutes/listing/:schoolid/:busid",
  checkToken,
  (req: Request, res: Response, next: NextFunction) =>
    fetchRespectiveBusRoutes(BusRoutes, req, res, next)
);
router.get("/schoolsbuses", (req: Request, res: Response, next: NextFunction) =>
  fetchRespectiveSchoolsAllRoutes(BusRoutes, req, res, next)
);

router.patch(
  "/busroutes/list/:id",
  checkToken,
  (req: Request, res: Response, next: NextFunction) =>
    update(BusRoutes, req, res, next)
);

router.delete(
  "/busroutes/delete/:id",
  checkToken,
  (req: Request, res: Response, next: NextFunction) =>
    destroy(BusRoutes, req, res, next)
);

router.patch(
  "/busroutes/update-default/:id",
  checkToken,
  (req: Request, res: Response, next: NextFunction) =>
    updateRespectiveBusRoutes(req, res, next)
);

// Students Routes
router.post(
  "/students/create",
  checkToken,
  (req: Request, res: Response, next: NextFunction) =>
    create(Students, req, res, next)
);

router.get(
  "/students/lists",
  checkToken,
  (req: Request, res: Response, next: NextFunction) =>
    index(Students, req, res, next, { path: "buses", value: "" })
);

router.get(
  "/students/list/:id",
  checkToken,
  (req: Request, res: Response, next: NextFunction) =>
    show(Students, req, res, next, { path: "buses", value: "" })
);
router.get(
  "/students/upadte/:id",
  checkToken,
  (req: Request, res: Response, next: NextFunction) =>
    update(Students, req, res, next)
);


export default router;
