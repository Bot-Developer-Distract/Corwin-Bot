const mongoose = require("mongoose");
let config = new mongoose.Schema({
  guild: String,
  user: String,
  channel: String,

});

module.exports = mongoose.model("ticketsuser", config);