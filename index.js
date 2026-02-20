const Discord = require("discord.js");
const readyHandler = require("./module/readyHandler.js");
const commandsHandler = require("./module/commandsHandler.js");
const interactionHandler = require("./module/InteractionHandler.js");
const { startServer } = require("./keepAlive.js");
require("dotenv").config();

const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.MessageContent,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.GuildPresences
    ],
});

client.commands = new Discord.Collection();

readyHandler(client);
commandsHandler(client);
interactionHandler(client);

// Démarrer le serveur keep-alive
startServer();

client.login(process.env.TOKEN);
