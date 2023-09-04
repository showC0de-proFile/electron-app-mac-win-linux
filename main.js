const fs = require("fs");
const { app, BrowserWindow, Tray, Menu } = require("electron");
const path = require("path");

let win;
let tray = null;

const assetsDirectory = path.join(__dirname, "assets");
const createTray = () => {  
  const trayIconPath = path.join(assetsDirectory, "iconTemplate.png");
  if (!fs.existsSync(trayIconPath)) {
    console.error("Tray icon not found at path:", trayIconPath);
    return;
  }

  tray = new Tray(trayIconPath);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "tsmDev",
      type: "radio",
      checked: false,
      icon: path.join(assetsDirectory, "./icons/happy.png"),
    },
    {
      label: "Open DevTools",
      click: () => {
        if (win) {
          win.webContents.openDevTools();
        }
      },
      icon: path.join(assetsDirectory, "./icons/gear.png"),
    },
    {
      label: "Settings",
      click: () => {
        
      },
      icon: path.join(assetsDirectory, "./icons/wrench.png"),
    },
    {
      label: "Pause App",
      click: () => {
        
      },
      icon: path.join(assetsDirectory, "./icons/pause-button.png"),
    },
    { type: "separator" }, 
    {
      label: "Leave",
      type: "normal",
      click: () => {
        app.quit();
      },
      icon: path.join(assetsDirectory, "./icons/logout.png"),
    },
  ]);

  tray.setToolTip("tsmDev");
  tray.setContextMenu(contextMenu);
};

// Função para criar a janela do aplicativo
function createWindow() {
  const windowIconPath = path.join(assetsDirectory, "icons/64x64.png");

  if (!fs.existsSync(windowIconPath)) {
    console.error("Window icon not found at path:", windowIconPath);
    return;
  }

  win = new BrowserWindow({
    icon: windowIconPath,
    // titleBarStyle: "hidden",
    backgroundColor: "#312450",
    width: 1366,
    height: 762,
    show: false, 
    webPreferences: {
      nodeIntegration: true,
      sandbox: true,
      preload: path.join(app.getAppPath(), "preload.js"),
    },
  });

  
  win.loadURL("https://thiagomessias.com//mp/cielo/");

  win.once("ready-to-show", () => {
    win.show();
  });

  

  win.on("closed", () => {
    win = null;
  });
}

app.whenReady().then(() => {
  createTray();
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (win === null) {
    createWindow();
  }
});
