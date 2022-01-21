const mongoose = require("mongoose");
let config = new mongoose.Schema({
  guild: String,
  suggestchannel: String,


});

module.exports = mongoose.model("guild", config);