const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Command to get the ping of the bot.'),

	async execute(interaction) {
        try {
            const mesg = await interaction.reply({ content: "Pong!", fetchReply: true, ephemeral: true  });

            await interaction.editReply({ content: `Bot Latency: \`${mesg.createdTimestamp - interaction.createdTimestamp}ms\`` });
        } catch(err) {
            console.log(err);
        };

	}
};