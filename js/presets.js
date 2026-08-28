/**
 * Antigravity Quiz App - Preloaded Question Banks
 * Includes full Operating Systems Multiple Choice Questions & Answers
 */

const PRESET_QUESTION_BANKS = {
  os_full: {
    id: "os_full",
    name: "Operating Systems (Complete 46 Questions)",
    description: "Official Operating Systems Question Bank: General Concepts, Structures, UNIX/Linux, System Calls, Process Management, and CPU Scheduling.",
    settings: {
      totalTeams: 4,
      baseTime: 25,
      bounceTime: 12,
      basePoints: 10,
      passPoints: 5,
      teamNames: ["Kernel Kings", "Daemon Knights", "Byte Warriors", "Process Titans"],
      teamColors: ["#3b82f6", "#10b981", "#f59e0b", "#ec4899"]
    },
    questions: [
      {
            "id": "os-1",
            "text": "What is the main role of an Operating System?",
            "category": "OS Basics - General Concepts",
            "options": [
                  "Compile programs",
                  "Manage hardware and software resources",
                  "Design databases",
                  "Create websites"
            ],
            "correctIndex": 1,
            "points": 10,
            "passPoints": 5,
            "customTime": 25,
            "explanation": "An Operating System acts as an intermediary between user applications and computer hardware, managing CPU, memory, storage, and I/O devices."
      },
      {
            "id": "os-2",
            "text": "Which of the following is an example of a desktop operating system?",
            "category": "OS Basics - General Concepts",
            "options": [
                  "Android",
                  "iOS",
                  "Windows",
                  "RTOS"
            ],
            "correctIndex": 2,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "Microsoft Windows is a widely used desktop/laptop OS, whereas Android and iOS are mobile operating systems."
      },
      {
            "id": "os-3",
            "text": "Which operating system is developed by Apple for iPhones?",
            "category": "OS Basics - General Concepts",
            "options": [
                  "Android",
                  "Linux",
                  "Windows",
                  "iOS"
            ],
            "correctIndex": 3,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "iOS is Apple's proprietary mobile operating system created exclusively for its iPhone hardware."
      },
      {
            "id": "os-4",
            "text": "Which OS function organizes and retrieves files?",
            "category": "OS Basics - General Concepts",
            "options": [
                  "Security",
                  "File Management",
                  "Scheduling",
                  "Buffering"
            ],
            "correctIndex": 1,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "File Management manages files and directories on storage drives, providing structured access, naming, and retrieval."
      },
      {
            "id": "os-5",
            "text": "Which operating system is open-source and highly customizable?",
            "category": "OS Basics - General Concepts",
            "options": [
                  "Windows",
                  "macOS",
                  "Linux",
                  "iOS"
            ],
            "correctIndex": 2,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "Linux is released under open-source licenses (GPL), allowing users and developers to inspect, modify, and distribute its source code."
      },
      {
            "id": "os-6",
            "text": "What is a process?",
            "category": "OS Basics - General Concepts",
            "options": [
                  "A stored file",
                  "A running program",
                  "A device driver",
                  "A compiler"
            ],
            "correctIndex": 1,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "A process is defined as an active program in execution loaded into memory with its program counter, stack, and data."
      },
      {
            "id": "os-7",
            "text": "Which process management function decides the next process to use the CPU?",
            "category": "OS Basics - General Concepts",
            "options": [
                  "Scheduling",
                  "Buffering",
                  "Spooling",
                  "Authentication"
            ],
            "correctIndex": 0,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "CPU Scheduling determines which process in the ready queue is allocated CPU time."
      },
      {
            "id": "os-8",
            "text": "Which memory management technique uses disk space as extra memory?",
            "category": "OS Basics - General Concepts",
            "options": [
                  "Paging",
                  "Virtual Memory",
                  "Buffering",
                  "Caching"
            ],
            "correctIndex": 1,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "Virtual Memory maps secondary disk storage into virtual address space, enabling execution of processes larger than physical RAM."
      },
      {
            "id": "os-9",
            "text": "Which file operation removes a file?",
            "category": "OS Basics - General Concepts",
            "options": [
                  "Read",
                  "Write",
                  "Delete",
                  "Create"
            ],
            "correctIndex": 2,
            "points": 10,
            "passPoints": 5,
            "customTime": 15,
            "explanation": "The Delete operation unlinks and frees the file blocks in the file system."
      },
      {
            "id": "os-10",
            "text": "What acts as an interface between hardware and the OS?",
            "category": "OS Basics - General Concepts",
            "options": [
                  "Shell",
                  "Driver",
                  "Compiler",
                  "Loader"
            ],
            "correctIndex": 1,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "A Device Driver is specialized software that provides a standardized interface for the OS to communicate with physical hardware."
      },
      {
            "id": "os-11",
            "text": "Which technique manages print jobs in a queue?",
            "category": "OS Basics - General Concepts",
            "options": [
                  "Paging",
                  "Spooling",
                  "Scheduling",
                  "Fragmentation"
            ],
            "correctIndex": 1,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "SPOOLing (Simultaneous Peripheral Operations On-Line) buffers print data to disk until the printer is ready to process it."
      },
      {
            "id": "os-12",
            "text": "Which OS processes jobs in groups without user interaction?",
            "category": "OS Structures & Types",
            "options": [
                  "Batch OS",
                  "Mobile OS",
                  "Distributed OS",
                  "Embedded OS"
            ],
            "correctIndex": 0,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "A Batch Operating System groups similar jobs together in batches and executes them sequentially without interactive user intervention."
      },
      {
            "id": "os-13",
            "text": "Which OS allows multiple CPUs to execute processes simultaneously?",
            "category": "OS Structures & Types",
            "options": [
                  "Batch OS",
                  "Time-Sharing OS",
                  "Multiprocessing OS",
                  "Embedded OS"
            ],
            "correctIndex": 2,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "A Multiprocessing OS coordinates two or more CPUs to run independent process threads in parallel."
      },
      {
            "id": "os-14",
            "text": "Which OS manages a group of networked computers as a single system?",
            "category": "OS Structures & Types",
            "options": [
                  "Mobile OS",
                  "Distributed OS",
                  "Batch OS",
                  "RTOS"
            ],
            "correctIndex": 1,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "A Distributed OS connects autonomous computing nodes across a network, presenting them as a unified single computer system."
      },
      {
            "id": "os-15",
            "text": "RTOS stands for:",
            "category": "OS Structures & Types",
            "options": [
                  "Real-Time Operating System",
                  "Runtime Operating Service",
                  "Remote Task Operating System",
                  "Real Task Operating Service"
            ],
            "correctIndex": 0,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "RTOS stands for Real-Time Operating System, designed to guarantee response within strict latency and timing deadlines."
      },
      {
            "id": "os-16",
            "text": "Which OS structure has no well-defined architecture?",
            "category": "OS Structures & Types",
            "options": [
                  "Layered",
                  "Modular",
                  "Simple Structure",
                  "Microkernel"
            ],
            "correctIndex": 2,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "A Simple Structure (like original MS-DOS) lacks clean separation between interfaces and levels of functionality."
      },
      {
            "id": "os-17",
            "text": "Which operating system is an example of a simple structure?",
            "category": "OS Structures & Types",
            "options": [
                  "Linux",
                  "UNIX",
                  "Windows",
                  "MS-DOS"
            ],
            "correctIndex": 3,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "MS-DOS was designed with a simple structure where applications could access basic I/O routines and hardware directly."
      },
      {
            "id": "os-18",
            "text": "Which structure divides the OS into multiple layers?",
            "category": "OS Structures & Types",
            "options": [
                  "Monolithic",
                  "Layered",
                  "Windows",
                  "Simple"
            ],
            "correctIndex": 1,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "A Layered OS is decomposed into hierarchical layers where Layer N uses only services provided by Layer N-1."
      },
      {
            "id": "os-19",
            "text": "Which OS structure uses dynamically loadable modules?",
            "category": "OS Structures & Types",
            "options": [
                  "Modular Structure",
                  "Monolithic Structure",
                  "Virtual Machine",
                  "Batch Structure"
            ],
            "correctIndex": 0,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "Modular Structure allows kernel extensions and drivers to be loaded and linked dynamically at runtime."
      },
      {
            "id": "os-20",
            "text": "VirtualBox is an example of:",
            "category": "OS Structures & Types",
            "options": [
                  "Modular Structure",
                  "Compiler",
                  "Simple Structure",
                  "Virtual Machine"
            ],
            "correctIndex": 3,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "VirtualBox is a hypervisor/virtualization platform that provides Virtual Machine environments."
      },
      {
            "id": "os-21",
            "text": "Which structure contains all services in one large kernel?",
            "category": "OS Structures & Types",
            "options": [
                  "Microkernel",
                  "Layered",
                  "Monolithic",
                  "Modular"
            ],
            "correctIndex": 2,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "A Monolithic kernel combines all OS services (scheduling, memory, file system, IPC, device drivers) into a single address space."
      },
      {
            "id": "os-22",
            "text": "Which OS structure runs non-essential services in user space?",
            "category": "OS Structures & Types",
            "options": [
                  "Monolithic",
                  "Layered",
                  "Microkernel",
                  "Simple"
            ],
            "correctIndex": 2,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "A Microkernel keeps only fundamental mechanisms (IPC, basic scheduling, memory mapping) in kernel mode and moves servers to user space."
      },
      {
            "id": "os-23",
            "text": "Which OS structure allows services to be dynamically added to the kernel at runtime?",
            "category": "OS Structures & Types",
            "options": [
                  "Simple structure",
                  "Layered structure",
                  "Modular structure",
                  "Monolithic structure"
            ],
            "correctIndex": 2,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "Modular kernel architectures (like Linux Loadable Kernel Modules - LKMs) permit dynamic loading/unloading without rebooting."
      },
      {
            "id": "os-24",
            "text": "Which OS structure organizes components into layers where each layer uses services of the lower layer?",
            "category": "OS Structures & Types",
            "options": [
                  "Modular",
                  "Layered",
                  "Exokernel",
                  "Virtual Machine"
            ],
            "correctIndex": 1,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "In a Layered architecture, the lowest layer (Layer 0) is hardware and the highest is user interface, with each layer communicating strictly with adjacent lower layers."
      },
      {
            "id": "os-25",
            "text": "In which era was UNIX introduced?",
            "category": "UNIX & Linux Specifics",
            "options": [
                  "1940s",
                  "1950s",
                  "1960s-1970s",
                  "2000s"
            ],
            "correctIndex": 2,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "UNIX was originally developed between 1969 and the 1970s by Ken Thompson, Dennis Ritchie, and others at AT&T Bell Labs."
      },
      {
            "id": "os-26",
            "text": "Which security mechanism verifies users through credentials?",
            "category": "UNIX & Linux Specifics",
            "options": [
                  "Authentication",
                  "Buffering",
                  "Scheduling",
                  "Compilation"
            ],
            "correctIndex": 0,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "Authentication is the process of confirming user identity using credentials such as usernames, passwords, or cryptographic keys."
      },
      {
            "id": "os-27",
            "text": "Who created Linux?",
            "category": "UNIX & Linux Specifics",
            "options": [
                  "Dennis Ritchie",
                  "Ken Thompson",
                  "Linus Torvalds",
                  "Steve Jobs"
            ],
            "correctIndex": 2,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "Linus Torvalds created the Linux kernel in 1991 while a student at the University of Helsinki."
      },
      {
            "id": "os-28",
            "text": "UNIX was originally developed at:",
            "category": "UNIX & Linux Specifics",
            "options": [
                  "Microsoft",
                  "Google",
                  "Bell Labs",
                  "Apple"
            ],
            "correctIndex": 2,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "UNIX was pioneered at AT&T Bell Labs in Murray Hill, New Jersey."
      },
      {
            "id": "os-29",
            "text": "Which UNIX component acts as the interface between user and kernel?",
            "category": "UNIX & Linux Specifics",
            "options": [
                  "Hardware",
                  "Shell",
                  "Driver",
                  "Memory"
            ],
            "correctIndex": 1,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "The Shell (e.g. bash, sh, zsh) is the command-line command interpreter that accepts user commands and executes corresponding system requests."
      },
      {
            "id": "os-30",
            "text": "Which is a key feature of UNIX?",
            "category": "UNIX & Linux Specifics",
            "options": [
                  "Single-user capability",
                  "Multi-user capability",
                  "No file system",
                  "No multitasking"
            ],
            "correctIndex": 1,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "UNIX was fundamentally designed from its early versions to support multiple simultaneous users (Multi-user) and preemptive multitasking."
      },
      {
            "id": "os-31",
            "text": "Which Linux layer contains device drivers?",
            "category": "UNIX & Linux Specifics",
            "options": [
                  "User Space",
                  "Shell",
                  "Kernel Space",
                  "GUI"
            ],
            "correctIndex": 2,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "In monolithic Linux architecture, hardware device drivers execute inside Kernel Space with direct hardware privileged access."
      },
      {
            "id": "os-32",
            "text": "Linux is licensed as:",
            "category": "UNIX & Linux Specifics",
            "options": [
                  "Proprietary",
                  "Closed Source",
                  "Open Source",
                  "Commercial Only"
            ],
            "correctIndex": 2,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "Linux is licensed under the GNU General Public License (GPL), making it Open Source."
      },
      {
            "id": "os-33",
            "text": "A company wants a free, open-source operating system for servers, cloud platforms, and development environments, with strong community support and frequent updates. Which OS is most suitable?",
            "category": "UNIX & Linux Specifics",
            "options": [
                  "UNIX",
                  "AIX",
                  "Solaris",
                  "Linux"
            ],
            "correctIndex": 3,
            "points": 10,
            "passPoints": 5,
            "customTime": 25,
            "explanation": "Linux distributions (Ubuntu Server, Debian, RHEL, Rocky) dominate server, cloud, and container infrastructures due to open licensing and massive global support."
      },
      {
            "id": "os-34",
            "text": "What is the main purpose of a system call?",
            "category": "System Calls & Modes",
            "options": [
                  "Compile a program",
                  "Provide an interface between user programs and the operating system",
                  "Manage hardware directly",
                  "Create variables"
            ],
            "correctIndex": 1,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "System calls provide the programmatic interface between a running application and kernel-level services."
      },
      {
            "id": "os-35",
            "text": "System calls act as a gateway between:",
            "category": "System Calls & Modes",
            "options": [
                  "RAM and ROM",
                  "User mode and Kernel mode",
                  "CPU and Memory",
                  "Compiler and Interpreter"
            ],
            "correctIndex": 1,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "System calls trigger a software trap or sysenter instruction that transitions execution from unprivileged User mode to privileged Kernel mode."
      },
      {
            "id": "os-36",
            "text": "Which mode executes system calls?",
            "category": "System Calls & Modes",
            "options": [
                  "User mode",
                  "Kernel mode",
                  "Debug mode",
                  "Safe mode"
            ],
            "correctIndex": 1,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "The kernel executes the privileged system call handler instructions in Kernel mode (Ring 0)."
      },
      {
            "id": "os-37",
            "text": "Which system call is commonly used to display output on the screen in POSIX/UNIX?",
            "category": "System Calls & Modes",
            "options": [
                  "read()",
                  "open()",
                  "write()",
                  "close()"
            ],
            "correctIndex": 2,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "The write() system call writes bytes from a buffer to a file descriptor (such as stdout / fd 1)."
      },
      {
            "id": "os-38",
            "text": "Which of the following is NOT a type of system call?",
            "category": "System Calls & Modes",
            "options": [
                  "Process Control",
                  "Memory Management",
                  "Device Management",
                  "Compiler Management"
            ],
            "correctIndex": 3,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "Compilers are user-space software tools; Operating Systems provide system calls for Process Control, File, Device, Info, and Communications, but not Compiler Management."
      },
      {
            "id": "os-39",
            "text": "A process is:",
            "category": "Process & Thread Management",
            "options": [
                  "A program stored on disk",
                  "A program in execution",
                  "A text editor",
                  "A compiler"
            ],
            "correctIndex": 1,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "A program is a passive entity stored on disk (executable file), whereas a process is an active entity in execution."
      },
      {
            "id": "os-40",
            "text": "Which section of a process contains executable code?",
            "category": "Process & Thread Management",
            "options": [
                  "Heap",
                  "Stack",
                  "Text",
                  "Data section"
            ],
            "correctIndex": 2,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "The Text segment (or code segment) stores the compiled binary machine code instructions."
      },
      {
            "id": "os-41",
            "text": "Which section stores global variables in a process?",
            "category": "Process & Thread Management",
            "options": [
                  "Heap",
                  "Stack",
                  "Text",
                  "Data section"
            ],
            "correctIndex": 3,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "The Data segment holds initialized and uninitialized global and static variables."
      },
      {
            "id": "os-42",
            "text": "Dynamic memory allocation (e.g., malloc in C) occurs in the:",
            "category": "Process & Thread Management",
            "options": [
                  "Stack",
                  "Heap",
                  "Text section",
                  "Register"
            ],
            "correctIndex": 1,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "The Heap is the memory region dynamically allocated at runtime via malloc/new and deallocated with free/delete."
      },
      {
            "id": "os-43",
            "text": "Function parameters and local variables are stored in the:",
            "category": "Process & Thread Management",
            "options": [
                  "Heap",
                  "Stack",
                  "Data section",
                  "Cache"
            ],
            "correctIndex": 1,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "The Stack allocates activation records containing function parameters, return addresses, and local stack variables."
      },
      {
            "id": "os-44",
            "text": "Which process state indicates that instructions are currently being executed?",
            "category": "Process & Thread Management",
            "options": [
                  "Ready",
                  "Waiting",
                  "Running",
                  "New"
            ],
            "correctIndex": 2,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "In the Running state, CPU instructions for the process are actively being executed on a processor core."
      },
      {
            "id": "os-45",
            "text": "A process waiting to be assigned to the CPU is in the:",
            "category": "Process & Thread Management",
            "options": [
                  "Ready state",
                  "Waiting state",
                  "Running state",
                  "New state"
            ],
            "correctIndex": 0,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "The Ready state contains processes in memory that are ready to run as soon as CPU time is scheduled."
      },
      {
            "id": "os-46",
            "text": "Which process state indicates the process has finished execution?",
            "category": "Process & Thread Management",
            "options": [
                  "Ready",
                  "Running",
                  "Waiting",
                  "Terminated"
            ],
            "correctIndex": 3,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "The Terminated (or Exit) state indicates that the process has finished execution and its OS resources are being cleaned up."
      },
      {
            "id": "os-47",
            "text": "PCB stands for:",
            "category": "Process & Thread Management",
            "options": [
                  "Process Control Block",
                  "Program Control Buffer",
                  "Process Communication Block",
                  "Processor Control Buffer"
            ],
            "correctIndex": 0,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "Process Control Block (PCB) is the primary kernel data structure storing all state and accounting details for a process."
      },
      {
            "id": "os-48",
            "text": "Which PCB field stores the address of the next instruction?",
            "category": "Process & Thread Management",
            "options": [
                  "Stack Pointer",
                  "Program Counter",
                  "Base Register",
                  "Cache Register"
            ],
            "correctIndex": 1,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "The Program Counter (PC) register contains the memory address of the next instruction to be fetched and executed."
      },
      {
            "id": "os-49",
            "text": "Context switching occurs when:",
            "category": "Process & Thread Management",
            "options": [
                  "A file is opened",
                  "CPU switches from one process to another",
                  "A program is compiled",
                  "Memory is allocated"
            ],
            "correctIndex": 1,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "Context switching saves the current process state into its PCB and restores another process's state to switch execution."
      },
      {
            "id": "os-50",
            "text": "During a context switch, the process context is saved in the:",
            "category": "Process & Thread Management",
            "options": [
                  "RAM",
                  "Cache",
                  "PCB",
                  "Register only"
            ],
            "correctIndex": 2,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "The CPU registers, PC, stack pointer, and state are preserved in the Process Control Block (PCB)."
      },
      {
            "id": "os-51",
            "text": "A thread is:",
            "category": "Process & Thread Management",
            "options": [
                  "A program in execution",
                  "A basic unit of CPU utilization",
                  "A memory block",
                  "A scheduling algorithm"
            ],
            "correctIndex": 1,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "A thread is a lightweight execution flow inside a process and represents the basic unit of CPU scheduling."
      },
      {
            "id": "os-52",
            "text": "Threads of the same process share:",
            "category": "Process & Thread Management",
            "options": [
                  "Different memory spaces",
                  "Process memory and resources",
                  "Different CPUs only",
                  "Separate files only"
            ],
            "correctIndex": 1,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "Threads in a shared process share the code section, data section, heap, and open file descriptors, while having independent stacks and registers."
      },
      {
            "id": "os-53",
            "text": "Which threading model maps many user threads to one kernel thread?",
            "category": "Process & Thread Management",
            "options": [
                  "One-to-One",
                  "Many-to-One",
                  "Many-to-Many",
                  "Two-Level"
            ],
            "correctIndex": 1,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "The Many-to-One model maps multiple user-space threads to a single kernel thread, but a blocking system call blocks all user threads."
      },
      {
            "id": "os-54",
            "text": "Which threading model is used by Linux (NPTL)?",
            "category": "Process & Thread Management",
            "options": [
                  "One-to-One",
                  "Many-to-One",
                  "Many-to-Many",
                  "Two-Level"
            ],
            "correctIndex": 0,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "Linux Native POSIX Thread Library (NPTL) utilizes the One-to-One threading model where each user thread maps to a kernel schedulable entity (task_struct)."
      },
      {
            "id": "os-55",
            "text": "Which threading model maps many user threads to many kernel threads?",
            "category": "Process & Thread Management",
            "options": [
                  "Many-to-One",
                  "One-to-One",
                  "Many-to-Many",
                  "Two-Level"
            ],
            "correctIndex": 2,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "The Many-to-Many model multiplexes many user threads onto a smaller or equal number of kernel threads."
      },
      {
            "id": "os-56",
            "text": "Which of the following is a CPU scheduling criterion?",
            "category": "CPU Scheduling",
            "options": [
                  "Disk Size",
                  "CPU Utilization",
                  "File Size",
                  "Cache Size"
            ],
            "correctIndex": 1,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "CPU Scheduling criteria include CPU Utilization, Throughput, Turnaround Time, Waiting Time, and Response Time."
      },
      {
            "id": "os-57",
            "text": "Throughput refers to:",
            "category": "CPU Scheduling",
            "options": [
                  "Number of completed processes per unit time",
                  "Number of CPUs available",
                  "Memory utilization",
                  "Number of files processed"
            ],
            "correctIndex": 0,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "Throughput is the count of processes that complete their execution per unit of time (e.g. processes per minute)."
      },
      {
            "id": "os-58",
            "text": "Which scheduling method allows a running process to be interrupted?",
            "category": "CPU Scheduling",
            "options": [
                  "Non-preemptive Scheduling",
                  "Batch Scheduling",
                  "Preemptive Scheduling",
                  "FCFS only"
            ],
            "correctIndex": 2,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "Preemptive scheduling allows the OS scheduler to interrupt and suspend an actively executing process to allocate the CPU to another process."
      },
      {
            "id": "os-59",
            "text": "In Non-preemptive scheduling, the CPU is released when the process:",
            "category": "CPU Scheduling",
            "options": [
                  "Arrives",
                  "Is interrupted",
                  "Terminates or waits for I/O",
                  "Changes priority"
            ],
            "correctIndex": 2,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "In non-preemptive scheduling, once the CPU has been allocated to a process, the process keeps the CPU until it releases it either by terminating or by switching to the waiting state."
      },
      {
            "id": "os-60",
            "text": "FCFS stands for:",
            "category": "CPU Scheduling",
            "options": [
                  "First Complete First Serve",
                  "First Come First Serve",
                  "First CPU First Schedule",
                  "Fast Come Fast Serve"
            ],
            "correctIndex": 1,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "FCFS stands for First Come First Serve scheduling."
      },
      {
            "id": "os-61",
            "text": "FCFS scheduling follows which queue discipline?",
            "category": "CPU Scheduling",
            "options": [
                  "LIFO",
                  "Priority Queue",
                  "FIFO",
                  "Circular Queue"
            ],
            "correctIndex": 2,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "FCFS scheduling operates on a First-In, First-Out (FIFO) queue discipline."
      },
      {
            "id": "os-62",
            "text": "FCFS scheduling is:",
            "category": "CPU Scheduling",
            "options": [
                  "Preemptive",
                  "Non-preemptive",
                  "Priority-based",
                  "Round Robin"
            ],
            "correctIndex": 1,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "Standard FCFS scheduling is non-preemptive."
      },
      {
            "id": "os-63",
            "text": "SJF stands for:",
            "category": "CPU Scheduling",
            "options": [
                  "Short Job First",
                  "Shortest Job First",
                  "Small Job Function",
                  "System Job First"
            ],
            "correctIndex": 1,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "SJF stands for Shortest Job First scheduling."
      },
      {
            "id": "os-64",
            "text": "SJF scheduling selects the process with the:",
            "category": "CPU Scheduling",
            "options": [
                  "Highest priority",
                  "Longest burst time",
                  "Shortest burst time",
                  "Earliest completion time"
            ],
            "correctIndex": 2,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "SJF associates each process with its next CPU burst length and schedules the process with the shortest CPU burst first."
      },
      {
            "id": "os-65",
            "text": "The preemptive version of SJF is known as:",
            "category": "CPU Scheduling",
            "options": [
                  "FCFS",
                  "Round Robin",
                  "SRTF",
                  "FIFO"
            ],
            "correctIndex": 2,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "SRTF (Shortest Remaining Time First) is the preemptive implementation of Shortest Job First scheduling."
      },
      {
            "id": "os-66",
            "text": "Round Robin scheduling uses a fixed:",
            "category": "CPU Scheduling",
            "options": [
                  "Burst Time",
                  "Arrival Time",
                  "Time Quantum",
                  "Completion Time"
            ],
            "correctIndex": 2,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "Round Robin (RR) allocates a fixed time slice called a Time Quantum (or time slice) to each process in circular order."
      },
      {
            "id": "os-67",
            "text": "Round Robin scheduling is a:",
            "category": "CPU Scheduling",
            "options": [
                  "Non-preemptive algorithm",
                  "Preemptive algorithm",
                  "Priority algorithm only",
                  "Batch scheduling algorithm"
            ],
            "correctIndex": 1,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "Round Robin is inherently preemptive because when the time quantum expires, a timer interrupt forces a context switch."
      },
      {
            "id": "os-68",
            "text": "A Gantt chart is used to:",
            "category": "CPU Scheduling",
            "options": [
                  "Store processes",
                  "Display process execution over time",
                  "Increase CPU speed",
                  "Allocate memory"
            ],
            "correctIndex": 1,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "A Gantt chart is a horizontal bar chart that visually illustrates the timeline and process schedule execution across the CPU."
      }
]
  },
  cs_tech: {
    id: "cs_tech",
    name: "Computer Science & Engineering Trivia",
    description: "Compiler design, networks, databases, and programming trivia.",
    settings: {
      totalTeams: 4,
      baseTime: 30,
      bounceTime: 15,
      basePoints: 10,
      passPoints: 5,
      teamNames: ["Alpha Byte", "Binary Titans", "Cyber Knights", "Delta Logic"],
      teamColors: ["#3b82f6", "#10b981", "#f59e0b", "#ec4899"]
    },
    questions: [
      {
            "id": "os-1",
            "text": "What is the main role of an Operating System?",
            "category": "OS Basics - General Concepts",
            "options": [
                  "Compile programs",
                  "Manage hardware and software resources",
                  "Design databases",
                  "Create websites"
            ],
            "correctIndex": 1,
            "points": 10,
            "passPoints": 5,
            "customTime": 25,
            "explanation": "An Operating System acts as an intermediary between user applications and computer hardware, managing CPU, memory, storage, and I/O devices."
      },
      {
            "id": "os-2",
            "text": "Which of the following is an example of a desktop operating system?",
            "category": "OS Basics - General Concepts",
            "options": [
                  "Android",
                  "iOS",
                  "Windows",
                  "RTOS"
            ],
            "correctIndex": 2,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "Microsoft Windows is a widely used desktop/laptop OS, whereas Android and iOS are mobile operating systems."
      },
      {
            "id": "os-3",
            "text": "Which operating system is developed by Apple for iPhones?",
            "category": "OS Basics - General Concepts",
            "options": [
                  "Android",
                  "Linux",
                  "Windows",
                  "iOS"
            ],
            "correctIndex": 3,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "iOS is Apple's proprietary mobile operating system created exclusively for its iPhone hardware."
      },
      {
            "id": "os-4",
            "text": "Which OS function organizes and retrieves files?",
            "category": "OS Basics - General Concepts",
            "options": [
                  "Security",
                  "File Management",
                  "Scheduling",
                  "Buffering"
            ],
            "correctIndex": 1,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "File Management manages files and directories on storage drives, providing structured access, naming, and retrieval."
      },
      {
            "id": "os-5",
            "text": "Which operating system is open-source and highly customizable?",
            "category": "OS Basics - General Concepts",
            "options": [
                  "Windows",
                  "macOS",
                  "Linux",
                  "iOS"
            ],
            "correctIndex": 2,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "Linux is released under open-source licenses (GPL), allowing users and developers to inspect, modify, and distribute its source code."
      },
      {
            "id": "os-6",
            "text": "What is a process?",
            "category": "OS Basics - General Concepts",
            "options": [
                  "A stored file",
                  "A running program",
                  "A device driver",
                  "A compiler"
            ],
            "correctIndex": 1,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "A process is defined as an active program in execution loaded into memory with its program counter, stack, and data."
      },
      {
            "id": "os-7",
            "text": "Which process management function decides the next process to use the CPU?",
            "category": "OS Basics - General Concepts",
            "options": [
                  "Scheduling",
                  "Buffering",
                  "Spooling",
                  "Authentication"
            ],
            "correctIndex": 0,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "CPU Scheduling determines which process in the ready queue is allocated CPU time."
      },
      {
            "id": "os-8",
            "text": "Which memory management technique uses disk space as extra memory?",
            "category": "OS Basics - General Concepts",
            "options": [
                  "Paging",
                  "Virtual Memory",
                  "Buffering",
                  "Caching"
            ],
            "correctIndex": 1,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "Virtual Memory maps secondary disk storage into virtual address space, enabling execution of processes larger than physical RAM."
      },
      {
            "id": "os-9",
            "text": "Which file operation removes a file?",
            "category": "OS Basics - General Concepts",
            "options": [
                  "Read",
                  "Write",
                  "Delete",
                  "Create"
            ],
            "correctIndex": 2,
            "points": 10,
            "passPoints": 5,
            "customTime": 15,
            "explanation": "The Delete operation unlinks and frees the file blocks in the file system."
      },
      {
            "id": "os-10",
            "text": "What acts as an interface between hardware and the OS?",
            "category": "OS Basics - General Concepts",
            "options": [
                  "Shell",
                  "Driver",
                  "Compiler",
                  "Loader"
            ],
            "correctIndex": 1,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "A Device Driver is specialized software that provides a standardized interface for the OS to communicate with physical hardware."
      },
      {
            "id": "os-11",
            "text": "Which technique manages print jobs in a queue?",
            "category": "OS Basics - General Concepts",
            "options": [
                  "Paging",
                  "Spooling",
                  "Scheduling",
                  "Fragmentation"
            ],
            "correctIndex": 1,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "SPOOLing (Simultaneous Peripheral Operations On-Line) buffers print data to disk until the printer is ready to process it."
      },
      {
            "id": "os-12",
            "text": "Which OS processes jobs in groups without user interaction?",
            "category": "OS Structures & Types",
            "options": [
                  "Batch OS",
                  "Mobile OS",
                  "Distributed OS",
                  "Embedded OS"
            ],
            "correctIndex": 0,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "A Batch Operating System groups similar jobs together in batches and executes them sequentially without interactive user intervention."
      },
      {
            "id": "os-13",
            "text": "Which OS allows multiple CPUs to execute processes simultaneously?",
            "category": "OS Structures & Types",
            "options": [
                  "Batch OS",
                  "Time-Sharing OS",
                  "Multiprocessing OS",
                  "Embedded OS"
            ],
            "correctIndex": 2,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "A Multiprocessing OS coordinates two or more CPUs to run independent process threads in parallel."
      },
      {
            "id": "os-14",
            "text": "Which OS manages a group of networked computers as a single system?",
            "category": "OS Structures & Types",
            "options": [
                  "Mobile OS",
                  "Distributed OS",
                  "Batch OS",
                  "RTOS"
            ],
            "correctIndex": 1,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "A Distributed OS connects autonomous computing nodes across a network, presenting them as a unified single computer system."
      },
      {
            "id": "os-15",
            "text": "RTOS stands for:",
            "category": "OS Structures & Types",
            "options": [
                  "Real-Time Operating System",
                  "Runtime Operating Service",
                  "Remote Task Operating System",
                  "Real Task Operating Service"
            ],
            "correctIndex": 0,
            "points": 10,
            "passPoints": 5,
            "customTime": 20,
            "explanation": "RTOS stands for Real-Time Operating System, designed to guarantee response within strict latency and timing deadlines."
      }
]
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PRESET_QUESTION_BANKS };
}
