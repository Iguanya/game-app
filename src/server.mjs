import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import { Server as socketIo } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.mjs';
import characterRoutes from './controllers/character.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new socketIo(server);

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../public')));

app.use('/auth', authRoutes);
app.use('/characters', characterRoutes);

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('createRoom', (room) => socket.join(room));
  socket.on('joinRoom', (room) => socket.join(room));
  socket.on('disconnect', () => console.log('Client disconnected'));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

process.on('SIGINT', () => {
  console.log("Shutting down server...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
