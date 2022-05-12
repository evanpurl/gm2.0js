const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment } = require('discord.js');
const fs = require('node:fs');

module.exports = {
    
	data: new SlashCommandBuilder()
		.setName('battle')
		.setDescription('Command to start a battle.')
        .addUserOption((option) =>
            option.setName('user')
            .setDescription('User you want to battle against.')
            .setRequired(true)),

	async execute(interaction) {
        const { guild } = interaction;
        const playertwo = interaction.guild.members.cache.get(interaction.options.getUser('user').id) || interaction.guild.members.cache.fetch(interaction.options.getUser('user').id)
        const playerone = interaction.guild.member;
        if (fs.existsSync(`./servers/${guild.id}/players/${interaction.user.id}.txt`)) { // Player one's group finder.
            interaction.reply(`${interaction.user.username}'s group has been found.`);
		} else {
            interaction.reply({content: `${interaction.user.username}'s group not found.`}) // If player one has no group.
            return
        };
        if (fs.existsSync(`./servers/${guild.id}/players/${playertwo.id}.txt`)) { // Player two's group finder.
            interaction.reply(`${playertwo.username}'s group has been found.`);
		} else {
            interaction.reply({content: `${playertwo.username}'s group not found.`}) // If player two has no group.
            return
        };
        
    }
}