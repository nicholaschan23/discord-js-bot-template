const { SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const utils = require("../../utils");
const logger = new utils.Logger("Command loader");
const commandsPath = path.join(__dirname, "../../commands/");

module.exports = (client) => {
  // Initialize an empty stack to store commands
  const stack = [];

  // Read command categories from the commands directory
  const commandCategories = fs.readdirSync(commandsPath);

  // Loop through each category to load commands
  commandCategories.forEach((category) => {
    const commandPath = path.join(commandsPath, category);
    const commandFiles = utils.getJsFiles(commandPath);

    // Loop through each command file in the category
    commandFiles.forEach((file) => {
      const filePath = path.join(commandPath, file);
      const command = require(filePath);
      const filePathAbbrev = utils.abbrevCmdPath(filePath);

      // Validate and register the command
      if (validateCommand(SlashCommandBuilder, command, filePathAbbrev)) {
        client.commands.set(command.data.name, command);
        stack.push(command);
        logger.success(`Successfully loaded ${filePathAbbrev} command`);

        // Load subcommands for the command
        loadSubcommands(path.join(commandPath, command.data.name));
      }
    });
  });

  logger.info("Commands loaded");
  return stack;

  /**
   * Validates a command to ensure it meets the necessary criteria.
   *
   * @param {Function} type - The expected type of the command (SlashCommandBuilder, etc.).
   * @param {Object} command - The command object to validate.
   * @param {string} filePathAbbrev - The abbreviated file path of the command.
   * @returns {boolean} - Returns true if the command is valid, false otherwise.
   */
  function validateCommand(type, command, filePathAbbrev) {
    if (!command) {
      logger.error(`${filePathAbbrev} not valid`);
      return false;
    }
    if (typeof command.execute !== "function") {
      logger.error(`${filePathAbbrev} does not have the execute function`);
      return false;
    }
    if (!(command.data instanceof type)) {
      logger.error(`${filePathAbbrev} does not have the ${type} instance`);
      return false;
    }
    if (client.commands.has(command.data.name)) {
      logger.warning(`Two or more commands share the name ${command.data.name}`);
      return false;
    }
    return true;
  }

  /**
   * Loads subcommands for a given command.
   *
   * @param {string} subcommandPath - The path to the subcommands directory.
   */
  function loadSubcommands(subcommandPath) {
    if (fs.existsSync(subcommandPath) && fs.statSync(subcommandPath).isDirectory()) {
      const subcommandFiles = utils.getJsFiles(subcommandPath);

      // Loop through each subcommand file
      subcommandFiles.forEach((file) => {
        const filePath = path.join(subcommandPath, file);
        const command = require(filePath);
        const filePathAbbrev = utils.abbrevCmdPath(filePath);

        // Validate and log the subcommand
        if (validateCommand(SlashCommandSubcommandBuilder, command, filePathAbbrev)) {
          logger.success(`Successfully loaded ${filePathAbbrev} subcommand`);

          // Load subcommand groups for the subcommand
          loadSubcommandGroups(path.join(subcommandPath, command.data.name));
        }
      });
    }
  }

  /**
   * Loads subcommand groups for a given subcommand.
   *
   * @param {string} subcommandGroupPath - The path to the subcommand groups directory.
   */
  function loadSubcommandGroups(subcommandGroupPath) {
    if (fs.existsSync(subcommandGroupPath) && fs.statSync(subcommandGroupPath).isDirectory()) {
      const subcommandGroupFiles = utils.getJsFiles(subcommandGroupPath);

      // Loop through each subcommand group file
      subcommandGroupFiles.forEach((file) => {
        const filePath = path.join(subcommandGroupPath, file);
        const command = require(filePath);
        const filePathAbbrev = utils.abbrevCmdPath(filePath);

        // Validate and log the subcommand group
        if (validateCommand(SlashCommandSubcommandGroupBuilder, command, filePathAbbrev)) {
          logger.success(`Successfully loaded ${filePathAbbrev} subcommand group`);
        }
      });
    }
  }
};
