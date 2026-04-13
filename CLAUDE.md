# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TinyMCE multi-device preview plugin ( multipreview ) — a plugin that provides real-time preview for mobile, tablet, and desktop viewports, with Vue 2 and Vue 3 component wrappers.

## Architecture

```
tinymce-preview/
├── plugin.js                          # Core TinyMCE plugin (native JS)
├── TinymcePreviewEditor.vue           # Vue 2 component (Options API)
├── TinymcePreviewEditor.vue3.vue      # Vue 3 component (Composition API)
├── tinymce/                           # TinyMCE core library (vendor)
│   └── js/tinymce/
│       ├── tinymce.min.js             # Core editor
│       ├── tinymce.d.ts               # TypeScript definitions
│       ├── icons/default/             # Icon assets
│       ├── models/dom/                # Editor models
│       ├── themes/silver/             # UI theme
│       └── plugins/*/                 # Built-in plugins
└── docs/                              # Documentation
```

### Core Components

**plugin.js** — The main plugin containing:
- `PreviewController` — Class managing preview modal, device switching, and content rendering
- `DEVICES` — Configuration for mobile (375×812), tablet (768×1024), desktop (1280×800)
- `getFullHtml()` — Generates complete HTML with styles for preview iframe
- TinyMCE plugin registration with `multipreview` command and toolbar button

**Vue Components** — Both Vue 2 and Vue 3 wrappers provide:
- `v-model` binding for editor content
- Props: `pluginPath`, `customPreviewStyles`, `showExternalTrigger`, `height`, `disabled`
- Exposed methods: `openPreview()`, `getContent()`, `setContent(html)`

## Usage

### Native JS
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
  <button @click="$refs.editor.openPreview()">Preview</button>
</template>
```

## Development Notes

- TinyMCE 5.x and 6.x supported
- Plugin uses `external_plugins` config for self-hosted setup
- Preview renders content in an iframe using Blob URL
- Device frame includes visual details (notch, home bar for mobile/tablet)
- Rotation supported for mobile/tablet landscape mode
