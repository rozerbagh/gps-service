const Schools = require("../models/schools.model");
async function getSchoolWithBuses(req, res) {
  console.log(req.params.schoolId);
  try {
    const result = await Schools.findById({ _id: req.params.schoolId });
    if (!result) {
      res.status(500).send({
        status: "failed",
        statuscode: "501",
        message: "School not found",
      });
      return;
    }
    const schoolsBuses = await result.getSchoolWithBuses();
    res.status(200).send({
      data: { ...schoolsBuses._doc, buses: schoolsBuses.buses },
      status: "success",
      statuscode: 200,
      message: "Lists of Buses",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "failed",
      statuscode: "500",
      error: err,
      message: "unable to get buses",
    });
  }
}
module.exports = {
  getSchoolWithBuses,
};
