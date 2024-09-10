const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('move')
        .setDescription('特定のボイスチャンネル内の人を移動します')
        .addChannelOption(option => 
            option.setName('from')
                .setDescription('移動元のボイスチャンネル')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildVoice)) // ボイスチャンネルのみを選択可能にする
        .addChannelOption(option => 
            option.setName('to')
                .setDescription('移動先のボイスチャンネル')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildVoice)) // ボイスチャンネルのみを選択可能にする
        .addUserOption(option => 
            option.setName('user')
                .setDescription('移動させたい特定のユーザー')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.MoveMembers),
    
    async execute(interaction) {
        const fromChannel = interaction.options.getChannel('from');
        const toChannel = interaction.options.getChannel('to');
        const user = interaction.options.getUser('user');

        // 特定のユーザーを移動
        if (user) {
            const member = fromChannel.members.get(user.id);
            if (!member) {
                return interaction.reply({ content: '指定されたユーザーは移動元のチャンネルにいません。', ephemeral: true });
            }

            try {
                await member.voice.setChannel(toChannel);
                return interaction.reply({ content: `${member.user.tag} を ${fromChannel.name} から ${toChannel.name} に移動しました。`, ephemeral: true });
            } catch (error) {
                console.error('エラーが発生しました:', error);
                return interaction.reply({ content: '指定されたユーザーの移動中にエラーが発生しました。', ephemeral: true });
            }
        };

        await interaction.reply(`メンバーを ${fromChannel.name} から ${toChannel.name} に移動しました。`);
    },
};
