const mongoose = require("mongoose");
let config = new mongoose.Schema({
  user: String,

});

module.exports = mongoose.model("blackuser", config);