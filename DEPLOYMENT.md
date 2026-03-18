# SoulCompass 项目部署指南

## 服务器信息
- **IP 地址**: 101.34.75.18
- **操作系统**: OpenCloudOS 8 + Docker 26
- **实例 ID**: lhins-bv665qe8

## 部署方式: Docker + Nginx

### 方案说明
使用 Docker 容器化部署,基于 Nginx 提供静态文件服务,并配置了:
- 自动构建 React 应用
- SPA 路由支持
- Gzip 压缩
- 静态资源缓存
- CORS 跨域配置
- 安全头设置

## 部署前准备

### 本地构建测试

**在部署前,强烈建议先在本地构建和测试:**

```bash
# 1. 安装依赖
npm install

# 2. 本地开发测试
npm run dev

# 3. 生产构建测试
npm run build

# 4. 预览构建结果
npm run preview
```

### 依赖安装说明

本项目需要安装以下开发依赖:
- `tailwindcss` - CSS 框架
- `postcss` - CSS 处理工具
- `autoprefixer` - CSS 自动前缀

如果之前没有安装,请运行:

```bash
npm install -D tailwindcss postcss autoprefixer
```

## 快速部署步骤

### 步骤 1: 连接到服务器

```bash
ssh root@101.34.75.18
```

### 步骤 2: 安装 Docker 和 Docker Compose (如果未安装)

```bash
# 安装 Docker
curl -fsSL https://get.docker.com | sh
systemctl start docker
systemctl enable docker

# 安装 Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# 验证安装
docker --version
docker-compose --version
```

### 步骤 3: 上传项目文件

**方式 1: 使用 SCP 上传 (推荐)**
```bash
# 在本地项目目录执行
scp -r . root@101.34.75.18:/var/www/soulcompass/
```

**方式 2: 使用 Git 克隆**
```bash
# 在服务器上执行
git clone <your-repo-url> /var/www/soulcompass
cd /var/www/soulcompass
```

**方式 3: 使用 rsync (排除不需要的文件)**
```bash
rsync -avz --exclude 'node_modules' --exclude '.git' --exclude 'dist' ./ root@101.34.75.18:/var/www/soulcompass/
```

### 步骤 4: 创建环境变量文件

在服务器上创建 `.env` 文件:

```bash
cd /var/www/soulcompass

cat > .env << EOF
VITE_GEMINI_API_KEY=AIzaSyCn4DJDo3uPwUfiB3w618REJWThHMgdhCs
VITE_SUPABASE_URL=https://kisniptjtwicndvdgoez.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_9zUig1BO1X0RxqczS-gaEA_Er1C-evn
EOF
```

### 步骤 5: 构建并启动服务

```bash
cd /var/www/soulcompass

# 构建并启动
docker-compose up -d

# 查看日志
docker-compose logs -f

# 查看服务状态
docker-compose ps
```

### 步骤 6: 验证部署

访问: **http://101.34.75.18**

## 常用管理命令

```bash
# 启动服务
docker-compose up -d

# 停止服务
docker-compose down

# 重启服务
docker-compose restart

# 查看日志
docker-compose logs -f

# 查看服务状态
docker-compose ps

# 查看容器资源使用
docker stats

# 进入容器
docker exec -it soulcompass-web sh
```

## 更新部署

当代码更新后,在服务器上执行:

```bash
cd /var/www/soulcompass

# 拉取最新代码
git pull

# 重新构建并启动
docker-compose up -d --build
```

## 故障排查

### 1. 构建失败 - 缺少依赖

**问题**: Docker 构建时提示找不到 `tailwindcss` 等依赖

**解决方案**:
```bash
# 检查 package.json 是否包含 tailwindcss
cat package.json | grep tailwindcss

# 如果没有,添加依赖
npm install -D tailwindcss postcss autoprefixer

# 重新构建
docker-compose build --no-cache
docker-compose up -d
```

### 2. 样式丢失

**问题**: 部署后页面样式混乱

**解决方案**:
```bash
# 检查 index.css 是否存在
ls -la index.css

# 检查 tailwind.config.js 是否存在
ls -la tailwind.config.js

# 重新构建
docker-compose up -d --build
```

### 3. 端口被占用

```bash
# 检查端口占用
netstat -tunlp | grep :80

# 如果 80 端口被占用,修改 docker-compose.yml 中的端口映射
ports:
  - "8080:80"
```

### 4. 容器启动失败

```bash
# 查看详细日志
docker-compose logs soulcompass-web

# 查看容器详细信息
docker inspect soulcompass-web
```

### 5. 构建失败

```bash
# 清理构建缓存
docker-compose down
docker system prune -a

# 重新构建
docker-compose build --no-cache
docker-compose up -d
```

### 6. 权限问题

```bash
# 确保 .env 文件权限正确
chmod 644 /var/www/soulcompass/.env

# 确保目录权限正确
chown -R root:root /var/www/soulcompass
```

## 安全配置建议

### 1. 配置防火墙

```bash
# 开放 HTTP 和 HTTPS 端口
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload
```

### 2. 配置 SSL 证书 (可选)

使用 Let's Encrypt 免费证书:

```bash
# 安装 certbot
yum install -y certbot

# 获取证书
certbot certonly --nginx -d your-domain.com

# 修改 nginx.conf 配置 HTTPS
```

### 3. 限制访问

在 `nginx.conf` 中添加 IP 白名单:

```nginx
# 仅允许特定 IP 访问
allow 1.2.3.4;
deny all;
```

## 监控和维护

### 查看服务器资源

```bash
# CPU 和内存使用
top

# 磁盘使用
df -h

# 网络流量
iftop
```

### 定期备份

```bash
# 备份数据库配置
cp /var/www/soulcompass/.env /var/www/backup/.env.$(date +%Y%m%d)

# 备份项目文件
tar -czf /var/www/backup/soulcompass-$(date +%Y%m%d).tar.gz /var/www/soulcompass
```

## 与 Cloudflare Pages 部署的区别

### Cloudflare Pages 部署
- 自动构建和部署
- 使用 Cloudflare CDN
- 自动 HTTPS
- 适合静态网站快速部署

### Docker + Nginx 部署
- 完全控制服务器环境
- 可以配置自定义域名和 SSL
- 可以部署到任意支持 Docker 的服务器
- 适合生产环境和需要自定义配置的场景

### 迁移注意事项

如果从 Cloudflare Pages 迁移到 Docker 部署:

1. **环境变量**: 确保在服务器的 `.env` 文件中正确配置所有环境变量
2. **依赖安装**: 确保安装了 `tailwindcss`、`postcss`、`autoprefixer`
3. **构建配置**: 检查 `vite.config.ts` 中的构建配置
4. **静态资源**: 确保 `index.css` 和相关配置文件存在
5. **路由配置**: 确保 Nginx 配置支持 SPA 路由

## 联系支持

如遇问题,请检查:
1. Docker 和 Docker Compose 是否正常运行
2. 端口 80 是否被占用
3. 防火墙是否开放端口 80
4. .env 文件配置是否正确
5. npm 依赖是否完整安装
6. Tailwind CSS 和相关工具是否正确配置
