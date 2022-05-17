const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('node:fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('config')
		.setDescription('Bot command to configure bot settings.')
		.addSubcommand(subcommand =>
			subcommand
				.setName('dmrole')
				.setDescription('Role that the bot will use to determine who is a dm.')
				.addStringOption((option) =>
					option.setName('rolename')
					.setDescription('Name of the role you want to select')
					.setRequired(true))
			),

	async execute(interaction) {
        const { commandName } = interaction;
        const { guild } = interaction;
        if (interaction.member.permissions.has('KICK_MEMBERS')) {
            try {
                if (interaction.options.getSubcommand() === 'dmrole') {
                    const rolename = interaction.options.getString('rolename');
                    const muterole = guild.roles.cache.find((role) => {
                        return role.name === rolename
                    });
                    if (!muterole) {
                        interaction.reply({content: `Role with the name **${interaction.options.getString('rolename')}** not found`, ephemeral: true});
                    } else {
                        if (fs.existsSync(`./servers/${interaction.guild.id}/dmrole.txt`)) {
                            fs.writeFile(`./servers/${interaction.guild.id}/dmrole.txt`, interaction.options.getString('rolename'), { encoding: "utf8", flag: "w" }, (err)=> {if (err) {console.error(err);}})
                            interaction.reply({content: "DM role has been set.", ephemeral: true });
                        } else {
                            fs.writeFile(`./servers/${interaction.guild.id}/dmrole.txt`, interaction.options.getString('rolename'), { encoding: "utf8", flag: "w" }, (err)=> {if (err) {console.error(err);}})
                            interaction.reply({content: "DM role has been set.", ephemeral: true });
                        };
                    }
                    
                };
            } catch(err) {
                console.log(err)
            }

        } else {
            interaction.reply({content: `You do not have the proper permissions to use the command "/${commandName}".`, ephemeral: true});
            return;
        }
	}
};