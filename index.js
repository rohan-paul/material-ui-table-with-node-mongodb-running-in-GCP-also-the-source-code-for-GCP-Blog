// const dotenv = require("dotenv");
require("dotenv").config();
const fs = require("fs");

// const envConfig = dotenv.parse(fs.readFileSync(".env.override"));
// for (let k in envConfig) {
//   process.env[k] = envConfig[k];
// }
const express = require("express");
const app = express();
const path = require("path");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const url = require("url");

const departmentRoutes = require("./routes/departmentRoutes");
const employeeRoutes = require("./routes/employeeRoutes");

const config = require("./config/config");

const addRequestId = require("express-request-id")();

config.connectDB();

// Generate UUID for request and add it to X-Request-Id header. To work along with morgan logging. Adding a request id to the request object, to facilitate tying different log entries to each other. So a Request log and its associated Response log would have the same id.
app.use(addRequestId);
app.use(morgan()); // I am both writing to a log file while showing logs on the console.
app.use(methodOverride("_method"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

morgan.token("id", function getId(req) {
  return req.id;
});

// Serving build's index.html file for Deploying to Google App Engine is MUST for production

// From - https://facebook.github.io/create-react-app/docs/deployment
app.use(express.static(path.join(__dirname, "/client/build")));

// The below two routes are also Perfectly Working with GAE, but I used the 'catchAll' routes below
// app.get("/employee", function(req, res) {
//   res.status(200).sendFile(path.join(__dirname, "/client/build", "index.html"));
// });

// app.get("/department", function(req, res) {
//   res.status(200).sendFile(path.join(__dirname, "/client/build", "index.html"));
// });

// The below IS ALSO WORKING when run < npm run dev > locally - but ofcourse it will not refer to the /client/build folder
// app.get("/", function(req, res) {
//   res.sendFile(path.join(__dirname, "/client/public", "index.html"));
// });

// Morgan - For saving logs to a log file
let accessLogStream = fs.createWriteStream(__dirname + "/access.log", {
  flags: "a"
});

// my custom log format, just adding ":id" to the pre-defined "combined" format from morgan
// let loggerFormat =
//   ':id :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :req[header] :response-time ms';

let loggerFormat = `:remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]`;

app.use(morgan(loggerFormat, { stream: accessLogStream }));

// Below two functions are for showing logs on the console. Define streams for Morgan. This logs to stderr for status codes greater than 400 and stdout for status codes less than 400.
app.use(
  morgan(loggerFormat, {
    skip: function(req, res) {
      return res.statusCode < 400;
    },
    stream: process.stderr
  })
);

app.use(
  morgan(loggerFormat, {
    skip: function(req, res) {
      return res.statusCode >= 400;
    },
    stream: process.stdout
  })
);

app.use("/api/department", departmentRoutes);
app.use("/api/employee", employeeRoutes);

// Only now, AFTER the above /api/ routes, the "catchall" handler routes: for any request that doesn't match any route after "/" below and send back React's index.html file.
// Note, this 'catchall" route MUST be put after the above two /api/ routes. Otherwise those api routes will never be hit
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/build/index.html"));
});

app.use((err, req, res, next) => {
  res.status(422).send({ error: err._message });
});

app.listen(8080, () => {
  console.log("Express Server running on port 8080");
});

// Graceful shutdown, on sigint ( generated with <Ctrl>+C in the terminal ) - kill/close database connection and exit
process.on("SIGINT", () => {
  config.disconnectDB();
  process.exit(0);
});
