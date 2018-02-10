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


// command execution 
client.on('message', message =>
{
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) return;

    try
    {
        client.commands.get(command).execute(message, args);
    }

    catch (error) 
    {
        console.error(error);
        message.reply('noob fix ur shit');
    }
});

client.login(token);