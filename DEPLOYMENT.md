# 《我们之间，尚未命名。》在线版

## 部署状态
工程已完成 Netlify 配置、PWA 和移动端兼容准备。正式域名只有在账号授权、部署成功和验证后才会记录在这里；localhost 和临时网址不是正式交付。

## 为什么选 Netlify
当前是纯静态 React + TypeScript + Vite 游戏，适合 Netlify。GitHub 保存源代码，Netlify 拉取源代码自动构建并通过 HTTPS 提供游戏。上线后 Mac 可以关机，iPhone 可以使用蜂窝网络或任意 Wi-Fi。

新账户 Free 目前为 0 美元/月、每月 300 credits 的硬额度。访问流量、生产发布等会消耗额度；用完会暂停，直到额度恢复或用户主动选择其他方案。当前个人小规模游戏适合先用 Free，不会自动购买付费方案。最终额度以账号后台为准。官方说明：https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/ 。

## 已准备的 GitHub → Netlify 配置
项目根目录的 netlify.toml 已指定 `pnpm run build` 和 `dist`，Node 为 24；package.json 固定 pnpm 版本。已配置页面刷新回退、Service Worker 更新和静态资源缓存。

GitHub 应上传包含 `src/`、`public/`、`scripts/`、`package.json`、`pnpm-lock.yaml`、`pnpm-workspace.yaml`、`tsconfig.json`、`vite.config.ts`、`index.html` 和 `netlify.toml` 的项目根目录。不要上传 node_modules、私人存档、认证文件或整个 Codex 工作目录。上传用的干净源码副本会另外准备，保留全部游戏代码。GitHub 可以使用私有仓库，连接 Netlify 时仅授权该仓库。

## 本次上线前已保留的内容
人物设定、19 段校园关键事件、心理与记忆、自由输入解释规则、结局、聊天、好友资料、动态与线索、模拟视频通话、电话记录、音乐播放器、相册、手动存档、JSON 导入导出。
“校园动态”目前由 X 文字动态和 Instagram 照片动态组成；原项目没有独立的校园论坛模块。本次没有借部署之名删掉它，也不会把不存在的功能说成已经实现。

## iPhone 添加到主屏幕
1. 在 Safari 打开正式游戏网址，等待顶部出现“可离线游玩”。第一次必须联网。
2. 点击 Safari 分享按钮，选择“添加到主屏幕”。找不到时，在分享菜单末尾的“编辑操作”里加入它。
3. 如果出现“作为网页 App 打开”，保持开启，然后点“添加”。
4. 从主屏幕图标打开后确认进度；若是新的存储空间，用 JSON 导入恢复。

PWA 仅提供网页 App 体验，不需要 App Store。系统可能回收离线缓存，必要时重新联网即可下载游戏。你选择的本地音乐、MP4、图片仅当前会话可用；刷新后需重新选择，文件不会被上传。官方操作：https://support.apple.com/guide/iphone/open-as-web-app-iphea86e5236/ios 。

## 怎样保存
每次剧情推进、聊天或互动完成后同步写入自动档；切到后台时补存。保存面板另有一个手动槽位，会在点击保存时覆盖。系统保留最近有效副本，损坏时可恢复，并会告知。

正常刷新或关闭 Safari 不会主动删除这些存档。但清理 Safari 网站数据、无痕模式、系统空间回收、卸载主屏幕 App 等仍可能导致本地数据消失。建议用普通浏览模式，并定期“导出 JSON 备份”保存到“文件”或 iCloud Drive。也可点击“申请此设备的存档保护”；是否授予由 Safari 决定，不承诺永久保存。官方存储政策：https://webkit.org/blog/14403/updates-to-storage-policy/ 。

电脑和手机不自动同步。localhost、正式域名、临时部署域名、不同浏览器都可能有独立存档；不要把复制网页链接当作复制进度。使用固定正式域名玩游戏，避免以后换地址。

### 把电脑进度搬到 iPhone
1. 在原来玩游戏的电脑浏览器和原地址打开存档面板，先“导出 JSON 备份”。
2. 用 AirDrop 或你自己的 iCloud Drive 把文件放到 iPhone。
3. 在 iPhone 正式游戏网址打开存档面板，点“导入 JSON 存档”，选择刚才的文件。
4. 核对故事日期、人物手记和聊天记录，再继续玩。

新版 v2 存档可直接导入；更早的大学故事 v1 不会混入高中世界，旧档仍留在原浏览器和旧版备份中。无云存档时，后续换设备也用同样方法。

## 更新游戏而不丢进度
以后直接对 Codex 说：“在现有目录更新《我们之间》，保留原 Netlify 项目、正式域名和 v2 存档兼容，部署前测试旧存档。”

更新时必须：
- 使用同一个 Netlify project 和同一个正式域名，不每次建新站。
- 不清理 localStorage、不改现有存档键；新增格式时提供迁移器。
- 新存档有完整世界快照，已有心理、聊天、记忆和承诺不重新用新规则解释。旧历史格式仍可读取。
- 不删除旧事件、人物、场景 ID；扩充数据结构时升级校验和迁移测试。
- 修改版本前导出一份 JSON。保留可回滚构建；上线后回滚到 0.2.1 以前可能不认识新快照，不直接回滚存档格式。
- PWA 下载新版本后显示“保存并更新”，由玩家点击后先存档再刷新；后台不会强制打断游玩。缓存清理只处理静态资源，不触碰进度。

开发验证命令：
```sh
pnpm test
pnpm build
node --test scripts/offline.test.mjs
```

后续继续往同一个 GitHub 仓库提交修改，Netlify 会自动重新构建同一个站点。一直使用相同的正式域名，不重新创建站点；保留存档键和迁移器。

本轮按照“每次只指导下一步”的要求，实际上传、授权仓库、导入站点和验证公网网址将逐步完成。正式 URL 在成功部署并检查后才填写。

## 可选云端存档方案（尚未启用）
建议使用 Supabase Auth + Postgres：邮箱验证登录，数据表以 `user_id` 和存档槽为主键，启用 Row Level Security，只允许 `auth.uid() = user_id` 的用户读取和写入。每次写入携带 revision；两台设备冲突时保留两份并提示选择，不能静默覆盖。

需要一个 Supabase 项目、数据库和玩家账号；Netlify 仍托管静态游戏。前端只配置 publishable key，绝不能放 service_role / secret key；不把所有人的存档放进公开 JSON 文件。离线先存本地，联网且登录后同步；退出账号不泄漏前一个账号的本地缓存。对存档长度、结构与版本进行服务端校验。

Free 计划目前列有 500 MB 数据库、50,000 月活等额度，小规模个人使用可以免费，但免费项目闲置一周会暂停；付费 Pro 页面起价为 25 美元/月，超出资源还可能产生额外费用。正式启用前重新核对 https://supabase.com/pricing 与 https://supabase.com/docs/guides/database/postgres/row-level-security 。当前没有创建数据库、没有额外收费，也没有自动同步。
