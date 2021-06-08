const mongoose = require("mongoose");

mongoose.set("useCreateIndex", true);

module.exports = {
  DATABASEURL: "mongodb://patao:112940@127.0.0.1:27017/todo",
  OPTIONS: {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  },
};
