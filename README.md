# GiggleChat

Welcome to **GiggleChat**, a modern and intuitive real-time chat application that brings people closer together. Whether it's for personal or professional use, GiggleChat provides a seamless messaging experience with sleek design and robust features.

---

## 🔗 Links

- **GitHub Repository**: [GiggleChat](https://github.com/prajapatsachin7078/GiggleChat)
- **Live Demo**: [GiggleChat Hosted on Vercel](https://chat-app-git-main-sachin-prajapatis-projects.vercel.app)
- **Developer X Account**: [Sachin Prajapati](https://x.com/SPrajapati7078)

---

## 🚀 Features

- **Real-Time Messaging**: Exchange messages instantly using WebSockets.
- **Group Chat**: Create and manage group chats with ease.
- **User Authentication**: Secure sign-up, login, and logout functionality.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Notifications**: Get notified about new messages (browser notification support).
- **Message Read Receipts**: See when your messages are delivered and read.
- **Profile Management**: Update profile picture, name, and other details.
- **Modern UI**: Simplistic and intuitive design inspired by WhatsApp.

---

## 🛠️ Tech Stack

### **Frontend**
- **React.js**: For building a dynamic and responsive user interface.
- **Tailwind CSS**: For rapid and customizable styling.
- **Axios**: For making API requests.
- **React Router**: For client-side routing.

### **Backend**
- **Node.js**: Server-side JavaScript runtime.
- **Express.js**: Lightweight framework for API development.
- **MongoDB**: NoSQL database for storing user and chat data.
- **Socket.IO**: Real-time, bidirectional communication between client and server.

### **Hosting**
- **Vercel**: Hosting the frontend for seamless deployment.
- **Render/Heroku** *(optional)*: Hosting the backend server and database.

---

## 💻 Getting Started

### Prerequisites
Make sure you have the following installed:

- **Node.js**: [Download Here](https://nodejs.org)
- **MongoDB**: [Download Here](https://www.mongodb.com/try/download/community)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/prajapatsachin7078/GiggleChat.git
   cd GiggleChat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory and add the following:
   ```env
   PORT=5000
   MONGO_URI=<your_mongodb_connection_string>
   JWT_SECRET=<your_jwt_secret>
   SOCKET_PORT=5001
   SMTP_USER=<your_smtp_email>
   SMTP_PASSWORD=<your_smtp_password>
   ```

4. **Run the application**
   
   - Start the backend server:
     ```bash
     npm run server
     ```
   - Start the frontend:
     ```bash
     npm start
     ```

5. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Folder Structure

```
GiggleChat/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── server.js
│   └── package.json
├── .env
└── README.md
```

---

## ✨ Features in Detail

### **Real-Time Messaging**
- Built using **Socket.IO** for instant communication.
- Displays message statuses (sent, delivered, read).

### **Group Chat**
- Allows users to create and join group chats.
- Manage group participants.

### **User Authentication**
- Secure JWT-based authentication.
- Email verification with temporary password support.

### **Browser Notifications**
- Users are notified about new messages even when they are not active in the chat.

### **Profile Management**
- Update user profiles with avatars and personalized names.

---

## 📜 License

This project is licensed under the MIT License. Feel free to use, modify, and distribute as needed.

---

## 👤 Author

- **Sachin Prajapati**  
  - **GitHub**: [prajapatsachin7078](https://github.com/prajapatsachin7078)  
  - **X (Twitter)**: [@SPrajapati7078](https://x.com/SPrajapati7078)  

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to fork the repository and submit pull requests.

1. Fork the project.
2. Create your feature branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -m 'Add some YourFeature'`
4. Push to the branch: `git push origin feature/YourFeature`
5. Open a pull request.

---

## 🌟 Show Your Support

If you like this project, please give it a ⭐️ on [GitHub](https://github.com/prajapatsachin7078/GiggleChat)!
