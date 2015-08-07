var re = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;

var videoId, scalaReady, youtubeReady;

// listen for scala ready
window.addEventListener('scala', function () {
  var matches = re.exec(scala.app.config.videoId);

  // allow youtube urls
  if (matches && matches[1]) {
    videoId = matches[1];
  } else {
    videoId = scala.app.config.videoId;
  }

  scalaReady = true;

  if (youtubeReady) {
    loadVideo();
  }
});

// listen for youtube ready
function onYouTubeIframeAPIReady() {
  youtubeReady = true;

  if (scalaReady) {
    loadVideo();
  }
}

var player;

function loadVideo() {

  player = new YT.Player('player', {
    videoId: videoId,
    playerVars: {
      autoplay: 1,
      controls: 0,
      enablejsapi: 1,
      iv_load_policy: 3,
      loop: 1,
      origin: 'http://' + window.location.host,
      playlist: videoId
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });

}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  player.setPlaybackQuality('hd1080');
  event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
//var done = false;
function onPlayerStateChange(event) {

  // if (event.data == YT.PlayerState.PLAYING && !done) {
  //   setTimeout(stopVideo, 6000);
  //   done = true;
  // }

}

// function stopVideo() {
//   player.stopVideo();
// }
