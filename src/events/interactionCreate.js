const { Events } = require("discord.js");
const log = require("../utils/logger.js");
const logger = new log("interactionCreate");
const interaction_handler = require("../handlers/interaction_handler");

module.exports = {
  event: Events.InteractionCreate,
  type: "on",
  async call(client, interaction) {
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) {
        logger.warn(`Command ${interaction.commandName} not found or loaded`);
        return interaction.reply({ ephemeral: true, content: `Command not found. Please report this!` });
      }

      try {
        return await command.execute(client, interaction);
      } catch (error) {
        logger.error(error.stack);
        return interaction.reply({ ephemeral: true, content: `Error executing command! Please try again. If the error persists, please report it to a developer.` }).catch(() => "");
      }
    } else {
      return await interaction_handler(client, interaction).catch((err) => {
        logger.error(`Interaction handler had issue handling interaction ${interaction.customID} ${err}`);
      });
    }
  },
};
