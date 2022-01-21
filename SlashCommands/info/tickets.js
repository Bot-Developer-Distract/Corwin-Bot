const { Client, CommandInteraction, MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const ticket = require("../../models/tickets")
const ticketu = require("../../models/ticketuser")
module.exports = {
    name: "tickets",
    description: "Get informations about our bot!",
    type: 'CHAT_INPUT',
    options: [{
            name: "add",
            type: "SUB_COMMAND",
            description: "🎫 Setup tickets system",
            options: [{
                name: "user",
                type: "USER",
                description: "User to add to your ticket!",
                required: true
            }]
        },
        {
            name: "remove",
            type: "SUB_COMMAND",
            description: "🎫 Remove user from your ticket",
            options: [{
                name: "user",
                type: "USER",
                description: "User to remove to your ticket!",
                required: true
            }]
        },
        {
            name: "close",
            type: "SUB_COMMAND",
            description: "🤖 Close this ticket!",
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async(client, interaction, args) => {
        if (interaction.options.getSubcommand() === 'close') {
            const a = await ticketu.findOne({ channel: interaction.channel.id })
            if (!a) return client.errorEmbed({ text: "This isn't a ticket!", reply: true }, interaction)
            a.delete()
            setTimeout(() => {
                if (interaction.channel.deletable) {
                    interaction.channel.delete()
                }
            }, 10000);
            client.succesEmbed({text: "This ticket will be deleted in 10 seconds!", reply: true}, interaction)
        } else if (interaction.options.getSubcommand() === "add") {
            const user = interaction.options.getUser("user")
            await interaction.channel.permissionOverwrites.create(user.id, { VIEW_CHANNEL: true, CREATE_INSTANT_INVITE: true, SEND_MESSAGES: true, ATTACH_FILES: true, CONNECT: true, ADD_REACTIONS: true, READ_MESSAGE_HISTORY: true })
            client.succesEmbed({text: `The user ${user.username} is succesfull geadd!`, reply: true}, interaction)

        } else if (interaction.options.getSubcommand() === "remove") {
            const user = interaction.options.getUser("user")
            await interaction.channel.permissionOverwrites.delete(user.id, { VIEW_CHANNEL: true, CREATE_INSTANT_INVITE: true, SEND_MESSAGES: true, ATTACH_FILES: true, CONNECT: true, ADD_REACTIONS: true, READ_MESSAGE_HISTORY: true })
            client.succesEmbed({text: `The user ${user.username} is succesfull deleted!`, reply: true}, interaction)

        }

    }
}