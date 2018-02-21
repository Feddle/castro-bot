
var waitingList = {};    

function add(id) {    
    waitingList[id].time.seconds++;
    if (waitingList[id].time.seconds >= 60) {
        waitingList[id].time.seconds = 0;
        waitingList[id].time.minutes++;
        if (waitingList[id].time.minutes >= 60) {
            waitingList[id].time.minutes = 0;
            waitingList[id].time.hours++;
        }
    }
    
    waitingList[id].clock = (waitingList[id].time.hours ? (waitingList[id].time.hours > 9 ? waitingList[id].time.hours : "0" + waitingList[id].time.hours) : "00") + ":" + 
    (waitingList[id].time.minutes ? (waitingList[id].time.minutes > 9 ? waitingList[id].time.minutes : "0" + waitingList[id].time.minutes) : "00") + ":" + 
    (waitingList[id].time.seconds > 9 ? waitingList[id].time.seconds : "0" + waitingList[id].time.seconds);

    timer(id);
}
function timer(id) {
    waitingList[id].timer = setTimeout(add, 1000, id);    
}

function start(id) {
    waitingList[id] = {timer: undefined, time: {seconds: 0, minutes: 0, hours: 0}, clock: ""};
    timer(id);
}

function stop(id) {
    clearTimeout(waitingList[id].timer);
}


function clear(id) {
    delete waitingList[id];
}



module.exports = {
    name: 'ketaootetaan',
    description: 'KETÄ OOTETAAN?',

    execute(message, args, client) 
    {    	         
        var user = message.mentions.members.first();
        var id = user.user.id;
        console.log(waitingList);
        if(user.voiceChannel !== undefined && message.member.voiceChannel.id == user.voiceChannel.id) {
            message.channel.send(user + " on jo kanavalla");
            return;
        }
        if(waitingList[id]) {
            message.channel.send("henkilöä " + user + " ootetaan jo");
            return;
        }
        start(id);
        var listener;        
        
		client.on('voiceStateUpdate', listener = (oldMember, newMember) => 
        {
          let newUserChannel = newMember.voiceChannel
          let oldUserChannel = oldMember.voiceChannel


          if(oldUserChannel === undefined && newUserChannel !== undefined) {
              if(newUserChannel.members.get(id)) {
                  stop(id);
                  message.channel.send("henkilöä "+ user + " ootettiin joku " + waitingList[id].clock);
                  clear(id);
                  client.removeListener("voiceStateUpdate", listener);
              }
               
          } 
        })
    },
};