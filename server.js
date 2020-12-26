const {userJoin ,getCurrentUser ,userLeaves ,getRoomUsers} = require('./utils/users');
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
        if(user.room == "MemeShowdown"){
            socket.emit('message',formatMessage(botName,"Submit all your memes and type !judgeme (and i will decide who is nomie)"));
        }

        else{
            console.log('New Connection established .... ');
            socket.emit('message',formatMessage(botName,"welcome to chat"));
        }


        //broadcast when user joins chat
        socket.broadcast.to(user.room).emit('message',formatMessage(botName,`${user.username} has joined the chat`));

        //update users in room
        io.to(user.room).emit('roomusers',{
            room: user.room,
            users: getRoomUsers(user.room)
        });

    });


    //Listen for chatmessage
    socket.on('chatMessage',(msg) => {
        const user = getCurrentUser(socket.id);
        console.log(msg);
        io.to(user.room).emit('message',formatMessage(user.username,msg));
    });


    //Listen for image transfers
    socket.on('upload',(msg) => {
        const user = getCurrentUser(socket.id);
        console.log(`File name ${msg.fileName} recieved`);
        io.to(user.room).emit('image',msg);

    })


    //when someone disconnects
    socket.on('disconnect', () => {
        const user = userLeaves(socket.id);
        if(user){    
            io.to(user.room).emit('message',formatMessage(botName,`${user.username} just rage quit the chat`));

        //update users in room
        io.to(user.room).emit('roomusers',{
            room: user.room,
            users: getRoomUsers(user.room)
        });

        }
    });
});
const PORT = 5000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on ${PORT}`));   
