const fetch = require("node-fetch");
const {twitchClientID} = require(__dirname +"/../config.json");
const logger = require("../logger.js");

//Fetch the givne streamer
function getStreamer(twitchUser) {
  let streams = "https://api.twitch.tv/kraken/streams/" + twitchUser;
  let myInit = {
    method: "GET",
    headers: {
      "Client-ID": twitchClientID
    }
  };
  return fetch(streams, myInit)
    .then(
      function (response) {
        let embed;		
        return response.json()
          .then(json => {
            if (response.ok && json["stream"] != null) {
              logger.info("Fetched twitch stream: " + twitchUser);
              let link = json["stream"]["channel"]["url"];
              let game = json["stream"]["game"];
              let status = json["stream"]["channel"]["status"];
              let displayName = json["stream"]["channel"]["display_name"];
              let logo = json["stream"]["channel"]["logo"];				

              embed = {
                "title": game,
                "description": status, 
                "url": link,
                "color": 7032241,    
                "thumbnail": {
                  "url": logo
                },
                "author": {
                  "name": displayName,
                  "url": link					
                }
              };

              return embed;
            } else if (json["stream"] == null && json["_links"] != null) {
              let name = json["_links"]["self"].split("/");
              return getChannel(name[name.length - 1]);
            } else {
              return Promise.reject(Object.assign({}, json, {
                status: response.status,
                statusText: response.statusText
              }));
            }
          });
      });
}

//Fetch the given channel
function getChannel(twitchUser) {
  let channels = "https://api.twitch.tv/kraken/channels/" + twitchUser;
  let myInit = {
    method: "GET",
    headers: {
      "Client-ID": twitchClientID
    }
  };
  return fetch(channels, myInit)
    .then(
      function (response) {
        let textResponse;
        return response.json()
          .then(json => {
            if (response.ok && json["display_name"]) {
              logger.info("Fetched twitch channel: " + twitchUser);
              let link = json["url"];
              let displayName = json["display_name"];				
              let logo = json["logo"];
              let embed = {
                "description": displayName + " is offline",
                "url": link,
                "color": 7032241,					  
                "thumbnail": {
                  "url": logo
                },
                "author": {
                  "name": displayName,
                  "url": link					
                }
              };
              return embed;
            } else {
              return Promise.reject(Object.assign({}, json, {
                status: response.status,
                statusText: response.statusText
              }));
            }
          });
      });
}

module.exports = {
  name: "twitch",
  description: "fetches twitch channel link and states whether the streamer is online or not",
  args: true,
  usage: "[twitchUser]",
  execute(message, args) {

    // Extract twitch user from command
    let sentence = message.content.split(" ");
    let twitchUser = sentence[1];

    getStreamer(twitchUser)
      .then(embed => {return message.channel.send({embed});})
      .catch(error => {
        logger.error(error);
        message.channel.send(error["message"]);
      });
  },
};
