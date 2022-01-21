const { Client, Collection, MessageEmbed, Intents } = require("discord.js");
const { DiscordTogether } = require('discord-together');

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_TYPING, Intents.FLAGS.GUILD_SCHEDULED_EVENTS, Intents.FLAGS.GUILD_WEBHOOKS, Intents.FLAGS.DIRECT_MESSAGES],
});
module.exports = client;

// Global Variables
client.commands = new Collection();
client.slashCommands = new Collection();
client.config = require("./config.json");

client.discordTogether = new DiscordTogether(client);
// Initializing the project
require("./handler")(client);
require("./handler/embed")(client)

client.login(client.config.token);
const { Manager } = require("erela.js");
const filter = require("erela.js-filters");
const Deezer = require("erela.js-deezer");
const Spotify = require("erela.js-spotify")
    // Initiate the Manager with some options and listen to some events.

client.manager = new Manager({
        // Pass an array of node. Note: You do not need to pass any if you are using the default values (ones shown below).
        nodes: [{
            host: "88.99.214.169", // Optional if Lavalink is local
            port: 4000,
            password: "CorwinD2@&*34S",
            identifier: "Corwin",
        }, ],
        autoPlay: true,
        resumeKey: "resume",
        resumeTimeout: "120",
        // A send method to send data to the Discord WebSocket using your library.
        // Getting the shard for the guild and sending the data to the WebSocket.
        send(id, payload) {
            const guild = client.guilds.cache.get(id);
            if (guild) guild.shard.send(payload);
        },
        plugins: [
            // Initiate the plugin
            new filter(),
            new Deezer(),
            new Spotify({
                clientID: "4dac2d9f241b49c8bec42ea54fc21d13",
                clientSecret: "2334dbf9fac9468e9a7aa9ea6f2f2f15"
            }),

        ]
    })
    .on("nodeConnect", node => console.log(`Node ${node.options.identifier} connected`))
    .on("nodeError", (node, error) => console.log(`Node ${node.options.identifier} had an error: ${error.message}`))
    .on("trackStart", (player, track) => {
        client.simpleEmbed({
            title: `🎶 || Music`,
            description: `> Now playing: ${track.title}`,
            send: true

        }, client.channels.cache.get(player.textChannel))

    })
    .on("queueEnd", (player) => {
        client.simpleEmbed({
            title: `🎶 || Music`,
            description: "> Queue has ended.",
            send: true
        }, client.channels.cache.get(player.textChannel))

        player.destroy();
    })
    .on("nodeDisconnect", (node, error)=>{
        console.log(node, error)

    });
client.manager.resumeKey = "resume"
client.manager.resumeTimeout= 120
client.once("ready", async() => {
    // Initiate the manager.
    client.manager.init(client.user.id);
    /*const command = await client.guilds.cache.get("921055797839011920")?.commands.fetch('931532105312264222');

    const permissions = [{
        id: '755297485328482356',
        type: 'USER',
        permission: true,
    }, ];

    await command.permissions.add({ permissions });*/
});

// Here we send voice data to lavalink whenever the bot joins a voice channel to play audio in the channel.
client.on("raw", (d) => client.manager.updateVoiceState(d));