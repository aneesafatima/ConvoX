# convoX - A Real-time Chat Application

**convoX** is a real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js) and Tailwind CSS. It allows users to communicate seamlessly in real-time through an intuitive interface, designed for a smooth experience across both web and mobile devices.

## 🚀 Features

### 🔑 Authentication
- **Sign up and Log in**: Secure user authentication to create new accounts and access chats.
- **User Settings**: Update user profile pictures.
- **Log out**: Log out securely for enhanced privacy control.

### 💬 Real-time Chat
- **Instant Messaging**: Send and receive messages in real-time without delays.
- **Online Status**: View which users are currently online.
- **Message Timestamps**: Timestamps are added to each message for clarity.
- **Persistent Chat History**: All chat data is saved and available when users log back in.

### 🗂 Chat Rooms
- **Multiple Chat Rooms**: Join or create group chat rooms for real-time discussions.
- **Private Messaging**: Send direct messages for private conversations.

### 🔔 Notifications (Received Upon Coming Online Again)
- **Message Notifications**: Receive notifications for new, unseen messages.
- **Offline Activity Notifications**: Get notified about actions that happened while you were offline, such as being added to or removed from a group, or when someone sends a message in your personal or group chats.
- **Alert for Removals**: Receive notifications when you are removed from contacts or kicked out of a group.

### 📬 Additional Features
- **File Sharing**: Share 📁 files, 🖼 images, and 📝 text messages within chats.
- **Message Reply**: Reply to specific messages, including text, images, and files.
- **Media Viewing**: View sent images and files directly in the chat.
- **Group Management**: Change group names and 📸 group pictures.
- **Message Deletion**: Delete messages with a "This message was deleted" indicator.
- **Delete Chats**: Remove entire chat histories between you and other users.
- **Remove Contacts**: Remove someone from your contact list.
- **Group Admin Controls**: 👑 Admins can remove users, add participants, or delete the group.

### 🎨 Responsive Design
- **Mobile & Desktop**: The application is fully responsive, providing a smooth user experience on both desktop and mobile devices.

## 🛠️ Main Technologies

- **Frontend**: React (with Vite) for building a dynamic and interactive UI.
- **Backend**: Node.js & Express for handling server-side logic.
- **Database**: MongoDB & Mongoose for managing chat and user data.
- **Real-time Communication**: Socket.io for enabling real-time messaging.
- **Styling**: Tailwind CSS for a sleek, responsive design.
- **Deployment**: Hosted on Render and Vercel for fast, scalable deployment.

## 📝 Process

The development process began with identifying core features like real-time messaging, chat rooms, and user authentication. The backend was built using **Node.js**, **Express**, and **MongoDB** to manage user data, chat messages, and authentication securely. Real-time messaging functionality was implemented using **Socket.io**, ensuring smooth communication between users.

The frontend was developed using **React** and **Tailwind CSS** to create a clean, responsive, and user-friendly interface. Key challenges included implementing efficient real-time communication and managing global state across different components, which was essential for ensuring a seamless chat experience. A special focus was placed on making the app scalable and user-friendly on both desktop and mobile.

## 🐛 Bugs & Future Improvements
While **convoX** functions well, it's far from perfect. As with any chat application, there are always features and improvements that can enhance the user experience. Some known areas that could be improved or added include:

- When you first log in or sign up, it may take a few minutes because the backend is hosted on a free server. The server goes into sleep mode when inactive and takes some time to wake up during login or signup.
- Occasional delay in real-time updates, especially when dealing with large media files.
- More advanced notification options, like custom sounds or muting specific conversations.
- Features such as voice messages, video chats, and richer media sharing are not yet implemented but could significantly improve the user experience.

Contributions are always welcome! If you have suggestions or would like to help make **convoX** better, feel free to open an issue or submit a pull request on the repository. Your feedback and support are appreciated in making this project even better. 

## 📁 Environment Setup

- **client**: A sample environment file is located in the `client` folder. It includes placeholders for environment variables used by the React application.
- **server**: A sample environment file is located in the `server` folder. It includes placeholders for environment variables used by the Node.js/Express application.

Please make sure to replace the placeholders in these `.env.sample` files with your actual values in the `.env` files to run the application successfully.

## 📁 Running the Project

### Client
1. Navigate to the `client` directory.
2. Create a `.env` file from the `.env.sample` file provided.
3. Replace the placeholders in the `.env` file with your actual values.
4. Install the required dependencies by running:
   ```bash
   npm install
5. Start the development server by running
   ```bash
   npm run dev

### Server 
1. Navigate to the `server` directory.
2. Create a `.env` file from the `.env.sample` file provided.
3. Replace the placeholders in the `.env` file with your actual values.
4. Install the required dependencies by running:
   ```bash
   npm install
5. Start the development server by running
   ```bash
   npm run start:dev
