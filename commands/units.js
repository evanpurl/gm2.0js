const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment } = require('discord.js');
const fs = require('node:fs');

module.exports = {
    
	data: new SlashCommandBuilder()
		.setName('units')
		.setDescription('Command to look up units in your GM group.'),

	async execute(interaction) {
        const { guild } = interaction;
        interaction.user.occur = {}
        if (fs.existsSync(`./servers/${guild.id}/players/${interaction.user.id}.txt`)) {
            file = fs.readFileSync(`./servers/${guild.id}/players/${interaction.user.id}.txt`, 'utf-8').split(/\r?\n/);
            file.forEach(function(el) {
                interaction.user.occur[el] = interaction.user.occur[el] + 1 || 1;
            })
            interaction.user.umessage = JSON.stringify(interaction.user.occur, null, 2).replaceAll('"": 1', "").replaceAll("{", "").replaceAll("}", "").replaceAll(",", "").replaceAll('"', "");
                
            if (interaction.user.umessage.length >= 1500){
                interaction.reply({content: "Too many units to display, please delete some and try again.", ephemeral: true})
            } else{
                interaction.reply({ content: `${interaction.user.username}'s units:\n**${interaction.user.umessage}**`});
            return;
            }
            return;
		} else {
            interaction.reply({content: "User's group not found.", ephemeral: true })
            return;
        };
}
}