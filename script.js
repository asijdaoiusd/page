var video = document.getElementById("video");
var unmuteButton = document.getElementById("unmute-button");


unmuteButton.addEventListener("click", function() {
  if (video.muted) {
    video.muted = false;
    unmuteButton.innerHTML = "Mute";
  } else {
    video.muted = true;
    unmuteButton.innerHTML = "Play";
  }
});
