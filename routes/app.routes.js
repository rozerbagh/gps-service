const express = require("express");
const router = express.Router();
const dataController = require("../controllers/data.controller");
const funcController = require("../controllers/function.controller");
const { checkToken } = require("../middlewares/auth.middleware");
const Schools = require("../models/schools.model");
const Buses = require("../models/buses.model");
const MBConfigs = require("../models/mapboxconfigs.model");
// const status = ["ordered", "dispatched", "shipped", "delivered"];
router.post("/school/add", checkToken, (req, res, next) => {
  dataController.create(req, res, next, Schools);
});
router.patch("/school/update/:id", checkToken, (req, res, next) =>
  dataController.update(req, res, next, Schools)
);
router.get("/school/all", checkToken, (req, res, next) =>
  dataController.index(req, res, next, Schools, { path: "" })
);
router.get("/school/get/:id", checkToken, (req, res, next) =>
  dataController.show(req, res, next, Schools, { path: "" })
);
router.get(
  "/school/getSchoolWithBuses/:schoolId",
  checkToken,
  (req, res, next) =>
    funcController.getSchoolWithBuses(req, res, next, Schools, { path: "" })
);
router.delete("/school/delete/:id", checkToken, (req, res, next) =>
  dataController.destroy(req, res, next, Schools)
);

// Buses
router.post("/bus/add", checkToken, (req, res, next) => {
  dataController.create(req, res, next, Buses);
});
router.get("/school/getbyschoolid/:schoolid", checkToken, (req, res, next) =>
  dataController.show(req, res, next, Buses, { path: "" })
);

router.post("/push/notification", (req, res, next) => {});
router.post("/mapbox-configs/create", (req, res, next) =>
  dataController.create(req, res, next, MBConfigs)
);
router.get("/mapbox-configs/get", (req, res, next) =>
  funcController.showMabConfigs(req, res, next)
);

module.exports = router;
