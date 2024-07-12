import express, { Application } from "express";
import dotenv from "dotenv"
import mongoose from "mongoose";
import bodyParser from "body-parser";
import appsRoutes from "./routes/app.routes";
import userRoutes from "./routes/user.routes";
import cors from "cors";
import { responseEnhancer } from "./middlewares/commonResponse";
// Initialize the express engine
const app: Application = express();
dotenv.config();

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 200,
};
app.use(responseEnhancer);

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
    // console.log("mongodb is connected successfully");
  })
  .catch((err) => {
    // console.log(err);
  });

// setting up the cors
app.use(cors(corsOptions));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
// app.post("/sms/inbound", (req, res) => {
//   // console.log(req.body);
//   res.send(req.body);
// });
// app.post("/sms/status", (req, res) => {
//   // console.log(req.body);
//   res.send(req.body);
// });
app.use(express.static("public"));
app.use(express.json({ limit: "150mb" }));
app.use(express.urlencoded({ extended: true, limit: "150mb" }));

// welcome api on '/' route
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/app", appsRoutes);
app.get("/", (req, res, next) => {
  res.status(200).json({
    message: ".....server is running",
    credit: "powered by -gps",
  });
});
app.post("/", (req, res, next) => {
  // console.log(":::: post requests ::::", req.body, req.query, req.params);
  res.status(200).json({
    message: ".....server is running",
    credit: "powered by -Ambee",
    req,
  });
});

// Create a route to handle incoming GPS data
app.post("/gps", (req, res) => {
  const gpsData = req.body; // Assuming Sinotrack sends JSON data
  // console.log("Received GPS data:", gpsData);
  // Process the GPS data as needed
  res.sendStatus(200); // Send a response to the tracker
});

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
const Applications = { app, websockets: (ws: any) => ws };
export default Applications;
