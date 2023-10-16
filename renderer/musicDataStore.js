const Store = require("electron-store");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

class DataStore extends Store {
  constructor(settings) {
    super(settings);
    this.tracks = this.get("tracks") || [];
  }
  saveTracks() {
    this.set("tracks", this.tracks);
    return this;
  }
  getTracks() {
    return this.get("tracks") || [];
  }
  addTracks(tracks) {
    const tracksWithProps = tracks
      .map((track) => {
        return {
          id: uuidv4(), // 生成唯一id
          path: track,
          fileName: path.basename(track),
        };
      })
      // 去掉重复
      .filter((track) => {
        const currentTracksPath = this.getTracks().map((track) => track.path);
        return currentTracksPath.indexOf(track.path) < 0;
      });
    this.tracks = [...this.tracks, ...tracksWithProps];
    return this.saveTracks();
  }
}

module.exports = DataStore;
