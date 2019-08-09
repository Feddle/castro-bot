const axios = require('axios');

const configPath = `${__dirname}/../config.json`;
const { twitchClientID } = require(configPath);
const logger = require('../logger.js');

const requestConf = {
  method: 'GET',
  headers: {
    'Client-ID': twitchClientID,
  },
};


/**
 * Returns an embed representing a twitch channel
 * @param {Object} stream - twitch response object
 * @returns {Object} discord embed object
 */
async function createEmbed(obj) {
  const { stream, channel, game } = obj;
  const url = `https://twitch.tv/${channel.display_name}`;
  const status = stream.type ? stream.title : 'Offline';
  const name = channel.display_name;
  const logo = channel.profile_image_url;

  const embed = {
    title: game,
    description: status,
    url,
    color: 7032241,
    thumbnail: {
      url: logo,
    },
    author: {
      name,
      url,
    },
  };
  return embed;
}

/**
 * Fetches twitch game name by id
 * @param {string} gameId - twitch game_id
 * @returns {string} name of the game
 */
async function getGame(gameId) {
  const games = `https://api.twitch.tv/helix/games?id=${gameId}`;
  const request = { ...requestConf, url: games };

  let gameResponse;
  try {
    gameResponse = await axios(request);
  } catch (httpErr) {
    logger.err(`Error fetching game: ${httpErr}`);
    return { err: 'Error fetching game' };
  }

  const gameJson = gameResponse.data;
  // If game was found
  if (gameJson.data.length > 0) {
    logger.info(`Fetched game: ${gameId}`);
    return gameJson.data[0].name;
  }

  return { err: `Could not find game ${gameId}` };
}

/**
 * Fetches information about the given users channel
 * @param {string} twitchUser - twitch username
 * @returns {Object} json representing the channel, {err} if error occured
 */
async function getChannel(twitchUser) {
  const channels = `https://api.twitch.tv/helix/users?login=${twitchUser}`;
  const request = { ...requestConf, url: channels };
  let channelResponse;
  try {
    channelResponse = await axios(request);
  } catch (httpErr) {
    logger.error(`Error fetching twitch channel: ${httpErr}`);
    return { err: 'Error fetching twitch channel' };
  }
  const channelJson = channelResponse.data;
  return channelJson;
}

/**
 * Fetches information about the given users stream
 * @param {string} twitchUser - twitch username
 * @returns {Object} json representing the stream, {err} if error occured
 */
async function getStreamer(twitchUser) {
  const streams = `https://api.twitch.tv/helix/streams?user_login=${twitchUser}`;
  const request = { ...requestConf, url: streams };

  let streamResponse;
  try {
    streamResponse = await axios(request);
  } catch (httpErr) {
    logger.error(`Error fetching twitch stream: ${httpErr}`);
    return { err: 'Error fetching twitch stream' };
  }
  const streamJson = streamResponse.data;
  return streamJson;
}

/**
 * Handles fetching of twitch channel information and returns an embed object
 * representing that channel
 * @param {string} twitchUser - twitch user name
 * @returns {Object} json representing discord embed
 */
async function handleCommand(twitchUser) {
  const stream = await getStreamer(twitchUser);
  const channel = await getChannel(twitchUser);

  if (stream.err) return stream.err;
  if (channel.err) return channel.err;

  const twitchData = {};
  if (channel.data.length > 0) [twitchData.channel] = channel.data;
  else return { err: `Could not find channel ${twitchUser}` };

  // If Stream is online
  if (stream.data.length > 0) {
    const game = await getGame();
    twitchData.game = game.err ? '' : game;
    [twitchData.stream] = stream.data;
  }
  if (stream.data.length <= 0) twitchData.stream = {};
  return createEmbed(twitchData);
}

module.exports = {
  name: 'twitch_test',
  description: 'Fetches a twitch streamer',
  args: true,
  usage: '[twitchUser]',
  execute(message, args) {
    handleCommand(args)
      .then((twitchEmbed) => {
        if (!twitchEmbed.err) message.channel.send({ embed: twitchEmbed });
        else message.channel.send(`\`\`\`${JSON.stringify(twitchEmbed)}\`\`\``);
      });
  },
};
