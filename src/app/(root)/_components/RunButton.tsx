"use client"

import { useCallback } from "react"
import { useCodeEditorStore } from "@/store/useCodeEditorStore"
import { Loader2, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"


const buttonStyles = {
  base: "relative min-w-[120px] bg-blue-600 border-0 shadow-lg shadow-blue-500/20 transition-colors duration-200",
  hover: "hover:bg-blue-700",
  disabled: "disabled:bg-blue-400 disabled:cursor-not-allowed",
}

const iconStyles = "w-4 h-4"

export function RunButton() {
  const { runCode, isRunning } = useCodeEditorStore()

  const handleRun = useCallback(async () => {
    await runCode()
  }, [runCode])

  return (
    <Button
      onClick={handleRun}
      disabled={isRunning}
      size="sm"
      className={cn(buttonStyles.base, buttonStyles.hover, buttonStyles.disabled)}
    >
      <div className="relative flex items-center gap-2">
        {isRunning ? (
          <>
            <Loader2 className={cn(iconStyles, "animate-spin")} />
            <span className="text-sm font-medium">Running...</span>
          </>

        ) : (
          <>
            <Play className={cn(iconStyles, "transition-transform group-hover:scale-110")} />
            <span className="text-sm font-medium">Run Code</span>
          </>
        )}
      </div>
    </Button>
  )
}

