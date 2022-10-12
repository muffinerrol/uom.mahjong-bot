const { EmbedBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    data: { name : 'selectRename' },
    async execute(interaction) {

        //command starts here

        const answer = interaction.values.toString();

        const securityEmbed = new EmbedBuilder()
        .setColor('ffcc66')
        .setTitle(`Renaming ${answer}`)
        .setAuthor({name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL()})
        .setDescription('Please complete the following prompt.');
  
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
        await interaction.editReply({embeds: [securityEmbed], components: [], ephemeral: true})
        //.then(reply => {setTimeout(() => reply.delete(), 5000)});   ephemeral messages cannot be deleted by bots

    }
}