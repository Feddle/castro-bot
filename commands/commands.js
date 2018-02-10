// Lista komennoista, päivitetään aina kun tehdään uusi komento
var commandList = ["ketaootetaan", "miika ", "twitch <username> ", "avatar "];

module.exports = {
    name: 'commands',
    description: 'List of commands',
    execute(message, args) {
        message.channel.send(commandList.toString());
    },
};