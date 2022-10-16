const { ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    data: { name : 'renameButton' },
    async execute(interaction) {

        //command starts here

        const answer = interaction.message.embeds[0].footer.text;
  
        const renameModal = new ModalBuilder()
        .setCustomId('renameModal')
        .setTitle(`Renaming ${answer}`);

        const newNameText = new TextInputBuilder()
        .setCustomId('newName')
        .setLabel('What would be your new name?')
        .setStyle(TextInputStyle.Short)
        .setMaxLength(100);

        const studentIDText = new TextInputBuilder()
        .setCustomId('studentID')
        .setLabel('For security, please enter the student ID.')
        .setStyle(TextInputStyle.Short)
        .setMinLength(8)
        .setMaxLength(8);

        const newNameRow = new ActionRowBuilder().addComponents(newNameText);
        const studentIDRow = new ActionRowBuilder().addComponents(studentIDText);
        renameModal.addComponents(newNameRow, studentIDRow);     

        await interaction.showModal(renameModal);

    }
}