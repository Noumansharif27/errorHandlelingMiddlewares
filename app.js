const express = require("express");
const mongoose = require("mongoose");
const ExpressError = require("./ExpressError.js");
const Chat = require("./models/chat.js");
const path = require("path");
const ejsMate = require("ejs-mate");

const MongoURL = "mongodb://127.0.0.1:27017/fakeWhatsapp";
main()
  .then(() => {
    console.log(`Connected to DB!`);
  })
  .catch((err) => {
    console.log(`Error : ${err}`);
  });

async function main() {
  mongoose.connect(MongoURL);
}

const app = express();
const PORT = 3000;

let Authentication = (req, res, next) => {
  const { token } = req.query;
  if (token === "Hello") {
    console.log("working");
    next();
  }
  throw new ExpressError(401, "You messed up");
};

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));

app.set("view engine", "views");
app.set("views", path.join(__dirname, "views"));

// app.engine("ejs", ejsMate);

function aysncWrap(fn) {
  return function (req, res, next) {
    fn();
  };
}

app.get("/", (req, res) => {
  console.log(req.url);
  res.send(`Welcome to the index route!`);
});

app.get("/random", Authentication, (req, res) => {
  console.log(req.query);
  res.send(`Welcome to random`);
});

app.get(
  "/chats",
  aysncWrap(async (req, res) => {
    const chats = await Chat.find();
    res.render("index.ejs", { chats });
  })
);

app.get(
  "/chats/:id",
  asyncWrap(async (req, res, next) => {
    const { id } = req.params;
    const chat = await Chat.findById(id);
    if (!chat) {
      return next(new ExpressError(404, "Chat not found!"));
    }
    res.render("show.ejs", { chat });
  })
);

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Some error occured!" } = err;
  res.status(statusCode).send(message);
});

app.listen(PORT, () => {
  console.log(`Server is listening at PORT: ${PORT}`);
});
