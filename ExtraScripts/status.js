module.exports = {
    name: "status",

    execute(bot) {

        // Making an interval to run the code that's inside it every 30 seconds
        bot.setInterval(() => {

            // Making an array of activities
            const activities = [
                'annoying dragonets',
                `over Trivia in ${bot.guilds.cache.size} servers.`,
                'WOF Memes',
                `for cheaters out of ${bot.users.cache.size}`,
                `Trivia in ${bot.guilds.cache.size} servers.`,
                `${bot.guilds.cache.size} Leaderboards`,
                'only civil people'
            ];

            // Making a ranomd number for use in the arrays
            let random = Math.floor(Math.random() * activities.length);

            // Pulling a single activity by the index of the random number
            let activity = activities[random];

            // Declaring a status variable and changing it based on the random number
            let status;
            if (random = 0 | 1 | 2 | 3) status = 'WATCHING'
            else if (random = 4) status = 'PLAYING'
            else if (random = 5) status = 'STREAMING'
            else status = 'LISTENING';

            // Declaring a streamURL variable and changing it based on the random number
            let streamURL;
            if (random = 6) streamURL = 'https://www.twitch.tv/ferotiq'
            else streamURL = 'Not Streaming';

            // Setting the status based on if the url is the stream url or just the activity/status
            if (streamURL === 'https://www.twitch.tv/ferotiq') {
                bot.user.setActivity(activity, {
                    type: status,
                    url: streamURL
                });
            } else {
                bot.user.setActivity(activity, {
                    type: status
                });
            };
        }, 30000);
    }
}