# 🎙 Whisper Discord Bot

**Whisper Discord Bot**は、複数の音声チャンネル管理や音声再生機能などを備えた、音声中心の高機能なDiscord Botです。

## 📦 機能一覧

| コマンド名   | 説明                                            |
|--------------|-------------------------------------------------|
| `/join`      | 2つのボイスチャンネルにBOTをそれぞれ参加させます |
| `/allmute`   | 指定したボイスチャンネルの全ユーザーをミュートします |
| `/mute`      | 特定のボイスチャンネル内のユーザーをミュートします |
| `/unmute`    | 特定のボイスチャンネル内のユーザーのミュートを解除します |
| `/move`      | 特定のユーザーを一つのボイスチャンネルから別のチャンネルに移動させます |
| `/play`      | 音声ファイルをボイスチャンネルで再生します     |
| `/record`    | 音声を録音します                                |
| `/stream`    | 音声を別のチャンネルに中継します                |

---

## ⚙ インストール方法

1. リポジトリをクローン：

```bash
git clone https://github.com/yourusername/whisper
```

2. 依存関係のインストール：
```bash
npm install
```

3. config.json の作成と設定
ルートディレクトリに config.json を作成し、以下の形式で各種トークンやIDを記述します：
```config.json
{
  "LISTENER": {
    "CLIENT_ID": "あなたのListener BotのClient ID",
    "TOKEN": "Listener Botのトークン"
  },
  "SPEAKER": {
    "CLIENT_ID": "あなたのSpeaker BotのClient ID",
    "TOKEN": "Speaker Botのトークン",
    "VC_ID": "Speaker Botが参加するVCのID"
  },
  "GUILD_ID": "Botを動作させたいサーバーID",
  "MUTE_VC_ID": "ミュート対象VCのID",
  "VC_ID": "デフォルトのVC ID"
}
```
※ すべての値をDiscord開発者ポータルやサーバーから取得して入力してください。

4. スラッシュコマンドのデプロイ
```bash
node deploy-commands.js
```

5. Botの起動
```bash
node index.js
```

## 📝 注意事項
- rec/ フォルダを作成しておかないと録音が失敗します。

- Botが 2体必要（Listener、Speaker）です。どちらもDiscord開発者ポータルでアプリ登録し、トークンとClient IDを取得してください。

- 録音ファイルは .dat形式 で保存され、/play コマンドで再生可能です。