module.exports = {
    name: 'commands',
    description: 'List of commands',
    execute(message, args, commandList) {
        message.channel.send(commandList.toString());
    },
};