const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
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
        const playerone = interaction;
        if (fs.existsSync(`./servers/${guild.id}/players/${playerone.user.id}.txt`)) { // Player one's group finder.
            playerone.found = true;
		} else {
            playerone.found = false;
        };
        if (fs.existsSync(`./servers/${guild.id}/players/${playertwo.user.id}.txt`)) { // Player two's group finder.
            playertwo.found = true;
		} else {
            playertwo.found = false;
        };

        if (playerone.found && playertwo.found) {
            // const unitembed = new MessageEmbed() // Embed Start
            //     .setColor('#FFFFFF')
            //     .setTitle(`${playerone.user} vs ${playertwo.user}`)
            //     .setDescription('Battle command')
            //     .addFields(
            //         { name: 'Unit Name:', value: interaction.options.getString('unit_name'), inline: true},
            //         { name: 'Shields:', value: String(interaction.options.getInteger('shields')), inline: true},
            //         { name: 'Health:', value: String(interaction.options.getInteger('health')), inline: true},
            //         { name: 'Shield Damage:', value: String(interaction.options.getInteger('shield_damage')), inline: true},
            //         { name: 'Damage:', value: String(interaction.options.getInteger('damage')), inline: true},
            //     )
            //     .setTimestamp() // Embed end
            interaction.reply("**Groups found, battle command is starting.**")
            // Battle goes here.
        } else{
            interaction.reply("**Battle command not starting.**") // If group not found, does not start battle.
            if (playerone.found){
                interaction.channel.send(`${playerone.user}'s group has been found.`)
            } else {
                interaction.channel.send(`${playerone.user}'s group has not been found.`)
            };
            if (playertwo.found){
                interaction.channel.send(`${playertwo.user}'s group has been found.`)
            } else {
                interaction.channel.send(`${playertwo.user}'s group has not been found.`)
            }
        };
        
        
    }
}