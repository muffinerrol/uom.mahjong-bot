require('dotenv').config({path:'process.env'});
const {discord_token} = require('./config.json');

const fs = require('node:fs');
const path = require('node:path');

const express = require("express");
const app = express();

const port = process.env.PORT || 3001;

const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>uom.mahjong-bot status page</title>
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
      If you are seeing this, then this bot is probably online :)
    </section>
  </body>
</html>
`

const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, ModalBuilder, ActivityType, TextInputBuilder, TextInputStyle, Collection } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

//establishing commands handler
client.commands = new Collection();
const commandPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
}

//establishing interactions handler (selectMenu/ modals/ buttons)
client.responses = new Collection();
const responsePath = path.join(__dirname, 'responses');
const responseFiles = fs.readdirSync(responsePath).filter(file => file.endsWith('.js'));

for (const file of responseFiles) {
  const filePath = path.join(responsePath, file);
  const response = require(filePath);
  client.responses.set(response.data.name, response);
}

//script starts here
client.once('ready', () => {
  //required for pings and make Render know the deploy is successful
  app.get("/", (req, res) => res.type('html').send(html));
  app.listen(port, () => console.log(`Loaded, now hosted from port ${port}.`));

  client.user.setPresence({ activities: [{ type: ActivityType.Watching, name: 'the monthly leaderboard' }] });
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);
  if (!command) return;

  try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}

});

client.on('interactionCreate', async interaction => {
	if (interaction.isChatInputCommand()) return;

  const response = interaction.client.responses.get(interaction.customId);
  if (!response) return;

  try {
		await response.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this response!', ephemeral: true });
	}

});

client.login(discord_token);