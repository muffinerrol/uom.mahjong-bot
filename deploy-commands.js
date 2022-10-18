require('dotenv').config({path:'process.env'});

const fs = require('node:fs');
const path = require('node:path');

const { REST, Routes } = require('discord.js');
const { clientId, guildId, discord_token } = require('./config.json');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(discord_token);

/* publish to test guild
rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then((data) => console.log(`Successfully registered ${data.length} application commands.`))
	.catch(console.error);
*/


rest.put(Routes.applicationCommands(clientId), { body: commands })
	.then((data) => console.log(`Successfully registered ${data.length} application commands.`))
	.catch(console.error);


/*
rest.delete(Routes.applicationCommand(clientId, '1028779162091147364'))
	.then(() => console.log('Successfully deleted application command'))
	.catch(console.error);
*/

/* deleting guild command
rest.delete(Routes.applicationGuildCommand(clientId, guildId, '1027705889102241804'))
	.then(() => console.log('Successfully deleted guild command'))
	.catch(console.error);
*/