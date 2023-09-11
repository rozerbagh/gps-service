const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Data = require("./api/models/dataModel");
// const request = require('request');
const dataRouter = require("./api/routes/dataRoute");

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
// mongodb://ambeedev:ambeedev1@ds151293.mlab.com:51293/heroku_gvsq2gkn
// localhost mongo connection
// mongoose.connect("mongodb://127.0.0.1:27017/data-test", {
//   useNewUrlParser: true,
// });

// use bodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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
    return res.status(200).json({});
  }
  next();
});

// welcome api on '/' route
app.get("/", (req, res, next) => {
  console.log(":::: get requests ::::",req.body, req.query, req.params);
  res.status(200).json({
    message: ".....server is running",
    credit: "powered by -Ambee",
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
app.post('/gps', (req, res) => {
  const gpsData = req.body; // Assuming Sinotrack sends JSON data
  console.log('Received GPS data:', gpsData);
  // Process the GPS data as needed
  res.sendStatus(200); // Send a response to the tracker
});

app.use("/api/v1/data", dataRouter);

module.exports = app;
