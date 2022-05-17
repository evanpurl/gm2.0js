const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('node:fs');
const closest_match = require("closest-match");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('deleteunit')
		.setDescription('Command to delete units for GM.')
        .addStringOption((option) =>
            option.setName('unit_name')
            .setDescription('Name of the Unit you want to delete.')
            .setRequired(true)),

	async execute(interaction) {
        const { guild } = interaction;
        if (fs.existsSync(`./servers/${interaction.guild.id}/dmrole.txt`)) {
            file = fs.readFile(`./servers/${interaction.guild.id}/dmrole.txt`, 'utf-8',(err, data)=> {
                let myRole = interaction.guild.roles.cache.find(role => role.name === data);
                if (myRole) {
                    const user = guild.members.cache.get(interaction.user.id) || guild.members.cache.fetch(interaction.user.id);
                    if (user.roles.cache.has(myRole.id)) {
                        const unitname = interaction.options.getString('unit_name');
                        const units = [];
                        fs.readdir(`./servers/${guild.id}/units`, (err, filenames) => {
                            if (err) {
                                console.log(err)
                                return;
                            } else {
                                filenames.forEach(file => {
                                    units.push(file.replace('.txt', ''));
                                });
                                const match = closest_match.closestMatch(unitname, units);
                                if (match) { // delete unit here.
                                    interaction.reply({content: `Deleting unit with the name ${match}.`, ephemeral: true })
                                    fs.rm(`./servers/${guild.id}/units/${match}.txt`, err => {
                                        if (err){
                                            console.log(err);
                                        }
                                    })
                                } else {
                                    interaction.reply({content: "Unit not found.", ephemeral: true })
                                }
                            }
                            
                        }); // Read directory.
                    } else {
                        interaction.reply({content: `You do not have the role **${data}** to use that command.`, ephemeral: true });
                        return;
                    };
                } else {
                    interaction.reply({content: "DM role does not exist, reconfigure it with /config.", ephemeral: true });
                    return;
                };
        }); // read dmrole file.
	} else {
        interaction.reply({content: "DM role not found, ending command.", ephemeral: true });
        return;
    };
}
}; // end