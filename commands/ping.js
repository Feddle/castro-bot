module.exports = {
  name: "ping",
  description: "answers with pong",
  usage: "!ping",
  execute(message, args) {
    message.channel.send("pong");
  },
};
