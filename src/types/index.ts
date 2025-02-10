import type { OnMount } from '@monaco-editor/react';

export interface Theme {
  id: string;
  label: string;
  color: string;
}


export interface CodeEditorState {
  language: string;
  output: string;
  isRunning: boolean;
  theme: string;
  fontSize: number;
  editor: Parameters<OnMount>[0] | null;

  setEditor: OnMount;
  getCode: () => string;
  setLanguage: (language: string) => void;
  setTheme: (theme: string) => void;
  setFontSize: (fontSize: number) => void;
  runCode: () => Promise<void>;
}