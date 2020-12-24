const {userJoin ,getCurrentUser } = require('./utils/users');
const formatMessage = require('./utils/messages');

const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const botName = "Dank Memer";
//setting static folder
app.use(express.static(path.join(__dirname, 'public')));

//run when client connects
io.on('connection', socket => {


    socket.on('joinRoom',({username,room}) => {

        const user = userJoin(socket.id,username,room);

        socket.join(user.room);

        console.log('New Connection established .... ');
        socket.emit('message',formatMessage(botName,"welcome to chat"));

        //broadcast when user joins chat
        socket.broadcast.to(user.room).emit('message',formatMessage(botName,`${user.username} has joined the chat`));

    });


    //Listen for chatmessage
    socket.on('chatMessage',(msg) => {
        const user = getCurrentUser(socket.id);
        console.log(msg);
        io.to(user.room).emit('message',formatMessage(user.username,msg));
    });


    //when someone disconnects
    socket.on('disconnect', () => {
        io.emit('message',formatMessage(botName,"user just rage quit the chat"));
    });
});

const PORT = 5000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on ${PORT}`));   
