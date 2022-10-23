const { PermissionsBitField, SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Create a prompt for users to interact with. Mods only.'),
    async execute(interaction) {

        //command starts here

        //basic check to see if user is an administrator
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return;
        }

        const startupEmbed = new EmbedBuilder()
        .setColor('ffcc66')
        .setTitle('Welcome to my home!')
        .setAuthor({ name: interaction.client.user.username })
        .setDescription('If you would like my assistance, please click on one of the options below.')
        .addFields(
            { name: 'Check your score', value: 'Check your current leaderboard score.', inline: true },
            { name: 'View the podium', value: 'See who\'s the top 3 players for this month.', inline: true },
            { name: 'Change your name', value: 'Change your display name on the leaderboard.', inline: true }
        )
        .setFooter({ text: 'Now I am become Death, the destroyer of worlds.', iconURL: interaction.client.user.displayAvatarURL() });

		const commandRow = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('checkButton')
					.setLabel('Check your score')
					.setStyle(ButtonStyle.Primary)
			)
            .addComponents(
				new ButtonBuilder()
					.setCustomId('leaderboardButton')
					.setLabel('View the podium')
					.setStyle(ButtonStyle.Primary)
			)
            .addComponents(
				new ButtonBuilder()
					.setCustomId('renameButton')
					.setLabel('Change your name')
					.setStyle(ButtonStyle.Secondary)
                    .setDisabled(false)
			);

        await interaction.reply({embeds: [startupEmbed], components: [commandRow]})

    }
}