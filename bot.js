const Discord = require("discord.js");
const client = new Discord.Client();
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;


const { prefix, token } = require('./config.json');

var commands = ["ketaootetaan","miika","cyanide", "lmao"];

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

function getStreamer(u = "https://wind-bow.glitch.me/twitch-api/streams/cyanideplaysgames") {
    
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
              
              textResponse = displayName + " is streaming " + game + "-" + status + "\n" + link;
              
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
* uudelle komennolle luodaan uusi case, casen nimi on commandin nimi
*/

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
    else if (message.content.startsWith(`${prefix}cyanide`)) 
    {
        var text = getStreamer();
        message.channel.send(text);
    }
    else if (message.content.startsWith(`${prefix}lmao`)) 
    {
        message.channel.send('LMFAO!');
    }
});

client.login(token);