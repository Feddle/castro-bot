const Discord = require("discord.js");
const client = new Discord.Client();
var auth = require('./auth.json');

var commands = ["ketaootetaan", "asd", "miika"];

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
    if (message.content.substring(0,1) == '!') {
        var args = message.content.substring(1).split(' ');
        var cmd = args[0];
        args = args.splice(1)

        // commandit
        switch(cmd)
        {
            //list of commands
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
        }
    }
  });

client.login(auth.token);