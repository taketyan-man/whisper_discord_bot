const { SlashCommandBuilder } = require('discord.js');

// BOTをVCに参加させるために必要。
const { joinVoiceChannel } = require('@discordjs/voice');
module.exports = {
	data: new SlashCommandBuilder()
        // コマンドの名前
		.setName('join')
        // コマンドの説明文
		.setDescription('VCに参加。')
        // チャンネルを選択する
    .addChannelOption((option) => 
      option
          // optionの名前
				.setName('channel1')
          // optionの説明
        .setDescription('The channel to join')
          // optionが必須かどうか
        .setRequired(true)
    )
    .addChannelOption((option) =>
			option
				.setName('channel2')
				.setDescription('The channel that Speaker-bot join')
				.setRequired(true)
		),
	async execute(interaction, client1, client2) {
        // VCに参加する処理
      console.log('joinコマンドが実行されました');  
    try {
      const voiceChannel1 = interaction.options.getChannel('channel1');
		  const voiceChannel2 = interaction.options.getChannel('channel2');
      if (voiceChannel1 && voiceChannel2) {
        if (voiceChannel1 === voiceChannel2) {
          await interaction.reply('同じVCには参加できません🥺');
          return;
        }
        const connection1 = joinVoiceChannel({
          // なぜかはわからないが、groupの指定をしないと、先にVCに入っているBOTがVCを移動するだけになってしまうので、記述。
          group: 'listener',
          guildId: interaction.guildId,
          channelId: voiceChannel1.id,
          // どっちのBOTを動かしてあげるかの指定をしてあげる。
          adapterCreator: client1.guilds.cache.get(interaction.guildId).voiceAdapterCreator,
          // VC参加時にマイクミュート、スピーカーミュートにするか否か
          selfMute: true,
          selfDeaf: false,
        });
        // Speaker-botがVCに参加する処理
        const connection2 = joinVoiceChannel({
          group: 'speaker',
          guildId: interaction.guildId,
          channelId: voiceChannel2.id,
          adapterCreator: client2.guilds.cache.get(interaction.guildId).voiceAdapterCreator,
          selfMute: false,
          selfDeaf: true,
        });
    
        await interaction.reply('参加しました！');
        return [connection1, connection2];
      } else {
        await interaction.reply('BOTを参加させるVCを指定してください！');
      }
    } catch (error) {
      console.error('エラーが発生しました:', error);  // エラー発生時のログ
      await interaction.reply('ボイスチャネルに参加できませんでした。エラーが発生しました。');
    }
	} 
};
