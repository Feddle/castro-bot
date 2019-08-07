const fs = require('fs');
const Discord = require('discord.js');

const { prefix, token } = require(`${__dirname }/config.json`);
const logger = require(`${__dirname}/logger.js`);

const t0 = process.hrtime();


const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync(`${__dirname}/commands`);

for (const file of commandFiles) {
  // require the command file
  const command = require(`${__dirname}/commands/${file}`);

  // set a new item in the Collection
  // with the key as the command name and the value as the exported module
  client.commands.set(command.name, command);
}

client.on('error', (e) => {
  logger.error(e);
});

// Check if there was a crash, try to print the stack and rename the file
client.on('ready', () => {
  // dividing by 1000000 gives milliseconds from nanoseconds
  const timeInMilliseconds = process.hrtime(t0)[1] / 1000000;
  logger.info(`Startup took ${timeInMilliseconds} milliseconds.`);
  logger.info(`Logged in as ${client.user.tag}`);

  fs.readFile(`${__dirname}/logs/crash.log`, (err, data) => {
    if (err) logger.warn(`Could not read crash.log: ${err}`);
    else {
      try {
        var d = JSON.parse(data).stack;
      } catch (err) {
        logger.error(`Could not parse crash.log: ${err}`);
        logger.info(`Removing crash.log\n${data}`);
        fs.unlink(`${__dirname}/logs/crash.log`, (err) => {
          if (err) logger.error(`Could not remove crash.log:${err}`);
          else logger.info('Removed crash.log');
          d = 'Error parsing crash log';
        });
      }
      if (!d) d = 'something went wrong :(';
      client.channels
        .get('423839512666439692')
        .send(`Kaadoit botin, tässä pino: \n\`\`\`\n${d}\`\`\``);
      const date = new Date().toISOString().replace(/:/g, '-');
      fs.rename(
        `${__dirname}/logs/crash.log`,
        `${__dirname}/logs/${date}-crash.log`,
        (err) => {
          if (err) logger.error(`Error renaming crash.log: ${err}`);
        },
      );
    }
  });
});

const vitunRegex = /(vitun[\s]bot)/;
const goodRegex = /(good[\s]bot)/;

client.on('message', (message) => {
  if (message.content.toLowerCase().match(goodRegex)) {
    replyHappy(message);
    return;
  }
  if (message.content.toLowerCase().match(vitunRegex)) {
    replySad(message);
    return;
  }
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName)
    || client.commands.find(
      cmd => cmd.aliases && cmd.aliases.includes(commandName),
    );

  if (!command) return;

  if (command.args && !args.length) {
    let reply = "You didn't provide any arguments!";

    if (command.usage) {
      reply += `\nThe proper usage would be: 
        \`${prefix}${command.name} ${command.usage}\``;
    }
    message.channel.send(reply);
  }

  try {
    command.execute(message, args, client);
  } catch (error) {
    logger.info(`Could not execute a command: ${error}`);
    message.reply('fix your shit noob');
  }
});

client.login(token);

function replyHappy(message) {
  const castroE = client.emojis.find('name', 'castro').toString();
  const arr = [':)', ':3', ';^)', castroE];
  message.channel.send(arr[getRandomInt(arr.length)]);
}

function replySad(message) {
  const castroE = client.emojis.find('name', 'castro').toString();
  const mullekoalatE = client.emojis.find('name', 'mullekoalat').toString();
  const arr = [
    ':(',
    mullekoalatE,
    ':3',
    'haluutko turpaas',
    'No ite vittu koodasit :D homo :Dd',
    castroE,
  ];
  const reply = arr[getRandomInt(arr.length)];
  message.channel.send(reply);
  setTimeout(replyTurpaas, 500, message, reply);
}

/* Reply for if user responded to replySad */
/* TODO: This is not the way to make a chat bot */
function replyTurpaas(message, reply) {
  if (reply === 'haluutko turpaas') {
    const listener = (msg) => {
      switch (msg.content) {
        case 'en':
          message.channel.send('saat silti');
          client.removeListener('message', listener);
          break;
        case 'homo':
          message.channel.send('ite oot');
          client.removeListener('message', listener);
          break;
        default:
          client.removeListener('message', listener);
      }
    };
    client.on('message', listener);
  }
}

/* Returns random positive integer */
/* TODO: if more fucntions like these are needed move this to utils.js */
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
