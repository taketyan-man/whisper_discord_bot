const { createAudioPlayer, NoSubscriberBehavior, createAudioResource, StreamType, AudioPlayerStatus, VoiceConnectionStatus, entersState } = require('@discordjs/voice');
const { SlashCommandBuilder } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
        // コマンドの名前
		.setName('play')
        // コマンドの説明文
		.setDescription('VCで音楽を流します。'),
	async execute(interaction, connection) {
		const resource = createAudioResource(
			'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
			{
                // OPUS型で渡す時はArbitrary
				inputType: StreamType.Arbitrary,
			},
		);
		const player = createAudioPlayer({
			behaviors: {
				noSubscriber: NoSubscriberBehavior.Pause,
			},
		});
		player.play(resource);
        // (以下)エラーが出て音声が無事に流れなかった場合、動いているかの確認を取りやすくするために記述。
		const status = ['●Loading Sounds...', '●Connecting to VC...'];
		const p = interaction.reply(status.join('\n'));
		const promises = [];
		promises.push(entersState(player, AudioPlayerStatus.AutoPaused, 1000 * 10).then(() => status[0] += 'Done!'));
		promises.push(entersState(connection, VoiceConnectionStatus.Ready, 1000 * 10).then(() => status[1] += 'Done!'));
		await Promise.race(promises);
		await p;
		await Promise.all([...promises, interaction.editReply(status.join('\n'))]);
		connection.subscribe(player);
		await entersState(player, AudioPlayerStatus.Playing, 100);
		await interaction.editReply('Playing'); // これは必須。
		await entersState(player, AudioPlayerStatus.Idle, 2 ** 31 - 1);
		await interaction.editReply('End');
	},
};

