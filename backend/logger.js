// logger.js
const winston = require("winston");

const logger = winston.createLogger({
  level: "info", // Set the default log level
  format: winston.format.combine(
    winston.format.timestamp(), // Add timestamps to logs
    winston.format.json() // Log in JSON format
  ),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }), // Log error level logs to error.log
    new winston.transports.File({ filename: "combined.log" }), // Log all logs to combined.log
  ],
});

// For console logging during development
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(), // Simple format for console logs
    })
  );
}

module.exports = logger;
