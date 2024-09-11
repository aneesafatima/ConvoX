const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const http = require("http");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const Message = require("./models/messageModel");
const userRouter = require("./routes/userRouter");
const homeRouter = require("./routes/homeRouter");
const messageRouter = require("./routes/messageRouter");
const notificationRouter = require("./routes/notificationRouter");
const Notification = require("./models/notificationModel");
const errorController = require("./controllers/errorController");
const User = require("./models/userModel");
const path = require("path");

const groupRouter = require("./routes/groupRouter");
dotenv.config({ path: "./.env" });

const DB = process.env.DB_CONNECTION_STRING.replace(
  "<password>",
  process.env.DB_PASSWORD
);
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

const unreadMessages = async (sender, receiver) => {
  const receiverData = await User.findById(receiver).select("unreadMessages");

  if (!receiverData.unreadMessages.find((el) => el.from?.toString() === sender))
    await User.findByIdAndUpdate(receiver, {
      $push: { unreadMessages: { from: sender, count: 1 } },
    });
  else
    await User.findOneAndUpdate(
      { _id: receiver, "unreadMessages.from": sender },
      { $inc: { "unreadMessages.$.count": 1 } }
    );
};

io.on("connection", async (socket) => {
  console.log("Connected to the server with id : ", socket.id);
  socket.broadcast.emit("new-connection");

  const userId = socket.handshake.query.userId; //user's mongo db id
  const user = await User.findByIdAndUpdate(userId, { $set: { active: true } });

  user.groupIds?.map((groupId) => {
    socket.join(groupId.toString());
  });

  connectedUsers.push({ userId, socketId: socket.id });

  socket.on("unread-message", ({ sender, receiver }) => {
    console.log("active but tab is not opened");
    unreadMessages(sender, receiver);
  });

  socket.on("send-message", async (data) => {
    console.log(data);
    if (data.type === "individual") {
      await Message.create({
        sender: userId,
        receiver: data.to,
        message: data.message,
        format: data.format,
        replyingToMessage: data.replyingMessage,
      });

      const receiver = connectedUsers.find((user) => user.userId === data.to);
      if (receiver) {
        socket.to(receiver.socketId).emit("new-message", userId);
      } else {
        unreadMessages(userId, data.to);
        console.log("inactive");
      }
    } else if (data.type === "group") {
      await Message.create({
        sender: userId,
        groupId: data.to,
        message: data.message,
        isGroupMessage: true,
        format: data.format,
        replyingToMessage: data.replyingMessage,
      });
      const groupMemberIds = await User.find({ groupIds: data.to }).select(
        "_id unreadMessages"
      );

      const disconnectedUsers = groupMemberIds.filter(
        (member) =>
          !connectedUsers.find((user) => user.userId === member._id.toString())
      );

      disconnectedUsers?.forEach(async (user) => {
        unreadMessages(data.to, user._id);
      });

      socket.to(data.to).emit("new-message", data.to);
    }
  });

  socket.on(
    "added-new-user",
    async ({ selectedUserId, userName, groupId, groupName }) => {
     
      const selectedUser = connectedUsers.find(
        (user) => user.userId === selectedUserId
      );
      console.log("selectedUser", selectedUser);

      if (!selectedUser) {
        await Notification.create({
          message: groupId
            ? `${userName} added you to a group ${groupName}`
            : `${userName} added you as a contact`,
          userIds: [selectedUserId],
        });
      }
      if (selectedUser && !groupId)
        socket.to(selectedUser.socketId).emit("added-as-contact", userName);
      else if (groupId) {
        socket.to(groupId).emit("added-new-grp-member", groupId);
      }
    }
  );

  socket.on(
    "group-creation",
    async ({ userName, groupId, groupMembersIds, groupName }) => {
      socket.join(groupId);
      let user;
      let disconnectedUsers = [];
      groupMembersIds.forEach((member) => {
        user = connectedUsers.find((user) => user.userId === member);
        if (user)
          socket
            .to(user.socketId)
            .emit("added-to-group", { userName, groupId, groupName });
        else {
          disconnectedUsers.push(member);
        }
      });
      if (disconnectedUsers.length > 0) {
        await Notification.create({
          message: `${userName} added you to a group ${groupName}`,
          userIds: disconnectedUsers,
        });
      }
    }
  );

  socket.on("group-name-updated", ({ groupId }) => {
    console.log(groupId);
    socket.to(groupId).emit("group-name-updated");
  });

  socket.on("join-room", ({ roomId }) => {
    socket.join(roomId);
  });
  socket.on("group-member-removed", async ({ groupId, groupName, userId }) => {
    const user = connectedUsers.find((user) => user.userId === userId);
    const socketInstance = io.sockets.sockets.get(user?.socketId);
    if (socketInstance) {
      socketInstance.leave(groupId);
      socketInstance.emit("removed-from-group", groupName);
    } else {
      await Notification.create({
        message: `You were removed from ${groupName} group`,
        userIds: [userId],
      });
    }
  });

  socket.on("group-deleted", async ({ groupId, groupName }) => {
    socket.to(groupId).emit("group-deleted", groupId);
    const userIds = (await User.find({ groupIds: groupId }).select("_id")).map(
      (el) => el._id
    );

    await Notification.create({
      message: `Group ${groupName} has been deleted by admin`,
      userIds,
    });
  });
  socket.on("disconnect", async () => {
    await User.findByIdAndUpdate(userId, {
      $set: { active: false },
    });
    connectedUsers.splice(
      connectedUsers.findIndex((user) => user.socketId === socket.id),
      1
    );
    console.log("Disconnect");
  });
});

module.exports = app;
