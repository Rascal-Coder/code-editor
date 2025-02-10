"use client";

import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { CheckCircle, Clock, Copy, Terminal } from "lucide-react";
import { useState } from "react";
import RunningCodeSkeleton from "./RunningCodeSkeleton";

// ANSI颜色代码到Tailwind类的映射
const ansiToTailwind: Record<string, string> = {
  '30': 'text-black',
  '31': 'text-red-500',
  '32': 'text-green-500',
  '33': 'text-yellow-500',
  '34': 'text-blue-500',
  '35': 'text-purple-500',
  '36': 'text-cyan-500',
  '37': 'text-white',
  '39': 'text-gray-300',
};

// 将ANSI转义序列转换为带样式的span元素
const convertAnsiToHtml = (str: string) => {
  const parts = str.split(/(\u001b\[\d+m)/);
  let currentColor = 'text-gray-300';
  
  return parts.map((part, index) => {
    if (part.startsWith('\u001b[')) {
      const colorCode = part.match(/\u001b\[(\d+)m/)?.[1];
      if (colorCode) {
        currentColor = ansiToTailwind[colorCode] || currentColor;
      }
      return '';
    }
    if (!part) return null;
    return <span key={index} className={currentColor}>{part}</span>;
  });
};

function OutputPanel() {
  const { output, isRunning } = useCodeEditorStore();
  const [isCopied, setIsCopied] = useState(false);

  const hasContent =  output;

  const handleCopy = async () => {
    if (!hasContent) return;
    await navigator.clipboard.writeText(output);
    setIsCopied(true);

    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="relative bg-[#181825] rounded-xl p-4 ring-1 ring-gray-800/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-[#1e1e2e] ring-1 ring-gray-800/50">
            <Terminal className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-sm font-medium text-gray-300">Output</span>
        </div>

        {hasContent && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-gray-400 hover:text-gray-300 bg-[#1e1e2e] 
            rounded-lg ring-1 ring-gray-800/50 hover:ring-gray-700/50 transition-all"
          >
            {isCopied ? (
              <>
                <CheckCircle className="w-3.5 h-3.5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy
              </>
            )}
          </button>
        )}
      </div>

      {/* Output Area */}
      <div className="relative">
        <div
          className="relative bg-[#1e1e2e]/50 backdrop-blur-sm border border-[#313244] 
        rounded-xl p-4 h-[600px] overflow-auto font-mono text-sm"
        >
          {isRunning ? (
            <RunningCodeSkeleton />
          ): output ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 mb-3">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Execution Successful</span>
              </div>
              <pre className="whitespace-pre-wrap">{convertAnsiToHtml(output)}</pre>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gray-800/50 ring-1 ring-gray-700/50 mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <p className="text-center">Run your code to see the output here...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OutputPanel;
