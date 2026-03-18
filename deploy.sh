#!/bin/bash

# 部署脚本 - 部署到腾讯云轻量应用服务器

set -e

echo "=========================================="
echo "SoulCompass 项目部署脚本"
echo "=========================================="

# 服务器配置
SERVER_IP="101.34.75.18"
SERVER_USER="root"
REMOTE_DIR="/var/www/soulcompass"

echo ""
echo "步骤 1: 检查本地环境..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose 未安装"
    exit 1
fi

echo "✅ Docker 环境检查通过"

echo ""
echo "步骤 2: 构建 Docker 镜像..."
docker-compose build

echo "✅ Docker 镜像构建完成"

echo ""
echo "步骤 3: 部署说明"
echo "=========================================="
echo "由于项目包含环境变量文件,需要手动上传到服务器"
echo ""
echo "请在服务器上执行以下步骤:"
echo ""
echo "1. 连接到服务器:"
echo "   ssh root@$SERVER_IP"
echo ""
echo "2. 安装 Docker 和 Docker Compose (如果未安装):"
echo "   curl -fsSL https://get.docker.com | sh"
echo "   curl -L \"https://github.com/docker/compose/releases/latest/download/docker-compose-\$(uname -s)-\$(uname -m)\" -o /usr/local/bin/docker-compose"
echo "   chmod +x /usr/local/bin/docker-compose"
echo ""
echo "3. 创建项目目录:"
echo "   mkdir -p $REMOTE_DIR"
echo "   cd $REMOTE_DIR"
echo ""
echo "4. 从本地上传项目文件到服务器:"
echo "   在本地执行: rsync -avz --exclude 'node_modules' --exclude '.git' --exclude 'dist' ./ root@$SERVER_IP:$REMOTE_DIR/"
echo ""
echo "5. 在服务器上创建 .env 文件:"
echo "   cat > $REMOTE_DIR/.env << EOF"
echo "   VITE_GEMINI_API_KEY=AIzaSyCn4DJDo3uPwUfiB3w618REJWThHMgdhCs"
echo "   VITE_SUPABASE_URL=https://kisniptjtwicndvdgoez.supabase.co"
echo "   VITE_SUPABASE_ANON_KEY=sb_publishable_9zUig1BO1X0RxqczS-gaEA_Er1C-evn"
echo "   EOF"
echo ""
echo "6. 启动服务:"
echo "   cd $REMOTE_DIR"
echo "   docker-compose up -d"
echo ""
echo "7. 查看日志:"
echo "   docker-compose logs -f"
echo ""
echo "8. 查看服务状态:"
echo "   docker-compose ps"
echo ""
echo "=========================================="
echo "部署完成后,访问地址: http://$SERVER_IP"
echo "=========================================="
