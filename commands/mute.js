const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('特定のボイスチャンネル内のユーザーをミュートにします')
    .addChannelOption(option => 
      option.setName('channel')
        .setDescription('ミュート対象のボイスチャンネルを選択してください')
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildVoice))
    .setDefaultMemberPermissions(PermissionFlagsBits.MoveMembers),
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');

    const members = channel.members;

    if (members.size === 0) {
      return interaction.reply({ content: '指定されたチャンネルにはメンバーがいません', ephemeral: true });
    }

    let failedMembers = [];
    for (const [memberId, member] of members) {
      try {
        await member.voice.setMute(true);
      } catch (error) {
        console.logerror('ミュート処理中にエラーが発生しました;', error);
        failedMembers.push(member.user.tag)
      }
    }

    if (failedMembers.length > 0) {
      return interaction.reply({ content: `以下のメンバーはミュートできませんでした: ${failedMembers.join(',')}`, ephemeral: true });
    }

    await interaction.reply({ content: `チャンネル ${channel.name} ないの全員をミュートしました`, ephemeral: true });
  },
};