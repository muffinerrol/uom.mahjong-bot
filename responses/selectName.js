const { EmbedBuilder } = require('discord.js');

const sheetCommands = require(require.main.path + '/googlesheet.js');

module.exports = {
    data: { name : 'selectName' },
    async execute(interaction) {

        //command starts here
        await interaction.deferUpdate();

        const answer = await interaction.values.toString();
        //console.log(`Check: score of ${answer} accessed`)

        const playerScore = await sheetCommands.fetchScore(answer);

        const scoreEmbed = new EmbedBuilder()
        .setColor('33cc33')
        .setAuthor({name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL()})
        .setTitle(`Score of ${answer}`)
        .addFields(
            { name: 'Score', value: `${playerScore[0]}`, inline: true },
            { name: 'Ranking', value: `${playerScore[1]}/${playerScore[2]}`, inline: true },
        )
        .setFooter({text: 'Please write down this value for safekeeping;\nthe score shown is for this month\'s leaderboard only.'});

        interaction.editReply({embeds: [scoreEmbed], components: [], ephemeral: true})
        //.then(reply => {setTimeout(() => reply.delete(), 5000)});   ephemeral messages cannot be deleted by bots
        
    }
}