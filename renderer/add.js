const { ipcRenderer } = require("electron");
const { $ } = require("./helper");
const path = require("path");

let musicFilePath = [];

$("select-music").addEventListener("click", () => {
  ipcRenderer.send("open-music-file");
});

$("add-music").addEventListener("click", () => {
  ipcRenderer.send("add-tracks", musicFilePath);
});

const rendererListHTML = (pathes) => {
  const musicList = $("musicList");
  const musicItemHTML = pathes.reduce((html, music) => {
    html += `<li class="list-group-item">${path.basename(music)}</li>`;
    return html;
  }, "");
  musicList.innerHTML = `<ul class="list-group">${musicItemHTML}</ul>`;
};

ipcRenderer.on("selected-file", (event, files) => {
  const { filePaths } = files;
  if (Array.isArray(filePaths)) {
    rendererListHTML(filePaths);
    musicFilePath = filePaths;
  }
});
