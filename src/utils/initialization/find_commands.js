const { SlashCommandBuilder, Collection, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const log = require("../logger.js");
const logger = new log("Command loader");
const path_to_command_sets = path.join(__dirname, "../../commands/");

module.exports = (client) => {
  client.commands = new Collection();
  const stack = [];

  const command_set_folders = fs.readdirSync(path_to_command_sets);

  command_set_folders.forEach((folder) => {
    const command_path = path.join(path_to_command_sets, folder);
    const command_files = getJsFiles(command_path);

    command_files.forEach((file) => {
      const file_path = path.join(command_path, file);
      const command = require(file_path);
      const command_abbrev = abbrevPath(file_path);

      if (validateCommand(SlashCommandBuilder, command, command_abbrev)) {
        client.commands.set(command.data.name, command);
        stack.push(command);
        logger.success(`Successfully loaded ${command_abbrev} command`);

        loadSubcommands(command_path, command.data.name);
      }
    });
  });

  logger.info("Commands loaded");
  return stack;

  function getJsFiles(directory) {
    return fs.readdirSync(directory).filter((file) => file.endsWith(".js"));
  }

  function validateCommand(type, command, command_abbrev) {
    if (!command) {
      logger.error(`${command_abbrev} not valid`);
      return false;
    }
    if (typeof command.execute !== "function") {
      logger.error(`${command_abbrev} does not have the execute function`);
      return false;
    }
    if (!(command.data instanceof type)) {
      logger.error(`${command_abbrev} does not have the ${type} instance`);
      return false;
    }
    if (client.commands.has(command.data.name)) {
      logger.warning(`Two or more commands share the name ${command.data.name}`);
      return false;
    }
    return true;
  }

  function loadSubcommands(command_path, command_name) {
    const subcommand_path = path.join(command_path, command_name);
    if (fs.existsSync(subcommand_path) && fs.statSync(subcommand_path).isDirectory()) {
      const subcommand_files = getJsFiles(subcommand_path);

      subcommand_files.forEach((file) => {
        const file_path = path.join(subcommand_path, file);
        const command = require(file_path);
        const command_abbrev = abbrevPath(file_path);

        if (validateCommand(SlashCommandSubcommandBuilder, command, command_abbrev)) {
          logger.success(`Successfully loaded ${command_abbrev} subcommand`);

          loadSubcommandGroups(subcommand_path, command.data.name);
        }
      });
    }
  }

  function loadSubcommandGroups(subcommand_path, command_name) {
    const subcommand_group_path = path.join(subcommand_path, command_name);
    if (fs.existsSync(subcommand_group_path) && fs.statSync(subcommand_group_path).isDirectory()) {
      const subcommand_group_files = getJsFiles(subcommand_group_path);

      subcommand_group_files.forEach((file) => {
        const file_path = path.join(subcommand_group_path, file);
        const command = require(file_path);
        const command_abbrev = abbrevPath(file_path);

        if (validateCommand(SlashCommandSubcommandGroupBuilder, command, command_abbrev)) {
          logger.success(`Successfully loaded ${command_abbrev} subcommand group`);
        }
      });
    }
  }

  function abbrevPath(dir) {
    return dir.slice(dir.indexOf("commands") + "commands/".length);
  }
};
