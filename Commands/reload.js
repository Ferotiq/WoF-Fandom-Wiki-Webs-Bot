module.exports = {
    name: "reload",
    description: "Reloads a command (Dev only)",
    aliases: ["reload", "r"],
    usability: "🟥",

    execute(message, args, bot) {
        // Checks if the author is the Dev (Ferotiq)
        if (message.author.id !== '325757696118882305') return message.channel.send('Permission\'t');

        // Checks if there is a second argument
        if (!args[1]) return message.channel.send('You didn\'t specify a command!');

        // Stores the first argument into a variable
        let command = args[1],

            // Stores the commands collection into a different variable
            commands = bot.commands;

        // Checks if the argument is a command
        if (!commands.get(command)) return message.channel.send(`${command} is not a command!`);

        // Deletes stored cache of the command
        delete require.cache[require.resolve(`./${command}.js`)];

        // Rerequiring the command and setting it back in the collection again
        try {
            const newCommand = require(`./${command}.js`);
            bot.commands.set(newCommand.name, newCommand);
        } catch (error) {
            console.log(error);
            message.channel.send(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``);
        }

        // Sends a message showing completion
        message.channel.send(`Successfully reloaded command: \`${command}\` from the require cache.`);
    }
}