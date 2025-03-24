"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { FilePlus, Folder, FileCode, Trash2, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileExplorerProps {
  files: string[]
  currentFile: string
  onFileSelect: (filename: string) => void
  onCreateFile: (filename: string) => void
  onDeleteFile: (filename: string) => void
}

export default function FileExplorer({
  files,
  currentFile,
  onFileSelect,
  onCreateFile,
  onDeleteFile,
}: FileExplorerProps) {
  const [newFileName, setNewFileName] = useState("")
  const [showTemplates, setShowTemplates] = useState(false)

  const handleCreateFile = () => {
    if (newFileName.trim()) {
      onCreateFile(newFileName.trim())
      setNewFileName("")
    }
  }

  const templates = [
    {
      name: "Hello World",
      code: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}',
    },
    {
      name: "Name Input",
      code: '#include <iostream>\n#include <string>\n\nint main() {\n    std::string name;\n    std::cout << "Enter your name: ";\n    std::getline(std::cin, name);\n    std::cout << "Hello, " << name << "!" << std::endl;\n    return 0;\n}',
    },
    {
      name: "Calculator",
      code: '#include <iostream>\n\nint main() {\n    int a, b;\n    std::cout << "Enter two numbers separated by space: ";\n    std::cin >> a >> b;\n    std::cout << "Sum: " << a + b << std::endl;\n    std::cout << "Difference: " << a - b << std::endl;\n    std::cout << "Product: " << a * b << std::endl;\n    if (b != 0) {\n        std::cout << "Division: " << a / b << std::endl;\n    } else {\n        std::cout << "Cannot divide by zero" << std::endl;\n    }\n    return 0;\n}',
    },
    {
      name: "Number Guessing",
      code: '#include <iostream>\n#include <cstdlib>\n#include <ctime>\n\nint main() {\n    // Seed the random number generator\n    std::srand(std::time(nullptr));\n    \n    // Generate a random number between 1 and 100\n    int secretNumber = std::rand() % 100 + 1;\n    int guess;\n    int attempts = 0;\n    \n    std::cout << "Welcome to the Number Guessing Game!" << std::endl;\n    std::cout << "I\'m thinking of a number between 1 and 100." << std::endl;\n    \n    do {\n        std::cout << "Enter your guess: ";\n        std::cin >> guess;\n        attempts++;\n        \n        if (guess < secretNumber) {\n            std::cout << "Too low! Try again." << std::endl;\n        } else if (guess > secretNumber) {\n            std::cout << "Too high! Try again." << std::endl;\n        } else {\n            std::cout << "Congratulations! You guessed the number in " << attempts << " attempts!" << std::endl;\n        }\n    } while (guess != secretNumber);\n    \n    return 0;\n}',
    },
    {
      name: "Interactive Chat",
      code: '#include <iostream>\n#include <string>\n#include <vector>\n#include <algorithm>\n\nint main() {\n    std::string input;\n    std::vector<std::string> responses = {\n        "That\'s interesting. Tell me more.",\n        "I understand. Please continue.",\n        "How does that make you feel?",\n        "Why do you think that is?",\n        "Let\'s explore that further."\n    };\n    \n    std::cout << "Welcome to C++ Chat Bot!" << std::endl;\n    std::cout << "Type something to start a conversation (or \'exit\' to quit):" << std::endl;\n    \n    while (true) {\n        std::cout << "> ";\n        std::getline(std::cin, input);\n        \n        if (input == "exit" || input == "quit") {\n            std::cout << "Goodbye! Thanks for chatting." << std::endl;\n            break;\n        }\n        \n        // Simple response based on input length to simulate "intelligence"\n        int responseIndex = input.length() % responses.size();\n        std::cout << "Bot: " << responses[responseIndex] << std::endl;\n    }\n    \n    return 0;\n}',
    },
  ]

  const handleCreateFromTemplate = (template: { name: string; code: string }) => {
    const filename = template.name.toLowerCase().replace(/\s+/g, "_") + ".cpp"
    onCreateFile(filename)
    // In a real implementation, you would set the file content here
    setShowTemplates(false)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-2 border-b border-border">
        <h3 className="text-sm font-medium">Files</h3>
        <div className="flex items-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <FilePlus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New File</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <Input
                  placeholder="filename.cpp"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button onClick={handleCreateFile}>Create</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Choose a Template</DialogTitle>
              </DialogHeader>
              <div className="py-4 grid gap-2">
                {templates.map((template, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleCreateFromTemplate(template)}
                  >
                    <FileCode className="h-4 w-4 mr-2" />
                    {template.name}
                  </Button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-2">
        <div className="mb-2">
          <div className="flex items-center text-sm text-muted-foreground mb-1">
            <Folder className="h-4 w-4 mr-1" />
            <span>Project</span>
          </div>

          <div className="pl-4">
            {files.map((file) => (
              <div
                key={file}
                className={cn(
                  "flex items-center justify-between py-1 px-2 text-sm rounded cursor-pointer hover:bg-muted group",
                  currentFile === file && "bg-muted text-primary",
                )}
                onClick={() => onFileSelect(file)}
              >
                <div className="flex items-center">
                  <FileCode className="h-4 w-4 mr-1" />
                  <span>{file}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteFile(file)
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

