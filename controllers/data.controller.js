const index = async (req, res, next, model, attr) => {
  try {
    if (attr.path)
      var data = await model
        .find({})
        .select("-passwordHash")
        .populate(attr.path)
        .exec();
    else var data = await model.find({}).select("-passwordHash");
    const count = await model.count({});

    if (!count) {
      const er = createError(404, "Data Not Found");
      res.errorResponse(er, "Data Not Found", 404);
    } else {
      res.successResponse({ ...data }, "Your details has been updated", 200);
    }
  } catch (error) {
    res.errorResponse(error, "Internal Server Error!", 500);
  }
};

const create = async (req, res, next, model) => {
  try {
    const result = new model({ ...req.body });
    const data = await result.save();
    res.successResponse({ ...data }, "Created/Added Successfully", 200);
  } catch (error) {
    res.errorResponse(error, "Data may exists, Internal Server Error!", 500);
  }
};

const bulkCreate = async (req, res, next, model) => {
  try {
    const data = await model.insertMany(req.data);
    res.successResponse({ ...data }, "Bulk Data Added Successfully", 200);

    res.status(201).send({
      success: true,
      message: "Bulk Data Added Successfully",
      responseStatus: 1,
      data: data,
    });
  } catch (error) {
    res.errorResponse(error, "Internal Server Error!", 500);
  }
};

const show = async (req, res, next, model, attr) => {
  try {
    var data;
    if (attr.path) {
      data = await model.findById(req.params.id).populate(attr.path).exec();
    } else {
      data = await model.findById(req.params.id);
    }

    if (!data) {
      const er = createError(404, "Data not found");
      res.errorResponse(er, "Data not found", 404);
      return;
    } else {
      res.successResponse(data, "Fetched Succesfull", 200);
    }
  } catch (error) {
    res.errorResponse(error, "Unable to Fetch", 500);
  }
};

const update = async (req, res, next, model) => {
  try {
    const data = await model.findByIdAndUpdate(req.params.id, req.body);
    if (!data) {
      const er = createError(404, "Data not found");
      res.errorResponse(er, "Data not found", 404);
      return;
    } else {
      res.successResponse(data, "Updated successfully", 200);
    }
  } catch (error) {
    res.errorResponse(error, "Unable to update", 500);
  }
};

const destroy = async (req, res, next, model) => {
  try {
    const data = await model.findByIdAndDelete(req.params.id);
    if (!data) {
      const er = createError(404, "Data not found");
      res.errorResponse(er, "Data not found", 404);
    } else {
      res.successResponse(data, "Your details has been updated", 200);
    }
  } catch (error) {
    res.errorResponse(error, "Unable Delete", 500);
  }
};

module.exports = { index, create, bulkCreate, show, update, destroy };
