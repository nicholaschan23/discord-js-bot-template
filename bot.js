const { Client, Collection, Events, GatewayIntentBits, Partials } = require("discord.js");
const assert = require("assert");
const path = require("path");
const findEvents = require("./src/utils/initialization/findEvents");
const findCommands = require("./src/utils/initialization/findCommands");
const registerCommands = require("./src/utils/initialization/registerCommands");
const registerInteractions = require("./src/utils/initialization/registerInteractions");

require("dotenv").config({ path: path.join(__dirname, ".env.test") });
assert(process.env.TOKEN, "A Discord bot token for is required.");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

findEvents(client);

// Collections
client.cooldowns = new Collection();
client.commands = new Collection();
client.autocompleteInteractions = new Collection();
client.buttonInteractions = new Collection();
client.modalInteractions = new Collection();
client.selectMenuInteractions = new Collection();

registerInteractions(client);

const commands = findCommands(client);

client.login(process.env.TOKEN);

client.once(Events.ClientReady, (client) => {
  registerCommands(client, commands);
});