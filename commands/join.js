const { SlashCommandBuilder } = require('discord.js');

// BOTをVCに参加させるために必要。
const { joinVoiceChannel } = require('@discordjs/voice');

const { LISTENER } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
        // コマンドの名前
		.setName('join')
        // コマンドの説明文
		.setDescription('VCに参加。'),
	async execute(interaction) {
        // VCに参加する処理
		const connection = joinVoiceChannel({
			guildId: interaction.guildId,
			channelId: LISTENER.VC_ID,
			adapterCreator: interaction.guild.voiceAdapterCreator,
		});
		await interaction.reply('参加しました！');
	},
};
