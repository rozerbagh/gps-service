import winston from "winston";
// const levels = {
//   error: 0,
//   warn: 1,
//   info: 2,
//   http: 3,
//   verbose: 4,
//   debug: 5,
//   silly: 6,
// };
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // Add timestamp
    winston.format.simple() // Format logs as JSON
  ),
  levels: winston.config.npm.levels,
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new winston.transports.File({ filename: "app.log", level: "info" }),
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "debug.log", level: "debug" }),
    new winston.transports.File({ filename: "warn.log", level: "warn" }),
  ],
});

export default logger;
