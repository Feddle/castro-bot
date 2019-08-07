const fs = require('fs');
const Discord = require('discord.js');

const { prefix, token } = require(`${__dirname}/config.json`);

/* Create /logs if it does not exist */
const logPath = `${__dirname}/logs`;
if (!fs.existsSync(logPath)) fs.mkdirSync(logPath);

const logger = require(`${__dirname}/logger.js`);

const t0 = process.hrtime();


const client = new Discord.Client();
client.commands = new Discord.Collection();

/* Create /leaderboards if it does not exist */
const leaderboardsPath = `${__dirname}/leaderboards`;
if (!fs.existsSync(leaderboardsPath)) fs.mkdirSync(leaderboardsPath);

const commandFiles = fs.readdirSync(`${__dirname}/commands`);

for (const file of commandFiles) {
  const command = require(`${__dirname}/commands/${file}`);

  // set a new item in the Collection
  // with the key as the command name and the value as the exported module
  client.commands.set(command.name, command);
}


/**
 * Removes crash.log
 * @return {Object} {err:} if error, else {}
 */
function removeCrashLog() {
  logger.info('Removing crash.log');
  fs.unlink(`${__dirname}/logs/crash.log`, (err) => {
    if (err) {
      const errorMsg = `Could not remove crash.log: ${err}`;
      logger.error(errorMsg);
      return { err: errorMsg };
    }
    logger.info('Removed crash.log');
    return {};
  });
}

/**
 * Parses data to JSON and returns crash stack if succesful otherwise returns error
 * @todo Test to see if data object has something more that could be used
 * @param {string} data - data to parse
 * @return {Object} {err:} if error, else {stack:}
 */
function parseCrashLog(data) {
  let crashStack;
  let errorMsg;
  try {
    crashStack = JSON.parse(data).stack;
  } catch (err) {
    errorMsg = `Could not parse crash.log: ${err}`;
    logger.error(errorMsg);
    logger.debug(`crash.log: ${data}`);
    removeCrashLog();

    return { err: errorMsg };
  }
  return { stack: crashStack };
}

/**
 * Reads crash.log and returns it's contents
 * Returns error if unsuccesful
 * @return {Object} {err:} if error, else {data:}
 */
function readCrashLog() {
  fs.readFile(`${__dirname}/logs/crash.log`, (readErr, data) => {
    if (readErr) {
      const errorMsg = `Could not read crash.log: ${readErr}`;
      logger.warn(errorMsg);
      return { err: errorMsg };
    }
    return { data };
  });
}

/**
 * Renames crash.log to [date]-crash.log
 * @return {Object} {err:} if error, else {}
 */
function renameCrashLog() {
  const date = new Date().toISOString().replace(/:/g, '-');
  fs.rename(
    `${__dirname}/logs/crash.log`,
    `${__dirname}/logs/${date}-crash.log`,
    (err) => {
      if (err) {
        const errorMsg = `Error renaming crash.log: ${err}`;
        logger.error(errorMsg);
        return { err: errorMsg };
      }
      return {};
    },
  );
}

/**
 * Handles the previous crash by creating [date]-crash.log and sending the stack to given channel
 * @todo Test this
 * @param {string} - id of the channel to report the stack to
 */
async function handlePreviousCrash(channel) {
  /* Read crash.log */
  const readResult = await readCrashLog();
  if (readResult.err) {
    logger.error(readResult.err);
    removeCrashLog();
    client.channels
      .get(channel)
      .send(`crash.log was found but could not be read: ${readResult.err}`);
    return;
  }

  /* Parse crash.log */
  const parseResult = parseCrashLog();
  if (parseResult.err) {
    logger.error(parseResult.err);
    removeCrashLog();
    client.channels
      .get(channel)
      .send(`crash.log was found but could not be parsed: ${parseResult.err}`);
    return;
  }

  /* Report stack */
  client.channels
    .get(channel)
    .send(`Kaadoit botin, tässä pino: \n\`\`\`\n${parseResult.stack}\`\`\``);

  /* Rename crash.log */
  const renameResult = renameCrashLog();
  if (renameResult.err) {
    logger.error(renameResult.err);
    removeCrashLog();
    client.channels
      .get(channel)
      .send(`crash.log was found but could not be renamed: ${renameResult.err}`);
  }
}


/**
 * Returns random positive integer
 * @todo if more fucntions like these are needed move this to utils.js
 * @param {number} max - maximum value for the random integer
 */
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

/**
 * Replies to good bot
 * @todo This and reply sad can propably be combined
 * @param {Object} message message object that will be replied to
 */
function replyHappy(message) {
  const castroE = client.emojis.find('name', 'castro').toString();
  const arr = [':)', ':3', ';^)', castroE];
  message.channel.send(arr[getRandomInt(arr.length)]);
}

/**
 * Reply for, if user responded to replySad
 * @todo Finish this doc
 * @todo Check and maybe rewrite this
 * @param {Object} message message object that will be replied to
 * @param {string} reply
 */
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

/**
 * Replies to vitun bot
 * @param {Object} message - message object that will be replied to
 */
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

// Client Handlers

client.on('error', (e) => {
  logger.error(e);
});

client.on('ready', () => {
  // dividing by 1000000 gives milliseconds from nanoseconds
  const timeInMilliseconds = process.hrtime(t0)[1] / 1000000;
  logger.info(`Startup took ${timeInMilliseconds} milliseconds.`);
  logger.info(`Logged in as ${client.user.tag}`);

  const crashReportChannel = '423839512666439692';
  if (fs.existsSync(`${__dirname}/logs/crash.log`)) handlePreviousCrash(crashReportChannel);
});

client.on('message', (message) => {
  const vitunRegex = /(vitun[\s]bot)/;
  const goodRegex = /(good[\s]bot)/;
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
