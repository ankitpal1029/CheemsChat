const userList = document.getElementById('users');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');

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


//rendering users in chat names
function outputUsers(users){
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    ` ;
}

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



//rendering room name
function outputRoomName(room){
    roomName.innerText = room;

}
export {outputImage,outputUsers,outputMessage,outputRoomName};
