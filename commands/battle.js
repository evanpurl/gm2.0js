const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
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
        let turn;
        const { guild } = interaction;
        const playertwo = interaction.guild.members.cache.get(interaction.options.getUser('user').id) || interaction.guild.members.cache.fetch(interaction.options.getUser('user').id)
        const playerone = interaction;
        if (playerone.user.id === playertwo.user.id){
            interaction.reply({content:"You cannot battle against yourself.", ephemeral: true });
        } else{
            function gatherdata() {
                playerone.shields = []
                playerone.health = []
                playerone.sdamage = []
                playerone.damage = []
                playertwo.shields = []
                playertwo.health = []
                playertwo.sdamage = []
                playertwo.damage = []
                if (fs.existsSync(`./servers/${guild.id}/players/${playerone.user.id}.txt`)) { // Player one's group finder.
                    playerone.unitnames = fs.readFileSync(`./servers/${guild.id}/players/${playerone.user.id}.txt`, 'utf-8').split("\n")
                    playerone.unitnames.forEach(function(el){
                        if (fs.existsSync(`./servers/${guild.id}/units/${el}.txt`)) {
                            playerone.shields.push(fs.readFileSync(`./servers/${guild.id}/units/${el}.txt`, 'utf-8').split("\n")[0].split(": ")[1])
                            playerone.health.push(fs.readFileSync(`./servers/${guild.id}/units/${el}.txt`, 'utf-8').split("\n")[1].split(": ")[1])
                            playerone.sdamage.push(fs.readFileSync(`./servers/${guild.id}/units/${el}.txt`, 'utf-8').split("\n")[2].split(": ")[1])
                            playerone.damage.push(fs.readFileSync(`./servers/${guild.id}/units/${el}.txt`, 'utf-8').split("\n")[3].split(": ")[1])
                        }
                    })
                    playerone.found = true;
                } else {
                    playerone.found = false;
                };
                if (fs.existsSync(`./servers/${guild.id}/players/${playertwo.user.id}.txt`)) { // Player two's group finder.
                    playertwo.unitnames = fs.readFileSync(`./servers/${guild.id}/players/${playertwo.user.id}.txt`, 'utf-8').split("\n");
                    playertwo.unitnames.forEach(function(el){
                        if (fs.existsSync(`./servers/${guild.id}/units/${el}.txt`)) {
                            playertwo.shields.push(fs.readFileSync(`./servers/${guild.id}/units/${el}.txt`, 'utf-8').split("\n")[0].split(": ")[1])
                            playertwo.health.push(fs.readFileSync(`./servers/${guild.id}/units/${el}.txt`, 'utf-8').split("\n")[1].split(": ")[1])
                            playertwo.sdamage.push(fs.readFileSync(`./servers/${guild.id}/units/${el}.txt`, 'utf-8').split("\n")[2].split(": ")[1])
                            playertwo.damage.push(fs.readFileSync(`./servers/${guild.id}/units/${el}.txt`, 'utf-8').split("\n")[3].split(": ")[1])
                        }

                    })
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
                playerone.umessage = JSON.stringify(playerone.occur, null, 2).replaceAll('"": 1', "").replaceAll("{", "").replaceAll("}", "").replaceAll(",", "").replaceAll('"', "");
                if (playerone.umessage.length >= 1000) {
                    playerone.umessage = "Too many units to display."
                }
                playertwo.umessage = JSON.stringify(playertwo.occur, null, 2).replaceAll('"": 1', "").replaceAll("{", "").replaceAll("}", "").replaceAll(",", "").replaceAll('"', "");
                if (playertwo.umessage.length >= 1000) {
                    playertwo.umessage = "Too many units to display."
                }
                const unitembed = new MessageEmbed() // Embed Start
                    .setColor('#FFFFFF')
                    .setTitle(`${playerone.user.username} vs ${playertwo.user.username}`)
                    .setDescription('Battle command')
                    .addFields(
                        { name: `${playerone.user.username}`, value: `${playerone.umessage}`},
                        { name: `${playertwo.user.username}`, value: `${playertwo.umessage}`},
                    )
                    .setTimestamp() // Embed end
                game_over = false;
                players = [playerone.user, playertwo.user]
                client = interaction.client;
                turn = players[Math.floor(Math.random() * players.length)];
                row = new MessageActionRow().addComponents(new MessageButton().setCustomId('attack').setLabel('Attack').setStyle('PRIMARY')).addComponents(new MessageButton().setCustomId('retreat').setLabel('Retreat').setStyle('DANGER'))
                await interaction.reply({content: `**Groups found, battle command is starting.** ${turn} goes first.`, embeds: [unitembed], components: [row]})
                // Battle functions here
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
        
        client.on('interactionCreate', async interaction => { // Battle magic happens here.
            if (interaction.isButton()){
                if (interaction.customId == 'attack') {
                    if (turn.id == interaction.user.id) {
                        interaction.message.edit({components: []})
                        if (interaction.user.id == playerone.user.id) {
                            for(let i = 0; i < playerone.unitnames; i++) {
                                roll = Math.floor(Math.random()*20)+1
                                if (roll >= 1 && roll <= 7) {
                                    sdamage = (playerone.sdamage[i] * (roll))/100
                                    sdmult = playerone.sdamage[i] -= sdamage
                                    damage = (playerone.damage[i] * (roll))/100
                                    dmult = playerone.damage[i] -= damage
                                }
                                if (roll >= 8 && roll <= 12){sdmult = 0; dmult = 0}
                                if (roll >= 13 && roll <= 19){
                                    sdamage = (playerone.sdamage[i] * (roll))/100
                                    sdmult = playerone.sdamage[i] += sdamage
                                    damage = (playerone.damage[i] * (roll))/100
                                    dmult = playerone.damage[i] += damage
                                }
                                if (roll == 20){
                                    sdamage = playerone.sdamage[i] * 2
                                    damage = playerone.damage[i] * 2
                                }
                                ranenemy = Math.floor(Math.random() * playertwo.unitnames.length);
                                if (playertwo.shields[ranenemy] > 0){
                                    playertwo.shields[ranenemy] -= sdmult;
                                    if (playertwo.shields[ranenemy] < 0) {
                                        playertwo.shields[ranenemy] = 0;
                                    }
                                }
                                if (playertwo.health[ranenemy] > 0){
                                    playertwo.health[ranenemy] -= dmult;
                                    if (playertwo.health[ranenemy] <= 0) {
                                        interaction.channel.send(`${playertwo.user}'s ${playertwo.unitnames[ranenemy]} has been destroyed.`)
                                        playertwo.unitnames.splice(ranenemy, 1);
                                        playertwo.health.splice(ranenemy, 1);
                                        playertwo.sdamage.splice(ranenemy, 1);
                                        playertwo.damage.splice(ranenemy, 1);
                                    }
                                }
                                if (playertwo.unitnames.length == 0){
                                    interaction.channel.send(`${playertwo.user} has lost the battle.`)
                                }

                            }
                            turn = playertwo
                        }
                        if (interaction.user.id == playertwo.user.id) {
                            for(let i = 0; i < playertwo.unitnames; i++) {
                                roll = Math.floor(Math.random()*20)+1
                                if (roll >= 1 && roll <= 7) {
                                    sdamage = (playertwo.sdamage[i] * (roll))/100
                                    sdmult = playertwo.sdamage[i] -= sdamage
                                    damage = (playertwo.damage[i] * (roll))/100
                                    dmult = playertwo.damage[i] -= damage
                                }
                                if (roll >= 8 && roll <= 12){sdmult = 0; dmult = 0}
                                if (roll >= 13 && roll <= 19){
                                    sdamage = (playertwo.sdamage[i] * (roll))/100
                                    sdmult = playertwo.sdamage[i] += sdamage
                                    damage = (playertwo.damage[i] * (roll))/100
                                    dmult = playertwo.damage[i] += damage
                                }
                                if (roll == 20){
                                    sdamage = playertwo.sdamage[i] * 2
                                    damage = playertwo.damage[i] * 2
                                }
                                ranenemy = Math.floor(Math.random() * playerone.unitnames.length);
                                if (playerone.shields[ranenemy] > 0){
                                    playerone.shields[ranenemy] -= sdmult;
                                    if (playerone.shields[ranenemy] < 0) {
                                        playerone.shields[ranenemy] = 0;
                                    }
                                }
                                if (playerone.health[ranenemy] > 0){
                                    playerone.health[ranenemy] -= dmult;
                                    if (playerone.health[ranenemy] <= 0) {
                                        interaction.channel.send(`${playerone.user}'s ${playerone.unitnames[ranenemy]} has been destroyed.`)
                                        playerone.unitnames.splice(ranenemy, 1);
                                        playerone.health.splice(ranenemy, 1);
                                        playerone.sdamage.splice(ranenemy, 1);
                                        playerone.damage.splice(ranenemy, 1);
                                    }
                                }
                                if (playerone.unitnames.length == 0){
                                    interaction.channel.send(`${playerone.user} has lost the battle.`)
                                }

                            }
                            turn = playerone
                        } // Switches player's turn.
                        
                        interaction.reply({content: `${interaction.user} attacked! It is ${turn.user}'s turn.`, components: [new MessageActionRow().addComponents(new MessageButton().setCustomId('attack').setLabel('Attack').setStyle('PRIMARY')).addComponents(new MessageButton().setCustomId('retreat').setLabel('Retreat').setStyle('DANGER'))]})
                    }
                }
                if (interaction.customId === 'retreat') {
                    interaction.message.edit({components: []})
                    interaction.channel.send(`${interaction.user} has retreated from combat.`)
                }
            }
        })
        
    }
}