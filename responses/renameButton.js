const { ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    data: { name : 'renameButton' },
    async execute(interaction) {

        //command starts here
  
        const renameModal = new ModalBuilder()
        .setCustomId('renameModal')
        .setTitle(`What's your leaderboard name?`);

        const searchName = new TextInputBuilder()
        .setCustomId('searchName')
        .setLabel('Please enter a search term.')
        .setStyle(TextInputStyle.Short)
        .setMaxLength(100);

        const renameRow = new ActionRowBuilder().addComponents(searchName);
        renameModal.addComponents(renameRow);     

        await interaction.showModal(renameModal);

    }
}