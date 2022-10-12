const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Pong.'),
    async execute(interaction) {

        //command starts here

        await interaction.reply({content: `Pong! The latency is ${Date.now() - interaction.createdTimestamp}ms.`, fetchReply: true})
        .then(
            reply => {setTimeout(() => reply.delete(), 3000)}
        );

    }
}