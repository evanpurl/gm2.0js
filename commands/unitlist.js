const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment } = require('discord.js');
const fs = require('node:fs');

module.exports = {
    
	data: new SlashCommandBuilder()
		.setName('unitlist')
		.setDescription('Command to look up units in your server'),

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
                    if (units.join('').length >= 1500){
                        interaction.reply({content: "Too many units to display, please delete some and try again.", ephemeral: true})
                    } else{
                        interaction.reply({ content: `Server units:\n**${units.join('')}**`, ephemeral: true });
                    return;
                    }
                }
            });
		} else {
            interaction.reply({content: "Units not found.", ephemeral: true });
            return;
        };
    }
}