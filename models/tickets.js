const mongoose = require("mongoose");
let config = new mongoose.Schema({
  guild: String,
  categoryID: String,
  supportRoleID: String

});

module.exports = mongoose.model("tickets", config);