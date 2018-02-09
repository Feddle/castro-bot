const Discord = require("discord.js");
const client = new Discord.Client();
var auth = require('./auth.json');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (message.substring(0,1) == '!')
  {
      var args = message.substring(1).split(' ');
      var cmd = args[0];

      args = args.splice(1);

      switch(cmd)
      {
          case 'ketaootetaan' :
            msg.reply('Mikkoo venattu joku 4h.');
            break;
      }
  }
});

client.login(auth.token);