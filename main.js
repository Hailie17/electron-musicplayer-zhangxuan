const { app, BrowserWindow, ipcMain } = require("electron");

class AppWindow extends BrowserWindow {
  constructor(config, location) {
    const basicConfig = {
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    };
    const finalConfig = { ...basicConfig, ...config };
    super(finalConfig);
    this.loadFile(location);
    this.once("ready-to-show", () => {
      this.show();
    });
  }
}

app.on("ready", () => {
  const mainWindow = new AppWindow({}, "./renderer/index.html");

  ipcMain.on("add-music-window", () => {
    const addWindow = new AppWindow(
      {
        width: 600,
        height: 400,
        parent: mainWindow,
      },
      "./renderer/add.html"
    );
  });
});
