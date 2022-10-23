const { ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    data: { name : 'renameProceedButton' },
    async execute(interaction) {

        //command starts here

        const answer = interaction.message.embeds[0].footer.text;
  
        const renameIdModal = new ModalBuilder()
        .setCustomId('renameIdModal')
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
        renameIdModal.addComponents(newNameRow, studentIDRow);     

        await interaction.showModal(renameIdModal);

    }
}