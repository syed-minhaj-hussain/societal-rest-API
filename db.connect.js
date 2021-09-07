const mongoose = require("mongoose");
require("dotenv").config();

const startConnection = () => {
  mongoose
    .connect(process.env.CONNECTION_URI, {
      useNewUrlParser: true,
    })
    .then(() => console.log("connected to DB"))
    .catch((err) => console.log({ err }));
};

module.exports = { startConnection };
