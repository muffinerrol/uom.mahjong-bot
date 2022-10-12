const { EmbedBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } = require('discord.js');

const sheetCommands = require(require.main.path + '/sheet-commands.js');

module.exports = {
    data: { name : 'renameModal' },
    async execute(interaction) {

        //command starts here

        await interaction.deferUpdate();

        const studentID = interaction.fields.getTextInputValue('studentID');
        const newName = interaction.fields.getTextInputValue('newName');
        const oldName = interaction.message.embeds[0].title.replace('Renaming ', '');

        console.log(studentID, oldName, newName);

        //check if student ID contains anything other than numbers
        if (/^\d+$/.test(studentID) == false) {
          console.log('here lies the reply for student ID containing non-digits');
          return;
        }

        //check if a name already exists (case insensitive)
        let newNameMatch = await sheetCommands.searchNameScoreless(newName);
        if (newNameMatch.find(result => result[0].toLowerCase() == newName.toLowerCase()) != undefined) {
          console.log(newNameMatch)
          console.log('here lies the reply for name already exist');
          return;
        }

        //check if the student ID matches
        const foundName = await sheetCommands.searchNameScoreless(oldName);
        if (foundName[0][1] != studentID) {
          console.log('here lies student ID not matched');
          return;
        }

        sheetCommands.updateName(oldName, newName);
        console.log('Successfully changed player name');

        //interaction.editReply({embeds: [scoreEmbed], components: [], ephemeral: true})
        //.then(reply => {setTimeout(() => reply.delete(), 5000)});   ephemeral messages cannot be deleted by bots

    }
}