const Levels = require("../../modules/discord-xp");
module.exports = {
  name: "removelevel",
  description: "Remove somebody from the database!",
  category: "levels",
  memberPermission: ["ADMINISTRATOR"],
  run: async (client, message, args) => {
    if (!args[1])
      return message.channel.send(
        "Usage: `removefromlevel <level>`\n\n**Inreversible action.**"
      );
    const level = parseInt(args[1]);
    if (level !== 0 && !level) return message.channel.send("Invalid level");
    if (level < 0) return message.channel.send("Invalid number!");
    const msgDocument = message.guild.cache.levelconfig
      ? message.guild.levelconfig
      : await message.guild.getLevelConfig();
    if (!msgDocument)
      return message.channel.send(
        "The levels on this server are disabled! Use `togglelevel system` to enable the system!"
      );
    if (msgDocument && !msgDocument.levelsystem)
      return message.channel.send(
        "The levels on this server are disabled! Use `togglelevel system` to enable the system!"
      );
    const removed = await Levels.removeFromLevel(message.guild.id, level);
    await message.channel.send(
      `${removed.n} users lower than or equal to that level have been removed from the database.`
    );
  },
};
