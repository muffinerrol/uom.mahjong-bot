const { ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    data: { name : 'checkButton' },
    async execute(interaction) {

        //command starts here
  
        const checkModal = new ModalBuilder()
        .setCustomId('checkModal')
        .setTitle(`What's your leaderboard name?`);

        const searchName = new TextInputBuilder()
        .setCustomId('searchName')
        .setLabel('Please enter a search term.')
        .setStyle(TextInputStyle.Short)
        .setMaxLength(100);

        const checkRow = new ActionRowBuilder().addComponents(searchName);
        checkModal.addComponents(checkRow);     

        await interaction.showModal(checkModal);

    }
}