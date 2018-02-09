const Discord = require("discord.js");
const client = new Discord.Client();
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;


var auth = require('./auth.json');

// uudet komennot pitää lisätä myös tähän
var commands = ["ketaootetaan", "asd", "miika", "cyanide"];

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

function getStreamer(u = "https://wind-bow.glitch.me/twitch-api/streams/cyanideplaysgames") {
    
    var xhr = new XMLHttpRequest();
    xhr.open('GET', u);
    xhr.responseType = 'json';
    xhr.send();
    
    xhr.onload = function() {

      //var products = JSON.parse(xhr.response);
      //var products = xhr.response;
      var products = JSON.parse(xhr.responseText);
      
      console.log(products);

      var link = products["stream"]["channel"]["url"];
      var game = products["stream"]["channel"]["game"];
      var status = products["stream"]["channel"]["status"];
      var displayName = products["stream"]["channel"]["display_name"];
      var logo = products["stream"]["channel"]["logo"];
      
      var textResponse = logo + " " + displayName + " is streaming " + game + "-" + status + "\n" + link;
      return textResponse;
    
    }
}

/*
---------- commands --------------
* uudelle komennolle luodaan uusi case, casen nimi on commandin nimi
*/
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
                break;

            case 'asd' :
                message.channel.send('ASDASDASDASD');
                break;

            case 'miika' :
                message.channel.send('Miika on homo.');
                break;
            
            case 'cyanide' :
                var text = getStreamer();
                message.channel.send(text);
                break;
        }
    }
  });

client.login(auth.token);