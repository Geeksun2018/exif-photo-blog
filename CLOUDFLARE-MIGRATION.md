# Cloudflare Pages 迁移指南

**目标**: 从 Vercel 迁移到 Cloudflare Pages + Workers，保持代码最小改动，便于同步上游更新。

## 🎯 迁移优势

✅ **完全免费** - Cloudflare Pages 无流量限制  
✅ **R2 同网络访问不计费** - 解决 Fast Origin Transfer 超限问题（当前 11.68GB/10GB）  
✅ **100K 请求/天** - 足够使用（当前仅 13K/天）  
✅ **双平台兼容** - 代码可同时部署到 Vercel 和 Cloudflare  

## 📋 迁移步骤

### 1️⃣ 安装依赖

```bash
pnpm install
```

新增的包：
- `@cloudflare/next-on-pages` - Next.js 到 Cloudflare Pages 的适配器
- `wrangler` - Cloudflare CLI 工具

### 2️⃣ 配置环境变量

创建 `.dev.vars` 文件（本地开发用）：

```bash
cp .dev.vars.example .dev.vars
```

编辑 `.dev.vars`，填入以下关键配置：

```env
# 数据库连接（保持不变）
POSTGRES_URL=postgresql://exif_user:ExifPhoto2025_SecurePass123@47.100.31.42:5432/exif_photo_blog?connect_timeout=10&statement_timeout=30000&idle_in_transaction_session_timeout=30000

# R2 存储配置
CLOUDFLARE_R2_ACCOUNT_ID=你的账户ID
CLOUDFLARE_R2_ACCESS_KEY_ID=你的访问密钥
CLOUDFLARE_R2_SECRET_ACCESS_KEY=你的密钥
CLOUDFLARE_R2_BUCKET_NAME=exif-photos
NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_DOMAIN=你的R2域名.com

# 存储偏好（使用 R2）
NEXT_PUBLIC_STORAGE_PREFERENCE=cloudflare-r2

# 平台标识
NEXT_PUBLIC_PLATFORM=cloudflare

# Next Auth
AUTH_URL=https://你的域名.pages.dev
AUTH_SECRET=生成一个随机密钥

# 其他配置
NEXT_PUBLIC_SITE_TITLE=你的站点标题
NEXT_PUBLIC_SITE_DESCRIPTION=你的站点描述
```

### 3️⃣ 配置 Cloudflare Pages

编辑 `wrangler.toml`，更新以下字段：

```toml
name = "你的项目名"

# 更新 R2 bucket 名称
[[r2_buckets]]
binding = "PHOTO_BUCKET"
bucket_name = "你的bucket名"
preview_bucket_name = "你的preview-bucket名"
```

### 4️⃣ 构建和测试

#### 本地构建测试

```bash
# 1. 先用 Next.js 构建
pnpm build

# 2. 用 Cloudflare 适配器转换
pnpm pages:build

# 3. 本地预览
pnpm pages:preview
```

访问 `http://localhost:8788` 查看效果。

### 5️⃣ 部署到 Cloudflare

#### 方式一：使用命令行（首次部署）

```bash
# 登录 Cloudflare
pnpm wrangler login

# 部署
pnpm pages:deploy
```

#### 方式二：使用 Cloudflare Dashboard（推荐）

1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 **Workers & Pages**
3. 点击 **Create Application** → **Pages** → **Connect to Git**
4. 选择你的 GitHub 仓库
5. 配置构建设置：
   - **Framework preset**: Next.js
   - **Build command**: `pnpm build && pnpm pages:build`
   - **Build output directory**: `.vercel/output/static`
   - **Node version**: 18 或更高

6. 添加环境变量（从 `.dev.vars` 复制）

### 6️⃣ 配置 R2 绑定（生产环境）

在 Cloudflare Dashboard 中：

1. 进入你的 Pages 项目
2. **Settings** → **Functions** → **R2 bucket bindings**
3. 添加绑定：
   - **Variable name**: `PHOTO_BUCKET`
   - **R2 bucket**: 选择你的 bucket
4. 保存并重新部署

### 7️⃣ 配置自定义域名

1. 在 Pages 项目中，进入 **Custom domains**
2. 添加你的域名
3. 按照提示更新 DNS 记录

## 🔄 代码改动说明

### 最小化改动原则

**改动的文件**：
- ✅ `package.json` - 添加 Cloudflare 脚本和依赖
- ✅ `app/layout.tsx` - 改用条件包装器（仅 2 行）
- ✅ `src/app/AnalyticsWrapper.tsx` - 新增文件（兼容层）

**未改动的文件**：
- ✅ 所有业务逻辑代码保持不变
- ✅ 数据库连接代码保持不变
- ✅ R2 存储代码保持不变（本来就支持）
- ✅ Next.js 配置保持不变

### 为什么改动少？

