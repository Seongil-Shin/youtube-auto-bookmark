export function isOnYoutubeVideo() {
  return document.location.href.includes("watch?v=") ? true : false;
}

export function getCurrentTime(video: HTMLMediaElement) {
  return {
    video,
    currentTime: video ? video.currentTime : 0
  };
}

export function getEndTime() {
  const video: (HTMLMediaElement | null) = document.querySelector("video.video-stream");
  if (video) {
    return video.duration;
  }
  return 0;
}

export function getStartSecondsFromURL(url: string) {
  const time = url.split("&t=")[1];
  if (time) {
    return Number(time);
  }
  return 0;
}

export function getStartTimeFromURL(url: string) {
  return secondsToTime(getStartSecondsFromURL(url));
}

function secondsToTime(seconds: number) {
  const date = new Date(0);
  date.setSeconds(seconds);
  const timeString = date.toISOString().substr(11, 8);
  return timeString;
}
