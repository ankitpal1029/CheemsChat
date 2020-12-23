const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);


//setting static folder
app.use(express.static(path.join(__dirname, 'public')));

//run when client connects
io.on('connection', () => {
    console.log('New Connection established .... ');
});

const PORT = 5000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on ${PORT}`));   
