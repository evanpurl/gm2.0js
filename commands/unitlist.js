const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment } = require('discord.js');
const fs = require('node:fs');

module.exports = {
    
	data: new SlashCommandBuilder()
		.setName('unitlist')
		.setDescription('Command to look up units in your GM group.'),

	async execute(interaction) {
        const { guild } = interaction;
        const units = [];

        if (fs.existsSync(`./servers/${guild.id}/units`)) {
            fs.readdir(`./servers/${guild.id}/units`, (err, filenames) => {
                if (err) {
                    console.log(err);
                    return;
                } else {
                    filenames.forEach(file => {
                        units.push(`${file.replace('.txt', '')}\n`);
                    });
                    interaction.reply({ content: `Server units:\n**${units.join('')}**`, ephemeral: true });
                    return;
                }
            });
		} else {
            interaction.reply({content: "Units not found.", ephemeral: true });
            return;
        };
}
}