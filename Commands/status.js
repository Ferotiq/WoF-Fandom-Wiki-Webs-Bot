// Getting the database
const db = require('quick.db');

module.exports = {
    name: "status",
    description: "Shows or sets the status (on/off) of the bot",
    aliases: ["status"],
    usability: "🟧",

    execute(message, args, triviaOn, modRole) {

        // Checks if there is no second argument, if there isn't, then send the status of the bot
        if (!args[1]) return message.channel.send(`Trivia On: ${triviaOn}`)
        else {

            // Checks if the member has the permission to use the rest of the arguments
            if (!message.member.hasPermission('ADMINISTRATOR') && !message.member.roles.cache.get(modRole)) return message.reply('Permission\'t');

            // Second Arguments
            switch (args[1]) {
                case 'on':

                    // Checks if the bot is already on
                    if (triviaOn === "true") return message.reply('Trivia is already on!');
                    else {

                        // Turns the bot on
                        db.set(`triviaOn_${message.guild.id}`, "true");
                        triviaOn = db.fetch(`triviaOn_${message.guild.id}`);

                        // Sends a message showing completion
                        message.reply('Trivia is now on!');
                    }
                    break;
                case 'off':

                    // Checks if the bot is already off
                    if (triviaOn === "false") return message.reply('Trivia is already off!');
                    else {

                        // Turns the bot off
                        db.set(`triviaOn_${message.guild.id}`, "false");
                        triviaOn = db.fetch(`triviaOn_${message.guild.id}`);

                        // Sends a message showing completion
                        message.reply('Trivia is now off!');
                    }
                    break;
            }
        }
    }
}