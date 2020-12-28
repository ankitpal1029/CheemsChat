const moment = require('moment');

function formatMessage(user, text){
    return{
        user,
        text,
        time:moment().format('h:mm a')
    }
    
}

//function formatEvaluateMessage(user,text,userOrigin)

module.exports = formatMessage;
