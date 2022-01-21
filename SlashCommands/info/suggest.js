const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const suggest = require("../../models/guilds")
module.exports = {
    name: "suggest",
    description: "Get informations about our bot!",
    type: 'CHAT_INPUT',
    options: [{
            name: "accept",
            type: "SUB_COMMAND",
            description: "💬 Accept a suggestion, admin only!!",
            options: [{
                name: "messageid",
                type: "STRING",
                description: "The suggestion messageid you wanna accept",
                required: true
            }],
        },
        {
            name: "deny",
            type: "SUB_COMMAND",
            description: "💬 Deny a suggestion, admin only!!",
            options: [{
                name: "messageid",
                type: "STRING",
                description: "The suggestion messageid you wanna deny",
                required: true
            }],
        },
        {
            name: "suggest",
            type: "SUB_COMMAND",
            description: "💬 Suggest for a new suggestion!",
            options: [{
                name: "suggestion",
                type: "STRING",
                description: "The suggestion you wanna suggest!",
                required: true
            }],
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async(client, interaction, args) => {
        if (interaction.options.getSubcommand() === "suggest") {
            const suggestion = interaction.options.getString("suggestion")
            const a = await suggest.findOne({ guild: interaction.guildId })
            if (!a) return client.errorEmbed({ text: "The suggestion system isn't setted up!", reply: true }, interaction)
            if (!a.suggestchannel) return client.errorEmbed({ text: "The suggestion system isn't setted up!", reply: true }, interaction)
            const message = await client.embed({ title: "New suggestion:",thumbnail: interaction.user.avatarURL(), description: suggestion, send: true }, client.channels.cache.get(a.suggestchannel))
            message.react("✅")
            message.react("❌")
            client.succesEmbed({ text: "Suggestion is send!", reply: true }, interaction)
        } else if (interaction.options.getSubcommand() === "accept") {
            if (!interaction.memberPermissions.has("ADMINISTRATOR")) return client.errorEmbed({ text: "You didn't have the permission: ADMINSTRATOR", reply: true }, interaction)
            const a = await suggest.findOne({ guild: interaction.guildId })
            if (!a) return client.errorEmbed({ text: "The suggestion system isn't setted up!", reply: true }, interaction)
            if (!a.suggestchannel) return client.errorEmbed({ text: "The suggestion system isn't setted up!", reply: true }, interaction)
            const channel = client.channels.cache.get(a.suggestchannel)
            const message = interaction.options.getString("messageid")
            channel.messages.fetch(message)
                .then(message => {
                    if(!message.embeds[0].title === "New suggestion:") return client.errorEmbed({text: "This isn't a suggestionembed!", reply: true}, interaction)
                    client.embed({ title: "✅ || Suggestion Accepted!",thumbnail: message.embeds[0].thumbnail.url, description: message.embeds[0].description, edit: true, color: "GREEN" }, message)
                    console.log(message.embeds)
                    console.log(message.content)
                })
                .catch(console.error);
        } else if (interaction.options.getSubcommand() === "deny") {
            if (!interaction.memberPermissions.has("ADMINISTRATOR")) return client.errorEmbed({ text: "You didn't have the permission: ADMINSTRATOR", reply: true }, interaction)
            const a = await suggest.findOne({ guild: interaction.guildId })
            if (!a) return client.errorEmbed({ text: "The suggestion system isn't setted up!", reply: true }, interaction)
            if (!a.suggestchannel) return client.errorEmbed({ text: "The suggestion system isn't setted up!", reply: true }, interaction)
            const channel = client.channels.cache.get(a.suggestchannel)
            const message = interaction.options.getString("messageid")
            channel.messages.fetch(message)
                .then(message => {
                    if(!message.embeds[0].title === "New suggestion:") return client.errorEmbed({text: "This isn't a suggestionembed!", reply: true}, interaction)

                    client.embed({ title: "❌ || Suggestion Denied!", thumbnail: message.embeds[0].thumbnail.url, description: message.embeds[0].description, edit: true, color: "RED" }, message)

                })
                .catch(console.error);
        }
    }
}