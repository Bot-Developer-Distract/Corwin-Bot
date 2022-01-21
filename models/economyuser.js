const mongoose = require("mongoose");
let config = new mongoose.Schema({
  guild: String,
  user: String,
  money: Number,
  dtime: Date,
  wtime: Date,
  mtime: Date,

});

module.exports = mongoose.model("usereco", config);