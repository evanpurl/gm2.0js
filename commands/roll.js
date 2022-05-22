const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Command to roll a number from 1-20.'),

	async execute(interaction) {
        interaction.reply(`Rolled: ${Math.floor(Math.random()*20)+1}`)
	}
};