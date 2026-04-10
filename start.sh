#!/bin/bash

# 获取脚本所在目录并进入，确保相对路径正确
cd "$(dirname "$0")"

echo "=================================="
echo "      启动电子印章生成工具      "
echo "=================================="

# 检查是否已经存在 PID 文件
if [ -f "app.pid" ]; then
    PID=$(cat app.pid)
    # 检查该 PID 是否真正在运行
    if ps -p $PID > /dev/null; then
        echo "服务已经在运行中！PID: $PID"
        echo "如需重启，请先运行 ./stop.sh"
        exit 1
    else
        echo "发现失效的 PID 文件，正在清理..."
        rm app.pid
    fi
fi

# 检查 node_modules 目录是否存在，不存在则自动安装依赖
if [ ! -d "node_modules" ]; then
    echo "未发现 node_modules，正在自动安装依赖..."
    npm install
    if [ $? -ne 0 ]; then
        echo "依赖安装失败，请检查网络或 npm 环境。"
        exit 1
    fi
fi

echo "正在后台启动 Vite 开发服务器..."

# 使用 nohup 在后台运行服务，并将日志重定向到 app.log
nohup npm run dev > app.log 2>&1 &

# 获取后台运行的进程 ID
PID=$!

# 将 PID 写入文件
echo $PID > app.pid

echo "服务已成功启动！PID: $PID"
echo "运行日志已输出到当前目录的 app.log 文件。"
echo "请在浏览器中访问: http://<服务器公网IP>:5176 (或 http://localhost:5176)"
echo "=================================="
