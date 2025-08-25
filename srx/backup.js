const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { spawn } = require("child_process");
const vm = require("vm");

let mainWindow;
let shellProcess;

function CreateWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    backgroundColor: "#0c0c0c",
    icon: "icon.ico",
    webPreferences: {
      preload: path.join(__dirname, "com.preloader.js"),
      contextIsolation: true,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "..", "public", 'index.html'));
  StartShell();
}

function StartShell() {
  let command;
  if (process.platform === "win32") {
    command = "cmd.exe";
  } else if (process.platform === "darwin") {
    command = process.env.SHELL || "/bin/zsh";
  } else {
    command = process.env.SHELL || "/bin/bash";
  }

  shellProcess = spawn(command, [], { windowsHide: true });

  shellProcess.stdout.on("data", (data) => {
    const text = data.toString("utf8");
    mainWindow.webContents.send("terminal:data", text);
  });

  shellProcess.stderr.on("data", (data) => {
    const text = data.toString("utf8");
    mainWindow.webContents.send("terminal:data", text);
  });

  shellProcess.on("exit", (code) => {
    mainWindow.webContents.send("terminal:data", `\n[${command} exited with code ${code}]`);
  });

  if (process.platform === "win32") {
    shellProcess.stdin.write("prompt $G\r\n");
  } else {
    shellProcess.stdin.write("export PS1='> '\n");
  }
}

ipcMain.on("terminal:input", (_event, input) => {
  const trimmedInput = input.trim();

  if (trimmedInput.startsWith("$")) {
    const code = trimmedInput.slice(1).trim();
    try {
      const result = vm.runInNewContext(code, { console });
      mainWindow.webContents.send("terminal:data", String(result ?? ""));
    } catch (error) {
      mainWindow.webContents.send("terminal:data", "Error: " + error.message);
    }
    return;
  }

  if (trimmedInput.toLowerCase() === "cls") {
    mainWindow.webContents.send("terminal:clear");
    return;
  }

  if (shellProcess) {
    shellProcess.stdin.write(input + "\n");
  }
});

app.whenReady().then(CreateWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
