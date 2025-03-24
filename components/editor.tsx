"use client"

import { useEffect, useState } from "react"
import { Editor as MonacoEditor } from "@monaco-editor/react"
import { Skeleton } from "@/components/ui/skeleton"

interface EditorProps {
  value: string
  onChange: (value: string) => void
  language: string
}

export default function Editor({ value, onChange, language }: EditorProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onChange(value)
    }
  }

  if (!mounted) {
    return (
      <div className="flex-1 p-4">
        <Skeleton className="h-full w-full" />
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-hidden">
      <MonacoEditor
        height="100%"
        language={language}
        value={value}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          fontSize: 14,
          fontFamily: "JetBrains Mono, Menlo, Monaco, Courier New, monospace",
          lineNumbers: "on",
          folding: true,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: "on",
          renderLineHighlight: "all",
          scrollbar: {
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
          },
        }}
      />
    </div>
  )
}

