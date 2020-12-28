const {userJoin ,getCurrentUser ,userLeaves ,getRoomUsers} = require('./utils/users');
const formatMessage = require('./utils/messages');
const formatImageMessage = require('./utils/images');


const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const { type } = require('os');

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
            socket.emit('message',formatMessage(botName,"Sumbmit all your memes amd tympe !judgememe"));
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
        /*const png = sharp(msg)
            .resize({width:400,height:400})
            .png();
        
        console.log(typeof(buffer));

        io.to(user.room).emit('image',formatImageMessage(user.username,buffer));
            */

            /*sharp(output1)
                    .toBuffer()
                    .then((outputBuffer) => {
                        io.to(user.room).emit('image',formatImageMessage(user.username,outputBuffer));
                    })
                    */
        io.to(user.room).emit('image',formatImageMessage(user.username,msg));

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
