# 南托岭·邻里闲置

面向社区邻里的二手交易网站，主打手机端浏览、低门槛发布和当面交易。

## 技术栈

- `Next.js 14`
- `React 18`
- `TypeScript`
- `Tailwind CSS`
- `Supabase`

## 当前功能

- 首页浏览与年龄段筛选
- 发布闲置并上传图片
- 详情页查看、复制联系方式、标记已出
- 我的发布列表（基于当前设备 `localStorage`）
- 微信群引流入口

## 本地开发

1. 安装依赖

```bash
npm install
```

2. 创建 `.env.local`

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_DEFAULT_COMMUNITY=南托岭社区
```

3. 初始化 Supabase

- 按 [项目技术栈与开发部署说明.md](./项目技术栈与开发部署说明.md) 中的建表 SQL 初始化数据库
- 创建 public bucket：`item-images`

4. 启动开发环境

```bash
npm run dev
```

默认访问地址：

```bash
http://localhost:3000
```

## 生产构建

```bash
npm run build
npm run start
```

## 部署建议

- 面向国内用户正式上线时，优先选择中国大陆云服务器
- 域名建议使用 `www` 作为主访问入口
- 如果使用中国大陆服务器，对外提供网站服务前需完成 ICP 备案

## 文档

- 详细技术栈与部署说明见 [项目技术栈与开发部署说明.md](./项目技术栈与开发部署说明.md)
