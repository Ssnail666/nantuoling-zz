# 南托岭·邻里闲置

面向社区邻里的二手交易网站，主打手机端、低门槛发布、当面交易。

## 本地启动

1. 安装依赖：`npm install`
2. 新建 `.env.local` 并填写：

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_DEFAULT_COMMUNITY=南托岭社区
```

3. 启动开发环境：`npm run dev`

## Supabase 准备

- 建表 SQL 见 [`二手市场.md`](./二手市场.md)
- Storage 创建 public bucket：`item-images`

## 当前功能

- 首页浏览与年龄段筛选
- 微信群引流入口
- 匿名发布闲置
- 详情页联系卖家、复制联系方式、标记已出
- 我的发布列表（基于当前设备记录）
