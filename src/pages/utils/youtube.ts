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
