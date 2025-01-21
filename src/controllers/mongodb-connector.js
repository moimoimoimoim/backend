const mongoose = require("mongoose");

const connect = () => {
  mongoose.connect("mongodb://ID:Password@Host:27017/DB명?authSource=admin");
};

mongoose.connection.on("error", (error) => {
  console.error("MongoDB Connection Error", error);
});

mongoose.connection.on("disconnected", () => {
  console.error("MongoDB Disconnected, retry...");
  connect();
});

module.exports = connect;