1. **使用官方适配器** - `@cloudflare/next-on-pages` 自动处理大部分兼容性
2. **条件导入** - 通过环境变量判断平台，不删除原代码
3. **双平台兼容** - 代码可同时部署到 Vercel 和 Cloudflare

## 🔧 开发工作流

### Vercel 开发（保持不变）

```bash
pnpm dev       # 本地开发
pnpm build     # 构建
git push       # 自动部署到 Vercel
```

### Cloudflare 开发

```bash
pnpm dev              # 本地开发（与 Vercel 相同）
pnpm pages:preview    # Cloudflare 本地预览
pnpm pages:deploy     # 部署到 Cloudflare
```

## ⚠️ 注意事项

### 1. Fast Origin Transfer 问题

**问题根源**（`src/photo/server.ts:73-79`）：
上传照片时，Vercel 会下载完整原图来提取 EXIF，导致流量超限。

**Cloudflare 优势**：
R2 同网络访问不计费，完全解决这个问题！

### 2. 环境变量同步

确保以下环境变量在两个平台保持一致：
- 数据库连接
- R2 配置
- Next Auth 配置
- 其他业务配置

### 3. 平台特定功能

**Vercel 特有**（会被跳过）：
- Vercel Analytics
- Vercel Speed Insights
- Vercel Blob（项目已改用 R2）

**Cloudflare 替代方案**：
- Cloudflare Web Analytics（可选）
- Cloudflare Speed Test（内置）
- R2 存储（已配置）

### 4. 数据库连接

两个平台都连接到同一个阿里云 PostgreSQL：
- IP: `47.100.31.42:5432`
- 数据库: `exif_photo_blog`
- 超时配置已优化（30s）

### 5. 缓存策略

**Vercel**：需要手动清除 CDN 缓存  
**Cloudflare**：缓存策略更智能，但也可能需要手动清除

清除 Cloudflare 缓存：
1. Dashboard → Caching → Configuration
2. Purge Everything

## 🚀 性能对比

| 指标 | Vercel Hobby | Cloudflare Pages |
|------|-------------|------------------|
| 流量限制 | 100GB/月 | ✅ 无限制 |
| Fast Origin Transfer | 10GB/月（已超限） | ✅ R2 同网络不计费 |
| 请求限制 | 无限制 | 100K/天（够用） |
| 区域控制 | ❌ 不保证 | ✅ 可选择 |
| 费用 | $0 → $1+/月 | ✅ $0 |

## 📊 迁移后监控

### 每周检查
- R2 用量（应该在免费额度内）
- 请求数（应该远低于 100K/天）
- 错误日志（Cloudflare Dashboard）

### 每月检查
- 总体性能对比
- 成本节省（消除 Fast Origin Transfer 费用）
- 数据库连接数（应该正常）

## 🔄 回滚方案

如果迁移后有问题，可以立即回滚到 Vercel：

1. **保持 Vercel 部署**：迁移过程中不删除 Vercel 项目
2. **DNS 切换**：修改域名 DNS 指向 Vercel
3. **代码兼容**：代码同时支持两个平台，无需回滚代码

## 🆘 常见问题

### Q: 上游仓库更新怎么办？
**A**: 合并时只会影响 3 个文件：
- `package.json` - 手动合并 Cloudflare 脚本
- `app/layout.tsx` - 只改了 2 行导入
- `src/app/AnalyticsWrapper.tsx` - 新文件，不冲突

### Q: 可以同时部署到两个平台吗？
**A**: 可以！代码完全兼容，通过环境变量区分平台。

### Q: 本地开发会受影响吗？
**A**: 不会，`pnpm dev` 保持不变，只是增加了 `pnpm pages:preview` 选项。

### Q: 数据库需要迁移吗？
**A**: 不需要，继续使用阿里云 PostgreSQL，两个平台共享。

## 📝 迁移检查清单

- [ ] 安装依赖 `pnpm install`
- [ ] 创建并配置 `.dev.vars`
- [ ] 更新 `wrangler.toml` 中的项目名和 bucket
- [ ] 本地测试 `pnpm pages:preview`
- [ ] Cloudflare 登录 `pnpm wrangler login`
- [ ] 创建 Pages 项目并连接 Git
- [ ] 配置环境变量
- [ ] 配置 R2 绑定
- [ ] 首次部署测试
- [ ] 配置自定义域名
- [ ] 更新 DNS 记录
- [ ] 验证所有功能正常
- [ ] 监控性能和错误

## 🎉 迁移完成后

1. **监控一周** - 确保稳定运行
2. **对比性能** - Cloudflare vs Vercel
3. **决定去留** - 可以保留 Vercel 作为备份，或完全迁移
4. **更新文档** - 记录实际迁移经验

---

**预计时间**: 2-3 天  
**技术难度**: ⭐⭐☆☆☆（中低）  
**风险等级**: ⭐☆☆☆☆（很低，可随时回滚）

祝迁移顺利！🚀


