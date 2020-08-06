// Getting the Discord Library
const Discord = require('discord.js'),
    db = require('quick.db'),
    {
        Name,
        Author,
        Description,
        Link,
        Art,
        Version,
        VersionHistory
    } = require('../Data/info.json');

module.exports = {
    name: "help",
    description: "Shows a help embed",
    aliases: ["help", "h"],
    usability: "🟧",

    execute(message, args, bot, modRole) {

        // Checking if there isn't a second argument, if there isn't, send a default help embed
        if (!args[1]) {

            // Grabs all of the information from each command file and puts it into a string array
            const helpArray = bot.commands
                .map(value => `**Name:** \`${value.name}\`, **Aliases:** \`${value.aliases.join(", ")}\`, **Usability:** ${value.usability}, **Description:** \`${value.description}\``);

            // Puts all of the information in an embed
            const helpEmbed = new Discord.MessageEmbed()
                .setTitle(`${message.guild.member(bot.user).displayName}: \`Help\``)
                .setDescription(`Here are all of the commands! (For Usability, 🟩 is full usability to everyone, 🟧 is limited usability, and 🟥 is no usability)`)
                .setColor(0x2ca6a1)
                .setAuthor(message.member.displayName)
                .setThumbnail(message.author.avatarURL())
                .setTimestamp()
                .addField('Commands:', helpArray)
                .setURL('https://discord.gg/Buq9dCP')
                .setFooter('Webs Trivia™️');

            // Sends the embed to the author in the DMs
            message.author.send(helpEmbed);

            // Runs the below code if there is a second argument
        } else {

            // Switch for the second argument
            switch (args[1]) {
                case 'rules':
                case 'rule': {

                    // Checking if the member has the permission to use this argument
                    if (!message.member.hasPermission('ADMINISTRATOR') && !message.member.roles.cache.get(modRole)) return message.reply('Permission\'t');

                    // Grabbing the rules from the database
                    let rules = db.fetch(`rules_${message.guild.id}`);

                    // Setting the rules if there isn't any in the database
                    if (rules == null) {
                        db.set(`rules_${message.guild.id}`, {
                            Rule1: "Not set yet",
                            Rule2: "Not set yet",
                            Rule3: "Not set yet",
                            Rule4: "Not set yet",
                            Rule5: "Not set yet",
                            Rule6: "Not set yet",
                            Rule7: "Not set yet",
                            Rule8: "Not set yet",
                            Rule9: "Not set yet",
                            Rule10: "Not set yet"
                        });
                        rules = db.fetch(`rules_${message.guild.id}`);
                    }

                    switch (args[2]) {
                        case 'set':
                            switch (args[3]) {
                                case '1':
                                case '2':
                                case '3':
                                case '4':
                                case '5':
                                case '6':
                                case '7':
                                case '8':
                                case '9':
                                case '10': {

                                    // Checking if there is a fifth argument
                                    if (!args[4]) return message.channel.send(`You didn't a fifth argument at the minimum to apply to rule ${args[3]}`);

                                    // Setting the rule
                                    let newRule = args.splice(4).join(" ");
                                    rules[`Rule${args[3]}`] = newRule;
                                    db.set(`rules_${message.guild.id}`, rules);
                                    rules = db.fetch(`rules_${message.guild.id}`);

                                    message.channel.send(`Rule \`${args[3]}\` set to \`${newRule}\``);
                                    break;
                                }
                                default:
                                    message.channel.send('The fourth argument (if any) is not a rule number!');
                            }
                            break;
                        case '1':
                        case '2':
                        case '3':
                        case '4':
                        case '5':
                        case '6':
                        case '7':
                        case '8':
                        case '9':
                        case '10': {

                            // Making an embed for that rule
                            const ruleEmbed = new Discord.MessageEmbed()
                                .setTitle(`${message.guild.name}: \`Rule ${args[2]}\``)
                                .setDescription(``)
                                .setColor(0x2ca6a1)
                                .setAuthor(message.member.displayName)
                                .setThumbnail(message.author.avatarURL())
                                .setTimestamp()
                                .addField(`Rule ${args[2]}`, rules[`Rule${args[2]}`])
                                .setURL('https://discord.gg/Buq9dCP')
                                .setFooter('Webs Trivia™️');

                            // Sending that embed
                            message.channel.send(ruleEmbed);
                            break;
                        }
                        default:

                            // Creating an embed with all of the rules
                            const rulesEmbed = new Discord.MessageEmbed()
                                .setTitle(`${message.guild.name}: \`Rules\``)
                                .setDescription(``)
                                .setColor(0x2ca6a1)
                                .setAuthor(message.member.displayName)
                                .setThumbnail(message.author.avatarURL())
                                .setTimestamp()
                                .setURL('https://discord.gg/Buq9dCP')
                                .setFooter('Webs Trivia™️');

                            Object.entries(rules)
                                .forEach(rule => {
                                    rulesEmbed.addField(rule[0].replace('e', 'e '), rule[1]);
                                });

                            // Sending the embed
                            message.channel.send(rulesEmbed);
                    }
                    break;
                }
                case 'information':
                case 'info': {

                    // Creating an embed with all information in it
                    const infoEmbed = new Discord.MessageEmbed()
                        .setTitle(`${message.guild.member(bot.user).displayName}: \`Info\``)
                        .setDescription(``)
                        .setColor(0x2ca6a1)
                        .setAuthor(message.member.displayName)
                        .setThumbnail(message.author.avatarURL())
                        .setTimestamp()
                        .addFields({
                            name: 'Bot Name:',
                            value: `\`${Name}\``,
                            inline: true
                        }, {
                            name: 'Bot Description:',
                            value: `\`${Description}\``,
                            inline: true
                        }, {
                            name: 'Bot Author:',
                            value: `\`${Author}\``,
                            inline: true
                        }, {
                            name: 'Bot Link:',
                            value: `${Link}`,
                            inline: true
                        }, {
                            name: 'Bot Art:',
                            value: `${Art}`,
                            inline: true
                        }, {
                            name: 'Bot Version:',
                            value: `\`${Version}\``,
                            inline: true
                        })
                        .setURL('https://discord.gg/Buq9dCP')
                        .setFooter('Webs Trivia™️');

                        VersionHistory
                        .forEach(version => {
                            infoEmbed.addField(version.split(":")[0], version.split(":")[1])
                        });

                    // Sending the embed to the author in DMs
                    message.author.send(infoEmbed);
                    break;
                }
                default:

                    // Checks if the second argument is a command, if false, send a message
                    if (!bot.commands.find(command => command.aliases.includes(args[1]))) return message.channel.send(`${args[1]} is not a command!`);

                    // This is the above if statement, but runs the below code if true
                    else {

                        // Finds the command
                        let command = bot.commands.find(command => command.aliases.includes(args[1]));

                        // Puts all of it's information in an embed
                        const helpCommandEmbed = new Discord.MessageEmbed()
                            .setTitle(`${message.guild.member(bot.user).displayName}: \`Help\``)
                            .setDescription(`Here is all of the information for the \`${command.name}\` command!`)
                            .setColor(0x2ca6a1)
                            .setAuthor(message.member.displayName)
                            .setThumbnail(message.author.avatarURL())
                            .setTimestamp()
                            .addFields({
                                name: 'Command:',
                                value: command.name,
                                inline: true
                            }, {
                                name: 'Aliases:',
                                value: command.aliases.join(", "),
                                inline: true
                            }, {
                                name: 'Description:',
                                value: command.description,
                                inline: true
                            }, {
                                name: 'Usability:',
                                value: command.usability,
                                inline: true
                            }, )
                            .setURL('https://discord.gg/Buq9dCP')
                            .setFooter('Webs Trivia™️');

                        // Sends the embed to the author in the DMs
                        message.author.send(helpCommandEmbed);
                    }
            }

        }
    }
}