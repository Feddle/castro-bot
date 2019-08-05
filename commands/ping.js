module.exports = {
  name: "ping",
  description: "answers with pong",
  usage: "",
  execute(message, args) {
    message.channel.send("pong");
  },
};
