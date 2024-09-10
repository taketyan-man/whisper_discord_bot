const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits, Events } = require('discord.js');
require('dotenv').config();

// Discordクライアントを作成
const client1 = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });
const client2 = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

// コマンドを保持するコレクションを作成
client1.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
let connection = null;

// コマンドファイルを読み込み、コマンドをコレクションに追加
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ('data' in command && 'execute' in command) {
    client1.commands.set(command.data.name, command);
  } else {
    console.log(`[WARNING]  ${filePath} のコマンドには、必要な "data" または "execute" プロパティがありません。`);
  }
}

// ボットが準備完了した際に呼び出される

// コマンドが実行された際の処理
client1.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isCommand()) return;

  const command = client1.commands.get(interaction.commandName);

  if (!command) return;

  try {
    // コマンドを実行
    if (interaction.commandName === 'join' || interaction.commandName === 'stream') {
        connection = await command.execute(interaction, client1, client2);
    }
    else if (interaction.commandName === 'record') { 
			await command.execute(interaction, connection[0]);
		}
    else if (interaction.commandName === 'play') {
        await command.execute(interaction, connection[1]);
    }
    else {
        await command.execute(interaction);
    }
} catch (error) {
    console.error(error);
    await interaction.reply({ content: 'コマンドを実行中にエラーが発生しました。', ephemeral: true });
}

});

client1.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
  });

client2.once(Events.ClientReady, c => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Discordボットにログイン
client1.login(LISTENER_TOKEN);
client2.login(SPEAKER_TOKEN);
