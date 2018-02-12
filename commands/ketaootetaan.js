
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

function listener(client) 
{	
	client.on('voiceStateUpdate', (oldMember, newMember) => 
	{
	  let newUserChannel = newMember.voiceChannel
	  let oldUserChannel = oldMember.voiceChannel
	  console.log("Event listener on käynnissä");


	  if(oldUserChannel === undefined && newUserChannel !== undefined) 
	  {

	     // User Joins a voice channel
	     console.log("liityit äänikanavalle");
	  } 
	  else if(newUserChannel === undefined)
	  {
	    // User leaves a voice channel
	     console.log("lähdit äänikanavalta");
	  }
	})
}


module.exports = {
    name: 'ketaootetaan',
    description: 'KETÄ OOTETAAN?',

    execute(message, args, client) 
    {    	
        //console.log(client);
		//kaivaa objektista käyttäjänimen ja Id:n
        var user = message.mentions.members.first();
        var userId = message.mentions.members.first().id;
		message.channel.send("henkilöä " + user + " ootetaan."); 
		//start();
		listener(client);



    },
};