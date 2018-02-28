
const fs = require('fs');
var waitingList = {};  
var leaderboard; 

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
    if(leaderboard[id] == undefined) leaderboard[id] = "00:00:00";    
    timer(id);
}

function stop(id) {
    clearTimeout(waitingList[id].timer);
}


function clear(id) {
    delete waitingList[id];
}

function sortLeaderboard() {
    var arr = [];
    for(var id in leaderboard) {        
        arr.push({[id]:leaderboard[id]});
    }    
    var re = /:/g;
    var newArr = arr.sort(function(a,b) {
        var timeA = parseInt(Object.values(a)[0].replace(re,"")); 
        var timeB = parseInt(Object.values(b)[0].replace(re, ""));            
        return timeB - timeA;
    });
    return newArr;
}



module.exports = {
    name: 'ketaootetaan',
    description: 'KETÄ OOTETAAN?',

    execute(message, args, client) 
    {    	    
        fs.readFile('./leaderboards/leaderboard_KO.json', (err, data) => {
           if(err) throw err; 
           leaderboard = JSON.parse(data);
           
            if(args == "leaderboard") {
                var arr = sortLeaderboard();                
                var embed = {
                  "title": "**Ketaootetaan Leaderboard**",
                  "fields": []
                };
                
                for(let i = 0; i < arr.length; i++) {
                    let id = Object.keys(arr[i])[0];   
                    var username = "";
                    try{username = client.users.get(id).username;}catch(error){}
                    if(!username) username = "User not found";
                    embed["fields"].push({"name": "#"+(i+1), "value": username + " - " + Object.values(arr[i])[0]});
                }
                message.channel.send({ embed });                               
                return;
            }
            
            var user = message.mentions.members.first();
            if(!user) {
                message.channel.send("ei sitä komentoa noin käytetä");
                return;
            }
            var id = user.user.id;        
            if(user.voiceChannel !== undefined && message.member.voiceChannel.id == user.voiceChannel.id) {
                message.channel.send(user + " on jo kanavalla");
                return;
            }
            if(waitingList[id]) {
                message.channel.send("henkilöä " + user + " ootetaan jo");
                return;
            }
            start(id);                
            var interval = setInterval(function() {
                leaderboard[id] = waitingList[id].clock;
                
                fs.writeFile('./leaderboards/leaderboard_KO.json', JSON.stringify(leaderboard), (err) => {  
                    if (err) throw err;                    
                });
            },60000);            
            var listener;        
            
            client.on('voiceStateUpdate', listener = (oldMember, newMember) => 
            {
              let newUserChannel = newMember.voiceChannel
              let oldUserChannel = oldMember.voiceChannel


              if(oldUserChannel === undefined && newUserChannel !== undefined) {
                  if(newUserChannel.members.get(id)) {
                      stop(id);
                      message.channel.send("henkilöä "+ user + " ootettiin joku " + waitingList[id].clock);
                      clearInterval(interval);
                      var timeBefore = leaderboard[id].split(":");                      
                      var seconds = parseInt(timeBefore[2]) + waitingList[id].time.seconds;                      
                      var minutes = parseInt(timeBefore[1]) + waitingList[id].time.minutes;
                      var hours = parseInt(timeBefore[0]) + waitingList[id].time.hours;
                      if(seconds >= 60) minutes++;
                      if(minutes >= 60) hours++;
                      var timeAfter = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + 
                                    (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + 
                                    (seconds > 9 ? seconds : "0" + seconds);
                      leaderboard[id] = timeAfter;
                      fs.writeFile('./leaderboards/leaderboard_KO.json', JSON.stringify(leaderboard), (err) => {  
                            if (err) throw err;                            
                        });
                      clear(id);
                      client.removeListener("voiceStateUpdate", listener);
                  }
                   
              } 
            })
        });
        
    },
};