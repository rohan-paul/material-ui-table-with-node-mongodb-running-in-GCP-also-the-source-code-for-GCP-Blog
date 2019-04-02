"use strict";
const mongoose = require("mongoose");

module.exports = {
  database: process.env.MONGO_DB,

  options: {
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 1000, // Reconnect every 500ms
    poolSize: 10 // Maintain up to 10 socket connections
  },

  // Connect connection with MongoDB Database
  connectDB: function() {
    mongoose.connect(this.database, this.options);
  },

  // Disconnect connection with MongoDB Database
  disconnectDB: function() {
    mongoose.disconnect(this.database);
  }
};
// on mongo connection open event print a console statement
mongoose.connection.on("open", function() {
  console.log("Connected to Database (MongoDB) ");
});

// on mongo connection error event
mongoose.connection.on("error", function() {
  console.log("error in Database (MongoDB) connections");
});

// on mongo connection disconnected event
mongoose.connection.on("disconnected", () => {
  console.log("Mongoose default connection disconnected");
});

//listen for SIGINT event(generated with <Ctrl>+C in the terminal) and close db connection on that event
process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    console.log("Mongoose disconnected through app termination");
    process.exit(0);
  });
});

/* Our application exits ( generated with 'SIGINT' event ) will also close database connection.

What is the cause? - EventLoop

As we know NodeJS will exit when EventLoop queue is empty and nothing left to do.

But sometime your application can have more functions and will not exit automatically, in this point comes our last work to do.
We need to exit from process using process.exit function.

Argument 0 means exit with a “success” code.
To exit with a “failure” code use 1.
*/
