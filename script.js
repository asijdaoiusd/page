var video = document.getElementById("video");
var unmuteButton = document.getElementById("unmute-button");

var videos = ["keoo.mp4", "bandoboyz.mp4"];
var randomIndex = Math.floor(Math.random() * videos.length);
var randomVideo = videos[randomIndex];
video.src = "../" + randomVideo;

unmuteButton.addEventListener("click", function() {
  if (video.muted) {
    video.muted = false;
    unmuteButton.innerHTML = "Mute";
  } else {
    video.muted = true;
    unmuteButton.innerHTML = "Play";
  }
});
