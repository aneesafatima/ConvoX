const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const http = require("http");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const userRouter = require("./routes/userRouter");
const homeRouter = require("./routes/homeRouter");
const messageRouter = require("./routes/messageRouter");
const notificationRouter = require("./routes/notificationRouter");
const errorController = require("./controllers/errorController");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const path = require("path");
const handleIoConnection = require("./utils/socketHandlers");

const groupRouter = require("./routes/groupRouter");
dotenv.config({ path: "./.env" });

const DB = process.env.DB_CONNECTION_STRING.replace(
  "<password>",
  process.env.DB_PASSWORD
);
const app = express(); //app is an instance of express
const server = http.createServer(app);
//ERROR HANDLING

// This will catch any uncaught exceptions from anywhere in your app
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});
// This will catch any unhandled promise rejections from anywhere in your app
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  // Attempt to close server gracefully before exiting
  server.close(() => {
    process.exit(1);
  });
});

// Middleware setup
// Set Security HTTP Headers using Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // CORP (Cross-Origin Resource Policy):
    // Allows cross-origin access for images, videos, etc.
  })
);

// Rate Limiting: Limit requests from the same IP
const limiter = rateLimit({
  max: 100, // Limit each IP to 100 requests per `window`
  windowMs: 60 * 60 * 1000, // 1 hour window
  message: "Too many requests from this IP, please try again after an hour!",
});
app.use("/api", limiter); // Apply to routes that start with `/api`

// Data Sanitization against NoSQL Injection attacks
app.use(mongoSanitize());

// // Data Sanitization against XSS attacks
app.use(xss());

// Prevent HTTP Parameter Pollution
app.use(hpp());

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
); // CORS (Cross-Origin Resource Sharing)

app.use(express.json());
app.use(cookieParser());
// Middleware to parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/api/users", userRouter);
app.use("/api/home", homeRouter);
app.use("/api/messages", messageRouter);
app.use("/api/groups", groupRouter);
app.use("/api/notifications", notificationRouter);
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
      server.listen(process.env.PORT, () => {
        console.log(`Server is listening on port ${process.env.PORT}`);
      }); 
    
  })
  .catch((err) => {
    console.error("DATABASE CONNECTION ERROR:", err);
    process.exit(1); //appication halting with an error
  });

handleIoConnection(io);

module.exports = app;
