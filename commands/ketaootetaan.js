
var seconds = 0, minutes = 0, hours = 0,
    t, clock;

function add() {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }
    }
    
    clock = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);

    timer();
}
function timer() {
    t = setTimeout(add, 1000);
}



function start() {
    timer();
}


function stop() {
    clearTimeout(t);
}


function clear() {
    seconds = 0; minutes = 0; hours = 0;
}



module.exports = {
    name: 'ketaootetaan',
    description: 'KETÄ OOTETAAN?',

    execute(message, args, client) 
    {    	                
        var user = message.mentions.members.first();
        /*console.log(message.member.voiceChannel);
        console.log(user.voiceChannel);
        console.log(message.member.voiceChannel.get("id") == user.voiceChannel.get("id"));*/
        if(user.voiceChannel !== undefined && message.member.voiceChannel.id == user.voiceChannel.id) {
            message.channel.send(user + " on jo kanavalla");
            return;
        }
        start();
        var listener;        
        
		client.on('voiceStateUpdate', listener = (oldMember, newMember) => 
        {
          let newUserChannel = newMember.voiceChannel
          let oldUserChannel = oldMember.voiceChannel
          /*console.log(client);
          console.log("=============");
          console.log(oldMember);
          console.log("Event listener on käynnissä");
          console.log(newUserChannel);
          console.log("====================");
          console.log(user);
          console.log("!!!!!!!!!!!!!!!!!");
          console.log(user.user.id);
          console.log("--------------");
          console.log(newUserChannel.members.get(user.user.id));
          console.log(newUserChannel.members.get("1241241"));*/

          if(oldUserChannel === undefined && newUserChannel !== undefined) {
              if(newUserChannel.members.get(user.user.id)) {
                  stop();
                  message.channel.send("henkilöä "+ user + " ootettiin joku " + clock);
                  clear();
                  client.removeListener("voiceStateUpdate", listener);
              }
             // User Joins a voice channel
             console.log("liityit äänikanavalle");                 
          } /*else if(){
              message.channel.send("");              
          }*/
        })
    },
};