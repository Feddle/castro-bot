const logger = require('../logger.js');


/**
 * Fetches a random picture from given channel
 * @param {string} - discord channel
 * @returns {Object} discord attachment
 */
async function getDogPic(channel) {
  const messages = await channel.fetchMessages();
  let dogAttachment;
  while (!dogAttachment) {
    const dogMsg = messages.random();
    if (dogMsg.attachments.first()) dogAttachment = dogMsg.attachments.first().url;
  }
  return dogAttachment;
}

module.exports = {
  name: 'koiru',
  description: 'posts a random picture from dogehouse channel',
  aliases: ['corgi'],
  usage: '',
  execute(message, args, client) {
    const dogehouse = client.channels.get('427803623892844544');
    getDogPic(dogehouse)
      .then(pic => message.channel.send('', { files: [pic] }))
      .catch((err) => { logger.error(err); message.channel.send('Ei löytynyt koirukuvaa.'); });
  },
};
