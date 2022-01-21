const Discord = require('discord.js');

/** 
 * @param {String} text
 * @param {TextChannel} channel
 */

module.exports = (client) => {
        console.log("Starting up embed loader..")

        //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-//
        //                      TEMPLATE EMBED                           //
        //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-//

        // This is an template embed for the normal embed function //

        client.templateEmbed = function() {
            return new Discord.MessageEmbed()
                .setColor(client.config.colors.normal)
                .setFooter({ text: client.config.discord.footer, iconURL: client.user.avatarURL({ size: 1024 }) })
                .setTimestamp();
        }

        //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-//
        //                        ERROR EMBED                            //
        //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-//

        // This is an embed embed //

        client.errorEmbed = async function({ text: text, reply: reply, edit: edit }, channel) {

            let embed = new Discord.MessageEmbed()
                .setTitle(`${client.config.embed.errorTitle}`)
                .setAuthor({ name: client.user.username, iconURL: client.user.avatarURL() })
                .setDescription(`${text}`)
                .setColor(client.config.colors.error)
                .setFooter({ text: client.config.discord.footer, iconURL: client.user.avatarURL({ size: 1024 }) })
                .setTimestamp();

            // Checking Sending Method

            if (reply == true) {

                return await channel.reply({ embeds: [embed] });
            } else if (edit == true) {
                return await channel.edit({ embeds: [embed], components: [] });
            }
        }

        //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-//
        //                     USER PERMS EMBED                          //
        //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-//

        // This is an no user permission embed //

        client.errorUserPerms = async function({ perms: perms, reply: reply }, channel) {
            let embed = new Discord.MessageEmbed()
                .setTitle(`${client.config.embed.errorTitle}`)
                .setAuthor(client.user.username, client.user.avatarURL())
                .setDescription(`You are not allowed to do this!`)
                .addField("Requierd Permissions:", `\`${perms}\``)
                .setColor(client.config.colors.error)
                .setFooter({ text: client.config.discord.footer, iconURL: client.user.avatarURL({ size: 1024 }) })
                .setTimestamp();

            // Checking Sending Method

            if (reply == true) {

                return await channel.reply({ embeds: [embed] });
            }
        }

        //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-//
        //                      BOT PERMS EMBED                          //
        //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-//

        // This is an no bot permissions embed //

        client.errorBotPerms = async function({ perms: perms, reply: reply }, channel) {
            let embed = new Discord.MessageEmbed()
                .setTitle(`${client.config.embed.errorTitle}`)
                .setAuthor(client.user.username, client.user.avatarURL())
                .setDescription(`I don't have the correct permissions!`)
                .addField("Required permissions", `\`${perms}\``)
                .setColor(client.config.colors.error)
                .setFooter({ text: client.config.discord.footer, iconURL: client.user.avatarURL({ size: 1024 }), })
                .setTimestamp();

            // Checking Sending Method

            if (reply == true) {

                return await channel.reply({ embeds: [embed] });
            }
        }

        //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-//
        //                   COOLDOWN ERROR EMBED                        //
        //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-//

        // This is an cooldown embed //

        client.errorWait = async function({ time: time, reply: reply }, channel) {
            let embed = new Discord.MessageEmbed()
                .setTitle(`${client.config.embed.errorTitle}`)
                .setAuthor(client.user.username, client.user.avatarURL())
                .setDescription(`You are on a cooldown!`)
                .addField("Retry In:", `\`${time}\``)
                .setColor(client.config.colors.error)
                .setFooter({ text: client.config.discord.footer, iconURL: client.user.avatarURL({ size: 1024 }) })
                .setTimestamp();

            // Checking Sending Method

            if (reply == true) {

                return await channel.reply({ embeds: [embed] });
            }
        }

        //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-//
        //                   OWNER ERROR EMBED                        //
        //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-//

        // This is an onwer embed //

        client.errorOwner = async function({ reply: reply }, channel) {
            let embed = new Discord.MessageEmbed()
                .setTitle(`${client.config.embed.errorTitle}`)
                .setAuthor(client.user.username, client.user.avatarURL())
                .setDescription(`You are not allowed to do this!`)
                .addField("Requierd Permissions:", `\`BOT_OWNER\``)
                .setColor(client.config.colors.error)
                .setFooter({ text: client.config.discord.footer, iconURL: client.user.avatarURL({ size: 1024 }) })
                .setTimestamp();

            // Checking Sending Method

            if (reply == true) {

                return await channel.reply({ embeds: [embed] });
            }
        }

        //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-//
        //                        SUCCES EMBED                           //
        //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-//

        // This is an succes embed

        client.succesEmbed = async function({ text: text, reply: reply, edit: edit, send: send }, channel) {
            if (!text) return

            let embed = new Discord.MessageEmbed()
                .setTitle(`${client.config.embed.succesTitle}`)
                .setAuthor({ name: client.user.username, iconURL: client.user.avatarURL(), url: "https://corwindev.nl" })
                .setDescription(`${text}`)
                .setColor(client.config.colors.succes)
                .setFooter({ text: client.config.discord.footer, iconURL: client.user.avatarURL({ size: 1024 }) })
                .setTimestamp();

            // Checking Sending Method

            if (reply == true) {

                return await channel.reply({ embeds: [embed] });

            } else if (edit == true) {

                return await channel.edit({ embeds: [embed], components: [] });

            } else if (send == true) {

                return await channel.send({ embeds: [embed], components: [] });

            }
        }

        //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=//
        //                         NORMAL EMBED                           //
        //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=//

        // This is an normal embed with footer, timestamp & author //

        client.embed = async function({ embed: embed = client.templateEmbed(), title: title, description: description, color: color, image: image, author: author, thumbnail: thumbnail, fields: fields, url: url, footer: footer, components: components, reply: reply, edit: edit, ephemeral: ephemeral, send: send }, channel) {

            // Checking Variables

            if (channel.guild == undefined) channel.guild = { id: "0" };

            if (title) embed.setTitle(title);
            if (description && description.length >= 2048) embed.setDescription(description.substr(0, 2044) + "...");
            else if (description) embed.setDescription(description);
            if (image) embed.setImage(image);
            if (thumbnail) embed.setThumbnail(thumbnail);
            if (fields) embed.addFields(fields);
            embed.setAuthor({ name: client.user.username, iconURL: client.user.avatarURL() });
            if (url) embed.setURL(url);
            if (color) embed.setColor(color);
            if (footer) embed.setFooter(footer, client.user.avatarURL({ size: 1024 }));
            if (client.config.colors.normal && !color) embed.setColor(client.config.colors.normal)

            // Checking Sending Method

            if (reply == true) {

                if (ephemeral) return await channel.reply({ embeds: [embed], ephemeral: true })
                if (components) return await channel.reply({ embeds: [embed], components: components })

                return await channel.reply({ embeds: [embed] });

            } else if (edit == true) {

                if (components) return await channel.edit({ embeds: [embed], components: components })

                return await channel.edit({ embeds: [embed], components: [] });

            } else if (send == true) {
                if (components) return await channel.edit({ embeds: [embed], components: components })

                return await channel.send({ embeds: [embed], components: [] });

            }
        }

        //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=//
        //                         SIMPLE EMBED                           //
        //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=//

        // This is a embed without footer or ect if unnecessary //

        client.simpleEmbed = async function({ title: title, description: description, image: image, reply: reply, edit: edit, send: send }, channel) {

            let simpleEmbed = new Discord.MessageEmbed()
                .setColor(client.config.colors.normal)

            // Checking Variables

            if (title && title !== " ") simpleEmbed.setTitle(title)
            if (description && description.length >= 2048) simpleEmbed.setDescription(description.substr(0, 2044) + "...");
            else if (description) simpleEmbed.setDescription(description);
            if (image) simpleEmbed.setImage(image)
            if (client.config.colors.normal) simpleEmbed.setColor(client.config.colors.normal)


            // Checking Sending Method

            if (reply == true) {

                if (ephemeral) return await channel.reply({ embeds: [embed], ephemeral: true })
                return await channel.reply({ embeds: [simpleEmbed] });

            } else if (edit == true) {

                return await channel.edit({ embeds: [simpleEmbed], components: [] });

            } else if (send == true) {
                return await channel.send({ embeds: [simpleEmbed], components: [] });

            }
        }
    }
    // © SlashMusic 2021 - 2022