const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();
var cors = require("cors");

const Data = require("./models/dataModel");
const dataRouter = require("./routes/dataRoute");
const userRoutes = require("./routes/user.routes");
const appsRoutes = require("./routes/app.routes");

var corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 200,
};

// m-lab mongo connection
mongoose
  .connect(
    "mongodb://adminrozerapp:19Vicky93%408050849022@143.244.128.159:27017/gpsdevice?authMechanism=DEFAULT&authSource=admin&readPreference=primary&appname=lemarchnad&directConnection=true&ssl=false",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }
  )
  .then((res) => {
    // console.log(res)
    console.log("mongodb is connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });

// setting up the cors
app.use(cors(corsOptions));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/app", appsRoutes);
app.use(express.static("public"));
app.use(express.json({ limit: "150mb" }));
app.use(express.urlencoded({ extended: true, limit: "150mb" }));

// welcome api on '/' route
app.get("/", (req, res, next) => {
  res.status(200).json({
    message: ".....server is running",
    credit: "powered by -gps",
  });
});
app.post("/", (req, res, next) => {
  console.log(":::: post requests ::::", req.body, req.query, req.params);
  res.status(200).json({
    message: ".....server is running",
    credit: "powered by -Ambee",
    req,
  });
});

// Create a route to handle incoming GPS data
app.post("/gps", (req, res) => {
  const gpsData = req.body; // Assuming Sinotrack sends JSON data
  console.log("Received GPS data:", gpsData);
  // Process the GPS data as needed
  res.sendStatus(200); // Send a response to the tracker
});
app.use("/api/v1/data", dataRouter);

// cors handling
app.use((req, res, next) => {
  // * can be replaced by any http://somthing.com
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Header",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, PATCH, DELETE");
    return res.status(200).json({ ...req });
  }
  next();
});
const Applications = { app: app, websockets: (ws) => ws };
module.exports = Applications;
