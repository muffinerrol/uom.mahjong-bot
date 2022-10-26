const { EmbedBuilder } = require('discord.js');

const sheetCommands = require(require.main.path + '/googlesheet.js');

module.exports = {
    data: { name : 'leaderboardButton' },
    async execute(interaction) {

        //command starts here
        await interaction.deferReply();
  
        const topThree = await sheetCommands.leaderboard();

        if (topThree.length == 0) {
            const noDataEmbed = new EmbedBuilder()
            .setColor('ff0000')
            .setTitle('Leaderboard is empty!')
            .setAuthor({name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL()})
            .setDescription('There are no data available. Please wait until the scores have been recorded.')
            .setFooter({text: 'This message will self-destruct in 5 seconds.'});

            await interaction.editReply({embeds: [noDataEmbed], fetchReply: true})
            .then(reply => {setTimeout(() => reply.delete(), 5000)});

            return;
        };

        let leaderboardEmbed = new EmbedBuilder()
        .setColor('33cc33')
        .setTitle('Top 3 leaderboard')
        .setAuthor({name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL()})
        .setDescription('Here are the top 3 players in this month\'s leaderboard.')
        .setFooter({text: 'This message will self-destruct in 10 seconds.'});

        if (topThree.length >= 1) {leaderboardEmbed.addFields({ name: `1  ${topThree[0][0]}`, value: `${topThree[0][1]}` })};
        if (topThree.length >= 2) {leaderboardEmbed.addFields({ name: `2  ${topThree[1][0]}`, value: `${topThree[1][1]}` })};
        if (topThree.length >= 3) {leaderboardEmbed.addFields({ name: `3  ${topThree[2][0]}`, value: `${topThree[2][1]}` })};

        console.log('Leaderboard: leaderboard accessed')

        await interaction.editReply({embeds: [leaderboardEmbed], fetchReply: true})
        .then(reply => {setTimeout(() => reply.delete(), 10000)});
        return;

    }
}