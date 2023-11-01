exports.$ = (id) => {
  return document.getElementById(id);
};

/**
 * 格式化时间
 * @param time 传入时间参数
 * @returns {string} 返回格式化后的时间
 */
exports.convertTime = (time) => {
  // 计算分钟 单数返回‘01’ ’011‘
  const munites = '0' + Math.floor(time/60)
  // 计算秒 单数返回'01' '011'
  const seconds = '0' + Math.floor(time - munites*60)
  return munites.substr(-2) + ':' + seconds.substr(-2)
}
