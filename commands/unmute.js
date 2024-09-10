const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('特定のボイスチャンネル内のユーザーをミュートを解除します')
    .addChannelOption(option => 
      option.setName('channel')
        .setDescription('ミュートを解除するボイスチャンネルを選択してください')
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
        await member.voice.setMute(false);
      } catch (error) {
        console.logerror( 'ミュート解除処理中にエラーが発生しました;', error);
        failedMembers.push(member.user.tag)
      }
    }

    if (failedMembers.length > 0) {
      return interaction.reply({ content: `以下のメンバーはミュートを解除できませんでした: ${failedMembers.join(',')}`, ephemeral: true });
    }

    await interaction.reply({content: `チャンネル ${channel.name} ないの全員をミュート解除しました`, ephemeral: true })
  },
};