const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fs = require('node:fs');
const closest_match = require("closest-match");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addunit')
		.setDescription('Command to add units to a GM group.')
        .addStringOption((option) =>
            option.setName('unit1name')
            .setDescription('Name of the Unit you want to create.')
            .setRequired(true))
        .addStringOption((option) =>
            option.setName('unit2name')
            .setDescription('Name of the Unit you want to create.')
            )
        .addStringOption((option) =>
            option.setName('unit3name')
            .setDescription('Name of the Unit you want to create.')
            )
        .addStringOption((option) =>
            option.setName('unit4name')
            .setDescription('Name of the Unit you want to create.')
            )
        .addStringOption((option) =>
            option.setName('unit5name')
            .setDescription('Name of the Unit you want to create.')
            ),

	async execute(interaction) {
        const { guild } = interaction;
        const units = [];
        const addedunits = [];

        fs.readdir(`./servers/${guild.id}/units`, (err, filenames) => {
            if (err) {
                console.log(err);
                return;
            } else {
                filenames.forEach(file => {
                    units.push(file.replace('.txt', ''));
                });
                if (!fs.existsSync(`./servers/${interaction.guild.id}/players`)){
                    fs.mkdir(`./servers/${interaction.guild.id}/players`, {recursive: true}, (err)=> {
                        if (err){
                            console.log(err);
                        };
                    });
                };
                try {
                    addedunits.push(closest_match.closestMatch(interaction.options.getString('unit1name'), units))

                fs.writeFile(`./servers/${interaction.guild.id}/players/${interaction.user.id}.txt`, `${closest_match.closestMatch(interaction.options.getString('unit1name'), units)}\n`, {encoding: 'utf-8', flag: 'a+'}, (err)=> {
                    if (err){
                        console.log(err);
                    }
                });
                if (interaction.options.getString('unit2name')) {
                    addedunits.push(closest_match.closestMatch(interaction.options.getString('unit2name'), units))

                    fs.writeFile(`./servers/${interaction.guild.id}/players/${interaction.user.id}.txt`, `${closest_match.closestMatch(interaction.options.getString('unit2name'), units)}\n`, {encoding: 'utf-8', flag: 'a+'}, (err)=> {
                        if (err){
                            console.log(err);
                        }
                    });
                };
                if (interaction.options.getString('unit3name')) {
                    addedunits.push(closest_match.closestMatch(interaction.options.getString('unit3name'), units))
                    fs.writeFile(`./servers/${interaction.guild.id}/players/${interaction.user.id}.txt`, `${closest_match.closestMatch(interaction.options.getString('unit3name'), units)}\n`, {encoding: 'utf-8', flag: 'a+'}, (err)=> {
                        if (err){
                            console.log(err);
                        }
                    });
                };
                if (interaction.options.getString('unit4name')) {
                    addedunits.push(closest_match.closestMatch(interaction.options.getString('unit4name'), units))
                    fs.writeFile(`./servers/${interaction.guild.id}/players/${interaction.user.id}.txt`, `${closest_match.closestMatch(interaction.options.getString('unit4name'), units)}\n`, {encoding: 'utf-8', flag: 'a+'}, (err)=> {
                        if (err){
                            console.log(err);
                        }
                    });
                };
                if (interaction.options.getString('unit5name')) {
                    addedunits.push(closest_match.closestMatch(interaction.options.getString('unit5name'), units))
                    fs.writeFile(`./servers/${interaction.guild.id}/players/${interaction.user.id}.txt`, `${closest_match.closestMatch(interaction.options.getString('unit5name'), units)}\n`, {encoding: 'utf-8', flag: 'a+'}, (err)=> {
                        if (err){
                            console.log(err);
                        }
                    });
                };
                interaction.reply({content: `Your unit(s) **${addedunits.join(', ')}** have been added to your group.`, ephemeral: true});
            } catch (err){
                console.log(err);
            }
            }
        });
    }
};