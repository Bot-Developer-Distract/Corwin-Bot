const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
    name: "bot",
    description: "Get informations about our bot!",
    type: 'CHAT_INPUT',
    options: [{
            name: "info",
            type: "SUB_COMMAND",
            description: "🤖 get the current uptime and info like that",
        },
        {
            name: "vote",
            type: "SUB_COMMAND",
            description: "🤖 Vote for our bot on several sites!",
        },
        {
            name: "bugreport",
            type: "SUB_COMMAND",
            description: "🤖 Vote for our bot on several sites!",
            options: [{
                name: "bug",
                type: "STRING",
                required: true,
                description: "The bug you wanna send to us!"
            }]
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async(client, interaction, args) => {
        if (interaction.options.getSubcommand() === "info") {

            const days = Math.floor(client.uptime / 86400000)
            const hours = Math.floor(client.uptime / 3600000) % 24
            const minutes = Math.floor(client.uptime / 60000) % 60
            const seconds = Math.floor(client.uptime / 1000) % 60

            client.embed({
                title: `🤖 || Botinfo`,
                thumbnail: client.user.displayAvatarURL(),
                fields: [{
                        name: `Bot Name`,
                        value: `${client.user.username}`,
                        inline: true
                    },
                    {
                        name: `Bot ID`,
                        value: `${client.user.id}`,
                        inline: true
                    },
                    {
                        name: `Servers`,
                        value: `\`${client.guilds.cache.size}\` servers`,
                        inline: true
                    },
                    {
                        name: `Channels`,
                        value: `\`${client.channels.cache.size}\` channels`,
                        inline: true
                    },
                    {
                        name: `Users`,
                        value: `\`${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)}\` Users`,
                        inline: true
                    },
                    {
                        name: `Join Date`,
                        value: `\`${client.user.createdAt.toLocaleDateString("en-us")}\``,
                        inline: true
                    },
                    {
                        name: `Uptime`,
                        value: `\`${days}\` days \`${hours}\` hrs \`${minutes}\` min \`${seconds}\` sec`,
                        inline: true
                    },

                ],
                reply: true
            }, interaction)
        } else if (interaction.options.getSubcommand() === "vote") {
            client.embed({ description: `[Top.gg](https://top.gg/bot/${client.user.id})`, reply: true }, interaction)
        } else if (interaction.options.getSubcommand() === "bugreport") {
            const channel = client.channels.cache.get(client.config.discord.bugreport)
            const string = interaction.options.getString("bug")
            if (!channel) return
            client.embed({ description: `Bugreport by ${interaction.user.username} / ${interaction.user.id}\n\nBug: ${string}.`, send: true }, channel)
            client.succesEmbed({ text: "Report succesfully send!", reply: true }, interaction)
        }
    },
};