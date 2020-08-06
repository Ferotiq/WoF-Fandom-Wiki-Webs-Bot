module.exports = {
    name: "uptime",
    description: "Shows how long the bot has been online",
    aliases: ["uptime", "u"],
    usability: "🟩",

    execute(message, uptimeStart) {

        // Get the current time
        let uptimeEnd = new Date();

        // Set a number to divide by
        let divisionNumber = 1000;

        // Set a unit in a string
        let unit = "seconds";

        // Subtract the two Dates
        let uptimeSub = uptimeEnd - uptimeStart;

        // Change divisionNumber and unit if the uptimeSub values are higher than a certain milestone (minute, hour, day)
        if (uptimeSub > 86400000) {
            divisionNumber = 86400000;
            unit = "days";
        } else if (uptimeSub > 3600000) {
            divisionNumber = 3600000;
            unit = "hours";
        } else if (uptimeSub > 60000) {
            divisionNumber = 60000;
            unit = "minutes";
        };

        // Finally calculate the uptime
        let uptime = Math.floor(uptimeSub / divisionNumber);

        // Send the message
        message.channel.send(`Uptime: ${uptime} ${unit}.`);
    }
}