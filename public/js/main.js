const chatForm = document.getElementById('chat-form');
const socket = io();


function outputMessage (message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
						<p class="meta">Mary <span>9:15pm</span></p>
						<p class="text">
                        ${message}
						</p>`;

    document.querySelector('.chat-messages').appendChild(div);

}


socket.on('message',message => {
    outputMessage(message);
    console.log(message);
});

//message submit

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //get message text
    const msg = e.target.elements.msg.value;
    //emitting to a server
    socket.emit('chatMessage',msg);

});

