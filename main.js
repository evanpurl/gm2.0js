const fs = require('node:fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config/token.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] });
module.exports.bot = client;

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	console.log(`I have signed in as user ${client.user.username}!`);
	client.user.setActivity('Powered by Nite Life Software:\nhttps://www.nitelifesoftware.com', {type: 'PLAYING'});
});

//joined a server
client.on('guildCreate', (guild) => {
	if (!fs.existsSync(`./servers/${guild.id}`)) {
		fs.mkdir(`./servers/${guild.id}`, (err)=> {if (err){console.error(err);}});
		console.log("Joined a new guild: " + guild.name);
	} else {
		console.log("Rejoining existing guild: " + guild.name);
	}	
	
});

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.on('messageCreate', (message) => {
	if (message.author.bot) return;
  });

client.login(token);
