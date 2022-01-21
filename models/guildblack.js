const mongoose = require("mongoose");
let config = new mongoose.Schema({
  guild: String,

});

module.exports = mongoose.model("blackguild", config);