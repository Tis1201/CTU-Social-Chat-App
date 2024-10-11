const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const connectDB = require('./src/config/database.config');
const usersRouter = require('./src/route/users.router');
const postsRouter = require('./src/route/post.router');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const http = require('http');
const socketSetup = require('./src/sockets/socket');
require('dotenv').config();


app.use(cors());
app.use(express.json())
app.use(helmet());
app.use(compression());

connectDB();

//create server
const server = http.createServer(app);
socketSetup(server);

app.use('/users', usersRouter);

app.use('/avt', express.static(path.join(__dirname, 'avt')));
app.use('/background', express.static(path.join(__dirname, 'background')));


app.use('/posts', postsRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
