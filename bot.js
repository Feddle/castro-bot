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


//---------- command execution --------------

// Lista komennoista, päivitetään aina kun tehdään uusi komento
var commandList = ["ketaootetaan", "miika ", "twitch <username> ", "avatar "];

client.on('message', message =>
{
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'ping') 
    {
        client.commands.get('ping').execute(message, args);
    }
    else if (command === 'commands') 
    {
        client.commands.get('commands').execute(message, args, commandList);
    }
    else if (command === 'ketaootetaan') 
    {
        client.commands.get('ketaootetaan').execute(message, args);
    }
    else if (command === 'miika') 
    {
        client.commands.get('miika').execute(message, args);
    }
    else if (command.startsWith(`twitch`)) 
    {
        client.commands.get('twitch').execute(message, args);         
    }
    else if (command === 'avatar')
    {
        client.commands.get('avatar').execute(message, args);
    }
});

client.login(token);