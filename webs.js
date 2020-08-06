// Const chain for essential variables
// Discord is the discord library needed to communicate with Discord
const Discord = require('discord.js'),

    // Bot is a new Discord Client
    bot = new Discord.Client(),

    // Fs is the built in Node JS file system module
    fs = require('fs'),

    // Db is for quick.db (A fast sqlite database)
    db = require('quick.db'),

    // ModMute is a new set to mute trivia mods from questions
    modMute = new Set(),

    // SnudooCooldown is a new set to restrict use of the snudoo command
    snudooCooldown = new Set(),

    // Grabbing the prefix and token from a config file and setting them into different variables
    {
        token
    } = require('./Data/config.json');

// Creating a new Discord Collection for all of the commands
// Creating the collection in the bot.commands variable
bot.commands = new Discord.Collection();

// Creating a new variable as an array for all of the command files
const commandFiles = fs.readdirSync('./Commands').filter(file => file.endsWith('.js'));

// For loop making sure that all of the files are inserted in the collection
for (const file of commandFiles) {

    // Creating a new variable for requiring the command
    const command = require(`./Commands/${file}`);

    // Setting the command into the collection under its name
    bot.commands.set(command.name, command);
};

// Creating a new Discord Collection for all of the extra scripts
// Creating the collection in the bot.extraScripts variable
bot.extraScripts = new Discord.Collection();

// Creating a new variable as an array for all of the extra script files
const extraScriptFiles = fs.readdirSync('./ExtraScripts').filter(file => file.endsWith('.js'));

// For loop making sure that all of the files are inserted in the collection
for (const file of extraScriptFiles) {

    // Creating a new variable for requiring the extra script
    const extraScript = require(`./ExtraScripts/${file}`);

    // Setting the extra script into the collection under its name
    bot.extraScripts.set(extraScript.name, extraScript);
};

// Declaring an uptime variable
let uptimeStart;

// Ready listener to log to the console that the bot is ready once the bot is ready
bot.on('ready', () => {
    console.log(`${bot.user.username} is online!`);
    uptimeStart = new Date();
});

// Start running the status script to change the bot status
bot.extraScripts.get('status').execute(bot);

// Message listener to run all of the commands asynchronously
bot.on('message', async message => {

    // Stopping the code if the message was done in the DMs
    if (!message.guild) return;

    // Let chain for essential variables
    // Custom variable for prefix
    let prefix,

        // The prefix of that guild
        prefixes = await db.fetch(`prefix_${message.guild.id}`),

        // Custom variable for setting an operator role
        modRole,

        // The operator role of that guild
        modRoles = await db.fetch(`modRole_${message.guild.id}`),

        // Custom variable for turning bot commands on/off
        triviaOn,

        // The message to send when the bot is off
        triviaOffMessage = 'You cannot use this commmand when the bot is off!',

        // The status of the bot in that guild
        TriviaOn = await db.fetch(`triviaOn_${message.guild.id}`),

        // Custon variable for the only channel the bot will listen to
        onlyChannel,

        // The only channel the bot will listen to in that guild
        onlyChannels = await db.fetch(`onlyChannel_${message.guild.id}`),
        score,
        scores = await db.fetch(`score_${message.guild.id}`);

    // If and else statements of making sure all the previous variables aren't null
    if (prefixes == null) {
        prefix = "sb";
        db.set(`prefix_${message.guild.id}`, "sb");
    } else {
        prefix = prefixes;
    };

    // Variable to store all of the arguments that are separated by a space
    let args = message.content.substring(prefix.length).split(" ");
    if (modRoles == null) {
        modRole = 000000000000000000;
        db.set(`modRole_${message.guild.id}`, 000000000000000000);
    } else {
        modRole = modRoles;
    };
    if (TriviaOn == null) {
        triviaOn = "false";
        db.set(`triviaOn_${message.guild.id}`, "false");
    } else {
        triviaOn = TriviaOn;
    };
    if (onlyChannels == null) {
        onlyChannel = 000000000000000000;
        db.set(`onlyChannel_${message.guild.id}`, 000000000000000000);
    } else {
        onlyChannel = onlyChannels
    };
    if (scores == null) {
        score = {};
        db.set(`score_${message.guild.id}`, {
            score: {}
        });
    } else {
        score = scores;
    }

    // Run the channelupdater script
    bot.extraScripts.get('channelupdater').execute(bot);

    // Making sure that the author of the message is not a bot
    if (message.author.bot === true) return;

    // Checks to see if the channel is the only channel
    if ( /* ParseFloat is used to make sure that the onlyChannel variable is a number */ parseFloat(onlyChannel) !== 000000000000000000) {
        if (parseFloat(message.channel.id) !== parseFloat(onlyChannel)) return;
    };

    if (message.content.startsWith(`${prefix}m`)) bot.commands.get('moderation').execute(message, args, onlyChannel, prefix);

    // Reacting to gundew on a 10% chance with the gundew emoji
    if (message.content.toLowerCase().includes('gundew')) {
        let Random = Math.floor(Math.random() * 10) + 1;
        if (Random = 5) message.react('698332536585322557');
    };

    // Running the snudoo command if someone says "snudoo"
    if (message.content.toLowerCase().includes('snudoo')) {
        bot.extraScripts.get('snudoo').execute(message, snudooCooldown, bot, triviaOn, triviaOffMessage);
    };

    // Making sure that the message starts with the prefix to run the next commands
    if (message.content.startsWith(prefix) === false) return;

    // Switch for the commands:
    switch (args[0]) {

        // Case 'reload' is for the Dev (Ferotiq)
        case 'reload':
        case 'r': {
            bot.commands.get('reload').execute(message, args, bot);
            break;
        }
        case 'help':
        case 'h': {
            bot.commands.get('help').execute(message, args, bot, modRole);
            break;
        }
        case 'score':
        case 's': {
            bot.commands.get('score').execute(message, args, bot, modRole, triviaOn, triviaOffMessage);
            break;
        }
        case 'uptime':
        case 'u': {
            bot.commands.get('uptime').execute(message, uptimeStart);
            break;
        }
        case 'status':
            bot.commands.get('status').execute(message, args, triviaOn, modRole);
            break;
        default:
            if (!message.content.startsWith(`${prefix}m`)) message.channel.send('Unknown command, do /help or /h to get help!');
    };
});

// Logging the bot in with the token from the config file
bot.login(token);