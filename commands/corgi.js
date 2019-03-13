const logger = require("../logger.js");

module.exports = {
  name: "corgi",
  description: "posts a random corgi picture from corgihouse channel",
  usage: "",
  execute(message, args, client) {        
    let corgi_ch = client.channels.get("427803623892844544");        

    corgi_ch.fetchMessages()
      .then(messages => {
        let corgi_msg = messages.random();
        let corgi_attach;
        while(!corgi_attach) {
          try {
            corgi_attach = corgi_msg.attachments.first().url;
          } catch(e) {logger.warn(e);}
        }
        return message.channel.send("", {files: [corgi_attach]});
      })
      .catch(err => {logger.error(err); return "Ei löytynyt corgi viestiä";});
  },
};


