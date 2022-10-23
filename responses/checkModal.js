const { EmbedBuilder, SelectMenuBuilder, ActionRowBuilder } = require('discord.js');

const sheetCommands = require(require.main.path + '/googlesheet.js');

module.exports = {
    data: { name : 'checkModal' },
    async execute(interaction) {

        //command starts here
  
        const searchTerm = interaction.fields.getTextInputValue('searchName');
        const searchResult = await sheetCommands.searchName(searchTerm);

        //no search result
        if (searchResult.length == 0) {

            const noresultEmbed = new EmbedBuilder()
            .setColor('ff0000')
            .setTitle('No result found')
            .setAuthor({name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL()})
            .setDescription('Please refine your query as there are no valid matches.');

            await interaction.reply({embeds: [noresultEmbed], fetchReply: true, ephemeral: true})
            .then(
                //reply => {setTimeout(() => reply.delete(), 5000)}
            );
            return;
        }

        //too many search results
        if (searchResult.length > 10) {

            const toomanyEmbed = new EmbedBuilder()
            .setColor('ff0000')
            .setTitle('Too many results')
            .setAuthor({name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL()})
            .setDescription('Please refine your query as there are too many valid matches.');

            await interaction.reply({embeds: [toomanyEmbed], fetchReply: true, ephemeral: true})
            .then(
                //reply => {setTimeout(() => reply.delete(), 5000)}
            );
            return;
        }

        const searchEmbed = new EmbedBuilder()
            .setColor('ffcc66')
            .setTitle('Search Result')
            .setAuthor({name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL()})
            .setDescription('Please select from one of the options below.');

        let rowOptions = [];
        
        for (foundName in searchResult) {
            rowOptions.push({ label: searchResult[foundName].toString(), value: searchResult[foundName].toString() });
        };

        const searchResultRow = new ActionRowBuilder()
            .addComponents(
                new SelectMenuBuilder()
                    .setCustomId('selectName')
                    .setPlaceholder('Select a name here.')
                    .addOptions(rowOptions)
            )

        await interaction.reply({embeds: [searchEmbed], components: [searchResultRow], fetchReply: true, ephemeral: true})
        .then(
            //setTimeout(() => {interaction.editReply({embeds: [timeoutEmbed], components: []}).then(reply => {setTimeout(() => reply.delete(), 3000)})}, 10000)
        );
        return;

    }
}