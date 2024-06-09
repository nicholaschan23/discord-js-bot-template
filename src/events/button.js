const { Events } = require("discord.js");
const messages = require("../messages")

module.exports = {
  event: Events.InteractionCreate,
  type: "on",

  async call(client, interaction) {
    if (!interaction.isButton()) return;

    const command = client.buttonInteractions.get(interaction.customId);
    if (!command) {
      return interaction.reply({
        content: messages.BUTTON_ERROR,
        ephemeral: true,
      });
    }

    try {
      await command.execute(interaction);
    } catch (err) {
      console.error(err);
      return interaction.reply({
        content: messages.BUTTON_ERROR,
        ephemeral: true,
      });
    }
  },
};
