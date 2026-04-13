# tinymce-plugin-multipreview

TinyMCE 多端预览插件，支持手机、平板、PC 三种视口预览，并提供 Vue 2 / Vue 3 组件封装。

## 功能特性

- 📱 **手机预览** — 375×812，还原 iPhone 级视口
- 📟 **平板预览** — 768×1024，iPad 视口
- 🖥️ **PC 预览** — 1280×800，桌面级视口
- 🔄 **横竖屏切换** — 一键旋转，验证横屏适配
- 🎨 **设备外壳** — 还原刘海、Home 键等真实设备细节
- ⚡ **零依赖** — 纯 JS 实现，支持 UMD/ESM/CJS 多种模块格式
- 🔧 **Vue 2 / Vue 3** — 提供完整 Options API 和 Composition API 组件

## 安装

```bash
npm install tinymce-plugin-multipreview
```

## 快速开始

### 原生 JS 使用

#### CDN 引入

```html
<script src="https://unpkg.com/tinymce-plugin-multipreview/dist/plugin.umd.js"></script>
<script>
tinymce.init({
  selector: '#editor',
  plugins: ['multipreview', 'lists', 'link', 'image'],
  toolbar: 'bold italic | multipreview',
  multipreview: {
    customStyles: 'body { background: #f9fafb; }'
  }
})
</script>
```

#### NPM + 打包工具

```js
import { initPlugin } from 'tinymce-plugin-multipreview'

tinymce.init({
  selector: '#editor',
  plugins: ['multipreview', 'lists', 'link'],
  toolbar: 'multipreview',
  setup: (editor) => {
    initPlugin(editor, {
      customStyles: 'body { max-width: 700px; margin: 0 auto; }'
    })
  }
})
```

### Vue 2 使用

```vue
<template>
  <TinymcePreviewEditor
    v-model="content"
    :height="500"
    ref="editor"
  />
  <button @click="$refs.editor.openPreview()">预览</button>
</template>

<script>
import TinymcePreviewEditor from 'tinymce-plugin-multipreview/vue/vue2'

export default {
  components: { TinymcePreviewEditor },
  data() {
    return { content: '' }
  }
}
</script>
```

### Vue 3 使用

```vue
<template>
  <TinymcePreviewEditor
    v-model="content"
    :height="500"
    ref="editorRef"
  />
  <button @click="openPreview">预览</button>
</template>

<script setup>
import { ref } from 'vue'
import TinymcePreviewEditor from 'tinymce-plugin-multipreview/vue/vue3'

const editorRef = ref(null)
const content = ref('')

const openPreview = () => {
  editorRef.value?.openPreview()
}
</script>
```

## Props（Vue 组件）

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `modelValue` / `v-model` | `String` | `''` | 编辑器内容 |
| `disabled` | `Boolean` | `false` | 是否禁用 |
| `pluginPath` | `String` | `/tinymce/plugins/multipreview/plugin.js` | 插件脚本路径 |
| `customPreviewStyles` | `String` | `''` | 预览区自定义 CSS |
| `showExternalTrigger` | `Boolean` | `false` | 是否在编辑器外显示预览按钮 |
| `height` | `Number\|String` | `500` | 编辑器高度（px） |

## Methods（Vue 组件 ref）

| 方法 | 说明 |
|------|------|
| `openPreview()` | 打开预览弹窗（默认手机视口） |
| `getContent()` | 获取编辑器 HTML 内容 |
| `setContent(html)` | 设置编辑器内容 |

## 插件选项（TinyMCE init）

```js
tinymce.init({
  // ...
  multipreview: {
    customStyles: 'body { max-width: 700px; margin: 0 auto; }'
  }
})
```

## 开发

```bash
# 安装依赖
npm install

# 构建插件
npm run build

# 构建 Vue 组件
npm run build:vue

# 发布
npm run release
```

## TinyMCE 版本支持

- TinyMCE 5.x ✅
- TinyMCE 6.x ✅

## License

MIT
