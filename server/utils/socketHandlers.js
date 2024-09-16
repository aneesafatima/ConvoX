const { unreadMessages, connectedUsers } = require("./socketUtils");
const Message = require("../models/messageModel");
const Notification = require("../models/notificationModel");
const User = require("../models/userModel");

const handleIoConnection = (io) => {
  io.on("connection", async (socket) => {
    console.log("Connected to the server with id : ", socket.id);
    socket.broadcast.emit("new-connection");

    const userId = socket.handshake.query.userId; //user's mongo db id
    const user = await User.findByIdAndUpdate(userId, {
      $set: { active: true },
    });

    user.groupIds?.map((groupId) => {
      socket.join(groupId.toString());
    });

    connectedUsers.push({ userId, socketId: socket.id });

    socket.on("unread-message", ({ contactId, receiver }) => {
      unreadMessages(contactId, receiver);
    });

    socket.on("send-message", async (data) => {
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
          socket.to(receiver.socketId).emit("new-message", {
            contactId: userId,
            message: data.format !== "text" ? data.format : data.message,
          });
        } else {
          unreadMessages(userId, data.to);
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
            !connectedUsers.find(
              (user) => user.userId === member._id.toString()
            )
        );

        disconnectedUsers?.forEach(async (user) => {
          unreadMessages(data.to, user._id);
        });

        socket.to(data.to).emit("new-message", {
          contactId: data.to,
          message: data.format !== "text" ? data.format : data.message,
        });
      }
    });

    socket.on(
      "added-new-user",
      async ({ selectedUserId, userName, groupId, groupName }) => {
        const selectedUser = connectedUsers.find(
          (user) => user.userId === selectedUserId
        );
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
      socket.to(groupId).emit("group-name-updated");
    });

    socket.on("join-room", ({ roomId }) => {
      socket.join(roomId);
    });
    socket.on(
      "group-member-removed",
      async ({ groupId, groupName, userId }) => {
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
      }
    );

    socket.on("group-deleted", async ({ groupId, groupName }) => {
      socket.to(groupId).emit("group-deleted", groupId);
      const userIds = (
        await User.find({ groupIds: groupId }).select("_id")
      ).map((el) => el._id);

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
};

module.exports = handleIoConnection;
