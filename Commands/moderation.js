// Getting the database
const db = require('quick.db');

module.exports = {
    name: "moderation",
    description: "Used by mods to set values for the bot",
    aliases: ["moderation", "m"],
    usability: "🟥",

    execute(message, args, onlyChannel, prefix, modRole) {

        // Makes sure the person issuing the command has the admin permission or the modRole
        if (!message.member.hasPermission('ADMINISTRATOR')) return message.reply('Permission\'t');

        // Makes sure there is a second argument
        if (!args[1]) return message.channel.send('You didn\'t provide a second argument! (Arguments: set, view)');

        // Second Arguments
        switch (args[1]) {
            case 'set':

                // Third Arguments
                switch (args[2]) {
                    case 'modrole':
                        if (!args[3]) return message.channel.send('You didn\'t provide a fourth argument! (ID of a role or a mention of a role)');
                        if (!message.guild.roles.cache.get(args[3]) && !message.mentions.roles.first() && args[3] !== '000000000000000000') return message.channel.send(`${args[3]} is not a valid role ID or mention`);
                        let newModRole;
                        if (!message.guild.roles.cache.get(args[3]) && args[3] !== '000000000000000000') newModRole = message.mentions.roles.first().id
                        else if (message.guild.roles.cache.get(args[3]) && args[3] !== '000000000000000000') newModRole = message.guild.roles.cache.get(args[3]).id
                        else newModRole = 000000000000000000;
                        db.set(`modRole_${message.guild.id}`, parseFloat(newModRole));
                        message.channel.send(`\`Operator Role\` set to \`${message.guild.roles.cache.get(newModRole).name}\`.`);
                        break;
                    case 'onlychannel':
                        if (!args[3]) return message.channel.send('You didn\'t provide a fourth argument! (ID of a channel or a mention of a channel)');
                        if (!message.guild.channels.cache.get(args[3]) && !message.mentions.channels.first() && args[3] !== '000000000000000000') return message.channel.send(`${args[3]} is not a valid channel ID or mention`);
                        let newOnlyChannel;
                        if (!message.guild.channels.cache.get(args[3]) && args[3] !== '000000000000000000') newOnlyChannel = message.mentions.channels.first().id
                        else if(message.guild.channels.cache.get(args[3]) && args[3] !== '000000000000000000') newOnlyChannel = message.guild.channels.cache.get(args[3]).id
                        else newOnlyChannel = 000000000000000000;
                        db.set(`onlyChannel_${message.guild.id}`, parseFloat(newOnlyChannel));
                        message.channel.send(`\`Listener Channel\` set to \`${message.guild.channels.cache.get(newOnlyChannel).name || newOnlyChannel}\`.`);
                        break;
                    case 'prefix':
                        if (!args[3]) return message.channel.send('You didn\'t provide a fourth argument!');
                        db.set(`prefix_${message.guild.id}`, args[3]);
                        message.channel.send(`\`Prefix\` set to \`${args[3]}\`.`);
                        break;
                    default:
                        message.channel.send(`${args[1]} is not a valid argument (Arguments: modrole, onlychannel, prefix)`);
                }
                break;
            case 'view':

                // Third Arguments
                switch (args[2]) {
                    case 'modrole':
                        message.reply(`Current \`Operator Role\` is \`${message.guild.roles.cache.get(modRole.toString()).name || 'Invalid or Not Set'}\`, ID: \`${modRole}\``);
                        break;
                    case 'onlychannel':
                        message.reply(`Current \`Listener Channel\` is \`${message.guild.channels.cache.get(onlyChannel.toString()).name || 'Invalid or Not Set'}\`, ID: \`${onlyChannel}\``);
                        break;
                    case 'prefix':
                        message.reply(`Current \`Prefix\` is \`${prefix}\``);
                        break;
                    default:
                        message.channel.send(`${args[1]} is not a valid argument (Arguments: modrole, onlychannel, prefix)`);
                }
                break;
            default:
                message.channel.send(`${args[1]} is not a valid argument (Arguments: set, view)`);
        }
    }
}