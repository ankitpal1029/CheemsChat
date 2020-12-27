const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const uploadImage = document.getElementById('image-upload');



async function predict (image){
    var result;
    let model = new cvstfjs.ClassificationModel();
    await model.loadModelAsync('../cheems/model.json');
    if(model){

        result = await model.executeAsync(image);
    }
    console.log(result);
}



const socket = io();
//rendering room name
function outputRoomName(room){
    roomName.innerText = room;

}

//rendering users in chat names
function outputUsers(users){
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    ` ;
}


//rendering text
function outputMessage (message){
    const div = document.createElement('div');
    div.classList.add('message');
    console.log(message);
    div.innerHTML = `
                    <p class="meta">	<span class="user">${message.user}</span> <span>${message.time}</span></p>
						<p class="text">
                        ${message.text}
						</p>`;

    document.querySelector('.chat-messages').appendChild(div);
//scroll to latest chat
    chatMessages.scrollTop = chatMessages.scrollHeight;

}


//rendering images
function outputImage (msg){
    const div = document.createElement('div');
    div.classList.add('message');

    div.innerHTML = `
                    <p class="meta">	<span class="user">${msg.user}</span> <span>${msg.time}</span></p>
						<img class="imagePreview" src=${msg.image}>
						`;
    document.querySelector('.chat-messages').appendChild(div);
    
    //scroll to latest chat
    chatMessages.scrollTop = chatMessages.scrollHeight;

}




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
socket.on('evaluate',(message) => {
    //outputMessage(message);
   //prediction has to start
    
    const chatImages = document.getElementsByClassName('imagePreview');
    console.log(chatImages[0].parentNode.childNodes[1].querySelector(".user").innerText);
    if(chatImages.length < 1){
        console.log('submit another meme');
    }else{
        var user = message.user;
        var image;
        const length = chatImages.length;
        for(var i= length -1;i>0;i--){
            if(user == chatImages[i].parentNode.childNodes[1].querySelector(".user").innerText){
                image = chatImages[i];
                break;
            }
        }
        console.log(image);
        predict(image) ;
//evaaluate
    }
});

//message submit

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
uploadImage.addEventListener('change',(e) => {
    var data = e.target.files[0];
    //var reader = new FileReader();
    

    if(data){
        const reader = new FileReader();

        reader.addEventListener("load", function(){
            socket.emit('upload',this.result);
        });

        reader.readAsDataURL(data)
    }
});
