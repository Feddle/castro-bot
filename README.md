# castro-bot
TODO: rewrite


Discord bot for personal guild use (alas the banter in the code).

### How to run

```npm install```

You need to add following directory structure manually (for now):
```
root
  ...
  config.json
  logs
    combined.log
  leaderboards
    leaderboard_KO.json
```

You also need add these lines to your config.json:
```
{
    "prefix" : "DESIRED TOKEN FOR YOUR COMMANDS (eg. "!")",
    "token" : "YOUR DISCORD BOT TOKEN",
    "twitchClientID": "YOUR TWITCH CLIENT ID (for twitch command)",
    "pastebinKey": "YOUR PASTEBIN DEV KEY (for print command)"
}
```
