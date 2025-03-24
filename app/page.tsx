"use client"

import { useState } from "react"
import Editor from "@/components/editor"
import Terminal from "@/components/terminal"
import Toolbar from "@/components/toolbar"
import FileExplorer from "@/components/file-explorer"
import { compileAndRunCode, sendInput } from "@/lib/compiler"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { Resizable } from "re-resizable"
import { Heart } from "lucide-react"

export default function IDEPage() {
  const [code, setCode] = useState<string>(
    '#include <iostream>\n#include <string>\n\nint main() {\n    std::string name;\n    std::cout << "Enter your name: ";\n    std::getline(std::cin, name);\n    std::cout << "Hello, " << name << "!" << std::endl;\n    return 0;\n}',
  )
  const [output, setOutput] = useState<string>("")
  const [isCompiling, setIsCompiling] = useState<boolean>(false)
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [currentFile, setCurrentFile] = useState<string>("main.cpp")
  const [processId, setProcessId] = useState<string>("")
  const [files, setFiles] = useState<{ [key: string]: string }>({
    "main.cpp":
      '#include <iostream>\n#include <string>\n\nint main() {\n    std::string name;\n    std::cout << "Enter your name: ";\n    std::getline(std::cin, name);\n    std::cout << "Hello, " << name << "!" << std::endl;\n    return 0;\n}',
  })
  const { toast } = useToast()

  const handleCodeChange = (value: string) => {
    setCode(value)
    setFiles((prev) => ({
      ...prev,
      [currentFile]: value,
    }))
  }

  const handleCompileAndRun = async () => {
    setIsCompiling(true)
    setOutput("Compiling...")
    setProcessId("")

    try {
      const result = await compileAndRunCode(code)
      setOutput(result.output)
      setProcessId(result.processId)
      setIsRunning(!!result.processId) // Only set running if we have a process ID

      toast({
        title: "Compilation successful",
        description: "Your code is now running",
      })
    } catch (error) {
      if (error instanceof Error) {
        setOutput(`Error: ${error.message}`)
        toast({
          title: "Compilation failed",
          description: error.message,
          variant: "destructive",
        })
      } else {
        setOutput("An unknown error occurred")
        toast({
          title: "Compilation failed",
          description: "An unknown error occurred",
          variant: "destructive",
        })
      }
      setIsRunning(false)
    } finally {
      setIsCompiling(false)
    }
  }

  const handleSendInput = async (input: string) => {
    if (!processId) return

    // Update the output to include the user's input directly
    // Don't add USER INPUT: prefix as we'll display it inline
    setOutput((prev) => prev.replace(/> $/, `> ${input}\n`))

    try {
      const result = await sendInput(processId, input)

      // If the program has finished, update the state
      if (result.finished) {
        setIsRunning(false)
        setProcessId("")
      }

      // Append the new output
      setOutput((prev) => `${prev}${result.output}`)
    } catch (error) {
      if (error instanceof Error) {
        setOutput((prev) => `${prev}\nError: ${error.message}`)
        toast({
          title: "Input error",
          description: error.message,
          variant: "destructive",
        })
      } else {
        setOutput((prev) => `${prev}\nAn unknown error occurred`)
        toast({
          title: "Input error",
          description: "An unknown error occurred",
          variant: "destructive",
        })
      }
      setIsRunning(false)
      setProcessId("")
    }
  }

  const handleFileSelect = (filename: string) => {
    setCurrentFile(filename)
    setCode(files[filename] || "")
  }

  const handleCreateFile = (filename: string) => {
    if (!filename.endsWith(".cpp") && !filename.endsWith(".h")) {
      filename += ".cpp"
    }

    if (files[filename]) {
      toast({
        title: "File already exists",
        description: `${filename} already exists`,
        variant: "destructive",
      })
      return
    }

    setFiles((prev) => ({
      ...prev,
      [filename]: "// New file\n",
    }))

    setCurrentFile(filename)
    setCode("// New file\n")

    toast({
      title: "File created",
      description: `${filename} has been created`,
    })
  }

  const handleDeleteFile = (filename: string) => {
    if (Object.keys(files).length <= 1) {
      toast({
        title: "Cannot delete file",
        description: "You must have at least one file",
        variant: "destructive",
      })
      return
    }

    const newFiles = { ...files }
    delete newFiles[filename]
    setFiles(newFiles)

    // Select another file
    const newCurrentFile = Object.keys(newFiles)[0]
    setCurrentFile(newCurrentFile)
    setCode(newFiles[newCurrentFile])

    toast({
      title: "File deleted",
      description: `${filename} has been deleted`,
    })
  }

  const handleStopProgram = () => {
    if (processId) {
      // In a real implementation, you would call an API to stop the process
      setIsRunning(false)
      setProcessId("")
      setOutput((prev) => `${prev}\n[Program execution terminated by user]`)

      toast({
        title: "Program stopped",
        description: "Program execution has been terminated",
      })
    }
  }

  return (
    <ThemeProvider defaultTheme="dark" attribute="class">
      <main className="flex flex-col h-screen bg-background text-foreground">
        <Toolbar
          onCompileAndRun={handleCompileAndRun}
          onStopProgram={handleStopProgram}
          isCompiling={isCompiling}
          isRunning={isRunning}
          currentFile={currentFile}
        />

        <div className="flex flex-1 overflow-hidden">
          <Resizable
            defaultSize={{ width: 200, height: "100%" }}
            minWidth={150}
            maxWidth={300}
            enable={{ right: true }}
            className="bg-muted/30 border-r border-border"
          >
            <FileExplorer
              files={Object.keys(files)}
              currentFile={currentFile}
              onFileSelect={handleFileSelect}
              onCreateFile={handleCreateFile}
              onDeleteFile={handleDeleteFile}
            />
          </Resizable>

          <div className="flex-1 flex flex-col overflow-hidden">
            <Editor value={code} onChange={handleCodeChange} language="cpp" />

            <Resizable
              defaultSize={{ height: 200, width: "100%" }}
              minHeight={100}
              maxHeight={500}
              enable={{ top: true }}
              className="border-t border-border"
            >
              <Terminal output={output} isRunning={isRunning} onSendInput={handleSendInput} />
            </Resizable>
          </div>
        </div>

        {/* Footer with developer credit */}
        <div className="p-2 text-center text-sm text-muted-foreground border-t border-border bg-muted/30 flex items-center justify-center">
          Developed by Yashodip More <Heart className="h-4 w-4 ml-1 text-red-500 inline" fill="currentColor" />
        </div>
      </main>
      <Toaster />
    </ThemeProvider>
  )
}

