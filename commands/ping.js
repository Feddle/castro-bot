module.exports = {
  name: 'ping',
  description: 'answers with pong',
  usage: '',
  execute(message) {
    message.channel.send('pong');
  },
};
