const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const socket = io();

//Get username and room
const {username , room} = Qs.parse(location.search,{
    ignoreQueryPrefix:true
});


//rendering text
function outputMessage (message){
    const div = document.createElement('div');
    div.classList.add('message');
    console.log(message);
    div.innerHTML = `
						<p class="meta">${message.user} <span>${message.time}</span></p>
						<p class="text">
                        ${message.text}
						</p>`;

    document.querySelector('.chat-messages').appendChild(div);

    //scroll to latest chat
    chatMessages.scrollTop = chatMessages.scrollHeight;

}


// join room
socket.emit('joinRoom',{username,room});

//message fromm server
socket.on('message',message => {
    console.log('should get ');
    outputMessage(message);
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

