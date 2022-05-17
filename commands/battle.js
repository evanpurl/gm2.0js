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
        function gatherdata() {
            if (fs.existsSync(`./servers/${guild.id}/players/${playerone.user.id}.txt`)) { // Player one's group finder.
                playerone.unitnames = fs.readFileSync(`./servers/${guild.id}/players/${playerone.user.id}.txt`, 'utf-8').split("\n")
                playerone.found = true;
            } else {
                playerone.found = false;
            };
            if (fs.existsSync(`./servers/${guild.id}/players/${playertwo.user.id}.txt`)) { // Player two's group finder.
                playertwo.unitnames = fs.readFileSync(`./servers/${guild.id}/players/${playertwo.user.id}.txt`, 'utf-8').split("\n")
                playertwo.found = true;
            } else {
                playertwo.found = false;
            };
        };
        gatherdata();

        if (playerone.found && playertwo.found) {
            playerone.occur = {}
            playertwo.occur = {}
            playerone.unitnames.forEach(function(el){
                playerone.occur[el] = playerone.occur[el] + 1 || 1;
            })
            playertwo.unitnames.forEach(function(el){
                playertwo.occur[el] = playertwo.occur[el] + 1 || 1;
            })
            const unitembed = new MessageEmbed() // Embed Start
                .setColor('#FFFFFF')
                .setTitle(`${playerone.user.username} vs ${playertwo.user.username}`)
                .setDescription('Battle command')
                .addFields(
                    { name: `${playerone.user.username}`, value: `${JSON.stringify(playerone.occur, null, 2).replaceAll('"": 1', "").replaceAll("{", "").replaceAll("}", "")}`},
                    { name: `${playertwo.user.username}`, value: `${JSON.stringify(playertwo.occur, null, 2).replaceAll('"": 1', "").replaceAll("{", "").replaceAll("}", "")}`},
                )
                .setTimestamp() // Embed end
            await interaction.reply({content: "**Groups found, battle command is starting.**", embeds: [unitembed]})
        } else{
            interaction.reply("**Battle command not starting.**") // If group not found, does not start battle.
            if (playerone.found){
                interaction.channel.send(`${playerone.user}'s group has been found. Number of units: ${playerone.unitnames.length}`)
            } else {
                interaction.channel.send(`${playerone.user}'s group has not been found.`)
            };
            if (playertwo.found){
                interaction.channel.send(`${playertwo.user}'s group has been found. Number of units: ${playertwo.unitnames.length}`)
            } else {
                interaction.channel.send(`${playertwo.user}'s group has not been found.`)
            }
        };
        
        
    }
}