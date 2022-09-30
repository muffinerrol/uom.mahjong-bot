const {discord_token} = require('./config.json');
const sheetCommands = require("./sheet-commands.js");


const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, InteractionResponse } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const timeoutEmbed = new EmbedBuilder()
    .setColor('ff0000')
    .setTitle('Timeout')
    .setDescription('Please re-enter the command again. Sorry!');

//script starts here
client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'ping') {
		await interaction.reply('Pong!');
	} else if (commandName === 'server') {
		await interaction.reply('Server info.');
	} else if (commandName === 'user') {
		await interaction.reply('User info.');
	}

    //check a player's score
    if (commandName === 'check') {
        const searchTerm = interaction.options.get('name').value;
        const searchResult = await sheetCommands.searchName(searchTerm);

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

    if (commandName === 'leaderboard') {
        const topThree = await sheetCommands.leaderboard();

        const leaderboardEmbed = new EmbedBuilder()
        .setColor('ffcc66')
        .setTitle('Top 3 leaderboard')
        .setAuthor({name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL()})
        .setDescription('Here are the top 3 players in this month\'s leaderboard.')
        .addFields(
            { name: `1  ${topThree[0][0]}`, value: `${topThree[0][1]}` },
            { name: `2  ${topThree[1][0]}`, value: `${topThree[1][1]}` },
		    { name: `3  ${topThree[2][0]}`, value: `${topThree[2][1]}` },
        )
        .setFooter({text: 'This message will self-destruct in 5 seconds.'});

        await interaction.reply({embeds: [leaderboardEmbed], fetchReply: true})
        .then(reply => {setTimeout(() => reply.delete(), 5000)});
        return;
    }
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isSelectMenu()) return;
	
    //choosing a player after searching for score
    if (interaction.customId === "selectName") {

        await interaction.deferUpdate();

        const answer = interaction.values.toString();

        const receivedEmbed = interaction.message.embeds[0];

        const playerScore = await sheetCommands.fetchScore(answer);

        const scoreEmbed = new EmbedBuilder()
        .setColor('33cc33')
        .setAuthor({name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL()})
        .setTitle(`Score of ${answer}`)
        .addFields(
            { name: 'Score', value: `${playerScore[0]}`, inline: true },
            { name: 'Ranking', value: `${playerScore[1]}/${playerScore[2]}`, inline: true },
        )
        .setFooter({text: 'Please write down this value for safekeeping;\nthe score shown is for this month\'s leaderboard only.'});

        interaction.editReply({embeds: [scoreEmbed], components: [], ephemeral: true})
        //.then(reply => {setTimeout(() => reply.delete(), 5000)});   ephemeral messages cannot be deleted by bots
    }
});

client.login(discord_token);