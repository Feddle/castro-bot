
const axios = require('axios');
const util = require('util');

const { pastebinKey } = require(`${__dirname }/../config.json`);
const querystring = require('querystring');
const logger = require('../logger.js');

module.exports = {
  name: 'print',
  description: 'Posts a pastebin link containing the discord.js object (message/user/guild/channel) of the given type for the given id.',
  usage: '[type] [id]',
  execute(message, args, client) {
    const types = ['message', 'user', 'guild', 'channel'];
    if (!types.includes(args[0])) { message.channel.send('ei sitä komentoa noin käytetä'); return; }

    const ch = message.channel.id;

    getSnowflake(args, client, ch)
      .then(snowflake => getPastebin(snowflake))
      .then((link) => {
        if (link) message.channel.send(link);
        else logger.error('Pastebin link was empty');
      });
  },
};

async function getSnowflake(args, client, ch) {
  let obj;
  switch (args[0]) {
    case 'message': obj = getMessage(args[1], client, ch); break;
    case 'user': obj = getUser(args[1], client, ch); break;
    case 'guild': obj = getGuild(args[1], client, ch); break;
    case 'channel': obj = getChannel(args[1], client, ch); break;
  }
  return await obj;
}

/**
 * Posts object to pastebin and returns the pastebin link
 * @param {Object} snowflake - discord collection object, not really a discord snowflake
 * @returns {string} url for the pasted object
 */
async function getPastebin(snowflake) {
  const api = 'https://pastebin.com/api/api_post.php';
  // Muutetaan objecti luettavaan muotoon
  const snowflakeString = util.inspect(snowflake);
  const parameters = {
    api_dev_key: pastebinKey,
    api_option: 'paste',
    api_paste_code: snowflakeString,
    api_paste_format: 'json',
    api_paste_private: 1,
    api_paste_expire_date: '1D',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  };
  const pastebin = axios.post(api, querystring.stringify(parameters))
    .then(response => response.data)
    .then(data => data);

  return await pastebin;
}

/**
 * Fetches message by given id and channel
 * @param {string} id - message id
 * @param {Object} client - discord client
 * @param {string} ch - channel to search the message from
 * @returns {Object} discord message
 */
async function getMessage(id, client, ch) {
  const res = client.channels.get(ch).fetchMessage(id)
    .then(message => message)
    .catch((err) => { logger.error(err); return 'Ei löytynyt viestiä'; });
  return await res;
}

/**
 * Fetches discord user by given id
 * @param {string} id - discord user id
 * @param {Object} client - discord client
 * @returns {Object} discord user
 */
function getUser(id, client) {
  const user = client.users.get(id);
  if (!user) return 'Ei löytynyt käyttäjää';
  return user;
}

/**
 * Fetches discord guild (server) by given id
 * @param {string} id - guild id
 * @param {Object} client - discord client
 * @returns {Object} discord guild
 */
function getGuild(id, client) {
  const guild = client.guilds.get(id);
  if (!guild) return 'Ei löytynyt kiltaa';
  return guild;
}

/**
 * Fetches discord channel by given id
 * @param {string} id - channel id
 * @param {Object} client - discord client
 * @returns {Object} discord channel
 */
function getChannel(id, client) {
  const channel = client.channels.get(id);
  if (!channel) return 'Ei löytynyt kanavaa';
  return channel;
}
