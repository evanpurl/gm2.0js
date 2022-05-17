const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment } = require('discord.js');
const fs = require('node:fs');

module.exports = {
    
	data: new SlashCommandBuilder()
		.setName('units')
		.setDescription('Command to look up units in your GM group.'),

	async execute(interaction) {
        const { guild } = interaction;

        if (fs.existsSync(`./servers/${guild.id}/players/${interaction.user.id}.txt`)) {
            const file = new MessageAttachment(`./servers/${guild.id}/players/${interaction.user.id}.txt`)
            interaction.reply({ content: 'Here you go!', files: [file]});
            return;
		} else {
            interaction.reply({content: "User's group not found.", ephemeral: true })
            return;
        };
}
}