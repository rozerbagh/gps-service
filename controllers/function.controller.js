const Schools = require("../models/schools.model");
const { pushNotification } = require("../middlewares/firebase");
async function getSchoolWithBuses(req, res) {
  console.log(req.params.schoolId);
  try {
    const result = await Schools.findById({ _id: req.params.schoolId });
    if (!result) {
      const er = createError(404, "School not found!");
      res.errorResponse(er, "School not found!", 404);
      return;
    }
    const schoolsBuses = await result.getSchoolWithBuses();
    res.successResponse(
      [{ ...schoolsBuses._doc, buses: schoolsBuses.buses }],
      "List of buses for the selected Schools",
      200
    );
  } catch (err) {
    res.errorResponse(err, "School not found! Internal server error", 500);
    return;
  }
}
async function sendNotification(req, res) {
  try {
    const sent = await pushNotification();
    if (sent) {
      res.successResponse({}, "Notification Send", 200);
    } else {
      const er = createError(501, "Internal server error");
      res.errorResponse(er, "Internal server error", 501);
    }
  } catch (error) {
    const er = createError(501, "Internal server error");
    res.errorResponse(er, "Internal server error", 501);
  }
}
module.exports = {
  getSchoolWithBuses,
  sendNotification,
};
