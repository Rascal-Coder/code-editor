import { CodeEditorState } from "@/types/index";
import { LANGUAGE_CONFIG } from "@/app/(root)/_constants";
import { create } from "zustand";

const getInitialState = () => {
  // if we're on the server, return default values
  if (typeof window === "undefined") {
    return {
      language: "javascript",
      fontSize: 16,
      theme: "vs-dark",
    };
  }

  // if we're on the client, return values from local storage bc localStorage is a browser API.
  const savedLanguage = localStorage.getItem("editor-language") || "javascript";
  const savedTheme = localStorage.getItem("editor-theme") || "vs-dark";
  const savedFontSize = localStorage.getItem("editor-font-size") || 16;

  return {
    language: savedLanguage,
    theme: savedTheme,
    fontSize: Number(savedFontSize),
  };
};

export const useCodeEditorStore = create<CodeEditorState>((set, get) => {
  const initialState = getInitialState();

  return {
    ...initialState,
    output: "",
    isRunning: false,
    editor: null,

    getCode: () => get().editor?.getValue() || "",

    setEditor: (editor) => {
      const savedCode = localStorage.getItem(`editor-code-${get().language}`);
      if (savedCode) editor.setValue(savedCode);

      set({ editor });
    },

    setTheme: (theme: string) => {
      localStorage.setItem("editor-theme", theme);
      set({ theme });
    },

    setFontSize: (fontSize: number) => {
      localStorage.setItem("editor-font-size", fontSize.toString());
      set({ fontSize });
    },

    setLanguage: (language: string) => {
      // Save current language code before switching
      const currentCode = get().editor?.getValue();
      if (currentCode) {
        localStorage.setItem(`editor-code-${get().language}`, currentCode);
      }

      localStorage.setItem("editor-language", language);

      set({
        language,
        output: "",
      });
    },

    runCode: async () => {
      const { language, getCode } = get();
      const code = getCode();

      console.log("code:", code);

      if (!code) {
        set({ output: "Please enter some code" });
        return;
      }

      set({ isRunning: true, output: "" });

      try {
        const runtime = LANGUAGE_CONFIG[language].pistonRuntime;
        if (runtime.language === "javascript") {
          runtime.language = "nodejs";
        }
        const response = await fetch("http://localhost:7777/code-runner/run", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: runtime.language,
            version: runtime.version,
            code: code,
          }),
        });

        const { data } = await response.json();

        console.log("data back from piston:", data);

        // handle API-level erros
        if (data.output) {
          set({
            output: data.output,
          });
          return;
        }
      } catch (error) {
        console.log("Error running code:", error);
        set({
          output: "Error running code",
        });
      } finally {
        set({ isRunning: false });
      }
    },
  };
});

export const getExecutionResult = () => useCodeEditorStore.getState().output;
