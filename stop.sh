#!/bin/bash

# 获取脚本所在目录并进入，确保相对路径正确
cd "$(dirname "$0")"

echo "=================================="
echo "      停止电子印章生成工具      "
echo "=================================="

# 如果不存在 app.pid，尝试清理默认的 5176 端口
if [ ! -f "app.pid" ]; then
    echo "未找到 app.pid 文件，服务可能未通过 start.sh 运行。"
    echo "正在尝试查找并终止占用 5176 端口的进程..."
    
    # 查找占用 5176 端口的进程 (macOS/Linux 通用)
    PORT_PID=$(lsof -ti:5176)
    if [ ! -z "$PORT_PID" ]; then
        echo "发现占用 5176 端口的进程 $PORT_PID，正在终止..."
        kill -9 $PORT_PID
        echo "已终止端口占用进程。"
    else
        echo "未发现 5176 端口被占用。服务未运行。"
    fi
    exit 0
fi

# 获取之前记录的 PID
PID=$(cat app.pid)

# 检查该 PID 是否真正在运行
if ps -p $PID > /dev/null; then
    echo "正在停止服务 (PID: $PID)..."
    kill $PID
    
    # 等待进程完全退出
    sleep 1
    
    # 如果进程还在运行，强制杀死
    if ps -p $PID > /dev/null; then
        echo "进程未响应，正在强制停止 (kill -9)..."
        kill -9 $PID
    fi
    echo "服务已停止。"
else
    echo "服务 (PID: $PID) 当前未运行。"
fi

# 清理 PID 文件
echo "清理残留文件..."
rm -f app.pid
echo "=================================="
