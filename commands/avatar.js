module.exports = {
    name: 'avatar',
    description: 'outputs your avatar',
    execute(message, args) {
        message.reply(message.author.avatarURL);
    },
};