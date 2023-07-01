const OPTIONS = {
  AUTO_BOOKMARk: "OPTIONS_AUTO_BOOKMARK"
};

let optionChecked = false;
let isOnAutoBookMark = false;
let intervalIdList = [];

function checkOption() {
  const intervalId = setInterval(() => {
    if (chrome.runtime?.id) {
      chrome.storage.local.get([OPTIONS.AUTO_BOOKMARk]).then((result) => {
        if (result[OPTIONS.AUTO_BOOKMARk] === "OFF") {
          clearInterval(intervalId);
        } else {
          isOnAutoBookMark = true;
          chrome.storage.local.set({ [OPTIONS.AUTO_BOOKMARk]: "ON" });
        }
        optionChecked = true;
      });
    }
  });
  intervalIdList.push(intervalId);
}

checkOption();

function goToLastSecond(videoId) {
  if (!isOnAutoBookMark) {
    return;
  }

  let video = getVideoElement();
  const intervalId = setInterval(() => {
    if (video === null) {
      video = getVideoElement();
    }

    if (video !== null && video.played) {
      chrome.storage.local.get([videoId]).then((result) => {
        const savedTime = result[videoId];
        if (savedTime && video.currentTime < savedTime) {
          video.currentTime = savedTime;
        }
        recordEndTime(videoId);
      });
      clearInterval(intervalId);
    }
  }, 500);
  intervalIdList.push(intervalId);
}

function recordEndTime(videoId) {
  if (!isOnAutoBookMark) {
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
        return chrome.storage.local.set({ [videoId]: 0 });
      }
      chrome.storage.local.set({ [videoId]: Math.floor(video.currentTime) });
    }
  }, 1000);
  intervalIdList.push(intervalId);
}

function getVideoElement() {
  const video = document.querySelector("video.video-stream");
  if (video === null) {
    return null;
  }
  return video as HTMLMediaElement;
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
    if (optionChecked) {
      goToLastSecond(videoId);
      clearInterval(intervalId);
    }
  }, 500);
}
