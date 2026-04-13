/**
 * TinyMCE Preview Plugin
 * 支持手机、平板、PC 多端预览
 * @version 1.0.0
 */

const PLUGIN_NAME = 'multipreview';

// 设备配置
const DEVICES = {
  mobile: {
    label: '手机',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
      <line x1="12" y1="18" x2="12.01" y2="18"/>
    </svg>`,
    width: 375,
    height: 812,
    scale: 0.75,
  },
  tablet: {
    label: '平板',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
      <line x1="12" y1="18" x2="12.01" y2="18"/>
    </svg>`,
    width: 768,
    height: 1024,
    scale: 0.65,
  },
  desktop: {
    label: '电脑',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
      <line x1="8" y1="21" x2="16" y2="21"/>
      <line x1="12" y1="17" x2="12" y2="21"/>
    </svg>`,
    width: 1280,
    height: 800,
    scale: 0.55,
  },
};

// 获取编辑器内容的完整 HTML
function getFullHtml(editor, customStyles) {
  const content = editor.getContent();
  const docStyles = `
    <style>
      * { box-sizing: border-box; }
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        font-size: 16px;
        line-height: 1.7;
        color: #333;
        margin: 0;
        padding: 20px;
        word-wrap: break-word;
        overflow-wrap: break-word;
      }
      img { max-width: 100%; height: auto; }
      table { border-collapse: collapse; width: 100%; }
      td, th { border: 1px solid #ddd; padding: 8px; }
      pre { overflow-x: auto; background: #f5f5f5; padding: 12px; border-radius: 4px; }
      code { background: #f5f5f5; padding: 2px 4px; border-radius: 3px; font-size: 0.9em; }
      blockquote {
        border-left: 4px solid #ddd;
        margin: 0;
        padding-left: 16px;
        color: #666;
      }
      h1,h2,h3,h4,h5,h6 { line-height: 1.3; margin-top: 1.5em; margin-bottom: 0.5em; }
      p { margin: 0.8em 0; }
      a { color: #0066cc; }
      ul, ol { padding-left: 1.5em; }
      ${customStyles || ''}
    </style>
  `;
  return `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>预览</title>${docStyles}</head><body>${content}</body></html>`;
}

// 创建预览弹窗 HTML
function createModalHTML() {
  const deviceTabs = Object.entries(DEVICES)
    .map(
      ([key, device]) => `
    <button class="tpm-device-btn ${key === 'mobile' ? 'active' : ''}" data-device="${key}" title="${device.label}">
      ${device.icon}
      <span>${device.label}</span>
    </button>
  `
    )
    .join('');

  return `
  <div class="tpm-overlay" id="tpm-overlay">
    <div class="tpm-modal">
      <!-- 顶部工具栏 -->
      <div class="tpm-toolbar">
        <div class="tpm-toolbar-left">
          <div class="tpm-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            <span>内容预览</span>
          </div>
        </div>
        <div class="tpm-device-tabs">
          ${deviceTabs}
        </div>
        <div class="tpm-toolbar-right">
          <button class="tpm-btn tpm-btn-rotate" id="tpm-rotate" title="旋转屏幕">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23 4 23 10 17 10"/>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
          </button>
          <button class="tpm-btn tpm-btn-close" id="tpm-close" title="关闭">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- 预览区域 -->
      <div class="tpm-stage" id="tpm-stage">
        <div class="tpm-device-wrapper" id="tpm-device-wrapper">
          <div class="tpm-device-frame" id="tpm-device-frame">
            <div class="tpm-device-notch" id="tpm-device-notch">
              <div class="tpm-notch-inner"></div>
            </div>
            <div class="tpm-device-screen">
              <iframe class="tpm-iframe" id="tpm-iframe" sandbox="allow-same-origin allow-scripts"></iframe>
            </div>
            <div class="tpm-device-home" id="tpm-device-home">
              <div class="tpm-home-bar"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部信息栏 -->
      <div class="tpm-footer">
        <span class="tpm-device-info" id="tpm-device-info">375 × 812</span>
        <span class="tpm-separator">·</span>
        <span class="tpm-device-label" id="tpm-device-label">手机预览</span>
        <span class="tpm-hint">横屏模式下旋转设备以获得更好体验</span>
      </div>
    </div>
  </div>
  `;
}

// 样式
const STYLES = `
  .tpm-overlay {
    position: fixed;
    inset: 0;
    background: rgba(8, 8, 20, 0.85);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    z-index: 999999;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: tpm-fade-in 0.25s ease;
  }
  @keyframes tpm-fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .tpm-modal {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  /* 工具栏 */
  .tpm-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    height: 60px;
    background: rgba(255,255,255,0.04);
    border-bottom: 1px solid rgba(255,255,255,0.08);
    flex-shrink: 0;
    gap: 16px;
  }
  .tpm-toolbar-left, .tpm-toolbar-right {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 120px;
  }
  .tpm-toolbar-right { justify-content: flex-end; }
  .tpm-logo {
    display: flex;
    align-items: center;
    gap: 8px;
    color: rgba(255,255,255,0.9);
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0.02em;
  }
  .tpm-logo svg {
    width: 20px;
    height: 20px;
    color: #6ee7f7;
  }
  .tpm-device-tabs {
    display: flex;
    align-items: center;
    gap: 4px;
    background: rgba(255,255,255,0.06);
    border-radius: 10px;
    padding: 4px;
  }
  .tpm-device-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border: none;
    background: transparent;
    color: rgba(255,255,255,0.5);
    border-radius: 7px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    transition: all 0.2s ease;
    white-space: nowrap;
  }
  .tpm-device-btn svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
  .tpm-device-btn:hover {
    color: rgba(255,255,255,0.8);
    background: rgba(255,255,255,0.08);
  }
  .tpm-device-btn.active {
    background: rgba(110, 231, 247, 0.15);
    color: #6ee7f7;
  }
  .tpm-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: none;
    background: rgba(255,255,255,0.06);
    color: rgba(255,255,255,0.6);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .tpm-btn svg { width: 18px; height: 18px; }
  .tpm-btn:hover {
    background: rgba(255,255,255,0.12);
    color: rgba(255,255,255,0.9);
  }
  .tpm-btn-close:hover { background: rgba(255, 80, 80, 0.2); color: #ff6b6b; }

  /* 预览舞台 */
  .tpm-stage {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    padding: 30px 20px;
    position: relative;
  }
  .tpm-stage::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 50% 50%, rgba(110, 231, 247, 0.03) 0%, transparent 70%);
    pointer-events: none;
  }
  .tpm-device-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
    transform-origin: center center;
  }

  /* 设备外壳 */
  .tpm-device-frame {
    position: relative;
    border-radius: 40px;
    background: linear-gradient(160deg, #2a2a3e 0%, #1a1a2e 50%, #12121f 100%);
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.12),
      0 0 0 2px rgba(0,0,0,0.8),
      0 30px 80px rgba(0,0,0,0.6),
      inset 0 1px 0 rgba(255,255,255,0.1),
      0 0 60px rgba(110, 231, 247, 0.06);
    transition: all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
    overflow: hidden;
  }
  .tpm-device-frame::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%);
    pointer-events: none;
    z-index: 2;
  }

  /* 刘海 */
  .tpm-device-notch {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 120px;
    height: 30px;
    background: #0a0a14;
    border-radius: 0 0 20px 20px;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }
  .tpm-notch-inner {
    width: 60px;
    height: 6px;
    background: #1a1a2e;
    border-radius: 3px;
  }

  /* 屏幕 */
  .tpm-device-screen {
    position: absolute;
    inset: 12px;
    border-radius: 28px;
    overflow: hidden;
    background: #fff;
  }
  .tpm-iframe {
    width: 100%;
    height: 100%;
    border: none;
    display: block;
  }

  /* Home 条 */
  .tpm-device-home {
    position: absolute;
    bottom: 8px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }
  .tpm-home-bar {
    width: 100px;
    height: 4px;
    background: rgba(255,255,255,0.35);
    border-radius: 2px;
  }

  /* 平板样式 */
  .tpm-device-frame.tablet {
    border-radius: 24px;
  }
  .tpm-device-frame.tablet .tpm-device-notch {
    width: 80px;
    height: 20px;
    border-radius: 0 0 12px 12px;
  }
  .tpm-device-frame.tablet .tpm-notch-inner {
    width: 40px;
    height: 5px;
  }

  /* PC 样式 */
  .tpm-device-frame.desktop {
    border-radius: 12px 12px 0 0;
  }
  .tpm-device-frame.desktop .tpm-device-notch { display: none; }
  .tpm-device-frame.desktop .tpm-device-home { display: none; }
  .tpm-device-frame.desktop .tpm-device-screen { inset: 32px 8px 8px; border-radius: 4px; }
  .tpm-device-frame.desktop::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 32px;
    background: linear-gradient(to bottom, #252538, #1e1e30);
    display: flex;
    align-items: center;
    padding-left: 16px;
  }
  .tpm-desktop-bar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 32px;
    background: linear-gradient(to bottom, #2a2a42, #1e1e32);
    border-radius: 12px 12px 0 0;
    display: flex;
    align-items: center;
    padding: 0 12px;
    gap: 6px;
    z-index: 5;
  }
  .tpm-desktop-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }

  /* 底部信息 */
  .tpm-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    height: 40px;
    background: rgba(255,255,255,0.03);
    border-top: 1px solid rgba(255,255,255,0.06);
    flex-shrink: 0;
    font-size: 12px;
    color: rgba(255,255,255,0.3);
  }
  .tpm-device-info { color: rgba(110, 231, 247, 0.7); font-weight: 600; letter-spacing: 0.05em; }
  .tpm-separator { color: rgba(255,255,255,0.15); }
  .tpm-device-label { color: rgba(255,255,255,0.5); }
  .tpm-hint { margin-left: 16px; font-size: 11px; opacity: 0.6; }

  /* 旋转动画 */
  .tpm-device-wrapper.rotating .tpm-device-frame {
    animation: tpm-rotate-pulse 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  @keyframes tpm-rotate-pulse {
    0% { transform: scale(1); }
    50% { transform: scale(0.9) rotate(5deg); }
    100% { transform: scale(1); }
  }

  /* 设备切换动画 */
  @keyframes tpm-device-in {
    from { opacity: 0; transform: scale(0.85) translateY(20px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
  .tpm-device-frame.entering {
    animation: tpm-device-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
`;

// 注入样式
function injectStyles() {
  if (document.getElementById('tpm-styles')) return;
  const styleEl = document.createElement('style');
  styleEl.id = 'tpm-styles';
  styleEl.textContent = STYLES;
  document.head.appendChild(styleEl);
}

// 预览控制器
class PreviewController {
  constructor(editor, options = {}) {
    this.editor = editor;
    this.options = options;
    this.currentDevice = 'mobile';
    this.isLandscape = false;
    this.modal = null;
  }

  open() {
    injectStyles();
    const div = document.createElement('div');
    div.innerHTML = createModalHTML();
    this.modal = div.firstElementChild;
    document.body.appendChild(this.modal);
    this._setupEvents();
    this._switchDevice('mobile', false);
    this._loadContent();
  }

  close() {
    if (this.modal) {
      this.modal.style.animation = 'tpm-fade-in 0.2s ease reverse';
      setTimeout(() => {
        this.modal?.remove();
        this.modal = null;
      }, 200);
    }
  }

  _loadContent() {
    const iframe = this.modal.querySelector('#tpm-iframe');
    const html = getFullHtml(this.editor, this.options.customStyles);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    iframe.src = url;
    iframe.onload = () => URL.revokeObjectURL(url);
  }

  _switchDevice(deviceKey, animate = true) {
    this.currentDevice = deviceKey;
    this.isLandscape = false;
    const device = DEVICES[deviceKey];
    const frame = this.modal.querySelector('#tpm-device-frame');
    const wrapper = this.modal.querySelector('#tpm-device-wrapper');

    // 更新设备外观
    frame.className = `tpm-device-frame ${deviceKey}`;
    if (animate) {
      frame.classList.add('entering');
      setTimeout(() => frame.classList.remove('entering'), 400);
    }

    // PC 特殊处理
    if (deviceKey === 'desktop') {
      if (!frame.querySelector('.tpm-desktop-bar')) {
        const bar = document.createElement('div');
        bar.className = 'tpm-desktop-bar';
        bar.innerHTML = `
          <div class="tpm-desktop-dot" style="background:#ff5f57"></div>
          <div class="tpm-desktop-dot" style="background:#febc2e"></div>
          <div class="tpm-desktop-dot" style="background:#28c840"></div>
        `;
        frame.prepend(bar);
      }
    } else {
      frame.querySelector('.tpm-desktop-bar')?.remove();
    }

    this._applyDimensions(device.width, device.height, device.scale);
    this._updateInfo(device);

    // 更新按钮状态
    this.modal.querySelectorAll('.tpm-device-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.device === deviceKey);
    });

    // 显示/隐藏旋转按钮
    const rotateBtn = this.modal.querySelector('#tpm-rotate');
    rotateBtn.style.display = deviceKey === 'desktop' ? 'none' : 'flex';
  }

  _applyDimensions(w, h, scale) {
    const frame = this.modal.querySelector('#tpm-device-frame');
    const wrapper = this.modal.querySelector('#tpm-device-wrapper');
    frame.style.width = w + 'px';
    frame.style.height = h + 'px';
    wrapper.style.transform = `scale(${scale})`;
  }

  _rotate() {
    const device = DEVICES[this.currentDevice];
    this.isLandscape = !this.isLandscape;
    const wrapper = this.modal.querySelector('#tpm-device-wrapper');
    wrapper.classList.add('rotating');
    setTimeout(() => wrapper.classList.remove('rotating'), 500);

    if (this.isLandscape) {
      this._applyDimensions(device.height, device.width, device.scale * 0.85);
      this._updateInfo({ ...device, width: device.height, height: device.width, label: device.label + ' (横屏)' });
    } else {
      this._applyDimensions(device.width, device.height, device.scale);
      this._updateInfo(device);
    }
  }

  _updateInfo(device) {
    const frame = this.modal.querySelector('#tpm-device-frame');
    const w = parseInt(frame.style.width);
    const h = parseInt(frame.style.height);
    this.modal.querySelector('#tpm-device-info').textContent = `${w} × ${h}`;
    this.modal.querySelector('#tpm-device-label').textContent = device.label + ' 预览';
  }

  _setupEvents() {
    // 关闭
    this.modal.querySelector('#tpm-close').addEventListener('click', () => this.close());
    // 点击遮罩关闭
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });
    // ESC 关闭
    this._keyHandler = (e) => { if (e.key === 'Escape') this.close(); };
    document.addEventListener('keydown', this._keyHandler);
    // 设备切换
    this.modal.querySelectorAll('.tpm-device-btn').forEach((btn) => {
      btn.addEventListener('click', () => this._switchDevice(btn.dataset.device));
    });
    // 旋转
    this.modal.querySelector('#tpm-rotate').addEventListener('click', () => this._rotate());
  }

  destroy() {
    document.removeEventListener('keydown', this._keyHandler);
    this.close();
  }
}

// 注册 TinyMCE 插件
function initPlugin(editor, options = {}) {
  // 注册命令
  editor.addCommand('mceMultiPreview', function () {
    const controller = new PreviewController(editor, options);
    controller.open();
  });

  // 注册按钮（新版 TinyMCE 5+）
  editor.ui.registry.addButton('multipreview', {
    tooltip: '多端预览',
    icon: 'preview',
    onAction: () => editor.execCommand('mceMultiPreview'),
  });

  // 注册菜单项
  editor.ui.registry.addMenuItem('multipreview', {
    text: '多端预览',
    icon: 'preview',
    onAction: () => editor.execCommand('mceMultiPreview'),
  });

  return {
    getMetadata: () => ({
      name: 'Multi-Device Preview Plugin',
      url: 'https://github.com/your-org/tinymce-plugin-multipreview',
    }),
  };
}

// 自动注册（浏览器环境）
if (typeof window !== 'undefined') {
  if (typeof window.tinymce !== 'undefined') {
    window.tinymce.PluginManager.add(PLUGIN_NAME, function (editor) {
      const pluginOptions = editor.getParam('multipreview', {});
      return initPlugin(editor, pluginOptions);
    });
  }
  // 导出全局变量
  window.TinyMCEPreviewPlugin = { PreviewController, DEVICES, getFullHtml, initPlugin };
}

// ES Module 导出
export { PreviewController, DEVICES, getFullHtml, initPlugin, PLUGIN_NAME };

// CommonJS 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PreviewController, DEVICES, getFullHtml, initPlugin, PLUGIN_NAME };
}
