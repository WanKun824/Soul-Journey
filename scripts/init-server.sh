#!/bin/bash
# 服务器初始化脚本 - 在腾讯云服务器上运行一次

set -e

echo "🔧 Initializing server for deployment..."

# 1. 安装 Docker 和 Docker Compose
if ! command -v docker &> /dev/null; then
    echo "📦 Installing Docker..."
    curl -fsSL https://get.docker.com | sh
    systemctl start docker
    systemctl enable docker
else
    echo "✅ Docker already installed"
fi

if ! command -v docker-compose &> /dev/null; then
    echo "📦 Installing Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
else
    echo "✅ Docker Compose already installed"
fi

# 2. 安装 Git
if ! command -v git &> /dev/null; then
    echo "📦 Installing Git..."
    yum install -y git
else
    echo "✅ Git already installed"
fi

# 3. 创建项目目录
mkdir -p /var/www/soulcompass
cd /var/www/soulcompass

echo "✅ Server initialization completed!"
echo ""
echo "📝 Next steps:"
echo "1. Clone your GitHub repository:"
echo "   git clone https://github.com/你的用户名/你的仓库名.git ."
echo ""
echo "2. Create .env file with your environment variables"
echo ""
echo "3. Configure GitHub Secrets and push to trigger deployment"
