# Understanding Our "Fake WhatsApp" Project

Welcome to our project, which is like a super simple "Fake WhatsApp"\! This project helps us learn about how websites handle problems or "errors" when things don't go as planned. Imagine you're playing a game, and sometimes it crashes, or something weird happens. This project shows how to make sure our "WhatsApp" doesn't crash and instead tells us what went wrong in a friendly way.

Let's look at the special files that make this project work:

## 1\. `app.js` - The Brain of Our WhatsApp

Think of `app.js` as the "brain" or the main control center of our Fake WhatsApp. It decides what happens when someone visits our website.

```javascript
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
```

- **`express`**: This is like a very helpful manager for our website. It makes it easy to set up different pages and how they talk to each other.
- **`mongoose`**: This is a tool that helps our WhatsApp talk to its "diary" (which is called a database). Our diary is where we save all the messages.
- **`ExpressError`**: This is a special "problem reporter" we made ourselves. When something goes wrong, we use this to create a special message about the problem.
- **`Chat`**: This tells us how a message should look when we save it in our diary.
- **`MongoDB`**: This is the actual "diary" or database where we keep all our chats. The code connects to it when the app starts.

### Special Helpers (Middleware)

Imagine you have a security guard at the entrance of your house. Before anyone can come in, the guard checks them. In our app, we have "middleware" which are like these security guards or helpers that check things before a request goes to its destination.

```javascript
let Authentication = (req, res, next) => {
  const { token } = req.query;
  if (token === "Hello") {
    console.log("working");
    next(); // All good, let them pass!
  }
  throw new ExpressError(401, "You messed up"); // Problem! Stop right here!
};
```

- **`Authentication`**: This is a security check. If you try to visit `/random` page, you need to send a secret word, "Hello". If you don't, it throws an `ExpressError` and tells you "You messed up". It's like a secret knock to get into a special room\!

<!-- end list -->

```javascript
function aysncWrap(fn) {
  return function (req, res, next) {
    fn(); // This line runs the function you give it
  };
}
```

- **`aysncWrap`**: Some tasks in our app, like getting messages from the diary, take a little time. This helper makes sure that if there's a problem while waiting, our special "problem reporter" (ExpressError) can catch it.

### Different Pages (Routes)

Just like a house has different rooms (kitchen, bedroom, living room), our website has different "routes" or pages.

```javascript
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
```

- **`/`**: This is the homepage of our WhatsApp.
- **`/random`**: This is a special page that needs the "secret word" (`Authentication` middleware) to enter.
- **`/chats`**: This page fetches all the messages from our diary and shows them.
- **`/chats/:id`**: This page is for seeing a single message. If you ask for a message that doesn't exist, it will use our `ExpressError` to say "Chat not found\!".

### The "Cleanup Crew" (Error Handling Middleware)

When a problem happens, we don't want our app to just stop. We have a special "cleanup crew" that catches all the `ExpressError` problems and makes sure a friendly message is shown.

```javascript
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Some error occured!" } = err;
  res.status(statusCode).send(message);
});

app.listen(PORT, () => {
  console.log(`Server is listening at PORT: ${PORT}`);
});
```

- This `app.use` part is like a "safety net". If any problem happens anywhere in our app, this code catches it. It then sends a message to the user, like "Some error occurred\!" or the specific problem message from our `ExpressError`.

## 2\. `ExpressError.js` - Our Custom Problem Reporter

This file is where we create our own special "problem reporter" that helps `app.js` tell us exactly what kind of problem happened.

```javascript
class ExpressError extends Error {
  constructor(stastusCode, message) {
    super();
    this.stastusCode = stastusCode;
    this.message = message;
  }
}

module.exports = ExpressError;
```

- Imagine you have different types of "problem cards" for your game: one for "game over," one for "wrong move," etc. This `ExpressError` file helps us make those specific problem cards.
- `statusCode`: This is like a special code number for the problem (e.g., 401 means "you don't have permission", 404 means "not found").
- `message`: This is the friendly text that explains the problem.

## 3\. `models/chat.js` - How Our Diary Pages Look

This file is like a blueprint for how we write our messages in our diary. It tells us what information each message should have.

```javascript
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = Schema({
  message: String,
});

const Chat = mongoose.model("chat", chatSchema);

module.exports = Chat;
```

- **`chatSchema`**: This is the blueprint. It says that each chat message will have a `message` which will be a `String` (like a sentence).
- **`Chat`**: This is like the stamp that makes sure every new message follows our blueprint before it goes into the diary.

## 4\. `.gitignore` - What to Ignore in Our Project Folder

When we share our project with others, we don't want to share everything. This file tells a special helper called Git (which tracks changes in our code) what files to _ignore_.

```
# ignoring node_modules
node_modules/
```

- **`node_modules/`**: This folder contains all the "tools" that our project needs to run. These tools are usually very big, so we tell Git to ignore them. It's like telling your friend, "You don't need to pack all the toys I have; you can download your own when you get home\!"

## 5\. `package.json` & `package-lock.json` - Our Project's Shopping List and Receipt

These files help us keep track of all the "tools" or "ingredients" our project needs to work.

### `package.json` - The Shopping List

```json
{
  "name": "errorhandlermiddlewares",
  "version": "1.0.0",
  "main": "app.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "ejs": "^3.1.10",
    "ejs-mate": "^4.0.0",
    "express": "^5.1.0",
    "mongoose": "^8.15.1"
  }
}
```

- **`name`**: The name of our project.
- **`version`**: The current version number.
- **`dependencies`**: This is the most important part here\! It's our shopping list of all the tools our project needs, like `express`, `mongoose`, and `ejs`. Each tool has a version number, like `^5.1.0` for `express`, which means "get version 5.1.0 or newer, but not version 6 yet."

### `package-lock.json` - The Detailed Receipt

This file is like a very detailed receipt. It remembers the _exact_ version of every single tool and all its tiny sub-tools that were installed. This makes sure that if someone else tries to run our project, they get the exact same tools and it works perfectly.

```json
{
  "name": "errorhandlermiddlewares",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "errorhandlermiddlewares",
      "version": "1.0.0",
      "license": "ISC",
      "dependencies": {
        "ejs": "^3.1.10",
        "ejs-mate": "^4.0.0",
        "express": "^5.1.0",
        "mongoose": "^8.15.1"
      }
    }
    // ... many more lines of exact versions and integrity checks
  }
}
```

- It has `resolved` links and `integrity` hashes, which are like unique fingerprints to ensure you download the correct version of each tool.

## How It All Works Together (Error Handling)

In simple terms, our project is designed to:

1.  **Do its job**: Like showing messages or connecting to the diary.
2.  **Catch problems**: If something goes wrong (like asking for a message that doesn't exist, or not having the secret word), our `ExpressError` "problem reporter" creates a special problem card.
3.  **Clean up**: The "cleanup crew" in `app.js` catches these problem cards.
4.  **Tell us nicely**: Instead of crashing, it sends a friendly message back to us, telling us what happened, without showing us confusing computer code.

This way, our "Fake WhatsApp" is more like a reliable friend who tells you when there's a problem, instead of just disappearing\!
