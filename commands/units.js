const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment } = require('discord.js');
const fs = require('node:fs');

module.exports = {
    
	data: new SlashCommandBuilder()
		.setName('units')
		.setDescription('Command to look up units in your GM group.'),

	async execute(interaction) {
        const { guild } = interaction;

        if (fs.existsSync(`./servers/${guild.id}/players/${interaction.user.id}.txt`)) {
			// file = fs.readFile(`./servers/${guild.id}/players/${interaction.user.id}.txt`, 'utf-8',(err, data)=> {
            //     const dat = data.length
            //     if (dat >= 1000) {
            //         const unitdata = `More units than possible:\n***${String(data).substring(0,990)}***`
            //         const unitembed = new MessageEmbed() // Embed Start
            //         .setColor('#FFFFFF')
            //         .setTitle(`${interaction.user.username}'s units.`)
            //         .setAuthor({name: `Command ran by :${interaction.user.username}`})
            //         .setDescription('Units in your group')
            //         .addFields(
            //             { name: 'Units:', value: unitdata, inline: true},
            //         )
            //         .setTimestamp() // Embed end
            //         interaction.reply({embeds: [unitembed]});
            //     } else {
            //         const unitdata = `***${String(data)}***`
            //         const unitembed = new MessageEmbed() // Embed Start
            //         .setColor('#FFFFFF')
            //         .setTitle(`${interaction.user.username}'s units.`)
            //         .setAuthor({name: `Command ran by :${interaction.user.username}`})
            //         .setDescription('Units in your group')
            //         .addFields(
            //             { name: 'Units:', value: unitdata, inline: true},
            //         )
            //         .setTimestamp() // Embed end
            //         interaction.reply({embeds: [unitembed]});
            //     }
            //     return;
			// });
            const file = new MessageAttachment(`./servers/${guild.id}/players/${interaction.user.id}.txt`)
            interaction.reply('Here you go!');
            interaction.channel.send({
                files: [file]
            });
            return;
		} else {
            interaction.reply("User's group not found.")
            return;
        };
}
}