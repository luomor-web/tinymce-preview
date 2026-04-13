// TypeScript 类型定义
export declare const PLUGIN_NAME: string;

export interface DeviceConfig {
  label: string;
  icon: string;
  width: number;
  height: number;
  scale: number;
}

export interface Devices {
  mobile: DeviceConfig;
  tablet: DeviceConfig;
  desktop: DeviceConfig;
}

export interface PreviewControllerOptions {
  customStyles?: string;
}

export declare class PreviewController {
  constructor(editor: any, options?: PreviewControllerOptions);
  open(): void;
  close(): void;
  destroy(): void;
}

export declare function getFullHtml(editor: any, customStyles?: string): string;

export declare function initPlugin(editor: any, options?: PreviewControllerOptions): {
  getMetadata: () => {
    name: string;
    url: string;
  };
};

export declare const DEVICES: Devices;

export default {
  PreviewController,
  DEVICES,
  getFullHtml,
  initPlugin,
  PLUGIN_NAME
};
