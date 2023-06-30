const OPTIONS = {
  AUTO_BOOKMARk: "OPTIONS_AUTO_BOOKMARK"
};

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

    if (isOnAutoBookMark && video !== null && video.played) {
      chrome.storage.local.get([videoId]).then((result) => {
        if (
          result[videoId] !== undefined &&
          video.currentTime < result[videoId]
        ) {
          video.currentTime = result[videoId];
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
