const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const economy = require("../../models/economyuser")
const prettyMilliseconds = require('pretty-ms');

module.exports = {
    name: "economy",
    description: "Start some music!",
    type: 'CHAT_INPUT',
    options: [{
            name: "claim",
            type: "SUB_COMMAND_GROUP",
            description: "💲 Economy claim daily/weekly/monthly money",
            options: [{
                    name: "daily",
                    type: "SUB_COMMAND",
                    description: "💲 Claim your daily money!",
                },
                {
                    name: "weekly",
                    type: "SUB_COMMAND",
                    description: "💲 Claim your weekly money!",
                },
                {
                    name: "monthly",
                    type: "SUB_COMMAND",
                    description: "💲 Claim your monthly money!",
                }
            ],
        },
        {
            name: "bal",
            type: "SUB_COMMAND",
            description: "💲 Check you money!",
            options: [{
                name: "user",
                description: "💲 Check other people's money.",
                type: "USER",
                required: false
            }]
        },
    ],



    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async(client, interaction, args) => {
        if (interaction.options.getSubcommand() === "bal") {
            if (interaction.options.getUser("user")) {
                economy.findOne({ user: interaction.options.getUser("user").id, guild: interaction.guild.id }).then(async(data) => {
                    if (!data) return client.errorEmbed({ text: "This user didn't have any money!", reply: true }, interaction)
                    else {
                        return client.succesEmbed({ text: `This user has: ${data.money} money`, reply: true }, interaction)
                    }
                })
            } else {
                economy.findOne({ user: interaction.user.id, guild: interaction.guild.id }).then(async(data) => {
                    if (!data) {

                        const data1 = new economy({
                            user: interaction.user.id,
                            guild: interaction.guild.id,
                            money: 200
                        })
                        data1.save(function(err, Person) {
                            if (err)
                                console.log(err);
                        })
                        return client.succesEmbed({ text: "I have succesfully setted up the economy for you!\nPlease rerun this command", reply: true }, interaction)
                    } else {
                        return client.succesEmbed({ text: `You have ${data.money} money!`, reply: true }, interaction)
                    }
                })
            }
        } else if (interaction.options.getSubcommand() === "daily") {
            economy.findOne({ user: interaction.user.id, guild: interaction.guild.id }).then(async(data) => {
                if (!data) {

                    const data1 = new economy({
                        user: interaction.user.id,
                        guild: interaction.guild.id,
                        money: 200
                    })
                    data1.save(function(err, Person) {
                        if (err)
                            console.log(err);
                    })
                    return client.succesEmbed({ text: "I have succesfully setted up the economy for you!\nPlease rerun this command", reply: true }, interaction)
                } else {
                    if (!data.dtime) {
                        data.money = data.money + 200
                        data.dtime = Date.now()
                        data.save()
                        return client.succesEmbed({ text: "You have redeemed the daily reward of **200**!", reply: true }, interaction)

                    } else {

                        if ((86400000 - (Date.now() - data.dtime)) > 0) {
                            let time = (86400000 - (Date.now() - data.dtime));
                            return client.succesEmbed({ text: `You can't redeem the daily reward more than once a day!\nCollect it again in ${prettyMilliseconds(time)}`, reply: true }, interaction)

                        } else {
                            data.money = data.money + 200
                            data.dtime = Date.now()
                            data.save()
                            return client.succesEmbed({ text: "You have redeemed the daily reward of **200**!", reply: true }, interaction)

                        }
                    }
                }
            })
        } else if (interaction.options.getSubcommand() === "weekly") {
            economy.findOne({ user: interaction.user.id, guild: interaction.guild.id }).then(async(data) => {
                if (!data) {

                    const data1 = new economy({
                        user: interaction.user.id,
                        guild: interaction.guild.id,
                        money: 200
                    })
                    data1.save(function(err, Person) {
                        if (err)
                            console.log(err);
                    })
                    return client.succesEmbed({ text: "I have succesfully setted up the economy for you!\nPlease rerun this command", reply: true }, interaction)
                } else {
                    if (!data.wtime) {
                        data.money = data.money + 1500
                        data.wtime = Date.now()
                        data.save()
                        return client.succesEmbed({ text: "You have redeemed the daily reward of **1500**!", reply: true }, interaction)

                    } else {

                        if ((604800000 - (Date.now() - data.wtime)) > 0) {
                            let time = (604800000 - (Date.now() - data.wtime));
                            return client.succesEmbed({ text: `You can't redeem the weekly reward more than once a week!\nCollect it again in ${prettyMilliseconds(time)}`, reply: true }, interaction)

                        } else {
                            data.money = data.money + 1500
                            data.wtime = Date.now()
                            data.save()
                            return client.succesEmbed({ text: "You have redeemed the daily reward of **1500**!", reply: true }, interaction)

                        }
                    }
                }
            })
        } else if (interaction.options.getSubcommand() === "monthly") {
            economy.findOne({ user: interaction.user.id, guild: interaction.guild.id }).then(async(data) => {
                if (!data) {

                    const data1 = new economy({
                        user: interaction.user.id,
                        guild: interaction.guild.id,
                        money: 200
                    })
                    data1.save(function(err, Person) {
                        if (err)
                            console.log(err);
                    })
                    return client.succesEmbed({ text: "I have succesfully setted up the economy for you!\nPlease rerun this command", reply: true }, interaction)
                } else {
                    if (!data.mtime) {
                        data.money = data.money + 5000
                        data.mtime = Date.now()
                        data.save()
                        return client.succesEmbed({ text: "You have redeemed the monthly reward of **5000**!", reply: true }, interaction)

                    } else {

                        if ((2629800000 - (Date.now() - data.mtime)) > 0) {
                            let time = (2629800000 - (Date.now() - data.mtime));
                            return client.succesEmbed({ text: `You can't redeem the monthly reward more than once a month!\nCollect it again in ${prettyMilliseconds(time)}`, reply: true }, interaction)

                        } else {
                            data.money = data.money + 5000
                            data.mtime = Date.now()
                            data.save()
                            return client.succesEmbed({ text: "You have redeemed the monthly reward of **5000**!", reply: true }, interaction)

                        }
                    }
                }
            })
        }
    }
}