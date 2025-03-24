// This is a mock implementation for the frontend
// In a real application, this would make API calls to a backend service
// that would compile and run the C++ code and handle user input

interface CompileResult {
  output: string
  processId: string
}

interface InputResult {
  output: string
  finished: boolean
}

// Store for active processes
const activeProcesses: {
  [processId: string]: {
    code: string
    output: string
    inputQueue: string[]
    waitingForInput: boolean
    inputHandlers: Array<(input: string) => void>
  }
} = {}

export async function compileAndRunCode(code: string): Promise<CompileResult> {
  // In a real implementation, this would send the code to a backend API
  // that would compile and run the code using g++

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate some basic error checking
      if (code.includes("syntax error")) {
        reject(new Error("Compilation error: syntax error"))
        return
      }

      // Generate a unique process ID
      const processId = Math.random().toString(36).substring(2, 15)

      // Initialize the process state
      activeProcesses[processId] = {
        code,
        output: "",
        inputQueue: [],
        waitingForInput: false,
        inputHandlers: [],
      }

      // Check if the code contains cin or getline
      const needsInput = code.includes("std::cin") || code.includes("std::getline")

      let initialOutput = ""

      if (needsInput) {
        // If the program needs input, simulate the first output until it waits for input
        if (code.includes("Enter your name:")) {
          initialOutput = "Enter your name: > "
          activeProcesses[processId].waitingForInput = true
        } else if (code.includes("std::cin >> ")) {
          initialOutput = "Please enter a value: > "
          activeProcesses[processId].waitingForInput = true
        } else {
          initialOutput = "Program is waiting for input: > "
          activeProcesses[processId].waitingForInput = true
        }
      } else {
        // If the program doesn't need input, simulate the full output
        if (code.includes('std::cout << "Hello, World!"')) {
          initialOutput = "Hello, World!"
        } else {
          // Extract expected output from comments for demo purposes
          const outputMatch = code.match(/\/\/ Expected output: (.+)/)
          if (outputMatch) {
            initialOutput = outputMatch[1]
          } else {
            initialOutput = "Program executed successfully."
          }
        }
      }

      activeProcesses[processId].output = initialOutput

      resolve({
        output: initialOutput,
        processId: needsInput ? processId : "", // Only return processId if input is needed
      })

      // If the program doesn't need input, clean up after a delay
      if (!needsInput) {
        setTimeout(() => {
          delete activeProcesses[processId]
        }, 5000)
      }
    }, 1500) // Simulate compilation time
  })
}

export async function sendInput(processId: string, input: string): Promise<InputResult> {
  // In a real implementation, this would send the input to a running process on the backend

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const process = activeProcesses[processId]

      if (!process) {
        reject(new Error("Process not found or has terminated"))
        return
      }

      if (!process.waitingForInput) {
        reject(new Error("Process is not waiting for input"))
        return
      }

      // Process the input
      process.waitingForInput = false

      // Simulate program response based on the input
      let response = ""
      let finished = false

      // Check the code to determine how to respond to the input
      if (process.code.includes("std::getline(std::cin, name)") && process.code.includes("Hello, ")) {
        response = `Hello, ${input}!`
        finished = true // Program completes after greeting
      } else if (process.code.includes("std::cin >> a >> b") && process.code.includes("a + b")) {
        // If this is a calculator-type program
        const numbers = input.split(" ").map(Number)
        if (numbers.length >= 2 && !isNaN(numbers[0]) && !isNaN(numbers[1])) {
          response = `Result: ${numbers[0] + numbers[1]}`
        } else {
          response = "Invalid input. Please enter two numbers separated by space."
        }
        finished = true
      } else if (process.code.includes("while") || process.code.includes("for")) {
        // If this might be a loop, ask for more input
        if (input.toLowerCase() === "exit" || input.toLowerCase() === "quit") {
          response = "Program terminated by user."
          finished = true
        } else {
          response = `You entered: ${input}\nEnter another value (or type 'exit' to quit): > `
          process.waitingForInput = true
        }
      } else {
        // Generic response
        response = `You entered: ${input}`
        finished = true
      }

      // Update the process output
      process.output += `\n${response}`

      resolve({
        output: response,
        finished,
      })

      // Clean up if the program has finished
      if (finished) {
        setTimeout(() => {
          delete activeProcesses[processId]
        }, 5000)
      }
    }, 500) // Simulate processing time
  })
}

