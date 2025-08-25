const { app, session, ipcRenderer, ipcMain, shell, systemPreferences, powerMonitor } = require('electron');
const { MicaBrowserWindow } = require('mica-electron');
const path = require('path');
const express = require('express');
const port = 5051;
const hostname = 'localhost';
const prox = express();

const { spawn } = require("child_process");
const vm = require("vm");
                         
prox.use(express.static(path.join(__dirname, '..', 'public')))
prox.use('/assx', express.static(path.join(__dirname, '..', 'assx')));
prox.use('/error', express.static(path.join(__dirname, '..', 'error')));
prox.listen(port, () => { console.log(`com.dexly.server policy is mounted on http://${hostname}:${port}`) });

let uicolor = systemPreferences.getAccentColor();
systemPreferences.on('accent-color-changed', (_, color) => { apx.webContents.send('accent-updated', color); })

let Shell;
let preload;
let apx;
let about;

async function Mount() {

    preload = new MicaBrowserWindow({

        width:440,
        height:250,
        show:false,
        frame:false,
        autoHideMenuBar:true,
        resizable: false,
        icon: path.join(__dirname, '..', 'assx', 'img', 'logo.png'),

        webPreferences:{

            contextIsolation: true,
            nodeIntegration: false,
            preload: path.join(__dirname, 'com.preloader.js'),
            devTools: false,

        }

    });

    about = new MicaBrowserWindow({

        width:560,
        height:550,
        frame: false,
        autoHideMenuBar: true, 
        show: false,
        minWidth:560,
        minHeight:550,
        maxWidth:560,
        maxHeight:550,
        x: 20,
        y: 20,
        icon: path.join(__dirname, '..', 'assx', 'img', 'logo.png'),


        webPreferences:{

            contextIsolation: true,
            nodeIntegration: false,
            preload: path.join(__dirname, 'com.preloader.js')

        }

    })

    apx = new MicaBrowserWindow({

        width:960,
        height:635,
        frame: false,
        autoHideMenuBar: true, 
        show: false,
        minWidth:955,
        minHeight:535,
        icon: path.join(__dirname, '..', 'assx', 'img', 'logo.png'),


        webPreferences:{

            contextIsolation: true,
            nodeIntegration: false,
            preload: path.join(__dirname, 'com.preloader.js')

        }

    })

    preload.setMicaAcrylicEffect();
    preload.setDarkTheme();
    preload.setRoundedCorner();
    preload.setBackgroundColor('rgba(0,0,0,.25)')

    apx.setBackgroundColor('rgba(0,0,0,.25)')
    apx.setMicaAcrylicEffect();
    apx.setDarkTheme();
    apx.setRoundedCorner();

    about.setBackgroundColor('rgba(0,0,0,.25)')
    about.setMicaAcrylicEffect();
    about.setDarkTheme();
    about.setRoundedCorner();


    app.commandLine.appendSwitch("enable-experimental-web-platform-features");
    apx.loadURL(`http://${hostname}:${port}`);
    preload.loadURL(`http://${hostname}:${port}/preload`);
    about.loadURL(`http://${hostname}:${port}/about`)
    preload.webContents.on('did-finish-load', () => { preload.show(); console.log(`com.dexly.apx policy has booted the app following local protocol in target: ${hostname}, local server mounted in ${port}`); runing = true })

}

app.whenReady().then(Mount);
app.whenReady().then(StartShell )
ipcMain.on('preload:done', () => { preload.hide(); setTimeout(() => {apx.show(); apx.alwaysFocused(true);},600); apx.webContents.send('apx:setting:color'); });


function StartShell() {
  let command;
  if (process.platform === "win32") {
    command = "cmd.exe";
  } else if (process.platform === "darwin") {
    command = process.env.SHELL || "/bin/zsh";
  } else {
    command = process.env.SHELL || "/bin/bash";
  }

  Shell = spawn(command, [], { windowsHide: true, cwd: app.getPath('home') });

  Shell.stdout.on("data", (data) => {
    const text = data.toString("utf8");
    apx.webContents.send("apx:data", text);
  });

  Shell.stderr.on("data", (data) => {
    const text = data.toString("utf8");
    apx.webContents.send("apx:data", text);
  });

  Shell.on("exit", (code) => {
    apx.webContents.send("apx:data", `\n[${command} exited with code ${code}]`);
  });

  if (process.platform === "win32") {
     Shell.stdin.write("chcp 65001\r\n");
    Shell.stdin.write("prompt \r\n");
  } else {
    Shell.stdin.write("export PS1=''\n");
  }
}

ipcMain.on("apx:input", (_event, input) => {
  const trimmedInput = input.trim();

  if (trimmedInput.startsWith("$")) {
    const code = trimmedInput.slice(1).trim();
    try {
      const result = vm.runInNewContext(code, { console });
      apx.webContents.send("apx:data", String(result ?? ""));
    } catch (error) {
      apx.webContents.send("apx:data", "Error: " + error.message);
    }
    return;
  }

  if (trimmedInput.toLowerCase() === "cls") {
    apx.webContents.send("apx:clear");
    return;
  }

  if (Shell) {
    Shell.stdin.write(input + "\n");
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.on('apx:cls', () => {

  apx.close();
  app.quit();

})

ipcMain.on('apx:min', () => {

    apx.minimize();

})

ipcMain.on("apx:max", () => {
  const wasMaximized = apx.isMaximized(); 

  apx.hide();

  setTimeout(() => {
    if (wasMaximized) {
      apx.restore();
      apx.webContents.send("apx:maxres");
    } else {
      apx.maximize();
      apx.webContents.send("apx:maxon");
    }

    setTimeout(() => {
      apx.show();
    }, 60);
  }, 100);

  
});

ipcMain.on('terminal:rule:about', () => { about.show(); apx.minimize(); apx.alwaysFocused(false); });

ipcMain.on('clip:rule:closeabout', () => {

    about.hide();
    apx.show();
    apx.alwaysFocused(true)

})

ipcMain.handle('apx:setting:color', () => {

    return uicolor;

})

ipcMain.on("apx:break", () => {
  if (Shell) {
    try {
      Shell.stdin.write("\x03");
      apx.webContents.send("apx:data", "\n[Se interrumpió la operación]\n");
    } catch (err) {
      apx.webContents.send("apx:data", "\n[Error al interrumpir: " + err.message + "]\n");
    }
  }
});

const { exec } = require("child_process");

function isAdminWindows(callback) {
  exec(
    'net session',
    (err, stdout, stderr) => {
      if (err) {
        callback(false);
      } else {
        callback(true);
      }
    }
  );
}

isAdminWindows((isAdmin) => {
  console.log("¿Es admin?", isAdmin);
});

ipcMain.on('terminal:rule:closeabout', () => {

    about.hide();
    apx.show();
    apx.alwaysFocused(true)

})