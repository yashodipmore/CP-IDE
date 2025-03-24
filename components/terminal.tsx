"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"

interface TerminalProps {
  output: string
  isRunning: boolean
  onSendInput: (input: string) => void
}

export default function Terminal({ output, isRunning, onSendInput }: TerminalProps) {
  const [inputValue, setInputValue] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [output])

  useEffect(() => {
    // Focus input when program is waiting for input
    if (isRunning && output.endsWith("> ")) {
      inputRef.current?.focus()
    }
  }, [isRunning, output])

  const handleSendInput = () => {
    if (inputValue.trim()) {
      onSendInput(inputValue)
      setInputValue("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendInput()
    }
  }

  // Split output to process it line by line
  const outputLines = output.split("\n")

  // Check if the last line is waiting for input
  const isWaitingForInput = isRunning && output.endsWith("> ")

  return (
    <div className="h-full bg-black text-green-500 font-mono text-sm flex flex-col">
      <div className="flex items-center justify-between p-2 border-b border-gray-800">
        <h3 className="text-xs uppercase tracking-wider">Terminal Output</h3>
        <div className="flex space-x-1">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="whitespace-pre-wrap">
          {outputLines.map((line, index) => {
            // Check if this is a user input line
            if (line.startsWith("USER INPUT: ")) {
              return (
                <div key={index} className="text-blue-400">
                  {line.replace("USER INPUT: ", "")}
                </div>
              )
            }
            // Regular output line
            else {
              return <div key={index}>{line}</div>
            }
          })}

          {/* Inline input field when waiting for input */}
          {isWaitingForInput && (
            <div className="flex items-center mt-1">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-transparent border-none text-blue-400 focus:ring-0 p-0 h-6 focus-visible:ring-0 focus-visible:ring-offset-0"
                autoFocus
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSendInput}
                className="h-6 w-6 ml-1 p-0 text-blue-400 hover:bg-blue-900/20"
              >
                <Send className="h-3 w-3" />
              </Button>
            </div>
          )}

          {!output && <div>Ready to compile and run...</div>}
        </div>
      </ScrollArea>
    </div>
  )
}

