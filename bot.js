const Discord = require("discord.js");
const client = new Discord.Client();
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const { prefix, token } = require('./config.json');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

function getStreamer(twitchUser, u = "https://wind-bow.glitch.me/twitch-api/streams/" + twitchUser ) {
    
    var xhr = new XMLHttpRequest();
    xhr.open('GET', u, false);
    xhr.responseType = 'json';    
    var textResponse;
    xhr.onload = function(e) {
        if(xhr.readyState === 4) {
            if(xhr.status === 200) {
              var products = JSON.parse(xhr.responseText);                           

              var link = products["stream"]["channel"]["url"];
              var game = products["stream"]["channel"]["game"];
              var status = products["stream"]["channel"]["status"];
              var displayName = products["stream"]["channel"]["display_name"];
              var logo = products["stream"]["channel"]["logo"];
              
              textResponse = displayName + " is streaming " + game + " - " + status + "\n" + link;
              
            }
            else {
               console.error(xhr.statusText);
            }
        }
    };
    xhr.onerror = function (e) {
        console.error(xhr.statusText);
    };
    xhr.send();
    return textResponse;
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
        
        var text = getStreamer(twitchUser);
        message.channel.send(text);
    }
});

client.login(token);