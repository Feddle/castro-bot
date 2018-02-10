const fetch = require('node-fetch');
const twitchClientID = "i5wia3qcsuevs5xv98u1bf4tc8ytng"

//Hakee annetun striimaajan
function getStreamer(twitchUser) {
    var streams = "https://api.twitch.tv/kraken/streams/" + twitchUser;        
    var myInit = { method: "GET",
                   headers: {"Client-ID": twitchClientID}
                };
    return fetch(streams, myInit)
    .then(
    function(response) {                    
            var textResponse;
            return response.json()
                .then(json => {
                  if (response.ok && json["stream"] != null) {                                                        
                        var link = json["stream"]["channel"]["url"];
                        var game = json["stream"]["channel"]["game"];
                        var status = json["stream"]["channel"]["status"];
                        var displayName = json["stream"]["channel"]["display_name"];
                        var logo = json["stream"]["channel"]["logo"];    
                        textResponse = displayName + " is streaming " + game + "\n" + status + "\n" + link;            
                        return textResponse;
                    } else if(json["stream"] == null) {                            
                            var name = json["_links"]["self"].split("/");
                            return getChannel(name[name.length - 1]);
                    } else {
                        return Promise.reject(Object.assign({}, json, {
                        status: response.status,
                        statusText: response.statusText
                        }))
                    }
                })
    }
    );           
}

//Hakee annetun twitch kanavan
function getChannel(twitchUser) {
    var channels = "https://api.twitch.tv/kraken/channels/" + twitchUser;    
    var myInit = { method: "GET",
                   headers: {"Client-ID": twitchClientID}
                };
    return fetch(channels, myInit)
    .then(
    function(response) {                    
            var textResponse;
            return response.json()
                .then(json => {
                  if (response.ok && json["display_name"]) {                                                        
                        var link = json["url"];                        
                        var displayName = json["display_name"];                                                 
                        textResponse = displayName + " is offline" + "\n" + link;
                        return textResponse;
                    } else {
                        return Promise.reject(Object.assign({}, json, {
                        status: response.status,
                        statusText: response.statusText
                        }))
                    }
                })
    }
    );   
}

module.exports = {
    name: 'twitch',
    description: 'twitch channel',
    args: true,
    usage: 'username',
    execute(message, args) {
        
        // Extract twitch user from command
        var sentence = message.content.split(' ');
        var twitchUser = sentence[1];

        getStreamer(twitchUser)
        .then(response => message.channel.send(response))
        .catch(error => {console.log(error); message.channel.send(error["message"])})
    },
};