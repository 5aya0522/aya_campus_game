#!/bin/zsh
cd "${0:A:h}"
GAME_PYTHON="$(command -v python3)"
if [[ -z "$GAME_PYTHON" ]]; then
  GAME_PYTHON="/Users/aya/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3"
fi
if [[ ! -x "$GAME_PYTHON" ]]; then
  echo '未找到 Python 3。请打开 README.md，按 Node.js 方式运行。'
  read -r '?按回车退出'; exit 1
fi
echo '游戏地址：http://localhost:4173'
echo '请保留此窗口；按 Control + C 停止游戏。'
echo '手机：连接同一 Wi-Fi，使用 README 中说明的 Mac 局域网地址。'
open 'http://localhost:4173'
"$GAME_PYTHON" -m http.server 4173 --bind 0.0.0.0 --directory dist
