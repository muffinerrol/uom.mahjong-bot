require('dotenv').config({path:'process.env'});
const { discord_token } = require('./config.json');

const fs = require('node:fs');
const path = require('node:path');

const express = require("express");
const app = express();

const port = process.env.PORT || 3001;

const { Client, GatewayIntentBits, ActivityType, Collection } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const html = fs.readFileSync('./success.html', 'utf-8');

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
		//console.error(error);
		
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
		
	}

});

client.login(discord_token);