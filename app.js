const express=require('express')
const session = require('express-session');
const dotenv=require("dotenv")
const cors=require("cors")
const cron = require('node-cron');
const http = require('http');
const path = require('path');
const index = require('./routers/index');
dotenv.config();
const app = express()
const db = require('./config/db');
const startCampaignScheduler = require('./scheduler');
const publicRedirectRoute = require('./routers/waLink');
const publicWidgetRoute = require('./routers/widget');
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

global._io = io;

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_room", (contactId) => {
    socket.join(contactId);
    console.log(`Socket ${socket.id} joined room: ${contactId}`);
  });

  socket.on("leave_room", (contactId) => {
    socket.leave(contactId);
    console.log(`Socket ${socket.id} left room: ${contactId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.use(cors())

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

// startCampaignScheduler();

const buildPath = path.join(__dirname, './client','dist')
app.use(express.static(buildPath))
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname,'./client','dist',"index.html"));
});

const PORT=8000 ||8000
server.listen(PORT,()=>{
     console.log(`server is running at port no ${PORT}`);
 })