const fetch = require('node-fetch');

//Hakee annetun striimaajan
function getStreamer(twitchUser) {
    var streams = "https://wind-bow.glitch.me/twitch-api/streams/" + twitchUser;    
    return fetch(streams)
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
    var channels = "https://wind-bow.glitch.me/twitch-api/channels/" + twitchUser;
    return fetch(channels)
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
    execute(message, args) {
        
        // Extract twitch user from command
        var sentence = message.content.split(' ');
        var twitchUser = sentence[1];

        getStreamer(twitchUser)
        .then(response => message.channel.send(response))
        .catch(error => {console.log(error); message.channel.send(error["message"])})
    },
};