"use client";

import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import React from "react";
import { THEMES } from "../_constants";
import { CircleOff, Cloud, Github, Laptop, Moon, Palette, Sun } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const THEME_ICONS: Record<string, React.ReactNode> = {
  "vs-dark": <Moon className="size-4" />,
  "vs-light": <Sun className="size-4" />,
  "github-dark": <Github className="size-4" />,
  monokai: <Laptop className="size-4" />,
  "solarized-dark": <Cloud className="size-4" />,
};

function ThemeSelector() {
  const { theme, setTheme } = useCodeEditorStore();
  const currentTheme = THEMES.find((t) => t.id === theme);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost"
          className="w-48 relative flex items-center gap-2 bg-[#1e1e2e] hover:bg-[#262637] 
            border border-gray-800 hover:border-gray-700 focus-visible:ring-1 
            focus-visible:ring-gray-700 focus-visible:ring-offset-0"
        >
          <Palette className="w-4 h-4 text-gray-400" />
          <span className="flex-1 text-left text-gray-300">
            {currentTheme?.label}
          </span>
          <div
            className="w-3 h-3 rounded-full border border-gray-700"
            style={{ background: currentTheme?.color }}
          />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="start"
        sideOffset={6}
        className="w-[240px] bg-[#1e1e2e] border-gray-800 rounded-md 
          shadow-lg shadow-black/40 animate-in fade-in-0 zoom-in-95 
          duration-100"
      >
        <DropdownMenuLabel className="px-2 py-1.5 text-xs font-medium text-gray-500">
          Select Theme
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="border-gray-800" />
        
        {THEMES.map((t) => (
          <DropdownMenuItem
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={cn(
              "flex items-center gap-3 px-2 py-1.5 text-sm text-gray-300",
              "hover:bg-[#262637] focus:bg-[#262637]",
              "data-[highlighted]:bg-[#262637] data-[highlighted]:text-gray-200",
              "outline-none cursor-pointer",
              theme === t.id && "bg-blue-500/10 text-blue-400"
            )}
          >
            <div
              className={cn(
                "flex items-center justify-center w-7 h-7 rounded",
                theme === t.id ? "bg-blue-500/10 text-blue-400" : "bg-gray-800/50 text-gray-400"
              )}
            >
              {THEME_ICONS[t.id] || <CircleOff className="w-4 h-4" />}
            </div>
            
            <span className="flex-1">
              {t.label}
            </span>
            
            <div
              className="w-3 h-3 rounded-full border border-gray-700"
              style={{ background: t.color }}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ThemeSelector;
