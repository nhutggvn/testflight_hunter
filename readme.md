## HOW IT WORK

**1.** The application will check the status after every n time

**2.** if have slot, it will send notification to telegram user

## HOW TO USE
**Prerequire**

NodeJS : `18.18.0`

**1.** Rename `.env.example` to `.env`

**2.** Fill in the `.env` file

*Example*

`CHAT_ID =` 0123456789  
`BOT_TOKEN =` ncuwnciu2nch92h3dh29n2&@*(#*YE@#*#BC  
`ID_LIST =` gdE4pRzI,MY6JTzix,fzDLkIVK  
`INTERVAL_CHECK` = 10000  

*Note*
`CHAT_ID` : Chat ID of telegram user
`BOT_TOKEN` : Token of chat bot
`ID_LIST` : Each testflight `ID` separated by commas  
`INTERVAL_CHECK` : Change this value for n time check, 1000 = 1 second

**3.** Run `node testflight_watcher.js`
