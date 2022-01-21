const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const moment = require("moment");
const { splitBar } = require("string-progressbar");
module.exports = {
    name: "music",
    description: "Start some music!",
    type: 'CHAT_INPUT',
    options: [{
            name: "play",
            type: "SUB_COMMAND",
            description: "🎶 Play da music!",
            options: [{
                name: "song",
                type: "STRING",
                description: "The song you wanna play",
                required: true
            }],
        },
        {
            name: "songinfo",
            type: "SUB_COMMAND",
            description: "🎶 Get the info of the music!",
        },
        {
            name: "seek",
            type: "SUB_COMMAND",
            description: "🎶 Seek to minute in the song",
            options: [{
                name: "time",
                type: "STRING",
                description: "The time you wanna seek to!",
                required: true
            }],
        },
        {
            name: "skipto",
            type: "SUB_COMMAND",
            description: "🎶 Skip to next song",
            options: [{
                name: "skipto",
                type: "STRING",
                description: "The song number you wanna jump to!",
                required: true
            }],
        },
        {
            name: "volume",
            type: "SUB_COMMAND",
            description: "🎶 Volume of the songs",
            options: [{
                name: "volume",
                type: "NUMBER",
                description: "The volume you wanna set to",
                required: true
            }],
        },
        {
            name: "pause",
            type: "SUB_COMMAND",
            description: "🎶 Pause the music!",
        },
        {
            name: "queue",
            type: "SUB_COMMAND",
            description: "🎶 Get the music queue",
        },
        {
            name: "skip",
            type: "SUB_COMMAND",
            description: "🎶 Skip the current song",
        },
        {
            name: "repeat",
            type: "SUB_COMMAND",
            description: "🎶 Repeat song or queue",
            options: [{
                name: "repeat",
                type: "STRING",
                description: "The mode you wanna repeat",
                required: true,
                choices: [{
                        name: "song",
                        value: "song"
                    },
                    {
                        name: "queue",
                        value: "queue"
                    }
                ],
            }]

        },
        {
            name: "filter",
            type: "SUB_COMMAND",
            description: "🎶 filter the music ",
            options: [{
                name: "filter",
                type: "STRING",
                description: "The filter you wanna apply",
                required: true,
                choices: [{
                        name: "Nightcore",
                        value: "nightcore"
                    },
                    {
                        name: "Bassboost",
                        value: "bassboost"
                    },
                    {
                        name: "Reset",
                        value: "reset"
                    },
                    {
                        name: "Vaporwave",
                        value: "vaporwave"
                    },
                    {
                        name: "Vibrato",
                        value: "vibrato"
                    },
                    {
                        name: "Tremolo",
                        value: "tremolo"
                    },
                    {
                        name: "Karaoke",
                        value: "karaoke"
                    },
                    {
                        name: "EightD",
                        value: "eightD"
                    },
                    {
                        name: "Pop",
                        value: "pop"
                    },
                    {
                        name: "Soft",
                        value: "soft"
                    }
                ],
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
        const embed = new MessageEmbed()
            .setTitle("🎶 || Music")
            .setColor(client.config.embed.maincolor)
        if (interaction.options.getSubcommand() === "pause") {
            const player = interaction.client.manager.get(interaction.guild.id);
            if (!player) {
                embed.setDescription("> There is no player for this guild.")
                return interaction.reply({ embeds: [embed] });
            }

            const { channel } = interaction.member.voice;

            if (!channel) {
                embed.setDescription("> You need to join a voice channel.")
                return interaction.reply({ embeds: [embed] });
            }
            if (channel.id !== player.voiceChannel) {
                embed.setDescription("> You're not in the same voice channel.")
                return interaction.reply({ embeds: [embed] });
            }
            if (player.paused) {
                player.pause(false);

                embed.setDescription("> The player is resuming!");
                return interaction.reply({ embeds: [embed] });
            } else {
                player.pause(true);
                embed.setDescription("> Paused the player.");
                return interaction.reply({ embeds: [embed] });
            }


        } else if (interaction.options.getSubcommand() === "play") {
            const { channel } = interaction.member.voice;
            if (!channel) {
                embed.setDescription("> You need to join a voice channel.")
                return interaction.reply({ embeds: [embed] });
            }
            const res = await client.manager.search(
                interaction.options.getString("song"),
                interaction.user
            );

            // Create a new player. This will return the player if it already exists.
            const player = client.manager.create({
                guild: interaction.guild.id,
                voiceChannel: interaction.member.voice.channel.id,
                textChannel: interaction.channel.id,
            });

            // Connect to the voice channel.
            if (player.state !== "CONNECTED") player.connect();

            // Adds the first track to the queue.
            player.queue.add(res.tracks[0]);
            embed.setDescription(`> Enqueuing track ${res.tracks[0].title}.`)
            interaction.reply({ embeds: [embed] });

            // Plays the player (plays the first track in the queue).
            // The if statement is needed else it will play the current track again
            if (!player.playing && !player.paused && !player.queue.size)
                player.play();

            // For playlists you'll have to use slightly different if statement
            if (!player.playing &&
                !player.paused &&
                player.queue.totalSize === res.tracks.length
            )
                player.play();
        } else if (interaction.options.getSubcommand() === "queue") {
            const player = interaction.client.manager.get(interaction.guild.id);
            if (!player) {
                embed.setDescription("> There is no player for this guild.")
                return interaction.reply({ embeds: [embed] });
            }
            const queue = player.queue;
            // change for the amount of tracks per page

            const tracks = queue.slice(0, 20);

            if (queue.current) embed.addField("> Current", `[${queue.current.title}](${queue.current.uri})`);

            if (!tracks.length) {
                embed.setDescription(`> No tracks!`);
            } else embed.setDescription(tracks.map((track, i) => `${0 + (++i)} - [${track.title}](${track.uri})`).join("\n"));

            return interaction.reply({ embeds: [embed] });

        } else if (interaction.options.getSubcommand() === "repeat") {

            const player = client.manager.get(interaction.guild.id);
            if (!player) {
                embed.setDescription("> There is no player for this guild.")
                return interaction.reply({ embeds: [embed] });
            }

            const { channel } = interaction.member.voice;
            if (!channel) {
                embed.setDescription("> You need to join a voice channel.")
                return interaction.reply({ embeds: [embed] });
            }
            if (channel.id !== player.voiceChannel) {
                embed.setDescription("> You're not in the same voice channel.")
                return interaction.reply({ embeds: [embed] });
            }


            if (interaction.options.getString("repeat") === "queue") {
                player.setQueueRepeat(!player.queueRepeat);
                const queueRepeat = player.queueRepeat ? "Enabled" : "Disabled";
                embed.setDescription(`> I've ${queueRepeat} queue repeat.`);
                return interaction.reply({ embeds: [embed] });

            }

            player.setTrackRepeat(!player.trackRepeat);
            const trackRepeat = player.trackRepeat ? "Enabled" : "Disabled";
            embed.setDescription(`> I've ${trackRepeat} the track repeat.`);
            return interaction.reply({ embeds: [embed] });
        } else if (interaction.options.getSubcommand() === "skip") {
            const player = client.manager.get(interaction.guild.id);
            if (!player) {
                embed.setDescription("> There is no player for this guild.")
                return interaction.reply({ embeds: [embed] });
            }

            const { channel } = interaction.member.voice;
            if (!channel) {
                embed.setDescription("> You need to join a voice channel.")
                return interaction.reply({ embeds: [embed] });
            }
            if (channel.id !== player.voiceChannel) {
                embed.setDescription("> You're not in the same voice channel.")
                return interaction.reply({ embeds: [embed] });
            }

            if (!player.queue.current) {
                embed.setDescription("> There is no music playing.")
                return interaction.reply({ embeds: [embed] });
            }

            const { title } = player.queue.current;

            player.stop();
            embed.setDescription(`> ${title} was skipped.`)
            return interaction.reply({ embeds: [embed] });
        } else if (interaction.options.getSubcommand() === "volume") {

            const player = client.manager.get(interaction.guild.id);
            if (!player) {
                embed.setDescription("> There is no player for this guild.")
                return interaction.reply({ embeds: [embed] });
            }
            const { channel } = interaction.member.voice;
            if (!channel) {
                embed.setDescription("> You need to join a voice channel.")
                return interaction.reply({ embeds: [embed] });
            }
            if (channel.id !== player.voiceChannel) {
                embed.setDescription("> You're not in the same voice channel.")
                return interaction.reply({ embeds: [embed] });
            }
            if (!player.queue.current) {
                embed.setDescription("> There is no music playing.")
                return interaction.reply({ embeds: [embed] });
            }
            volume = interaction.options.getNumber("volume")
            player.setVolume(volume);
            embed.setDescription("> Volume set to " + volume)

            interaction.reply({ embeds: [embed] })
        } else if (interaction.options.getSubcommand() === "filter") {

            const player = client.manager.get(interaction.guild.id);
            if (!player) {
                embed.setDescription("> There is no player for this guild.")
                return interaction.reply({ embeds: [embed] });
            }

            const { channel } = interaction.member.voice;
            if (!channel) {
                embed.setDescription("> You need to join a voice channel.")
                return interaction.reply({ embeds: [embed] });
            }
            if (channel.id !== player.voiceChannel) {
                embed.setDescription("> You're not in the same voice channel.")
                return interaction.reply({ embeds: [embed] });
            }

            if (!player.queue.current) {
                embed.setDescription("> There is no music playing.")
                return interaction.reply({ embeds: [embed] });
            }
            if (interaction.options.getString("filter") === "nightcore") {
                if (!player.nightcore) player.nightcore = true;
                else player.nightcore = false
            }
            if (interaction.options.getString("filter") === "bassboost") {
                if (!player.bassboost) player.bassboost = true;
                else player.bassboost = false
            }
            if (interaction.options.getString("filter") === "vibrato") {
                if (!player.vibrato) player.vibrato = true;
                else player.vibrato = false
            }
            if (interaction.options.getString("filter") === "tremolo") {
                if (!player.tremolo) player.tremolo = true;
                else player.tremolo = false
            }
            if (interaction.options.getString("filter") === "karaoke") {
                if (!player.karaoke) player.karaoke = true;
                else player.karaoke = false
            }
            if (interaction.options.getString("filter") === "eightD") {
                if (!player.eightD) player.eightD = true;
                else player.eightD = false
            }
            if (interaction.options.getString("filter") === "vaporwave") {
                if (!player.vaporwave) player.vaporwave = true;
                else player.vaporwave = false
            }
            if (interaction.options.getString("filter") === "pop") {
                if (!player.pop) player.pop = true;
                else player.pop = false
            }
            if (interaction.options.getString("filter") === "soft") {
                if (!player.soft) player.soft = true;
                else player.soft = false
            }
            if (interaction.options.getString("filter") === "reset") player.reset()
            interaction.reply(`> The filter ${interaction.options.getString("filter")} is Enabled!`)
        } else if (interaction.options.getSubcommand() === "seek") {

            const player = client.manager.get(interaction.guild.id);
            if (!player) {
                embed.setDescription("> There is no player for this guild.")
                return interaction.reply({ embeds: [embed] });
            }

            const { channel } = interaction.member.voice;
            if (!channel) {
                embed.setDescription("> You need to join a voice channel.")
                return interaction.reply({ embeds: [embed] });
            }
            if (channel.id !== player.voiceChannel) {
                embed.setDescription("> You're not in the same voice channel.")
                return interaction.reply({ embeds: [embed] });
            }


            const song = player.queue.current;
            const time1 = interaction.options.getString("time")
            if (!song.isSeekable) {
                embed.setDescription("> Can't seek this song.")
                return interaction.reply({ embeds: [embed] });

            }

            if (!time1[0] || isNaN(time1[0]) && !time1.includes(":")) {
                embed.setDescription("> Provide a valid time to seek.")
                return interaction.reply({ embeds: [embed] });
            }

            let timeString = time1;
            if (!isNaN(timeString)) timeString = `00:${timeString}`;

            let time = toTimeMilliSeconds(timeString);
            if (time === song.duration) time = song.duration - 1;

            if (!time || isNaN(time) || time >= song.duration || time < 0) {
                embed.setDescription("> Please provide a valid duration to seek.");
                return interaction.reply({ embeds: [embed] });
            }

            player.seek(time);
            embed.setDescription(`Seeked to \`${timeString}\`.`);
            return interaction.reply({ embeds: [embed] });
        } else if (interaction.options.getSubcommand() === "skipto") {

            const player = client.manager.get(interaction.guild.id);
            if (!player) {
                embed.setDescription("> There is no player for this guild.")
                return interaction.reply({ embeds: [embed] });
            }

            const { channel } = interaction.member.voice;
            if (!channel) {
                embed.setDescription("> You need to join a voice channel.")
                return interaction.reply({ embeds: [embed] });
            }
            if (channel.id !== player.voiceChannel) {
                embed.setDescription("> You're not in the same voice channel.")
                return interaction.reply({ embeds: [embed] });
            }

            if (!player.queue.current) {
                embed.setDescription("> There is no music playing.")
                return interaction.reply({ embeds: [embed] });
            }
            const index = Number(interaction.options.getString("skipto"));
            const queue = player.queue
            if (!index || !queue[index] || index > queue.length || index < 1) {
                embed.setDescription("> Provided Song Index does not exist.");
                return interaction.reply({ embeds: [embed] });
            }

            player.stop(index);
            embed.setDescription(`> Skipped \`${index}\` songs.`);
            return interaction.reply({ embeds: [embed] });
        } else if (interaction.options.getSubcommand() === "autoplay") {
            const player = client.manager.get(interaction.guild.id);
            if (!player) {
                embed.setDescription("> There is no player for this guild.")
                return interaction.reply({ embeds: [embed] });
            }

            const { channel } = interaction.member.voice;
            if (!channel) {
                embed.setDescription("> You need to join a voice channel.")
                return interaction.reply({ embeds: [embed] });
            }
            if (channel.id !== player.voiceChannel) {
                embed.setDescription("> You're not in the same voice channel.")
                return interaction.reply({ embeds: [embed] });
            }
            player.set(`autoplay`, !player.get(`autoplay`))
            embed.setDescription(`> Turned \`${player.get("autoplay") ? "on" : "off"}\` autoplay mode.`);
            return interaction.reply({ embeds: [embed] })
        } else if (interaction.options.getSubcommand() === "songinfo") {
            const player = client.manager.get(interaction.guild.id);
            if (!player) {
                embed.setDescription("> There is no player for this guild.")
                return interaction.reply({ embeds: [embed] });
            }
            const queue = player.queue;

            let song = queue.current;


            if (!song.title) {
                await song.resolve()
            };

            let duration = song.duration;
            let formattedDuration = moment.duration(song.duration, "milliseconds").moment().format();
            let formattedCurrentTime = moment.duration(player.position, "milliseconds").moment().format();

            const seek = player.position;

            if (song.isStream) {
                duration = player.position;
                formattedDuration = "Live";
            }

            const embed1 = new MessageEmbed()
                .setColor("#00FFFF")
                .setTitle(song.title)
                .setURL(song.uri);

            embed1.setAuthor(`Now ${player.playing ? "playing" : "paused"} 🎶`)
                .setDescription(`~ Played by: ${song.requester.toString()}${splitBar(song.duration, seek)}[${formattedCurrentTime}\/${formattedDuration}]`);


            return interaction.reply({ embeds: [embed1] }).catch(console.error);
        }
    },
};

function toTimeMilliSeconds(time) {
    if (isNaN(time) && !time.includes(":")) return false;

    const t = time.split(":");
    let seconds;
    if (t.length === 3) seconds = (+t[0]) * 60 * 60 + (+t[1]) * 60 + (+t[2]);
    else if (t.length === 2) seconds = (+t[0]) * 60 + (+t[1]);
    else if (t.length === 1) seconds = t[0];

    return Number(seconds * 1000);
}