const { Events } = require("discord.js");
const log = require("../utils/logger.js");
const logger = new log("ready");

module.exports = {
  event: Events.ClientReady,
  type: "once",
  async call(client) {
    const guilds_size = client.guilds.cache.size;
    logger.success(`Connected! ${client.user.username} is currently on ${guilds_size} server${guilds_size > 1 ? "s" : ""}`);
  },
};
