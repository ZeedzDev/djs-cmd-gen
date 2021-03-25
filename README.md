# DJS-CMD-GEN

Cut the fuss of creating a new discord bot. Get started instantly with many options to choose from! djs-cmd-gen will handle all the code to create your command handler, letting you get started ASAP!

## Installation
```
npm i djs-cmd-gen
```

## Setup

### Create your workspace
First, create your command folder by running `mkdir commands` and then create your main file (e.g. `index.js`)

### Creating a client
In your main file, have the following code (this is an example, read below for more information)

```js
const DJSCDMS = require('djs-cmd-gen');

DJSCMDS.newClient(  
  token, 
  prefix, 
  false,
  '../commands'
).then((client) => {
  client.user.setActivity('with you')
});
```

### Adding Commands
To add a command with the above example as your code, create a JS file in your commands folder.
Inside, have the following code:
```js
const Discord = require('discord.js');

module.exports = {
  name: 'eval',
  description: 'Evaluates some code',
  usage: '!eval <evaluation>',
  aliases: ['evaluate', 'evaluation'],
  
  run: async(client,message,args) => {
    // code here
  })
  
}
```

# Params 
DJS-CMD-GEN allows you to change the way the workspace works. 

This can be done through the changes in the params during the creation of a client:

- Change the way the directory works.
-- Change the false to true to use categories:
-- File strucure of categories:
  
```
        commands
        -- info
        ---- help.js
        ---- invite.js
        
        -- economy
        ---- beg.js
        ---- balance.js
        
        index.js
```
     
     
