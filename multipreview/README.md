# TinyMCE 多端预览插件

一款为 TinyMCE 打造的多端预览插件，支持手机、平板、PC 三种视口，并提供完整的 Vue 2 / Vue 3 集成方案。

## 功能特性

- 📱 **手机预览** — 375×812，还原 iPhone 级视口
- 📟 **平板预览** — 768×1024，iPad 视口
- 🖥️ **PC 预览** — 1280×800，桌面级视口
- 🔄 **横竖屏切换** — 一键旋转，验证横屏适配
- 🎨 **设备外壳** — 还原刘海、Home 键等真实设备细节
- ⚡ **零依赖** — 纯 JS 实现，无额外依赖
- 🔧 **Vue 2 / Vue 3** — 提供完整 Options API 和 Composition API 组件

---

## 快速开始

### 方式一：原生 JS

```html
<!-- 1. 引入 TinyMCE -->
<script src="/tinymce/tinymce.min.js"></script>

<!-- 2. 引入预览插件 -->
<script src="/tinymce/plugins/multipreview/plugin.js"></script>

<!-- 3. 初始化 -->
<script>
tinymce.init({
  selector: '#editor',
  plugins: ['multipreview', 'lists', 'link', 'image'],
  toolbar: 'bold italic | multipreview',
  multipreview: {
    customStyles: 'body { background: #f9fafb; }'  // 可选
  }
})
</script>
```

### 方式二：Vue 2（Options API）

```bash
npm install @tinymce/tinymce-vue tinymce
```

```vue
<template>
  <TinymcePreviewEditor
    v-model="content"
    :height="500"
    plugin-path="/tinymce/plugins/multipreview/plugin.js"
    :show-external-trigger="true"
    ref="editor"
  />
</template>

<script>
import TinymcePreviewEditor from './TinymcePreviewEditor.vue'

export default {
  components: { TinymcePreviewEditor },
  data() {
    return { content: '' }
  },
  methods: {
    preview() {
      this.$refs.editor.openPreview()
    }
  }
}
</script>
```

### 方式三：Vue 3（Composition API）

```vue
<template>
  <TinymcePreviewEditor
    v-model="content"
    :height="500"
    ref="editorRef"
  />
  <button @click="editorRef.openPreview()">打开预览</button>
</template>

<script setup>
import { ref } from 'vue'
import TinymcePreviewEditor from './TinymcePreviewEditor.vue3.vue'

const editorRef = ref(null)
const content = ref('')
</script>
```

---

## 文件结构

```
tinymce-preview-plugin/
├── src/
│   ├── plugin.js                     # 核心插件（原生 JS，TinyMCE 注册）
│   ├── TinymcePreviewEditor.vue      # Vue 2 组件（Options API）
│   └── TinymcePreviewEditor.vue3.vue # Vue 3 组件（Composition API）
├── demo.html                          # 在线演示
└── README.md
```

---

## Props（Vue 组件）

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `modelValue` / `v-model` | `String` | `''` | 编辑器内容 |
| `disabled` | `Boolean` | `false` | 是否禁用 |
| `pluginPath` | `String` | `/tinymce/plugins/multipreview/plugin.js` | 插件脚本路径 |
| `customPreviewStyles` | `String` | `''` | 预览区自定义 CSS |
| `showExternalTrigger` | `Boolean` | `false` | 是否在编辑器外显示预览按钮 |
| `height` | `Number\|String` | `500` | 编辑器高度（px） |

---

## Methods（Vue 组件 ref）

| 方法 | 说明 |
|------|------|
| `openPreview()` | 打开预览弹窗（默认手机视口） |
| `getContent()` | 获取编辑器 HTML 内容 |
| `setContent(html)` | 设置编辑器内容 |

---

## 插件选项（TinyMCE init）

```js
tinymce.init({
  // ...
  multipreview: {
    customStyles: 'body { max-width: 700px; margin: 0 auto; }'
  }
})
```

---

## TinyMCE 版本支持

- TinyMCE 5.x ✅
- TinyMCE 6.x ✅

---

## License

MIT
