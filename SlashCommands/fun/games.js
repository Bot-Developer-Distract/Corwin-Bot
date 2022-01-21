const { Client, CommandInteraction, MessageButton, MessageActionRow } = require("discord.js");
const { SnakeGame } = require('djs-games')

module.exports = {
    name: "games",
    description: "Get informations about our bot!",
    type: 'CHAT_INPUT',
    defaultPermission: false,

    options: [{
            name: "snake",
            type: "SUB_COMMAND",
            description: "🤖 get the current uptime and info like that",
        },
        {
            name: "wordsnake",
            type: "SUB_COMMAND",
            description: "🤖 get the current uptime and info like that",
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async(client, interaction, args) => {
        if (interaction.options.getSubcommand() === "snake") {
            const game = new SnakeGame({
                message: interaction,
                buttons: true,
                snake: '🟩',
                apple: '🍎',
                embedColor: 'RANDOM',
                leftButton: '◀',
                rightButton: '▶',
                upButton: '▲',
                downButton: '▼',
            })
            game.start()
            const button = new MessageButton()
                .setStyle("PRIMARY")
                .setCustomId("left")
                .setLabel("=>")
            const row = new MessageActionRow().addComponents(button)
            interaction.reply({ content: "play SNakeeee", components: [row] })
        }

    }
}