export function getVideoElement() {
  const video = document.querySelector("video.video-stream");
  if (video === null) {
    return null;
  }
  return video as HTMLMediaElement;
}
