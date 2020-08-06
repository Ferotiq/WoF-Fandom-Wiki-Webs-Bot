module.exports = {
    name: "snudoo",

    execute(message, snudooCooldown, bot, triviaOn, triviaOffMessage) {

        // Checks if the bot is on
        if (triviaOn !== "true") return message.reply(triviaOffMessage);

        // All cyclable messages
        const messages = [
            'SNUDOO!',
            ':musical_note: Beemish Snudoo, Bumpbump Snableday, Beemish Snudoo, Bumpbump Snableday :musical_note:',
            'Yim!',
            'Boobah!',
            'Herkle Turkle Mishoo.',
            'Looble Flooble Gooble.',
            'Florb!',
            'GWOSE!',
            'Snabble *poof!*',
            'RAWR? Bammo slammo eeeeeeenow?',
            'Eeeeeeepow?',
            'Ha HA! Beebuf! I sabladay! Me mish! Yim yim yim!',
            'STABEEBAD, YUUUUsafe.',
            'Meh meh *meh* meh meh.',
            'Meboo bope!',
            'Ooobeegoo, do NOBBY splamflamp.',
            'Beebuf!'
        ];

        // Creating a random number
        let random = Math.floor(Math.random() * messages.length)

        // Sending the message in the channel
        message.channel.send(messages[random]);
    }
}