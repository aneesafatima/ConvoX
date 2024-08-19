const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const http = require("http");
dotenv.config({ path: "./.env" });
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const Message = require("./models/messageModel");

const DB = process.env.DB_CONNECTION_STRING.replace(
  "<password>",
  process.env.DB_PASSWORD
);
const userRouter = require("./routes/userRouter");
const homeRouter = require("./routes/homeRouter");
const errorController = require("./controllers/errorController");
const User = require("./models/userModel");
const app = express(); //app is an instance of express
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Frontend URL
    methods: ["GET", "POST"], // Allowed methods
    credentials: true, // Allow credentials such as cookies
  },
});
app.use(
  cors(
    {
      origin: ["http://localhost:5173"], // Your frontend origin
      credentials: true,
    } // Allows credentials (cookies) to be sent
  )
);

app.use(express.json());
app.use(cookieParser());
// Middleware to parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
  });
});

app.use("/api/users", userRouter);
app.use("/api/home", homeRouter);
app.use("*", (req, res) => {
  res.status(404).json({
    message: "Not Found",
  });
});
app.use(errorController);

mongoose
  .connect(DB, {})
  .then(() => {
    console.log("Mongodb connected");

    if (process.env.NODE_ENV === "development") {
      server.listen(process.env.PORT, () => {
        console.log(`Server is listening on port ${process.env.PORT}`);
      });
    }
  })
  .catch((err) => {
    console.error("DATABASE CONNECTION ERROR:", err);
    process.exit(1); //appication halting with an error
  });
const connectedUsers = [];
io.on("connection", async (socket) => {
  const userId = socket.handshake.query.userId; //user's mongo db id
  await User.findByIdAndUpdate(userId, { active: true });
  connectedUsers.push({ userId, socketId: socket.id });
  console.log(connectedUsers);
  socket.on("send-message", async (data) => {
    await Message.create({
      sender: userId,
      receiver: data.to,
      message: data.message,
    });
  });
  socket.on("disconnect", async () => {
    await User.findByIdAndUpdate(userId, {
      active: false,
    });
    connectedUsers.splice(
      connectedUsers.findIndex((user) => user.userId === socket.id),
      1
    );
    console.log("Disconnect");
  });
});

module.exports = app;
