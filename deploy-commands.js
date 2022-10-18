require('dotenv').config({path:'process.env'});

const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline').createInterface({
	input: process.stdin,
	output: process.stdout
});

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

readline.question("Is it register, or is it delete? (register/ delete)\n>", async command => {
	if (command == "register") {
	
		await rest.put(Routes.applicationCommands(clientId), { body: commands })
			.then((data) => console.log(`Successfully registered ${data.length} application commands.`))
			.catch(console.error);
		process.exit();
			
	} else if (command == "delete") {
	
		readline.question("What will be the command ID?\n>", async id => {
			await rest.delete(Routes.applicationCommand(clientId, id))
				.then(() => console.log('Successfully deleted application command'))
				.catch(console.error);
			process.exit();
		})

	} else {
	
		console.log("Command unknown! Please make sure it's either \"register\" or \"delete\".");
		process.exit();
	
	}
})