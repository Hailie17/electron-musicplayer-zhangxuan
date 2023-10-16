const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const Store = require("electron-store");
const DataStore = require("./renderer/musicDataStore");

const myStore = new DataStore({ name: "myStore" });

const store = new Store();

//定义窗口类21
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
  const mainWindow = new AppWindow({}, "./renderer/index.html"); //主窗口

  //添加音乐窗口
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

  //添加音乐
  ipcMain.on("add-tracks", (event, tracks) => {
    const updatedTracks = myStore.addTracks(tracks).getTracks();
    console.log(updatedTracks);
  });

  //打开文件夹
  ipcMain.on("open-music-file", (event) => {
    dialog
      .showOpenDialog({
        properties: ["openFile", "multiSelections"],
        filters: [{ name: "Music", extensions: ["MP3"] }],
      })
      .then((files) => {
        if (files) {
          event.sender.send("selected-file", files);
        }
      });
  });
});
