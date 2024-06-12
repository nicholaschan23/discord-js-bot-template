module.exports = {
  id: "sample",

  async execute(client, interaction) {
    await interaction.reply({
      content: "This was a reply from a modal handler!",
    });
    return;
  },
};
