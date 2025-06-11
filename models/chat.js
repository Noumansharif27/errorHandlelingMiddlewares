const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = Schema({
  message: String,
});

const Chat = mongoose.model("chat", chatSchema);

module.exports = Chat;
