var video = document.getElementById("video");
var unmuteButton = document.getElementById("unmute-button");

var videos = [
  "https://cdn.discordapp.com/attachments/1107128683522703411/1128281353847320636/keoo.mp4",
  "https://cdn.discordapp.com/attachments/1107128683522703411/1128256282239979550/y2mate.com_-_Kidd_Keo_24H_Official_Video__v720P.mp4"
];

var randomIndex = Math.floor(Math.random() * videos.length);
var randomVideo = videos[randomIndex];
video.src = randomVideo;

unmuteButton.addEventListener("click", function() {
  if (video.muted) {
    video.muted = false;
    unmuteButton.innerHTML = "Mute";
  } else {
    video.muted = true;
    unmuteButton.innerHTML = "Play";
  }
});
