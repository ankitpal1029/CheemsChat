const moment = require('moment');

function formatImageMessage(user, image){
    return{
        user,
        image,
        time:moment().format('h:mm a')
    }
    
}

module.exports = formatImageMessage;
