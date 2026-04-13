<template>
  <div class="tinymce-preview-wrapper">
    <div class="editor-container">
      <editor
        v-model="content"
        :init="editorConfig"
        :disabled="disabled"
        @init="onEditorInit"
      />
    </div>
    <div v-if="showExternalTrigger" class="preview-trigger">
      <button class="preview-btn" @click="openPreview">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
        多端预览
      </button>
    </div>
  </div>
</template>

<script>
import Editor from '@tinymce/tinymce-vue'

export default {
  name: 'TinymcePreviewEditor',
  components: { Editor },

  props: {
    /** 编辑器内容 (v-model) */
    modelValue: {
      type: String,
      default: '',
    },
    /** 是否禁用 */
    disabled: {
      type: Boolean,
      default: false,
    },
    /** TinyMCE API Key（cloud 版需要） */
    apiKey: {
      type: String,
      default: 'no-api-key',
    },
    /** 插件脚本路径 */
    pluginPath: {
      type: String,
      default: '/tinymce/plugins/multipreview/plugin.js',
    },
    /** 工具栏配置（额外） */
    extraToolbar: {
      type: String,
      default: '',
    },
    /** 自定义预览样式 */
    customPreviewStyles: {
      type: String,
      default: '',
    },
    /** 是否显示外部预览按钮 */
    showExternalTrigger: {
      type: Boolean,
      default: false,
    },
    /** 编辑器高度 */
    height: {
      type: [Number, String],
      default: 500,
    },
  },

  emits: ['update:modelValue', 'change', 'editor-init'],

  data() {
    return {
      editorInstance: null,
      content: this.modelValue,
    }
  },

  computed: {
    editorConfig() {
      return {
        height: this.height,
        menubar: 'file edit view insert format tools table help',
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'wordcount',
          'multipreview',
        ],
        toolbar: [
          'undo redo | blocks | bold italic underline strikethrough | ' +
          'forecolor backcolor | alignleft aligncenter alignright alignjustify | ' +
          'bullist numlist outdent indent | removeformat | ' +
          'link image media table | code fullscreen | multipreview',
          this.extraToolbar,
        ].filter(Boolean).join(' | '),
        multipreview: {
          customStyles: this.customPreviewStyles,
        },
        external_plugins: {
          multipreview: this.pluginPath,
        },
        content_style: `
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 16px;
            line-height: 1.6;
            color: #374151;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
        `,
        branding: false,
        promotion: false,
        setup: (editor) => {
          this.editorInstance = editor
        },
      }
    },
  },

  watch: {
    modelValue(val) {
      if (val !== this.content) {
        this.content = val
      }
    },
    content(val) {
      this.$emit('update:modelValue', val)
    },
  },

  methods: {
    onEditorInit(evt, editor) {
      this.editorInstance = editor
      this.$emit('editor-init', editor)
    },

    onContentChange() {
      this.$emit('change', this.content)
    },

    /** 编程式打开预览 */
    openPreview() {
      if (this.editorInstance) {
        this.editorInstance.execCommand('mceMultiPreview')
      }
    },

    /** 获取编辑器内容 */
    getContent() {
      return this.editorInstance?.getContent() ?? this.content
    },

    /** 设置编辑器内容 */
    setContent(html) {
      if (this.editorInstance) {
        this.editorInstance.setContent(html)
      }
      this.content = html
    },
  },
}
</script>

<style scoped>
.tinymce-preview-wrapper {
  width: 100%;
}
.editor-container {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
.preview-trigger {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}
.preview-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
}
.preview-btn svg {
  width: 16px;
  height: 16px;
}
.preview-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.5);
}
.preview-btn:active {
  transform: translateY(0);
}
</style>
