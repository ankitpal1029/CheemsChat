const users = [];

//join user to chat
function userJoin(id,username,room){
    const user = {id , username , room};
    users.push(user);
    return user;
}

//get current user
function getCurrentUser(id){
    return users.find(user => user.id === id);
}

//user leaves
function userLeaves(id){
    const userleft = users.findIndex(user => user.id === id);
    if(userleft !== -1){
        return users.splice(userleft,1)[0];
    }

}

//Get room users
function getRoomUsers(room){
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeaves,
    getRoomUsers
}
