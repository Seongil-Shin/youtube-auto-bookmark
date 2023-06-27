const video = document.querySelector("video.video-stream") as HTMLMediaElement;
const videoId = document.location.href.split("v=")[1].split("&")[0];

function init() {
  /* FIXME : 가끔씩 아래 interval이 실행되지 않는 경우가 있음
      case 1 : 영상 -> 유튜브 로고 -> 뒤로가기 시. (BFcache 의심)
      case 2 : extension 설치 후 처음 시청하는 영상 or 처음부터 재생되지 않는 영상
  * */
  const intervalId = setInterval(() => {
    if (video.played) {
      chrome.storage.local.get([videoId]).then((result) => {
        // FIXME : 저장은 제대로 되었는데, get 결과로는 조회되지않는 경우가 있음.
        if (
          result[videoId] !== undefined &&
          video.currentTime < result[videoId]
        ) {
          video.currentTime = result[videoId];
        }
        recordEndTime();
      });
      clearInterval(intervalId);
    }
  }, 500);
}

init();

function recordEndTime() {
  setInterval(() => {
    if (video?.currentTime) {
      chrome.storage.local
        .set({ [videoId]: Math.floor(video.currentTime) });
    }
  }, 1000);
}
