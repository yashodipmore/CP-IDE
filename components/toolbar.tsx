"use client"

import { Button } from "@/components/ui/button"
import { Play, Save, Settings, Download, Square } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ModeToggle } from "@/components/mode-toggle"

interface ToolbarProps {
  onCompileAndRun: () => void
  onStopProgram: () => void
  isCompiling: boolean
  isRunning: boolean
  currentFile: string
}

export default function Toolbar({ onCompileAndRun, onStopProgram, isCompiling, isRunning, currentFile }: ToolbarProps) {
  const handleSaveFile = () => {
    // Create a blob with the current code
    const element = document.createElement("a")
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent("// Placeholder for actual code saving"),
    )
    element.setAttribute("download", currentFile)
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="flex items-center justify-between p-2 border-b border-border bg-muted/30">
      <div className="flex items-center space-x-2">
        <h1 className="text-lg font-bold">C++ IDE</h1>
        <span className="text-sm text-muted-foreground">|</span>
        <span className="text-sm text-muted-foreground">{currentFile}</span>
      </div>

      <div className="flex items-center space-x-2">
        {!isRunning ? (
          <Button variant="default" size="sm" onClick={onCompileAndRun} disabled={isCompiling}>
            <Play className="w-4 h-4 mr-2" />
            {isCompiling ? "Compiling..." : "Run"}
          </Button>
        ) : (
          <Button variant="destructive" size="sm" onClick={onStopProgram}>
            <Square className="w-4 h-4 mr-2" />
            Stop
          </Button>
        )}

        <Button variant="outline" size="sm" onClick={handleSaveFile}>
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Settings className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Download className="w-4 h-4 mr-2" />
              Export Project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <ModeToggle />
      </div>
    </div>
  )
}

