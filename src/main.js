const { Client, GatewayIntentBits, Partials, Events } = require("discord.js");
const assert = require("assert");
const path = require("path")
const find_events = require("./utils/initialization/find_events");
const find_commands = require("./utils/initialization/find_commands");
const register_commands = require("./utils/initialization/register_commands");

require("dotenv").config({ path: path.join(__dirname, "../.env.test") });
assert(process.env.TOKEN, "A Discord bot token for is required.");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent, 
    GatewayIntentBits.GuildMembers
  ],
  partials: [
    Partials.Message, 
    Partials.Channel, 
    Partials.Reaction
  ],
});

find_events(client);

const commands = find_commands(client);

client.login(process.env.TOKEN);

client.once(Events.ClientReady, (client) => {
  register_commands(client, commands);
});
