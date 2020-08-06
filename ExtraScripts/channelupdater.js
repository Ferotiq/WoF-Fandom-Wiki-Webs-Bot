module.exports = {
    name: "channelupdater",

    execute(bot) {

        // Grabs bot.guilds and updates the voice channel name to show it
        bot.guilds.cache.get('702655443759005806')
        .channels.cache.get('714691350393520219')
        .setName(`Bot Guilds: ${bot.guilds.cache.size}`);

        // Grabs bot.users and updates the voice channel name to show it
        bot.guilds.cache.get('702655443759005806')
        .channels.cache.get('714695580814934047')
        .setName(`Bot Guilds: ${bot.users.cache.size}`);
    }
}