const { REST, Routes } = require("discord.js");
const log = require("../logger.js");
const logger = new log("Command register");
const config = require("../../../config.js");

module.exports = async (client, commands) => {
  if (!commands || commands.length == 0) return logger.warn("No commands to register");
  const rest = new REST().setToken(process.env.TOKEN);

  // All commands excluding developer
  const developer_commands = filterCommands(commands, "developer");
  const public_commands = filterCommands(commands, "public");

  try {
    logger.info(`Registering ${public_commands.length} public command${public_commands.length > 1 ? "s" : ""} to the Discord API...`);

    // Register public commands globally
    const public_data = await rest.put(Routes.applicationCommands(client.user.id), {
      body: public_commands,
    });

    logger.success(`Successfully registered ${public_data.length} public application (/) command${public_data.length > 1 ? "s" : ""}`);

    logger.info(`Registering ${developer_commands.length} developer command${developer_commands.length > 1 ? "s" : ""} to the Discord API...`);

    // Register developer commands to the developer guild
    const developer_data = await rest.put(Routes.applicationGuildCommands(client.user.id, config.developer.guild_id), {
      body: developer_commands,
    });

    logger.success(`Successfully registered ${developer_data.length} developer application (/) command${developer_data.length > 1 ? "s" : ""}`);
  } catch (error) {
    logger.error(error);
  }
};

function filterCommands(commands, category) {
  return commands.filter((commands) => commands.category == category).map((commands) => commands.data);
}
