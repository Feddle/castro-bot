const fs = require('fs');
const Discord = require("discord.js");
const {
	prefix,
	token
} = require('./config.json');
const logger = require("./logger.js");

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
	logger.info("Logged in as " + client.user.tag);
	fs.readFile("./logs/crash.log", (err, data) => {
		if(err) logger.warn("Could not read crash.log: " + err);
		else {
			try {
				var d = JSON.parse(data);
			} catch(err) {
				logger.error("Could not parse crash.log: " + err);
				logger.info("Deleting crash.log\n" + data);
				fs.unlink("./logs/crash.log", (err) => {
					if(err) logger.error("Could not remove crash.log:" + err);
					logger.info("Removed crash.log");
				})
			}
			client.channels.get("423839512666439692").send("Kaadoit botin, tässä pino: \n" + "```\n" + d.stack + "```");
			let date = new Date().toISOString().replace(/:/g, "-");
			fs.rename("./logs/crash.log", "./logs/" + date + "-crash.log", function(err) {
				if (err) logger.error("Error renaming crash.log: " + err);			
			});
		}
	});
});

var vitunRegex = /(vitun[\s]bot)/;
var goodRegex = /(good[\s]bot)/;

client.on('message', message => {		
	if (message.content.toLowerCase().match(goodRegex))
		replyHappy(message);
	if (message.content.toLowerCase().match(vitunRegex))
		replySad(message);
	if (!message.content.startsWith(prefix) || message.author.bot)
		return;			

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName)
		 || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command)
		return;

	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}
		return message.channel.send(reply);
	}

	try {
		command.execute(message, args, client);
	} catch (error) {
		logger.info("Could not execute a command: " + error);
		message.reply('fix your shit noob');
	}
});


client.login(token);

function replyHappy(message) {	
	var castroE = client.emojis.find("name", "castro").toString();
	var arr = [":)", ":3", ";^)", castroE];
	message.channel.send(arr[getRandomInt(arr.length)]);
}

function replySad(message) {
	var castroE = client.emojis.find("name", "castro").toString();
	var mullekoalatE = client.emojis.find("name", "mullekoalat").toString();
	var arr = [":(", mullekoalatE, ":3", "haluutko turpaas", "No ite vittu koodasit :D homo :Dd", castroE];	
	var reply = arr[getRandomInt(arr.length)]
	message.channel.send(reply);
	setTimeout(replyTurpaas, 500, message, reply);	
}

function replyTurpaas(message, reply) {
	if(reply == "haluutko turpaas") {		
		var listener;
		client.on("message", listener = function(msg) {			
			switch (msg.content) {
				case "en":				
					message.channel.send("saat silti");
					client.removeListener("message", listener);
					break;			
				case "homo":
					message.channel.send("ite oot");
					client.removeListener("message", listener);
					break;
				default:
					client.removeListener("message", listener);
			}
		});
	}
}

function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}
