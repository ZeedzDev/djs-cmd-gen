const fs = require("fs");
const Discord = require("discord.js");
const client = new Discord.Client();
module.exports = {
  //Class: function (token, prefix) {
  //this.token = token;
  //this.prefix = prefix;
  //},

  newClient: async function (
    token,
    prefix,
    useCategories,
    path,
    mongooseConnection
  ) {
    if (!token) throw new TypeError(`No Token was set`);
    if (!prefix) throw new TypeError(`No Prefix was set`);

    if (useCategories === undefined)
      throw new TypeError(
        `No use categories were set. Please see the docs for more information.`
      );
    if (useCategories !== true && useCategories !== false)
      throw new TypeError(`Use a Boolean for the useCategories.`);
    if (!path)
      throw new TypeError(
        `Please specify a path to the commands dir from the node_modules dir.`
      );
    await client.login(token);
    client.commands = new Discord.Collection();
    client.aliases = new Discord.Collection();
    client.usage = new Discord.Collection();
    client.description = new Discord.Collection();

    let commands = fs
      .readdirSync(`./commands/`)
      .filter((file) => file.endsWith(".js"));
    if (!useCategories)
      commands.forEach(async (command) => {
        const pull = require(`../${path}/${command}`);
        console.log(pull);
        if (!pull.name)
          throw new TypeError(`There is no name set for file ${command}`);
        else client.commands.set(pull.name.toLowerCase(), pull);

        if (pull.aliases && Array.isArray(pull.aliases))
          pull.aliases.forEach((alias) => client.aliases.set(alias, pull.name));
        if (pull.usage) client.usage.set(pull.usage, pull.name);
        if (pull.description)
          client.description.set(pull.description, pull.name);
      });

    if (useCategories) {
      client.categories = fs.readdirSync(`./commands/`);
      fs.readdirSync("./commands/").forEach((dir) => {
        console.log(dir);
        commands = fs
          .readdirSync(`./commands/${dir}`)
          .filter((file) => file.endsWith(".js"));
        console.log(commands);
        for (let file of commands) {
          let pull = require(`../${path}/${dir}/${file}`);
          console.log(pull);
          if (pull.name) {
            client.commands.set(pull.name.toLowerCase(), pull);
          } else {
            throw new TypeError(`No name set for file ${file}`);
          }
          if (pull.aliases && Array.isArray(pull.aliases))
            pull.aliases.forEach((alias) =>
              client.aliases.set(alias, pull.name)
            );
          if (pull.usage) client.usage.set(pull.usage, pull.name);
          if (pull.description)
            client.description.set(pull.description, pull.name);
        }
      });
    }

    client.on("message", async (message) => {
      if (!message.guild) return;
      if (message.channel.type === "dm") return;
      if (!message.member)
        message.member = await message.guild.members.fetch(message.author.id);
      if (!message.content.startsWith(prefix)) return;

      let args = message.content.slice(prefix.length).trim().split(/ +/g);
      const cmd = args.shift().toLowerCase();
      if (!cmd.length === 0) return;

      if (client.commands.has(cmd)) {
        command = client.commands.get(cmd);
      } else {
        command = client.commands.get(client.aliases.get(cmd));
      }
      if (!command) command = client.commands.get(client.aliases.get(cmd));

      if (!command) return;
      command.run(client, message, args);
    });
    return client;
  },
};
