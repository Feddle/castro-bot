const logger = require("../logger.js");

module.exports = {
  name: "koiru",
  description: "posts a random koiru picture from dogehouse channel",
  aliases: ["corgi"],
  usage: "",
  execute(message, args, client) {        
    let koiru_ch = client.channels.get("427803623892844544");        

    koiru_ch.fetchMessages()
      .then(messages => {        
        let koiru_attach;
        while(!koiru_attach) {
          let koiru_msg = messages.random();
          try {
            koiru_attach = koiru_msg.attachments.first().url;
          } catch(e) {logger.warn(e);}
        }
        return message.channel.send("", {files: [koiru_attach]});
      })
      .catch(err => {logger.error(err); return "Ei löytynyt koiru viestiä";});
  },
};


