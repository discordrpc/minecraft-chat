/**
 * CREDITS
 */
const { EventEmitter } = require("events");
const Minecraft = require("minecraft-protocol");
const fs = require("fs");

function createBot(options = {}) {
    // Assign default username
    options.username = options.username ?? "Player";
    options.version = options.version ?? "1.8.9";

    // Create bot as event emitter
    const bot = new EventEmitter();

    // Assign options to bot and create minecraft client
    bot.options = options;
    bot._client = Minecraft.createClient(options);

    // Hook error handler
    bot._client.on("error", err => {
        console.error(err);
    });

    // Load plugins
    let plugins = fs.readdirSync("../src/plugins/").filter(file => file.endsWith(".js"));
    plugins.forEach(plugin => {
        require(`./plugins/${plugin}`)(bot);
    });

    // Return bot
    return bot;
}

module.exports = {
    createBot
}