const chatForm = document.getElementById('chat-form');
const uploadImage = document.getElementById('image-upload');

import {predict} from './predict.js'
import {resizeImage} from './utilfunc.js'
import {outputImage,outputUsers,outputMessage,outputRoomName} from './render.js'


const socket = io();



//Get username and room
const {username , room} = Qs.parse(location.search,{
    ignoreQueryPrefix:true
});


//Get room and users
socket.on('roomusers',({room,users}) => {
    outputRoomName(room);
    outputUsers(users);
});



// join room
socket.emit('joinRoom',{username,room});

//message fromm server
socket.on('message',message => {
    console.log('should get ');
    outputMessage(message);
    if(message.text == "!judgememe"){
        console.log('evaluation has started');
    }
});

//Image from server
socket.on('image', msg => {
    outputImage(msg);
})

//server evaluating message
socket.on('evaluate',async (message) => {
   //prediction has to start
    
    const chatImages = document.getElementsByClassName('imagePreview');
    if(chatImages.length < 1){
        console.log('upload an image first');
        socket.emit('errors',"ERROR_IMAGE_NOT_FOUND");
    }else{

        var user = message.user;
        var image;
        const length = chatImages.length;

        //checking if this is the user who requested !judgememe to prevent tf.js from running
        if(user == username){

            for(var i= length -1;i>=0;i--){
                if(user == chatImages[i].parentNode.childNodes[1].querySelector(".user").innerText){
                    image = chatImages[i];
                    break;
                }
            }
            const result = await predict(image) ;
            console.log(result)
            socket.emit('result',result[0]);
        }
    }
});


chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //get message text
    const msg = e.target.elements.msg.value;
    //emitting to a server
    socket.emit('chatMessage',msg);
    //clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();


});

// upload image
uploadImage.addEventListener('change',async (e) => {
    var data = e.target.files[0];
    //var reader = new FileReader();
    

    if(data){
        const reader = new FileReader();

        reader.addEventListener("load", function(){
            resizeImage(this.result,400,400).then((result) => {
            socket.emit('upload',result);
            })
        });
        
        reader.readAsDataURL(data)
    }
});
