const { Client, CommandInteraction, MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const tickets = require("../../models/tickets")
const guild = require("../../models/guilds")
module.exports = {
    name: "setup",
    description: "Get informations about our bot!",
    type: 'CHAT_INPUT',
    options: [{
            name: "tickets",
            type: "SUB_COMMAND",
            description: "🎫 Setup tickets system",
            options: [{
                    name: "category",
                    type: "CHANNEL",
                    channelTypes: ["GUILD_CATEGORY"],
                    description: "Category for the tickets to create new between",
                    required: true
                },
                {
                    name: "supportrole",
                    type: "ROLE",
                    description: "The role for your staff members to access tickets",
                    required: true
                },
                {
                    name: "channel",
                    type: "CHANNEL",
                    channelTypes: ["GUILD_TEXT"],
                    description: "Channel to send the panel to",
                    required: true
                },
            ]
        },
        {
            name: "suggestion",
            type: "SUB_COMMAND",
            description: "🤖 Vote for our bot on several sites!",
            options: [{
                name: "channel",
                type: "CHANNEL",
                channelTypes: ["GUILD_TEXT"],
                description: "suggestionchannel",
                required: true
            }, ]
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async(client, interaction, args) => {
        if (!interaction.memberPermissions.has("ADMINISTRATOR")) return client.errorEmbed({ text: "You didn't have the reqeured permissions!", reply: true }, interaction)
        if (interaction.options.getSubcommand() === "tickets") {
            const category = interaction.options.getChannel("category")
            const role = interaction.options.getRole("supportrole")
            const channel = interaction.options.getChannel("channel")
            const data = await tickets.findOne({ guild: interaction.guild.id })
            const ticketbutton = new MessageButton()
                .setCustomId("tickets")
                .setEmoji("🎫")
                .setLabel("Open a ticket!")
                .setStyle("PRIMARY")
            const row = new MessageActionRow()
                .addComponents(ticketbutton)
            const ticketEmbed = new MessageEmbed()
                .setTitle("Tickets")
                .setDescription("Press the button below to open a ticket!")
            if (!data) {
                const ticket = new tickets({
                    guild: interaction.guild.id,
                    categoryID: category.id,
                    supportRoleID: role.id
                })
                ticket.save()
                client.succesEmbed({ text: "Succesfull setted up the Tickets system", reply: true }, interaction)


                channel.send({ components: [row], embeds: [ticketEmbed] })
            } else {
                data.categoryID = category.id
                data.supportRoleID = role.id
                data.save()
                client.succesEmbed({ text: "Succesfull setted up the Tickets system", reply: true }, interaction)
                channel.send({ components: [row], embeds: [ticketEmbed] })

            }

        } else if (interaction.options.getSubcommand() === "suggestion") {
            const channel = interaction.options.getChannel("channel")
            const a = await guild.findOne({ guild: interaction.guild.id })
            if (!a) {
                const config = new guild({
                    guild: interaction.guild.id,
                    suggestchannel: interaction.options.getChannel("channel").id
                }).save()
                return client.succesEmbed({text: "The suggestionchannel is succesfully setted up!", reply: true}, interaction)
            } else {

            }
        }

    }
}