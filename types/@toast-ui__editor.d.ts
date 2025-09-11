declare module '@toast-ui/editor' {
  // Minimal type declarations for the core Toast UI Editor used in our app
  // This is intentionally lightweight to satisfy TS where the package lacks types.

  export interface EditorOptions {
    el: HTMLElement;
    initialEditType?: 'markdown' | 'wysiwyg';
    previewStyle?: 'tab' | 'vertical';
    hideModeSwitch?: boolean;
    theme?: string;
    height?: string;
    usageStatistics?: boolean;
    autofocus?: boolean;
    initialValue?: string;
    [key: string]: unknown;
  }

  export type EditorEventName = 'change' | 'keydown' | 'keyup' | string;

  export default class Editor {
    constructor(options: EditorOptions);

    getMarkdown(): string;
    setMarkdown(markdown: string, cursorToEnd?: boolean): void;

    // 当前编辑模式（'markdown' | 'wysiwyg'）
    getCurrentMode(): 'markdown' | 'wysiwyg';

    on(event: EditorEventName, handler: (...args: unknown[]) => void): void;
    off(event: EditorEventName, handler: (...args: unknown[]) => void): void;
    destroy(): void;
  }
}
