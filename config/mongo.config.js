const mongoose = require("mongoose");

mongoose.set("useCreateIndex", true);

module.exports = {
  DATABASEURL: "mongodb+srv://patao:UTIs9A7MrAlCeQgk@cluster0.ksr6u.mongodb.net/todo?retryWrites=true&w=majority",
  OPTIONS: {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  },
};
