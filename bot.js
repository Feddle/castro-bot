const Discord = require('discord.js');
const bot = new Discord.Client();
var auth = require('./auth.json');

bot.on('ready', () => {
  console.log('Ready');
});

bot.on('message', function (user, userID, channelID, message, evt) {

    // bot will listen for messages that start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
        args = args.splice(1);

        //commandit
        switch(cmd) {

            // !miika
            case 'miika':
                bot.sendMessage({
                    to: channelID,
                    message: 'Miika on homo.'
                });
            break;
         }
     }
});

bot.login(auth);