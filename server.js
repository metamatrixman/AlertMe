const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { 
    origin: "*", 
    methods: ["GET", "POST"] 
  }
});

// Key: clientId, Value: { socketId, state, status, location }
const clients = {};

io.on('connection', (socket) => {
  const clientId = socket.handshake.query.clientId;
  
  if (!clientId || typeof clientId !== 'string') {
    console.log('Invalid client connection attempt');
    return socket.disconnect();
  }

  console.log(`📡 Client Online: ${clientId}`);

  // Initialize or update client record
  clients[clientId] = {
    id: clientId,
    socketId: socket.id,
    status: "Online",
    lastSeen: new Date().toISOString(),
    state: {}
  };

  // 1. Receive Initial Data from Client
  socket.on('CLIENT_SNAPSHOT', (data) => {
    if (clients[clientId]) {
      clients[clientId].state = data;
      clients[clientId].location = data.userData?.location || null;
      clients[clientId].lastSeen = new Date().toISOString();
      io.to('admin_room').emit('CLIENT_LIST_UPDATE', Object.values(clients));
      console.log(`📥 Snapshot received from ${clientId}`);
    }
  });

  // 2. Receive Real-time Updates
  socket.on('STATE_UPDATED', (data) => {
    if (clients[clientId]) {
      clients[clientId].state = { ...clients[clientId].state, ...data };
      clients[clientId].lastSeen = new Date().toISOString();
      io.to('admin_room').emit('CLIENT_LIST_UPDATE', Object.values(clients));
    }
  });

  // 3. Chat System: Message from Client
  socket.on('MESSAGE_TO_SERVER', (payload) => {
    console.log(`💬 Message from ${clientId}: ${payload.text}`);
    io.to('admin_room').emit('NEW_CHAT_MESSAGE', {
      clientId,
      text: payload.text,
      timestamp: payload.timestamp
    });
  });

  // 4. Admin Joining the Dashboard
  socket.on('JOIN_ADMIN', () => {
    socket.join('admin_room');
    console.log('Admin joined the dashboard');
    socket.emit('CLIENT_LIST_UPDATE', Object.values(clients));
  });

  // 5. Remote Control Command (Relay from Dashboard to PWA)
  socket.on('ADMIN_COMMAND', ({ targetId, action, payload }) => {
    const target = clients[targetId];
    if (target && target.status === "Online") {
      console.log(`📤 Sending command "${action}" to ${targetId}`);
      io.to(target.socketId).emit('command', { action, payload });
    } else {
      console.log(`⚠️ Target ${targetId} is not available`);
    }
  });

  socket.on('disconnect', () => {
    if (clients[clientId]) {
      clients[clientId].status = "Offline";
      clients[clientId].lastSeen = new Date().toISOString();
      io.to('admin_room').emit('CLIENT_LIST_UPDATE', Object.values(clients));
      console.log(`📴 Client Offline: ${clientId}`);
    }
  });

  // Error handling
  socket.on('error', (error) => {
    console.error(`Socket error for ${clientId}:`, error);
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    clients: Object.keys(clients).length,
    timestamp: new Date().toISOString()
  });
});

// Get all clients (REST alternative to socket event)
app.get('/api/clients', (req, res) => {
  res.json(Object.values(clients));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Shadow Server active on port ${PORT}`);
  console.log(`📊 Health check available at http://localhost:${PORT}/health`);
});
