module.exports = {
  id: "byeModal",

  async execute(client, interaction) {
    const amount = interaction.fields.getTextInputValue("byeAmount");

    await interaction.reply({
      content: "Bye! ".repeat(amount),
    });
    return;
  },
};
