const { app, BrowserWindow, ipcMain } = require("electron");

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  mainWindow.loadFile("index.html");
  ipcMain.on("message", (event, arg) => {
    console.log(arg);
    event.sender.send("reply", "reply from main");
  });
});
