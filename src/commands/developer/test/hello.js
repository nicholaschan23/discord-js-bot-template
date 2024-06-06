const { SlashCommandSubcommandBuilder } = require("discord.js");

module.exports = {
  category: "developer/test",
  data: new SlashCommandSubcommandBuilder()
    .setName("hello")
    .setDescription("Hello."),
  async execute(client, interaction) {
    return interaction.reply({ content: `Hello!`});
  },
};
