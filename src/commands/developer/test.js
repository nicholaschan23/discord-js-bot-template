const { SlashCommandBuilder } = require("discord.js");
const utils = require("../../utils");
const logger = new utils.Logger("test");
const hello = require("./test/hello.js");

module.exports = {
  category: "developer",
  data: new SlashCommandBuilder().setName("test").setDescription("Test a bot feature.").addSubcommand(hello.data),

  async execute(client, interaction) {
    const subcommand = interaction.options.getSubcommand();
    switch (subcommand) {
      case "hello": {
        await hello.execute(client, interaction);
        break;
      }
      default: {
        const message = `There was no execute case for the '${subcommand}' subcommand.`;
        logger.error(message);
        return interaction.reply(message);
      }
    }
  },
};
