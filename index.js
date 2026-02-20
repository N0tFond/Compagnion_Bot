const { Client, GatewayIntentBits, Collection } = require("discord.js");
const readyHandler = require("./module/readyHandler.js");
const commandsHandler = require("./module/commandsHandler.js");
const interactionHandler = require("./module/InteractionHandler.js");
const { startServer } = require("./keepAlive.js");
require("dotenv").config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences
    ],
});

client.commands = new Collection();

readyHandler(client);
commandsHandler(client);
interactionHandler(client);

startServer();

client.login(process.env.TOKEN);