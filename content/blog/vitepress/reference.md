# 常用配置

## Frontmatter

```md
---
# ✅ SEO 元信息
title: 页面标题
description: 页面描述，自动生成<meta name="description">
lang: zh-CN # html lang 属性
dir: ltr # 文字方向 ltr / rtl

# ✅ 布局控制
layout: doc # doc | home | page
isHome: false # 强制标记为首页（配合自定义layout）

# ✅ 侧边栏 / 导航 / 大纲（就是你刚才问的三级标题）
sidebar: true # 是否显示左侧侧边栏
aside: true # 是否显示右侧大纲容器（outline容器）
outline: [2, 3] # 右侧大纲层级，false=关闭大纲
navbar: true # 是否显示顶部导航栏

# ✅ 页脚相关
editLink: true # 是否显示「编辑此页」链接
lastUpdated: true # 是否显示最后更新时间；也可以写日期字符串 lastUpdated: 2026-10-29
footer: true # 是否显示底部footer

# ✅ 注入自定义 meta / link 标签（SEO关键词、og:image等）
head:
  - - meta
    - name: keywords
      content: vitepress,文档,前端
  - - meta
    - property: og:image
      content: /cover.png
  - - link
    - rel: icon
      href: /favicon.ico

# ✅ 首页专属（layout: home 才生效）
hero:
  name: Notes
  text: 笔记
  tagline: 技术笔记
  actions:
    - theme: brand
      text: 开始阅读
      link: /intro
features:
  - title: 轻量化
    details: 基于Vite，启动飞快

# ✅ 自定义字段（VitePress不处理，可以在Vue里 $frontmatter.xxx 使用）
author: zhangsan
date: 2026-10-29
tags: [vitepress, 笔记]
---
```

## 提示块

```md
::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: danger
This is a dangerous warning.
:::

::: details
This is a details block.
:::
```
