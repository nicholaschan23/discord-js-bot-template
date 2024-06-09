const { Events } = require("discord.js");
const utils = require("../utils");
const logger = new utils.Logger("Command");

module.exports = {
  event: Events.InteractionCreate,
  type: "on",

  async call(client, interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
      logger.warn(`Command ${interaction.commandName} not found or loaded`);
      return interaction.reply({ ephemeral: true, content: `Command not found. Please report this!` });
    }

    try {
      await command.execute(client, interaction);
    } catch (error) {
      logger.error(error.stack);
      return interaction.reply({ ephemeral: true, content: `Error executing command! Please try again. If the error persists, please report it to a developer.` }).catch(() => "");
    }
  },
};
