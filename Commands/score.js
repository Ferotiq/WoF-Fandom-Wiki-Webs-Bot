// Getting the Discord Library and the database
const db = require('quick.db'),
    Discord = require('discord.js');

module.exports = {
    name: "score",
    description: "Manages guild score",
    aliases: ["score", "s"],
    usability: "🟧",

    execute(message, args, bot, modRole, triviaOn, triviaOffMessage) {

        // Checking if trivia is on
        if (triviaOn !== "true") return message.reply(triviaOffMessage);

        // Getting the score
        var scoreDB = db.fetch(`score_${message.guild.id}`),
            score = scoreDB.score;

        // If no score for the person, write them their score
        if (!score[message.author.id]) {
            score[message.author.id] = 0;
            scoreDB = db.set(`score_${message.guild.id}`, scoreDB);
            message.reply('You have joined tonight\'t trivia session!');
        };

        // Checking if there is a first argument, if no, then show the user their score
        if (!args[1]) {

            // Sending the user their score
            message.reply(`your score is ${score[message.author.id]}`);
            return;
        } else {

            // Stopping the code if the member does not have the correct permissions
            if (!message.member.hasPermission('ADMINISTRATOR') && !message.member.roles.cache.get(modRole)) return message.channel.send('Permission\'t');

            // Second Arguments
            switch (args[1]) {
                case 'add':

                    // Checks if there is a third argument and it is a member mention
                    if (!args[2]) return message.channel.send('You didn\'t provide a third argument (a member mention) (ex: sbs add @Ferotiq#2857 1 This is an example)');
                    if (!message.guild.member(message.mentions.users.first())) return message.channel.send('You didn\'t provide a member mention! (ex: sbs add @Ferotiq#2857 1 This is an example)');

                    // Checks if there is a fourth argument and it is a number)
                    if (!args[3]) return message.channel.send('You didn\'t supply a number to add!');
                    if (isNaN(args[3])) return message.channel.send(`${args[3]} is :regional_indicator_n: :regional_indicator_a: :regional_indicator_n: (Not a number)`);

                    // Stores the member mention in a variable
                    let addPerson = message.guild.member(message.mentions.users.first());

                    // Sets the persons score if they don't have one yet
                    if (!score[addPerson.id]) {
                        score[addPerson.id] = 0
                        db.set(`score_${message.guild.id}`, {
                            score: score
                        });
                        scoreDB = db.fetch(`score_${message.guild.id}`);
                        score = scoreDB.score
                    };

                    // Adds the score and resets all variables
                    score[addPerson.id] = parseFloat(score[addPerson.id]) + parseFloat(args[3]);
                    db.set(`score_${message.guild.id}`, {
                        score: score
                    });
                    scoreDB = db.fetch(`score_${message.guild.id}`);
                    score = scoreDB.score;

                    // Creates an array for all of the scores
                    const scoreAddArray = Object.entries(score)
                        .map(value => `${value[1]} - ${message.guild.member(bot.users.cache.get(value[0].toString())).toString()}`)
                        .sort((a, b) => b.split(" - ")[0] - a.split(" - ")[0]);

                    // Creates the embed
                    if (!args[4]) args.push("No Reason Specified");
                    const scoreAddEmbed = new Discord.MessageEmbed()
                        .setTitle(`${message.guild.name}: \`Add Score\``)
                        .setDescription(`Reason: ${args.splice(4).join(" ")}, Member: ${addPerson.displayName}`)
                        .setColor(0x2ca6a1)
                        .setAuthor(message.member.displayName)
                        .setThumbnail(addPerson.user.avatarURL())
                        .addField(`${message.guild.name} Score:`, scoreAddArray)
                        .setURL('https://discord.gg/Buq9dCP')
                        .setTimestamp()
                        .setFooter('Webs Trivia™️');

                    // Sends the embed
                    message.channel.send(scoreAddEmbed);
                    break;
                case 'set':

                    // Checks if there is a third argument and it is a member mention
                    if (!args[2]) return message.channel.send('You didn\'t provide a third argument (a member mention) (ex: sbs set @Ferotiq#2857 1 This is an example)');
                    if (!message.guild.member(message.mentions.users.first())) return message.channel.send('You didn\'t provide a member mention! (ex: sbs set @Ferotiq#2857 1 This is an example)');

                    // Checks if there is a fourth argument and it is a number)
                    if (!args[3]) return message.channel.send('You didn\'t supply a number to set!');
                    if (isNaN(args[3])) return message.channel.send(`${args[3]} is :regional_indicator_n: :regional_indicator_a: :regional_indicator_n: (Not a number)`);

                    // Stores the member mention in a variable
                    let setPerson = message.guild.member(message.mentions.users.first());

                    // Sets the persons score if they don't have one yet
                    if (!score[setPerson.id]) {
                        score[setPerson.id] = 0
                        db.set(`score_${message.guild.id}`, {
                            score: score
                        });
                        scoreDB = db.fetch(`score_${message.guild.id}`);
                        score = scoreDB.score
                    };

                    // Sets the score and resets all variables
                    score[setPerson.id] = parseFloat(args[3]);
                    db.set(`score_${message.guild.id}`, {
                        score: score
                    });
                    scoreDB = db.fetch(`score_${message.guild.id}`);
                    score = scoreDB.score;

                    // Creates an array for all of the scores
                    const scoreSetArray = Object.entries(score)
                        .map(value => `${value[1]} - ${message.guild.member(bot.users.cache.get(value[0].toString())).toString()}`)
                        .sort((a, b) => b.split(" - ")[0] - a.split(" - ")[0]);

                    // Creates the embed
                    if (!args[4]) args.push("No Reason Specified");
                    const scoreSetEmbed = new Discord.MessageEmbed()
                        .setTitle(`${message.guild.name}: \`Set Score\``)
                        .setDescription(`Reason: ${args.splice(4).join(" ")}, Member: ${setPerson.displayName}`)
                        .setColor(0x2ca6a1)
                        .setAuthor(message.member.displayName)
                        .setThumbnail(setPerson.user.avatarURL())
                        .addField(`${message.guild.name} Score:`, scoreSetArray)
                        .setURL('https://discord.gg/Buq9dCP')
                        .setTimestamp()
                        .setFooter('Webs Trivia™️');

                    // Sends the embed
                    message.channel.send(scoreSetEmbed);
                    break;
                case 'sub':

                    // Checks if there is a third argument and it is a member mention
                    if (!args[2]) return message.channel.send('You didn\'t provide a third argument (a member mention) (ex: sbs sub @Ferotiq#2857 1 This is an example)');
                    if (!message.guild.member(message.mentions.users.first())) return message.channel.send('You didn\'t provide a member mention! (ex: sbs sub @Ferotiq#2857 1 This is an example)');

                    // Checks if there is a fourth argument and it is a number)
                    if (!args[3]) return message.channel.send('You didn\'t supply a number to subtract!');
                    if (isNaN(args[3])) return message.channel.send(`${args[3]} is :regional_indicator_n: :regional_indicator_a: :regional_indicator_n: (Not a number)`);

                    // Stores the member mention in a variable
                    let subPerson = message.guild.member(message.mentions.users.first());

                    // Sets the persons score if they don't have one yet
                    if (!score[subPerson.id]) {
                        score[subPerson.id] = 0
                        db.set(`score_${message.guild.id}`, {
                            score: score
                        });
                        scoreDB = db.fetch(`score_${message.guild.id}`);
                        score = scoreDB.score
                    };

                    // Subtracts the score and resets all variables
                    score[subPerson.id] = parseFloat(score[message.author.id]) - parseFloat(args[3]);
                    db.set(`score_${message.guild.id}`, {
                        score: score
                    });
                    scoreDB = db.fetch(`score_${message.guild.id}`);
                    score = scoreDB.score;

                    // Creates an array for all of the scores
                    const scoreSubArray = Object.entries(score)
                        .map(value => `${value[1]} - ${message.guild.member(bot.users.cache.get(value[0].toString())).toString()}`)
                        .sort((a, b) => b.split(" - ")[0] - a.split(" - ")[0]);

                    // Creates the embed
                    if (!args[4]) args.push("No Reason Specified");
                    const scoreSubEmbed = new Discord.MessageEmbed()
                        .setTitle(`${message.guild.name}: \`Subtract Score\``)
                        .setDescription(`Reason: ${args.splice(4).join(" ")}, Member: ${subPerson.displayName}`)
                        .setColor(0x2ca6a1)
                        .setAuthor(message.member.displayName)
                        .setThumbnail(subPerson.user.avatarURL())
                        .addField(`${message.guild.name} Score:`, scoreSubArray)
                        .setURL('https://discord.gg/Buq9dCP')
                        .setTimestamp()
                        .setFooter('Webs Trivia™️');

                    // Sends the embed
                    message.channel.send(scoreSubEmbed);
                    break;
                case 'lb':

                    // Creates an array for all of the scores
                    const scoreLBArray = Object.entries(score)
                        .map(value => `${value[1]} - ${message.guild.member(bot.users.cache.get(value[0].toString())).toString()}`)
                        .sort((a, b) => b.split(" - ")[0] - a.split(" - ")[0]);

                    // Creates the embed
                    const scoreLBEmbed = new Discord.MessageEmbed()
                        .setTitle(`${message.guild.name}: \`Score Leaderboard\``)
                        .setColor(0x2ca6a1)
                        .setAuthor(message.member.displayName)
                        .setThumbnail(message.author.avatarURL())
                        .addField(`${message.guild.name} Score:`, scoreLBArray)
                        .setURL('https://discord.gg/Buq9dCP')
                        .setTimestamp()
                        .setFooter('Webs Trivia™️');

                    // Sends the embed
                    message.channel.send(scoreLBEmbed);
                    break;
                case 'wipe':

                    // Resets the score
                    db.set(`score_${message.guild.id}`, {
                        score: {}
                    });
                    scoreDB = db.fetch(`score_${message.guild.id}`);
                    score = scoreDB.score

                    // Sends a message showing completion
                    message.channel.send('Scores are wiped!');
                    break;
                case 'else':

                    // Checks if the person exists
                    let elsePerson = message.guild.member(message.mentions.users.first());
                    if (!elsePerson) return message.channel.send('You didn\'t supply a user!');

                    // Checks if the person has score, if not, then stop the code and send a message
                    if (!score[elsePerson.id]) return message.channel.send('That person is not in the current Trivia Session!');

                    // Sends a message to show the author the person's score
                    message.reply(`${elsePerson.displayName} has ${score[elsePerson.id]} score!`);
                    break;
            }
        }
    }
}