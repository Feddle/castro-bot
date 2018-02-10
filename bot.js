// require node's file system module - https://nodejs.org/api/fs.html
const fs = require('fs');
const Discord = require("discord.js");
const {prefix, token} = require('./config.json');


//------command functionality--------

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands');

for (const file of commandFiles) {
    // require the command file
    const command = require(`./commands/${file}`);

    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
}


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});


// command handler
client.on('message', message =>
{
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName)
    || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (command.args && !args.length)
    {
        let reply = `You didn't provide any arguments!`;

        if (command.usage)
        {
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }
        return message.channel.send(reply);
    }

    try
    {
        command.execute(message, args);
    }

    catch (error) 
    {
        console.error(error);
        message.reply('fix your shit noob');
    }
});

client.login(token);