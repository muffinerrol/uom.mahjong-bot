require('dotenv').config({path:'process.env'});
const {discord_token} = require('./config.json');
const sheetCommands = require("./sheet-commands.js");

const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

app.get("/", (req, res) => res.type('html').send(html));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));


const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Hello from Render!</title>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
    <script>
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          disableForReducedMotion: true
        });
      }, 500);
    </script>
    <style>
      @import url("https://p.typekit.net/p.css?s=1&k=vnd5zic&ht=tk&f=39475.39476.39477.39478.39479.39480.39481.39482&a=18673890&app=typekit&e=css");
      @font-face {
        font-family: "neo-sans";
        src: url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
        font-style: normal;
        font-weight: 700;
      }
      html {
        font-family: neo-sans;
        font-weight: 700;
        font-size: calc(62rem / 16);
      }
      body {
        background: white;
      }
      section {
        border-radius: 1em;
        padding: 1em;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, -50%);
      }
    </style>
  </head>
  <body>
    <section>
      Hello from Render!
    </section>
  </body>
</html>
`

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

    if (interaction.commandName === 'ping') {
		await interaction.reply('Pong!');
	}

    //check command
    if (commandName === 'check') {
        const searchTerm = interaction.options.get('name').value;
        const searchResult = await sheetCommands.searchName(searchTerm);

        //no search result
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

        //too many search results
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

    //leaderboard command
    if (commandName === 'leaderboard') {
        const topThree = await sheetCommands.leaderboard();

        if (topThree.length == 0) {
            const noDataEmbed = new EmbedBuilder()
            .setColor('ffcc66')
            .setTitle('Leaderboard is empty!')
            .setAuthor({name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL()})
            .setDescription('There are no data available. Please wait until the scores have been recorded.')
            .setFooter({text: 'This message will self-destruct in 5 seconds.'});

            await interaction.reply({embeds: [noDataEmbed], fetchReply: true})
            .then(reply => {setTimeout(() => reply.delete(), 5000)});

            return;
        };

        let leaderboardEmbed = new EmbedBuilder()
        .setColor('ffcc66')
        .setTitle('Top 3 leaderboard')
        .setAuthor({name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL()})
        .setDescription('Here are the top 3 players in this month\'s leaderboard.')
        .setFooter({text: 'This message will self-destruct in 5 seconds.'});

        if (topThree.length >= 1) {leaderboardEmbed.addFields({ name: `1  ${topThree[0][0]}`, value: `${topThree[0][1]}` })};
        if (topThree.length >= 2) {leaderboardEmbed.addFields({ name: `2  ${topThree[1][0]}`, value: `${topThree[1][1]}` })};
        if (topThree.length >= 3) {leaderboardEmbed.addFields({ name: `3  ${topThree[2][0]}`, value: `${topThree[2][1]}` })};

        await interaction.reply({embeds: [leaderboardEmbed], fetchReply: true})
        .then(reply => {setTimeout(() => reply.delete(), 5000)});
        return;
    }
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isSelectMenu()) return;
	
    //check command: search result selected
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