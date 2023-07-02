import init from "@pages/content/init";
import { getVideoElement } from "@pages/content/utils";

let options = {
  isOnAutoBookMark: false,
  optionChecked: false
};
let intervalIdList = [];

init().then((value) => {
  options = value;
});

function goToLastSecond(videoId) {
  if (!options.isOnAutoBookMark) {
    return;
  }

  let video = getVideoElement();
  const intervalId = setInterval(() => {
    if (video === null) {
      video = getVideoElement();
    }

    if (video !== null && video.played) {
      chrome.storage.local.get([videoId]).then((result) => {
        const savedData = result[videoId];
        if (savedData && video.currentTime < savedData.seconds) {
          video.currentTime = savedData.seconds;
        }
        recordEndTime(videoId);
      });
      clearInterval(intervalId);
    }
  }, 500);
  intervalIdList.push(intervalId);
}

function recordEndTime(videoId) {
  if (!options.isOnAutoBookMark) {
    return;
  }

  let video = getVideoElement();
  const intervalId = setInterval(() => {
    if (video === null) {
      video = document.querySelector("video.video-stream");
    }

    if (video !== null && video.currentTime) {
      // 영상 마지막 부근이면, 시작 지점 저장
      if (video.duration - 5 <= video.currentTime) {
        return chrome.storage.local.set({
          [videoId]: {
            seconds: 0,
            lastUpdated: Date.now()
          }
        });
      }
      chrome.storage.local.set({
        [videoId]: {
          seconds: Math.floor(video.currentTime),
          lastUpdated: Date.now()
        }
      });
    }
  }, 1000);
  intervalIdList.push(intervalId);
}

document.addEventListener("yt-navigate-finish", (e) => {
  if (location.pathname.includes("watch")) {
    const videoId = document.location.href.split("v=")?.at(1)?.split("&")[0];
    goToLastSecond(videoId);
  } else {
    intervalIdList.map((id) => clearInterval(id));
    intervalIdList = [];
  }
});

// 처음 접속 시 영상 재생 화면이면 바로 실행
if (location.pathname.includes("watch")) {
  const videoId = document.location.href.split("v=")?.at(1)?.split("&")[0];
  const intervalId = setInterval(() => {
    if (options.optionChecked) {
      goToLastSecond(videoId);
      clearInterval(intervalId);
    }
  }, 500);
}
