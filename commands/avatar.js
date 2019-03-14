module.exports = {
  name: "avatar",
  description: "outputs your avatar",
  aliases: ["icon"],
  usage: "!avatar",
  execute(message, args) {
    message.reply(message.author.avatarURL);
  },
};