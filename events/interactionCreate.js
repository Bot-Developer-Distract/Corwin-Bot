const client = require("../index");
const { MessageEmbed } = require("discord.js")
const blackuser = require("../models/userblack")
client.on("interactionCreate", async(interaction) => {
    blackuser.findOne({user: interaction.user.id}).then(a=>{
        if(a) return  client.errorEmbed({text: "You're blacklisted by the owners of this bot!", reply: true}, interaction)
    })
    // Slash Command Handling
    if (interaction.isCommand()) {

        const cmd = client.slashCommands.get(interaction.commandName);
        if (!cmd)
            return interaction.followUp({ content: "An error has occured " });

        const args = [];

        for (let option of interaction.options.data) {
            if (option.type === "SUB_COMMAND") {
                if (option.name) args.push(option.name);
                option.options?.forEach((x) => {
                    if (x.value) args.push(x.value);
                });
            } else if (option.value) args.push(option.value);
        }
        interaction.member = interaction.guild.members.cache.get(interaction.user.id);
        const embed = new MessageEmbed()
            .setTitle("Error")
            .setDescription(`> You dont have the right permissions! You need: \`${cmd.UserPerms || []}\` Permissions`)
            .setColor(client.config.embed.error)

        // User Perms
        if (!interaction.member.permissions.has(cmd.UserPerms || [])) return interaction.reply({ embeds: [embed], ephemeral: true }) // Added this

        const embed1 = new MessageEmbed()
            .setTitle("Error")
            .setDescription(`> I dont have the right permissions! I need: \`${cmd.UserPerms || []}\` Permissions`)
            .setColor(client.config.embed.error)

        // Bot Perms
        if (!interaction.guild.me.permissions.has(cmd.BotPerms || [])) return interaction.reply({ embeds: [embed1], ephemeral: true })
        cmd.run(client, interaction, args);
    }

    // Context Menu Handling
    if (interaction.isContextMenu()) {
        await interaction.deferReply({ ephemeral: false });
        const command = client.slashCommands.get(interaction.commandName);
        if (command) command.run(client, interaction);
    }
});