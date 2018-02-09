const Discord = require("discord.js");
const client = new Discord.Client();
const {prefix, token} = require('./config.json');
const fetch = require('node-fetch');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});


function getStreamer(twitchUser, url = "https://wind-bow.glitch.me/twitch-api/streams/" + twitchUser ) {

    return fetch(url)
      .then(handleTwitchResponse)      
      .catch(error => console.log(error));     
      
}

function handleTwitchResponse(response) {
    var textResponse;
    return response.json()
        .then(json => {
          if (response.ok) {
            if(json["stream"] == null) {                
                var link = json["url"];            
                var displayName = json["display_name"];
                var logo = json["logo"];                      
                textResponse = displayName + " is offline";
                return textResponse;      
            } else {
                var link = json["stream"]["channel"]["url"];
                var game = json["stream"]["channel"]["game"];
                var status = json["stream"]["channel"]["status"];
                var displayName = json["stream"]["channel"]["display_name"];
                var logo = json["stream"]["channel"]["logo"];    
                textResponse = displayName + " is streaming " + game + "\n" + status + "\n" + link;            
                return textResponse;
            }
          } else {
            return Promise.reject(Object.assign({}, json, {
              status: response.status,
              statusText: response.statusText
            }))
          }
        })
}



/*
---------- commands --------------
* uusi komento: kopioi uusi else if rakenne ja täytä
*/

// Tähän lisätään aina uudet commandit niin näkyy !commands listassa.
var commands = ["ketaootetaan","miika", "twitch <username>"];

client.on('message', message => 
{

    if (message.content.startsWith(`${prefix}commands`)) 
    {
        message.channel.send(commands.toString());
    }
    else if (message.content.startsWith(`${prefix}ketaootetaan`)) 
    {
        message.channel.send('Roopea odotettu joku 4h kohta.');
    }
    else if (message.content.startsWith(`${prefix}miika`)) 
    {
        message.channel.send('Miika on homo.');
    }
    else if (message.content.startsWith(`${prefix}twitch`)) 
    {
        // Extract twitch user from command
        var sentence = message.content.split(' ');
        var twitchUser = sentence[1];

        getStreamer(twitchUser).then(response => message.channel.send(response));        
    }
});

client.login(token);