const client = require("../index");
const { MessageEmbed } = require("discord.js")
const black = require("../models/guildblack")
client.on("guildCreate", async(guild) => {
    black.findOne({ guild: guild.id }).then(a => {
        if (!a) return
        if (a) guild.leave()
    })
})