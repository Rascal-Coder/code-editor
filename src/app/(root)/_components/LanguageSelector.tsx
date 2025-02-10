"use client";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { LANGUAGE_CONFIG, LANGUAGE_ICONS } from "../_constants";
import { Icon } from "@iconify/react";
import useMounted from "@/hooks/useMounted";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

function LanguageSelector() {
  const mounted = useMounted();
  const { language, setLanguage } = useCodeEditorStore();

  if (!mounted) return null;

  return (
    <Select value={language} onValueChange={setLanguage}>
      <SelectTrigger className="w-[180px] bg-[#1e1e2e]/80 border-gray-800/50 hover:border-gray-700">
        <div className="flex items-center gap-3">
          <SelectValue placeholder="Select language" />
        </div>
      </SelectTrigger>
      <SelectContent className="bg-[#1e1e2e]/95 backdrop-blur-xl border-[#313244]">
        {Object.values(LANGUAGE_CONFIG).map((lang) => (
          <SelectItem
            key={lang.id}
            value={lang.id}
            className={cn(
              "hover:bg-[#262637] focus:bg-[#262637] group relative",
            )}
          >
            <div className="flex items-center gap-3">
              <div className="size-6 rounded-md bg-gray-800/50 p-0.5 group-hover:scale-110 transition-transform">
                <Icon
                  icon={LANGUAGE_ICONS[lang.id] || "vscode-icons:file-type-default"}
                  className="w-full h-full"
                />
              </div>
              <span className="text-sm text-gray-200">{lang.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default LanguageSelector;
