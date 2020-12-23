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
io.on('connection', socket => {
    console.log('New Connection established .... ');
    socket.emit('message',"welcome to chat");

    //broadcast when user joins chat
    socket.broadcast.emit('message','User has joined the chat');

    //when someone disconnects
    socket.on('disconnect', () => {
        io.emit('message','user just rage quit the chat');
    });

    //Listen for chatmessage
    socket.on('chatMessage',(msg) => {
        console.log(msg);
        io.emit('message',msg);
    });
});

const PORT = 5000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on ${PORT}`));   
