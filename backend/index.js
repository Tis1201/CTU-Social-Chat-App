const express = require("express");
const app = express();

const cors = require("cors");
const connectDB = require("./src/config/database.config");
const usersRouter = require("./src/route/users.router");
const postsRouter = require("./src/route/post.router");
const authRouter = require("./src/route/auth.router");
const conversationRouter = require("./src/route/conversation.router");
const messageRouter = require("./src/route/message.router");
const path = require("path");
const helmet = require("helmet");
const compression = require("compression");
const http = require("http");
const socketSetup = require("./src/sockets/socket");
const bodyParser = require("body-parser");
const notificationRouter = require("./src/route/notification.router");
require("dotenv").config();

app.use(cors({
    origin: "*", // Thay bằng domain frontend
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(bodyParser.json({ limit: "10mb" })); // Thay '10mb' với giá trị tùy theo nhu cầu
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

connectDB();

//create server
const server = http.createServer(app);
socketSetup(server);

app.use("/users", usersRouter);

app.use("/avt", express.static(path.join(__dirname, "avt")));
app.use("/background", express.static(path.join(__dirname, "background")));

app.use("/posts", postsRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/auth", authRouter);
app.use("/conversations", conversationRouter);
app.use("/messages", messageRouter);
app.use("/notifications", notificationRouter);

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
