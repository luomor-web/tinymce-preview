# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在此代码仓库中工作提供指引。

## 项目概述

tinymce-plugin-multipreview — TinyMCE 多端预览插件，支持手机、平板、PC 三种视口预览，并提供 Vue 2 / Vue 3 组件封装。可通过 npm 安装使用。

## 架构

```
tinymce-preview/
├── src/
│   └── plugin.js                          # 核心插件源码（ESM/CJS/UMD）
├── vue/
│   ├── TinymcePreviewEditor.vue           # Vue 2 组件（Options API）
│   ├── TinymcePreviewEditor.vue3.vue      # Vue 3 组件（Composition API）
│   ├── vue2.js                            # Vue 2 导出入口
│   └── vue3.js                            # Vue 3 导出入口
├── dist/                                  # 构建输出目录（npm 发布）
│   ├── plugin.esm.js                      # ESM 格式插件
│   ├── plugin.cjs.js                      # CommonJS 格式插件
│   ├── plugin.umd.js                      # UMD 格式插件
│   └── vue/                               # Vue 组件构建输出
├── package.json
├── vite.config.js                         # 插件构建配置
├── vite.vue.config.js                     # Vue 组件构建配置
└── README.md
```

### 核心组件

**src/plugin.js** — 主插件源码，导出：
- `PreviewController` — 管理预览弹窗、设备切换和内容渲染的类
- `DEVICES` — 设备配置：手机 (375×812)、平板 (768×1024)、桌面 (1280×800)
- `getFullHtml()` — 生成预览 iframe 所需的完整 HTML（含样式）
- `initPlugin()` — 手动初始化插件的函数
- `PLUGIN_NAME` — 插件名称 `'multipreview'`

**vue/组件** — Vue 2 和 Vue 3 封装提供：
- `v-model` 双向绑定编辑器内容
- Props：`pluginPath`、`customPreviewStyles`、`showExternalTrigger`、`height`、`disabled`
- 暴露方法：`openPreview()`、`getContent()`、`setContent(html)`

## 使用方式

### NPM 安装

```bash
npm install tinymce-plugin-multipreview
```

### 原生 JS（CDN）

```html
<script src="https://unpkg.com/tinymce-plugin-multipreview/dist/plugin.umd.js"></script>
<script>
tinymce.init({
  selector: '#editor',
  plugins: ['multipreview', 'lists', 'link'],
  toolbar: 'multipreview',
  multipreview: { customStyles: 'body { background: #f9fafb; }' }
})
</script>
```

### 原生 JS（NPM + 打包工具）

```js
import { initPlugin } from 'tinymce-plugin-multipreview'

tinymce.init({
  selector: '#editor',
  plugins: ['multipreview'],
  toolbar: 'multipreview',
  setup: (editor) => {
    initPlugin(editor, { customStyles: '...' })
  }
})
```

### Vue 2

```js
import TinymcePreviewEditor from 'tinymce-plugin-multipreview/vue/vue2'
```

### Vue 3

```js
import TinymcePreviewEditor from 'tinymce-plugin-multipreview/vue/vue3'
```

## 开发命令

```bash
npm install              # 安装依赖
npm run build            # 构建插件 + Vue 组件
npm run build:plugin     # 仅构建插件
npm run build:vue        # 仅构建 Vue 组件
npm run release          # 构建并发布到 npm
```

## 开发说明

- 支持 TinyMCE 5.x 和 6.x
- 插件使用 `external_plugins` 配置进行自托管部署
- 预览通过 Blob URL 在 iframe 中渲染内容
- 设备外壳包含视觉细节（刘海、Home 条等，适用于手机/平板）
- 支持手机/平板横竖屏切换
