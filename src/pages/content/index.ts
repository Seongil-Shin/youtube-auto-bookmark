const OPTIONS = {
  AUTO_BOOKMARk: "OPTIONS_AUTO_BOOKMARK",
};

let optionChecked = false;
let isOnAutoBookMark = false;
let intervalIdList = [];

function init() {
  checkOption();
  deleteOldData();
}
init();

function checkOption() {
  const intervalId = setInterval(() => {
    if (chrome.runtime?.id) {
      chrome.storage.local.get([OPTIONS.AUTO_BOOKMARk]).then((result) => {
        if (
          result[OPTIONS.AUTO_BOOKMARk] === "ON" ||
          result[OPTIONS.AUTO_BOOKMARk] === undefined
        ) {
          isOnAutoBookMark = true;
          chrome.storage.local.set({ [OPTIONS.AUTO_BOOKMARk]: "ON" });
        }
        clearInterval(intervalId);
        optionChecked = true;
      });
    }
  }, 500);
}

function deleteOldData() {
  const oneMonthMilliSeconds = 30 * 24 * 60 * 60 * 1000;
  const intervalId = setInterval(() => {
    if (chrome.runtime?.id) {
      chrome.storage.local.get(null, (result) => {
        const shouldRemove = [];
        const oneMonthBefore = Date.now() - oneMonthMilliSeconds;
        Object.entries(result).forEach(([key, value]) => {
          if (
            key !== OPTIONS.AUTO_BOOKMARk &&
            value.lastUpdated < oneMonthBefore
          ) {
            shouldRemove.push(key);
          }
        });
        chrome.storage.local.remove(shouldRemove);
      });
      clearInterval(intervalId);
    }
  }, 500);
}

function goToLastSecond(videoId) {
  console.log("goToLastSeconds", isOnAutoBookMark);
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
  console.log("recordEndTime", isOnAutoBookMark);
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
        return chrome.storage.local.set({
          [videoId]: {
            seconds: 0,
            lastUpdated: Date.now(),
          },
        });
      }
      chrome.storage.local.set({
        [videoId]: {
          seconds: Math.floor(video.currentTime),
          lastUpdated: Date.now(),
        },
      });
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
