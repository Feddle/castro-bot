
//ei taida onnistua koska user, message jne objetkeja ei saa muutettua stringiksi jotta voisi lähettää pastebiniin

const logger = require("../logger.js");
const axios = require("axios");
const util = require("util");
const {pastebinKey} = require(__dirname + "/../config.json");
const querystring = require("querystring");

module.exports = {
  name: "print",
  description: "Posts a pastebin link containing the discord.js object (message/user/guild/channel) of the given type for the given id.",
  usage: "!print [type] [id]",
  execute(message, args, client) {  
    const types = ["message", "user", "guild", "channel"];
    if(!types.includes(args[0])) {message.channel.send("ei sitä komentoa noin käytetä"); return;}  

    let ch = message.channel.id;    
    logger.debug(args);

    getSnowflake(args, client, ch)
      .then(snowflake => getPastebin(snowflake))
      .then(link => {          
        if(link) message.channel.send(link);
        else logger.error("Pastebin link was empty");  
      });                          
  },
};

async function getSnowflake(args, client, ch) {
  let obj;
  switch(args[0]) {
  case "message": obj = getMessage(args[1], client, ch); break;
  case "user": obj = getUser(args[1], client, ch) ;break;
  case "guild": obj = getGuild(args[1], client, ch); break;
  case "channel": obj = getChannel(args[1], client, ch); break;  
  }
  return await obj;
}

async function getPastebin(snowflake) {  
  let api = "https://pastebin.com/api/api_post.php";
  let snowflakeString = util.inspect(snowflake);  
  let parameters = {         
    api_dev_key: pastebinKey,
    api_option: "paste",
    api_paste_code: snowflakeString,
    api_paste_format: "json",
    api_paste_private: 1,
    api_paste_expire_date: "1D",    
    headers: {"Content-Type": "application/x-www-form-urlencoded"}
  };
  let pastebin = axios.post(api, querystring.stringify(parameters))
    .then(response => response.data)
    .then(data => data);

  return await pastebin;
}

async function getMessage(id, client, ch) {
  let res = client.channels.get(ch).fetchMessage(id)
    .then(message => message)
    .catch(err => {logger.error(err); return "Ei löytynyt viestiä";});
  return await res;
}

function getUser(id, client) {
  let user = client.users.get(id);  
  if(!user) return "Ei löytynyt käyttäjää";
  return user;
}

function getGuild(id, client) {
  let guild = client.guilds.get(id);  
  if(!guild) return "Ei löytynyt kiltaa";
  return guild;
}

function getChannel(id, client) {
  let channel = client.channels.get(id);  
  if(!channel) return "Ei löytynyt kanavaa";
  return channel;
}

