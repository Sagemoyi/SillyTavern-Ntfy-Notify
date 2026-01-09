# SillyTavern Ntfy Notify Plugin

Gemini帮我写的基于ntfy的酒馆ai回复通知插件，解决在http环境下，手机浏览器没法发送通知的痛点（不知道有没有人做过，没找到就让Gemini写了）

需要手机下载ntfy软件，自行创建频道，其它设置在酒馆插件里能看到（我暂时只测试了基础功能）

这是一个为 [SillyTavern](https://github.com/SillyTavern/SillyTavern) 开发的简单的消息通知插件。
当 AI 生成回复完毕后，它会通过 [Ntfy](https://ntfy.sh) 将消息推送到你的手机上。

支持 iOS 和 Android，无需注册账户，基于 HTTP 协议，简单安全。

## ✨ 功能特点

- **实时推送**：AI 回复生成结束，手机立马收到通知。
- **后台检测**：可设置为“仅当浏览器在后台/最小化时”才发送通知（防止刷屏）。
- **隐私保护**：可隐藏具体回复内容，仅提示“收到新消息”。
- **中文支持**：完美解决中文标题和内容乱码问题。
- **高优先级**：支持高优先级推送，确保小米手环/智能手表能收到震动提醒。
- **点击跳转**：点击通知栏可直接跳转回酒馆页面。

## 🚀 安装方法

方法一：直接克隆 (推荐)
1. 进入你的酒馆目录：`/SillyTavern/public/scripts/extensions/`
2. 克隆本仓库：
   ```bash
   git clone [https://github.com/你的GitHubID/SillyTavern-Ntfy-Notify.git](https://github.com/你的GitHubID/SillyTavern-Ntfy-Notify.git) ntfy-notify
3.   重启酒馆或刷新网页。

方法二：手动安装
下载本仓库的 index.js 和 manifest.json。

在 /SillyTavern/public/scripts/extensions/ 下新建文件夹 ntfy-notify。

将文件放入该文件夹。

⚙️ 使用说明
手机端配置：

下载 Ntfy APP (iOS/Android)。

点击 + 订阅一个主题，名字随便起（例如 my_tavern_secret_123）。

注意：如果是小米手环用户，请在“小米运动健康/Zepp Life”中将 Ntfy 加入消息通知白名单。

酒馆端配置：

刷新酒馆页面，点击顶部的 插件 (Extensions) 图标。

找到 Ntfy 手机通知 设置面板。

必填：在 Topic 一栏填入你刚才在手机上订阅的名字。

建议勾选 仅当浏览器在后台时通知。

🤝 贡献
欢迎提交 Issue 或 Pull Request。