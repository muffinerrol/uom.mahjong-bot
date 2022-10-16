const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: { name : 'selectRename' },
    async execute(interaction) {

        //command starts here

        const answer = interaction.values.toString();

        const securityEmbed = new EmbedBuilder()
        .setColor('ffcc66')
        .setTitle(`Form submission`)
        .setAuthor({name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL()})
        .setDescription('Please press the button below to to provide more information.')
        .setFooter({text: `${answer}`});

		const formButtonRow = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('renameButton')
					.setLabel('Continue rename')
					.setStyle(ButtonStyle.Primary)
			);

        //await interaction.showModal(renameModal);
        await interaction.update({embeds: [securityEmbed], components: [formButtonRow], ephemeral: true})
        //.then(reply => {setTimeout(() => reply.delete(), 5000)});   ephemeral messages cannot be deleted by bots

    }
}