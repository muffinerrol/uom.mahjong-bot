const { REST, SlashCommandBuilder, Routes } = require('discord.js');
const { clientId, guildId, discord_token } = require('./config.json');

const commands = [
	new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
	new SlashCommandBuilder().setName('server').setDescription('Replies with server info!'),
	new SlashCommandBuilder().setName('leaderboard').setDescription('Check who are on this month\'s leaderboard podium.'),
    new SlashCommandBuilder().setName('check').setDescription('Check your score on the Monthly Leaderboard.').addStringOption(option => option.setName('name').setDescription('The name to be searched.').setRequired(true)),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(discord_token);

/* publish to test guild
rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then((data) => console.log(`Successfully registered ${data.length} application commands.`))
	.catch(console.error);
*/

rest.put(Routes.applicationCommands(clientId), { body: commands })
	.then((data) => console.log(`Successfully registered ${data.length} application commands.`))
	.catch(console.error);