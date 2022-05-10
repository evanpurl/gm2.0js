const { SlashCommandBuilder } = require('@discordjs/builders');
const { name } = require('ci-info');
const { MessageEmbed } = require('discord.js');
const fs = require('node:fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('createunit')
		.setDescription('Command to create units for GM.')
        .addStringOption((option) =>
            option.setName('unit_name')
            .setDescription('Name of the Unit you want to create.')
            .setRequired(true))
        .addIntegerOption((option) =>
            option.setName('shields')
            .setDescription('Shields for the unit. (0 if none.)')
            .setRequired(true))
        .addIntegerOption((option) =>
            option.setName('health')
            .setDescription('Health for the unit.')
            .setRequired(true))
        .addIntegerOption((option) =>
            option.setName('shield_damage')
            .setDescription('Shield Damage for the unit. (0 if none.)')
            .setRequired(true))
        .addIntegerOption((option) =>
            option.setName('damage')
            .setDescription('Damage for the unit.')
            .setRequired(true)),

	async execute(interaction) {
        const { guild } = interaction;

        if (fs.existsSync(`./servers/${interaction.guild.id}/dmrole.txt`)) {
			file = fs.readFile(`./servers/${interaction.guild.id}/dmrole.txt`, 'utf-8',(err, data)=> {
                let myRole = interaction.guild.roles.cache.find(role => role.name === data);
                if (myRole) {
                    const user = guild.members.cache.get(interaction.user.id) || guild.members.cache.fetch(interaction.user.id);
                    if (user.roles.cache.has(myRole.id)) {
                        const unitembed = new MessageEmbed() // Embed Start
                            .setColor('#FFFFFF')
                            .setTitle('Created Unit')
                            .setURL('https://www.nitelifesoftware.com/gmutility/gmunittester.html')
                            .setAuthor({name: interaction.user.username})
                            .setDescription('Unit you created using the /createunit command.')
                            .addFields(
                                { name: 'Unit Name:', value: interaction.options.getString('unit_name'), inline: true},
                                { name: 'Shields:', value: String(interaction.options.getInteger('shields')), inline: true},
                                { name: 'Health:', value: String(interaction.options.getInteger('health')), inline: true},
                                { name: 'Shield Damage:', value: String(interaction.options.getInteger('shield_damage')), inline: true},
                                { name: 'Damage:', value: String(interaction.options.getInteger('damage')), inline: true},
                            )
                            .setTimestamp() // Embed end
                        interaction.reply({embeds: [unitembed]});
                        try {
                            if (!fs.existsSync(`./servers/${interaction.guild.id}/units`)){
                                fs.mkdir(`./servers/${interaction.guild.id}/units`, {recursive: true}, (err)=> {
                                    if (err){
                                        console.log(err);
                                    };
                                    
                                });
                            }
                            fs.writeFile(`./servers/${interaction.guild.id}/units/${interaction.options.getString('unit_name')}.txt`, `shields: ${interaction.options.getInteger('shields')} \nhealth: ${interaction.options.getInteger('health')}\nshield damage: ${interaction.options.getInteger('shield_damage')}\ndamage: ${interaction.options.getInteger('damage')}`, {encoding: 'utf-8', flag: 'w'}, (err)=> {
                                if (err){
                                    console.log(err);
                                };
                            });
                        } catch(err){
                            if (err){
                                console.log(err);
                            };
                        }
                    } else {
                        interaction.reply(`You do not have the role **${data}** to use that command.`);
                        return;
                    };
                } else {
                    interaction.reply("DM role does not exist, reconfigure it with /config.");
                    return;
                };
			});
			
		} else {
            interaction.reply("DM role not found, ending command.");
			return;
		};
	}
};