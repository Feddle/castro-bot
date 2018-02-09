const Discord = require("discord.js");
const client = new Discord.Client();
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;


//const config = require('./config.json');
const { prefix, token } = require('./config.json');

var commands = [];

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
        commands.push('ketaootetaan');
        message.channel.send('Roopea odotettu joku 4h kohta.');
    }
    else if (message.content.startsWith(`${prefix}miika`)) 
    {
        commands.push('miika');
        message.channel.send('Miika on homo.');
    }
    else if (message.content.startsWith(`${prefix}cyanide`)) 
    {
        commands.push('cyanide');
        var text = getStreamer();
        message.channel.send(text);
    }
});

/*
client.on('message', message => {
    if (message.content.substring(0,1) == '!')
    {
        var args = message.content.substring(1).split(' ');
        var cmd = args[0];
        args = args.splice(1)

        switch(cmd)
        {
            // !commands
            case 'commands' :
                message.channel.send(commands.toString());
                break;
        
            case 'ketaootetaan' :
                message.channel.send('Roopea odotettu joku 4h kohta.');
                commands.push('ketaootetaan');
                break;

            case 'asd' :
                message.channel.send('ASDASDASDASD');
                commands.push('asd');
                break;

            case 'miika' :
                message.channel.send('Miika on homo.');
                commands.push('miika');
                break;
            
            case 'cyanide' :
                var text = getStreamer();
                message.channel.send(text);
                commands.push('cyanide');
                break;
        }
    }
  });
  */

//client.login(config.token);
client.login(token);