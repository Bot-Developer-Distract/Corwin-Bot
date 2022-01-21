const client = require("../index");
const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js")
const tickets = require("../models/tickets")
const ticketu = require("../models/ticketuser")
client.on("interactionCreate", async(interaction) => {
    if (interaction.isButton) {
        if (interaction.customId === "tickets") {
            const a = await tickets.findOne({ guild: interaction.guild.id })
            if (!a) return interaction.reply({ content: "The tickets system isn't enabled in this guild!", ephemeral: true })
            const b = await ticketu.findOne({
                guild: interaction.guild.id,
                user: interaction.user.id
            })
            if (b) return interaction.reply({ content: `You already have's a ticket!\n<#${b.channel}>`, ephemeral: true })
            const role = a.supportRoleID
            interaction.reply({ content: "Your ticket is made!", ephemeral: true })

            const channel = await interaction.guild.channels.create("|🎫-" + interaction.user.username, {
                type: "GUILD_TEXT",
            });
            await channel.setParent(a.categoryID)

            await channel.permissionOverwrites.create(interaction.guild.id, { VIEW_CHANNEL: false });
            await channel.permissionOverwrites.create(interaction.user.id, { VIEW_CHANNEL: true, CREATE_INSTANT_INVITE: true, SEND_MESSAGES: true, ATTACH_FILES: true, CONNECT: true, ADD_REACTIONS: true, READ_MESSAGE_HISTORY: true })
            await channel.permissionOverwrites.create(interaction.guild.roles.cache.find(x => x.id === role), {
                VIEW_CHANNEL: true,
                CREATE_INSTANT_INVITE: false,
                SEND_MESSAGES: true,
                ATTACH_FILES: true,
                CONNECT: true,
                ADD_REACTIONS: true,
                READ_MESSAGE_HISTORY: true,
            });
            const config = new ticketu({
                guild: interaction.guild.id,
                user: interaction.user.id,
                channel: channel.id
            }).save()
            const button = new MessageButton()
                .setLabel("CLOSE")
                .setStyle("DANGER")
                .setEmoji("❌")
                .setCustomId("close")
            const row = new MessageActionRow()
                .addComponents(button)
            const embed = new MessageEmbed()
                .setTitle(`Ticket: ${interaction.user.username}`)
                .setDescription("Please descripe your question as best as possible")
            channel.send({ content: `<@${interaction.user.id}> <@&${a.supportRoleID}>`, embeds: [embed], components: [row] })

        } else if (interaction.customId === "close") {
            const c = await ticketu.findOne({ channel: interaction.channel.id })
            if (!c) return
            c.delete()
            interaction.reply("This channel is being closed in 10 seconds.")
            setTimeout(() => {
                if (interaction.channel.deletable) {
                    interaction.channel.delete()
                }
            }, 10000);

        }
    }



})