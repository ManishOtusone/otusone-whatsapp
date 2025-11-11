const express = require('express');
const session = require('express-session');
const dotenv = require("dotenv");
const cors = require("cors");
const cron = require('node-cron');
const http = require('http');
const path = require('path');

dotenv.config();

const app = express();
const db = require('./config/db');
const startCampaignScheduler = require('./scheduler');

const index = require('./routers/index');
const publicRedirectRoute = require('./routers/waLink');
const publicWidgetRoute = require('./routers/widget');

const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: { origin: "*" },
});
global._io = io;

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_room", (contactId) => {
    socket.join(contactId);
  });

  socket.on("leave_room", (contactId) => {
    socket.leave(contactId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.use(cors({
  origin: "*",
}));

app.use(
  session({
    secret: 'WSDMKDWK274YXMIWJRW83MMIQMNUR32MUEHEJ',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.json());

app.use('/wa-link', publicRedirectRoute);
app.use('/widget', publicWidgetRoute);
app.use('/api/v1', index);

const buildPath = path.join(__dirname, 'client', 'dist');
app.use(express.static(buildPath));

app.get("/*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
