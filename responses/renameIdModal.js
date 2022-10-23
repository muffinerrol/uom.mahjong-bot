const { EmbedBuilder } = require('discord.js');

const sheetCommands = require(require.main.path + '/googlesheet.js');

module.exports = {
    data: { name : 'renameIdModal' },
    async execute(interaction) {

        //command starts here

        await interaction.deferUpdate();

        const studentID = interaction.fields.getTextInputValue('studentID');
        const newName = interaction.fields.getTextInputValue('newName').trim();
        const oldName = interaction.message.embeds[0].footer.text;
        console.log(`Rename: ${oldName} is going to become ${newName}`);

        //form items cannot only contains spaces
        if (studentID.replace(/\s/g, '').length == 0 || newName.replace(/\s/g, '').length == 0) {

          const errorEmbed = new EmbedBuilder()
          .setColor('ff0000')
          .setTitle('Textbox content is empty')
          .setAuthor({name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL()})
          .setDescription('One or more of the textbox contains only spaces.')
          .setFooter({text: `${oldName}`});

          await interaction.editReply({embeds: [errorEmbed], fetchReply: true, ephemeral: true})
          .then(
              //reply => {setTimeout(() => reply.delete(), 5000)}
          );
          return;
        }

        //check if student ID contains anything other than numbers
        if (/^\d+$/.test(studentID) == false) {
  
          const errorEmbed = new EmbedBuilder()
          .setColor('ff0000')
          .setTitle('ID contains non-numbers')
          .setAuthor({name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL()})
          .setDescription('Please make sure that the ID only contains numbers.')
          .setFooter({text: `${oldName}`});

          await interaction.editReply({embeds: [errorEmbed], fetchReply: true, ephemeral: true})
          .then(
              //reply => {setTimeout(() => reply.delete(), 5000)}
          );
          return;
        }

        //check if a name already exists (case insensitive)
        let newNameMatch = await sheetCommands.searchNameScoreless(newName);
        if (newNameMatch.find(result => result[0].toLowerCase() == newName.toLowerCase()) != undefined) {
  
          const errorEmbed = new EmbedBuilder()
          .setColor('ff0000')
          .setTitle('Name already exists')
          .setAuthor({name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL()})
          .setDescription('The new name you have entered already exists.')
          .setFooter({text: `${oldName}`});

          await interaction.editReply({embeds: [errorEmbed], fetchReply: true, ephemeral: true})
          .then(
              //reply => {setTimeout(() => reply.delete(), 5000)}
          );
          return;
        }

        //check if the student ID matches
        const foundName = await sheetCommands.searchNameScoreless(oldName);
        if (foundName[0][1] != studentID) {
  
          const errorEmbed = new EmbedBuilder()
          .setColor('ff0000')
          .setTitle('ID does not match.')
          .setAuthor({name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL()})
          .setDescription('The ID you have provided does not match our records.')
          .setFooter({text: `${oldName}`});

          await interaction.editReply({embeds: [errorEmbed], fetchReply: true, ephemeral: true})
          .then(
              //reply => {setTimeout(() => reply.delete(), 5000)}
          );
          return;
        }

        const result = await sheetCommands.updateName(oldName, newName);
        if (result === "findError") {
  
          const errorEmbed = new EmbedBuilder()
          .setColor('ff0000')
          .setTitle('Oh noes!')
          .setAuthor({name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL()})
          .setDescription('There is an internal error in renaming the player!\nPlease open a ticket in *#support* for diagnosis.');

          await interaction.editReply({embeds: [errorEmbed], components: [], fetchReply: true, ephemeral: true})
          .then(
              //reply => {setTimeout(() => reply.delete(), 5000)}
          );
          return;
        }

        const successEmbed = new EmbedBuilder()
        .setColor('33cc33')
        .setAuthor({name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL()})
        .setTitle(`Name updated`)
        .addFields(
            { name: 'Your new name will be:', value: `${newName}` }
        )
        .setFooter({text: 'To change your name again please re-run this command.'});
        
        interaction.editReply({embeds: [successEmbed], components: [], ephemeral: true})
        //.then(reply => {setTimeout(() => reply.delete(), 5000)});   ephemeral messages cannot be deleted by bots

    }
}