const {userJoin ,getCurrentUser ,userLeaves ,getRoomUsers} = require('./utils/users');
const formatMessage = require('./utils/messages');
const formatImageMessage = require('./utils/images');

const process = require('process');
const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const botName = "Damk Memer";
//setting static folder
app.use(express.static(path.join(__dirname, 'public')));


//run when client connects
io.on('connection', socket => {


    socket.on('joinRoom',({username,room}) => {

        const user = userJoin(socket.id,username,room);

        socket.join(user.room);
        if(user.room == "MemeShowdown"){
            socket.emit('message',formatMessage(botName,"Sumbmit your memes amd tympe !judgememe"));
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
        var string1 = `!judgememe`;
        if(!string1.localeCompare(msg)){
            //const something = formatMessage(botName,"gimme a minute evaluating...");
            io.to(user.room).emit('message',formatMessage(user.username,msg));
            io.to(user.room).emit('message',formatMessage(botName,"gimme a minute evaluating..."));
            io.to(user.room).emit('evaluate',formatMessage(user.username,"evaluate"));
        }else{
            io.to(user.room).emit('message',formatMessage(user.username,msg));
        }
        
    });


    //Listen for image transfers
    socket.on('upload',(msg) => {
        const user = getCurrentUser(socket.id);
        console.log(`File name recieved`);
        console.log(typeof(msg));
        io.to(user.room).emit('image',formatImageMessage(user.username,msg));

    });

    socket.on('result',(result) => {
        console.log(result[0]);
        const percent = result[0]*100;
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message',formatMessage(botName,`${user.username} your meme is ${percent}% cheemsy`));
    })

    socket.on('errors',(msg) => {
        const user = getCurrentUser(socket.id);
        if(msg == "ERROR_IMAGE_NOT_FOUND"){
            io.to(user.room).emit('message',formatMessage(botName,`${user.username} Pleams upload an image firmst`));
        }
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
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on ${PORT}`));   
