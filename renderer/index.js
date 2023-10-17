const { ipcRenderer } = require("electron");
const { $ } = require("./helper");
let musicAudio = new Audio();
let allTracks;
let currentTrack;

$("add-music-button").addEventListener("click", () => {
  ipcRenderer.send("add-music-window");
});

// 渲染列表
const renderListHTML = (tracks) => {
  const tracksList = $("tracksList");
  const tracksListHTML = tracks.reduce((html, track) => {
    html += `<li class ='row music-track list-group-item d-flex justify-content-between align-items-center'>
      <div class='col-10'>
        <i class="fas fa-music mr-2 text-secondary"></i>
        <b>${track.fileName}</b>
      </div>
      <div class='col-2'>
        <i class="fas fa-play mr-2" data-id="${track.id}"></i>
        <i class="fas fa-trash-alt" data-id="${track.id}"></i>
      </div>
    </li>`;
    return html;
  }, "");
  const emptyTrackHTML = `<div class='alert alert-primary'>还没有添加任何音乐</div>`;
  tracksList.innerHTML = tracks.length
    ? `<ul class='list-group'>${tracksListHTML}</ul>`
    : emptyTrackHTML;
};

ipcRenderer.on("getTracks", (event, tracks) => {
  allTracks = tracks;
  renderListHTML(tracks);
});

$("tracksList").addEventListener("click", (event) => {
  event.preventDefault();
  const { dataset, classList } = event.target;
  const id = dataset && dataset.id;
  //播放音乐
  if (id && classList.contains("fa-play")) {
    currentTrack = allTracks.find((track) => track.id === id);
    musicAudio.src = currentTrack.path;
    musicAudio.play();
  }
});