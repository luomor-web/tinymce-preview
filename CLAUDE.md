# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在此代码仓库中工作提供指引。

## 项目概述

TinyMCE 多端预览插件 (multipreview) — 为 TinyMCE 编辑器提供手机、平板、PC 三种视口的实时预览功能，并提供 Vue 2 和 Vue 3 组件封装。

## 架构

```
tinymce-preview/
├── plugin.js                          # 核心 TinyMCE 插件（原生 JS）
├── TinymcePreviewEditor.vue           # Vue 2 组件（Options API）
├── TinymcePreviewEditor.vue3.vue      # Vue 3 组件（Composition API）
├── tinymce/                           # TinyMCE 核心库（vendor）
│   └── js/tinymce/
│       ├── tinymce.min.js             # 核心编辑器
│       ├── tinymce.d.ts               # TypeScript 类型定义
│       ├── icons/default/             # 图标资源
│       ├── models/dom/                # 编辑器模型
│       ├── themes/silver/             # UI 主题
│       └── plugins/*/                 # 内置插件
└── docs/                              # 文档
```

### 核心组件

**plugin.js** — 主插件，包含：
- `PreviewController` — 管理预览弹窗、设备切换和内容渲染的类
- `DEVICES` — 设备配置：手机 (375×812)、平板 (768×1024)、桌面 (1280×800)
- `getFullHtml()` — 生成预览 iframe 所需的完整 HTML（含样式）
- TinyMCE 插件注册：`multipreview` 命令和工具栏按钮

**Vue 组件** — Vue 2 和 Vue 3 封装提供：
- `v-model` 双向绑定编辑器内容
- Props：`pluginPath`、`customPreviewStyles`、`showExternalTrigger`、`height`、`disabled`
- 暴露方法：`openPreview()`、`getContent()`、`setContent(html)`

## 使用方式

### 原生 JS
```html
<script src="/tinymce/tinymce.min.js"></script>
<script src="/tinymce/plugins/multipreview/plugin.js"></script>
<script>
tinymce.init({
  selector: '#editor',
  plugins: ['multipreview', 'lists', 'link', 'image'],
  toolbar: 'bold italic | multipreview',
  multipreview: { customStyles: 'body { background: #f9fafb; }' }
})
</script>
```

### Vue 2/3
```vue
<template>
  <TinymcePreviewEditor
    v-model="content"
    :height="500"
    plugin-path="/tinymce/plugins/multipreview/plugin.js"
    ref="editor"
  />
  <button @click="$refs.editor.openPreview()">预览</button>
</template>
```

## 开发说明

- 支持 TinyMCE 5.x 和 6.x
- 插件使用 `external_plugins` 配置进行自托管部署
- 预览通过 Blob URL 在 iframe 中渲染内容
- 设备外壳包含视觉细节（刘海、Home 条等，适用于手机/平板）
- 支持手机/平板横竖屏切换
