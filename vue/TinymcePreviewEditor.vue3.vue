<template>
  <div class="tinymce-preview-wrapper">
    <div class="editor-container">
      <editor
        v-model="content"
        :init="editorConfig"
        :disabled="props.disabled"
        @init="onEditorInit"
      />
    </div>
    <div v-if="props.showExternalTrigger" class="preview-trigger">
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

<script setup>
import { ref, computed, watch } from 'vue'
import Editor from '@tinymce/tinymce-vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  pluginPath: { type: String, default: '/tinymce/plugins/multipreview/plugin.js' },
  customPreviewStyles: { type: String, default: '' },
  showExternalTrigger: { type: Boolean, default: false },
  height: { type: [Number, String], default: 500 },
})

const emit = defineEmits(['update:modelValue', 'change', 'editor-init'])

const editorInstance = ref(null)
const content = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  if (val !== content.value) content.value = val
})
watch(content, (val) => {
  emit('update:modelValue', val)
  emit('change', val)
})

const editorConfig = computed(() => ({
  height: props.height,
  menubar: 'file edit view insert format tools table help',
  plugins: [
    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
    'insertdatetime', 'media', 'table', 'wordcount', 'multipreview',
  ],
  toolbar:
    'undo redo | blocks | bold italic underline | forecolor backcolor | ' +
    'alignleft aligncenter alignright | bullist numlist | ' +
    'link image media table | code fullscreen | multipreview',
  multipreview: { customStyles: props.customPreviewStyles },
  external_plugins: { multipreview: props.pluginPath },
  content_style: `
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 16px; line-height: 1.6; color: #374151;
      max-width: 800px; margin: 0 auto; padding: 20px;
    }
  `,
  branding: false,
  promotion: false,
  setup: (editor) => { editorInstance.value = editor },
}))

const onEditorInit = (evt, editor) => {
  editorInstance.value = editor
  emit('editor-init', editor)
}

const openPreview = () => editorInstance.value?.execCommand('mceMultiPreview')
const getContent = () => editorInstance.value?.getContent() ?? content.value
const setContent = (html) => {
  editorInstance.value?.setContent(html)
  content.value = html
}

defineExpose({ openPreview, getContent, setContent })
</script>

<style scoped>
.tinymce-preview-wrapper { width: 100%; }
.editor-container { border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,.1); }
.preview-trigger { display: flex; justify-content: flex-end; margin-top: 12px; }
.preview-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 8px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff; border: none; border-radius: 8px;
  font-size: 14px; font-weight: 500; cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(102,126,234,.4);
}
.preview-btn svg { width: 16px; height: 16px; }
.preview-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(102,126,234,.5); }
</style>
