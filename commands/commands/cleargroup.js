const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fs = require('node:fs');
const closest_match = require("closest-match");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cleargroup')
		.setDescription('Command to clear units from a GM group.'),

	async execute(interaction) {
        const { guild } = interaction;
        
        if (fs.existsSync(`./servers/${guild.id}/players/${interaction.user.id}.txt`)){
            fs.rm(`./servers/${guild.id}/players/${interaction.user.id}.txt`, err => {
                if (err){
                    console.log(err);
                    interaction.reply({content: "There was an issue clearing your group.", ephemeral: true})
                    return;
                }
            });
            interaction.reply({content: "Your group has been cleared!", ephemeral: true})
        } else {
            interaction.reply({content: "Group not found", ephemeral: true})
        }
        
    }
};