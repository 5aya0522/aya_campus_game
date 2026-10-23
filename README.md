# 我们之间，尚未命名。

在原 React + TypeScript + Vite 项目上持续开发的韩国高中校园互动小说。人物、剧情、心理规则和手机应用均保留。

在线手机版的上线状态、iPhone 主屏幕安装、存档迁移、后续更新和可选云存档说明见 **DEPLOYMENT.md**。正式网址将在部署成功验证后填写，不把 localhost 当成线上网址。

## 本地打开（仍可使用）
在 Finder 双击「启动游戏.command」，浏览器打开 http://localhost:4173 。保留终端窗口；停止服务按 Control + C。脚本使用电脑的 Python 3，没有时尝试本机 Codex 自带 Python。它服务 `dist` 构建文件，不需要重新安装依赖。

本地服务只用于预览；Mac 关机后这个地址无法访问。上线后的 HTTPS 正式网址由 Netlify 托管，和 Mac 是否开机无关。

## 开发
需要 Node.js 24 和 pnpm。
```sh
pnpm install
pnpm test
pnpm build
node --test scripts/offline.test.mjs
pnpm dev
```

生产构建目标为 Safari 16.4 及更新版本。PWA 仅在生产构建的 HTTPS 或 localhost 环境注册；开发模式不注册离线缓存。

## 已有功能
自由文字表达（有限的本地关键词解释，不冒充通用 AI）、19 段学年关键事件、六位角色、双向十维隐藏心理、独立记忆与信息边界、不同关系结局。手机有聊天、资料、未读、X 和 Instagram 动态、线索、模拟视频通话、通话记录、播放器和本地媒体导入。首章较细致，后续是关键事件短篇，不宣称完整商业长篇已完成。

每次互动自动保存。电脑、iPhone 和不同网址不自动共享存档，换设备使用 JSON 导入导出。正常关闭后可恢复，但浏览器清理或回收数据仍有风险。详情见 DEPLOYMENT.md。

本次上线准备没有改动人物、剧本或心理规则；完整检查记录见 TESTING.md。
