const { ipcRenderer } = require("electron");
const { $, convertTime } = require("./helper");
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

/**
 * 播放器展示
 * name: 音乐名称
 * duration: 时长
 */
const renderPlayerHTML = (name, duration) =>{
  // 获取播放器节点
  const player = $('player-status')
  // 渲染播放器节点
  player.innerHTML = `<div class='col font-weight-bold'>
                            正在播放：${name}
                        </div>
                        <div class='col'>
                            <span id="current-seeker">00:00</span> / ${convertTime(duration)}
                        </div>`
}

/**
 *  更新音乐播放时间
 *  currentTime: 音乐当前播放时间
 */
const updateProgressHTML = (currentTime, duration) => {
  const progress = Math.floor(currentTime / duration * 100 ) + '%'
  // 获取进度条节点
  const bar = $('player-progress')
  bar.innerHTML = progress
  bar.style.width = progress
  // 获取时间节点
  const seeker = $('current-seeker')
  // 渲染时间节点
  seeker.innerHTML = convertTime(currentTime)
}

ipcRenderer.on("getTracks", (event, tracks) => {
  allTracks = tracks;
  renderListHTML(tracks);
});

  // 渲染播放器状态
musicAudio.addEventListener("loadedmetadata", () => {
  renderPlayerHTML(currentTrack.fileName, musicAudio.duration)
});

//更新播放器状态
musicAudio.addEventListener("timeupdate", () => {
  updateProgressHTML(musicAudio.currentTime, musicAudio.duration)
});

$("tracksList").addEventListener("click", (event) => {
  event.preventDefault();
  const { dataset, classList } = event.target;
  const id = dataset && dataset.id;
  //播放音乐
  if (id && classList.contains("fa-play")) {
    // 播放当前音乐
    if (currentTrack && currentTrack.id === id) {
      musicAudio.play();
    } else {
      currentTrack = allTracks.find((track) => track.id === id);
      musicAudio.src = currentTrack.path;
      musicAudio.play();
      //替换之前的图标
      const resetIconEle = document.querySelector(".fa-pause");
      if (resetIconEle) {
        resetIconEle.classList.replace("fa-pause", "fa-play");
      }
    }
    classList.replace("fa-play", "fa-pause"); //替换播放图标
  } else if (id && classList.contains("fa-pause")) {
    //暂停音乐
    musicAudio.pause();
    classList.replace("fa-pause", "fa-play"); //替换暂停图标
  } else if (id && classList.contains("fa-trash-alt")) {
    //发送事件 删除音乐
    ipcRenderer.send("delete-track", id);
  }
});
