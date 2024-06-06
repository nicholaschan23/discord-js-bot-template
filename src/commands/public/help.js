const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  category: "public",
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Display all commands available to you."),
  async execute(client, interaction) {
    return interaction.reply({ content: `Help!` });
  },
};
