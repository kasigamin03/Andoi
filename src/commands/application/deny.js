const discord = require("discord.js");
const App = require("../../models/application/applied");
const Paste = require("../../models/application/applied");
module.exports = {
  name: "deny",
  aliases: ["decline"],
  description: "Deny an application",
  category: "application",
  memberPermission: ["MANAGE_GUILD"],
  run: async (client, message, args) => {
    let app = await App.findOne({
      guildID: message.guild.id,
    });

    if (!app) {
      app = new App({
        guildID: message.guild.id,
      });

      await app.save();
      app = await App.findOne({
        guildID: message.guild.id,
      });
    }

    const id = args[0];
    if (!id)
      return message.reply(
        "No application id was provided. How to get one? Use the command `a!review` to find the application ID."
      );
    const paste = await Paste.findOne({
      guildID: message.guild.id,
      appID: id,
    });
    const member = message.guild.members.cache.get(paste.userID);

    if (!paste)
      return message.channel.send(
        `${client.emoji.fail} Could not find this application.`
      );

    let reason = args.slice(1).join(" ");
    if (!reason) reason = `None`;
    if (reason.length > 1024) reason = reason.slice(0, 1021) + "...";

    if (paste.status === "approved")
      return message.channel.send(
        `${client.emotes.error} | This application was already approved`
      );
    if (paste.status === "declined")
      return message.channel.send(
        `${client.emotes.error} | This application was already declined`
      );

    (paste.status = "declined"), await paste.save().catch(() => {});
    await paste.deleteOne();
    message.channel.send(
      new discord.MessageEmbed()
        .setColor("GREEN")
        .setTitle(`Application Declined!`)
        .setDescription(
          `${client.emotes.success} I have sucessfully declined this application.\n\n**Application ID:** ${id}\n**Declined by:** ${message.author.tag}\n**Reason:** ${reason}`
        )
    );
    member
      .send(
        new discord.MessageEmbed()
          .setColor("RED")
          .setTitle(`Application Declined`)
          .setDescription(
            `${client.emotes.error} Hey ${member.user.tag}, your application was Declined.\n\n**Application ID:** ${id}\n**Declined by:** ${message.author.tag}\n**Reason:** ${reason}`
          )
      )
      .catch(() => {
        message.channel.send(
          `Never Mind... I was able to decline the application but couldn't dm ${member.user.tag} since their DMs are closed.'`
        );
      });
  },
};
