# 自动化 CI/CD 部署指南

本配置实现类似 **Cloudflare Pages** 的体验：推送代码到 GitHub 即自动部署到腾讯云服务器。

---

## 📋 部署步骤

### 1. 初始化服务器（仅需一次）

SSH 登录你的腾讯云服务器：

```bash
ssh root@101.34.75.18
```

运行初始化脚本：

```bash
# 下载初始化脚本
wget https://raw.githubusercontent.com/你的用户名/你的仓库名/main/scripts/init-server.sh -O /tmp/init-server.sh

# 赋予执行权限
chmod +x /tmp/init-server.sh

# 运行脚本
bash /tmp/init-server.sh
```

或者手动执行以下命令：

```bash
# 安装 Docker
curl -fsSL https://get.docker.com | sh
systemctl start docker
systemctl enable docker

# 安装 Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# 安装 Git
yum install -y git

# 创建项目目录
mkdir -p /var/www/soulcompass
cd /var/www/soulcompass
```

---

### 2. 克隆代码到服务器

```bash
cd /var/www/soulcompass
git clone https://github.com/你的用户名/你的仓库名.git .
```

---

### 3. 创建环境变量文件

```bash
cat > /var/www/soulcompass/.env << EOF
VITE_GEMINI_API_KEY=AIzaSyCn4DJDo3uPwUfiB3w618REJWThHMgdhCs
VITE_SUPABASE_URL=https://kisniptjtwicndvdgoez.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_9zUig1BO1X0RxqczS-gaEA_Er1C-evn
EOF
```

---

### 4. 配置 GitHub Secrets

在你的 GitHub 仓库中配置以下 Secrets：

1. 进入仓库页面：`Settings` → `Secrets and variables` → `Actions`
2. 点击 `New repository secret` 添加以下密钥：

| Secret 名称 | 值 | 说明 |
|------------|---|---|
| `SERVER_HOST` | `101.34.75.18` | 服务器 IP 地址 |
| `SERVER_USER` | `root` | SSH 用户名 |
| `SERVER_PASSWORD` | 你的服务器密码 | SSH 密码 |
| `SERVER_PORT` | `22` | SSH 端口（默认 22） |

---

### 5. 推送代码触发部署

```bash
# 提交代码
git add .
git commit -m "feat: add CI/CD automation"
git push origin main
```

推送后，GitHub Actions 会自动运行，你可以在这里查看部署状态：
- 仓库页面 → `Actions` 标签

---

## ✅ 验证部署

部署完成后，访问：
- **HTTP**: http://101.34.75.18
- **HTTPS**: https://101.34.75.18（需配置 SSL 证书）

---

## 🔄 工作流程

每次推送代码到 `main` 分支时：

1. GitHub Actions 自动触发
2. SSH 连接到腾讯云服务器
3. 拉取最新代码 (`git pull`)
4. 停止旧容器 (`docker-compose down`)
5. 构建并启动新容器 (`docker-compose up -d --build`)
6. 清理未使用的镜像

整个过程 **自动完成**，无需手动操作！

---

## 🛠 手动触发部署

如果需要手动触发部署（不推送代码）：

1. 进入仓库 `Actions` 页面
2. 选择 `Deploy to Tencent Cloud` 工作流
3. 点击 `Run workflow` → `Run workflow`

---

## 📌 注意事项

1. **`.env` 文件不要提交到 GitHub** - 已在 `.gitignore` 中排除
2. **环境变量只在服务器上创建一次** - 后续 `git pull` 不会覆盖
3. **GitHub Secrets 保护敏感信息** - 密码等不要明文写在代码中
4. **首次部署可能较慢** - Docker 需要下载镜像和构建

---

## 🔧 故障排查

### 查看服务器日志
```bash
ssh root@101.34.75.18
cd /var/www/soulcompass
docker-compose logs -f
```

### 重启容器
```bash
docker-compose restart
```

### 查看运行状态
```bash
docker-compose ps
```

---

## 🚀 高级配置

### 添加 HTTPS（Let's Encrypt）

在 `nginx.conf` 中配置 SSL，或使用 Certbot：

```bash
# 安装 Certbot
yum install -y certbot

# 获取证书
certbot certonly --nginx -d your-domain.com

# 更新 nginx.conf 使用证书
```

### 配置自定义域名

在腾讯云域名解析中添加 A 记录：
- 主机记录：`@` 或 `www`
- 记录值：`101.34.75.18`
