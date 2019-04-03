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

// *****  Start of serving build's index.html file for Deploying to Google App Engine  *******

// From - https://facebook.github.io/create-react-app/docs/deployment
app.use(express.static(path.join(__dirname, "/client/build")));

// The below two routes are Perfectly Working with GAE ***

app.get("/", function(req, res) {
  res.status(200).sendFile(path.join(__dirname, "/client/build", "index.html"));
});

app.get("/employee", function(req, res) {
  res.status(200).sendFile(path.join(__dirname, "/client/build", "index.html"));
});

// Perfectly Working with GAE
app.get("/department", function(req, res) {
  res.status(200).sendFile(path.join(__dirname, "/client/build", "index.html"));
});

// This way of coding a catch-all route, although was sometime rendering the UI, but was NOT working as mongodb data from Atlas was not being fetched.
// app.get("*", async (req, res) => {
//   const path = await url.parse(req.url).pathname;
//   console.log("REQ.URL IS ", path);
//   try {
//     if (
//       path === "/api/employee/" ||
//       path === "/employee" ||
//       path === "/api/employee/current/today"
//     ) {
//       res.sendFile(path.join(__dirname, "/client/build", "index.html"));
//     }
//   } catch {
//     console.log("Error happened while parsing URL");
//   }
// });

// graphQLServer.get('*', function (req, res) {
//     res.status(200).sendFile(path.resolve(__dirname, '..', 'public', 'index.html'));
//   });

// app.get("*", function(req, res) {
//   res
//     .status(200)
//     .sendFile(path.resolve(__dirname, "/client/build", "index.html"));
// });

// The "catchall" handler: for any request that doesn't
// match any route after "/" below, send back React's index.html file.
// app.get("/*", (req, res) => {
//   res.sendFile(path.join(__dirname, "/client/build", "index.html"));
// });

// The below IS ALSO WORKING when run < npm run dev > locally - but ofcourse it will not refer to the /client/build folder
// app.get("/", function(req, res) {
//   res.sendFile(path.join(__dirname, "/client/public", "index.html"));
// });

// **** End of serving files for Deploying to Google App Engine *******

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
