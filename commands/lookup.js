const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const closest_match = require("closest-match");
const fs = require('node:fs');

module.exports = {
    
	data: new SlashCommandBuilder()
		.setName('lookup')
		.setDescription('Command to look up units for GM.')
        .addStringOption((option) =>
            option.setName('unit_name')
            .setDescription('Name of the Unit you want to look up.')
            .setRequired(true)
            ),

	async execute(interaction) {
        const { guild } = interaction;
        const units = [];

        if (fs.existsSync(`./servers/${interaction.guild.id}/units/${interaction.options.getString('unit_name')}.txt`)) {
			file = fs.readFile(`./servers/${interaction.guild.id}/units/${interaction.options.getString('unit_name')}.txt`, 'utf-8',(err, data)=> {
                const unitembed = new MessageEmbed() // Embed Start
                    .setColor('#FFFFFF')
                    .setTitle(interaction.options.getString('unit_name'))
                    .setAuthor({name: `Command ran by :${interaction.user.username}`})
                    .setDescription('Unit you requested')
                    .addFields(
                        { name: 'Stats:', value: `***${String(data)}***`, inline: true},
                    )
                    .setTimestamp() // Embed end
                interaction.reply({embeds: [unitembed]});
                return;
			});
			
		} else {
            const unitname = interaction.options.getString('unit_name');
            fs.readdir(`./servers/${guild.id}/units`, (err, filenames) => {
                if (err) {
                    console.log(err)
                    return;
                } else {
                    filenames.forEach(file => {
                        units.push(file.replace('.txt', ''));
                    });
                    const match = closest_match.closestMatch(unitname, units);
                    if (match) {
                        file = fs.readFile(`./servers/${interaction.guild.id}/units/${match}.txt`, 'utf-8',(err, data)=> {
                            const unitembed = new MessageEmbed() // Embed Start
                                .setColor('#FFFFFF')
                                .setTitle(match)
                                .setAuthor({name: `Command ran by: ${interaction.user.username}`})
                                .setDescription('Unit you requested')
                                .addFields(
                                    { name: 'Stats:', value: `***${String(data)}***`, inline: true},
                                )
                                .setTimestamp() // Embed end
                            interaction.reply({embeds: [unitembed]});
                            return;
                        });
                    } else {
                        interaction.reply("No unit was found.")
                    }
	}
})
}
}
}