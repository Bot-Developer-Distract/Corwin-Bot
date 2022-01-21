const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

const blackg = require("../../models/guildblack")
const blacku = require("../../models/userblack")

module.exports = {
    name: "owner",
    description: "👨‍💻 OwnerCommands",
    type: 'CHAT_INPUT',
    defaultPermission: false,
    options: [{
            name: "blacklist-guild",
            type: "SUB_COMMAND",
            description: "👨‍💻 Blacklist an guild!",
            options: [{
                name: "guild",
                type: "STRING",
                description: "The guild ID to blacklist",
                required: true
            }],
        },
        {
            name: "blacklist-user",
            type: "SUB_COMMAND",
            description: "👨‍💻 Blacklist an user.",
            options: [{
                name: "user",
                type: "STRING",
                description: "The user you wanna blacklist",
                required: true
            }],
        },
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async(client, interaction, args) => {
        if (interaction.options.getSubcommand() === "blacklist-guild") {
            const guild = interaction.options.getString("guild")
            blackg.findOne({ guild: guild }).then(a => {
                if (a) {
                    a.delete()
                    client.succesEmbed({ text: "Succesfully deleted the blacklisted guild!", reply: true }, interaction)
                    return
                } else {
                    const config = new blackg({
                        guild: guild
                    })
                    config.save()
                    if (client.guilds.cache.get(guild)) guild.leave()
                    client.succesEmbed({ text: "Succesfully added the blacklisted guild!", reply: true }, interaction)
                    return
                }
            })
        } else if (interaction.options.getSubcommand() === "blacklist-user") {
            const user = interaction.options.getString("user")
            blacku.findOne({ user: user }).then(a => {
                if (a) {
                    a.delete()
                    client.succesEmbed({ text: "Succesfully deleted the blacklisted user!", reply: true }, interaction)
                    return
                } else {
                    const config = new blacku({
                        user: user
                    })
                    config.save()
                    client.succesEmbed({ text: "Succesfully added the blacklisted user!", reply: true }, interaction)
                    return

                }
            })
        }
    }
}