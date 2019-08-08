const axios = require('axios');

const configPath = `${__dirname}/../config.json`;
const { twitchClientID } = require(configPath);
const logger = require('../logger.js');

const requestHeaders = {
  method: 'GET',
  headers: {
    'Client-ID': twitchClientID,
  },
};


/**
 * Returns an embed representing a twitch stream
 * @param {Object} stream - twitch stream object
 * @returns {Object} discord embed object
 */
function createEmbed(stream) {
  const link = stream.channel.url;
  const { game } = stream;
  const { status } = stream.channel;
  const displayName = stream.channel.display_name;
  const { logo } = stream.channel;

  const embed = {
    title: game,
    description: status,
    url: link,
    color: 7032241,
    thumbnail: {
      url: logo,
    },
    author: {
      name: displayName,
      url: link,
    },
  };
  return embed;
}

/**
 * Returns an embed representing a twitch channel
 * @param {Object} channel - twitch channel object
 * @returns {Object} discord embed object
 */
function createChannelEmbed(channel) {
  const link = channel.url;
  const displayName = channel.display_name;
  const { logo } = channel;
  const embed = {
    description: `${displayName} is offline`,
    url: link,
    color: 7032241,
    thumbnail: {
      url: logo,
    },
    author: {
      name: displayName,
      url: link,
    },
  };
  return embed;
}

/**
 * Fetches information about the given users channel
 * returns a discord embed object representing the channel
 * @todo Check the channel object and add a version of this to createEmbed
 * @param {string} twitchUser - twitch username
 * @returns {Object} discord embed object representing the streamer, {err:} if error occured
 */
async function getChannel(twitchUser) {
  const channels = `https://api.twitch.tv/kraken/channels/${twitchUser}`;

  const channelResponse = await axios(channels, requestHeaders);
  let channelJson;
  try {
    channelJson = JSON.parse(channelResponse);
  } catch (parseErr) {
    logger.error(`Error parsing channel response: ${parseErr}`);
    return { err: parseErr };
  }

  if (channelResponse.ok && channelJson.display_name) {
    logger.info(`Fetched twitch channel: ${twitchUser}`);
    const embed = createChannelEmbed(channelJson);
    return embed;
  }

  const errObj = {
    err: {
      status: channelResponse.status,
      statusText: channelResponse.statusText,
    },
  };
  return errObj;
}

/**
 * Fetches information about the given users stream
 * returns a discord embed object representing the stream
 * if stream is down fetches the streamers channel information
 * @param {string} twitchUser - twitch username
 * @returns {Object} discord embed object representing the streamer, {err:} if error occured
 */
async function getStreamer(twitchUser) {
  const streams = `https://api.twitch.tv/kraken/streams/'${twitchUser}`;

  const streamResponse = await axios(streams, requestHeaders);
  let streamJson;
  try {
    streamJson = JSON.parse(streamResponse);
  } catch (parseErr) {
    logger.error(`Error parsing stream response: ${parseErr}`);
    return { err: parseErr };
  }
  if (streamResponse.ok && streamJson.stream != null) {
    logger.info(`Fetched twitch stream: ${twitchUser}`);
    const embed = createEmbed(streamJson.stream);
    return embed;
  }
  if (streamJson.stream == null && streamJson._links != null) {
    const name = streamJson._links.self.split('/');
    return getChannel(name[name.length - 1]);
  }
  const errObj = {
    err: {
      status: streamResponse.status,
      statusText: streamResponse.statusText,
    },
  };
  return errObj;
}

module.exports = {
  name: 'twitch',
  description: 'Fetches a twitch streamer',
  args: true,
  usage: '[twitchUser]',
  execute(message, args) {
    logger.debug(args);
    // Extract twitch user from command
    const sentence = message.content.split(' ');
    const twitchUser = sentence[1];

    const twitchEmbed = getStreamer(twitchUser);
    if (!twitchEmbed.err) message.channel.send({ twitchEmbed });
    else {
      logger.warn(twitchEmbed.err);
      message.channel.send(twitchEmbed); // TESTAA TÄMÄ
    }
  },
};
