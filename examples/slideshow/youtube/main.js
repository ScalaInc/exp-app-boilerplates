'use strict';

var player;
var playerReady = false;

function getQueryString(field, url) {
  var href = url ? url : window.location.href;
  var reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
  var string = reg.exec(href);
  return string ? string[1] : null;
}

function onPlayerReady(event) {
  player.setPlaybackQuality('hd1080');
  playerReady = true;
}

function onPlayerStateChange(event) {
  if(event.data === YT.PlayerState.ENDED) {
    window.dispatchEvent(new Event('ended'));
  }
}

function onPlayerError(event) {
  playerReady = false; // give up for good
  window.dispatchEvent(new Event('error'));
}

// function stopVideo() {
//   player.stopVideo();
// }

// listen for youtube ready (automatically bound)
function onYouTubeIframeAPIReady() {
  var videoId = getQueryString('videoId');

  player = new YT.Player('player', {
    videoId: videoId,
    playerVars: {
      controls: 0,
      enablejsapi: 1,
      iv_load_policy: 3,
      origin: 'http://' + window.location.host
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange,
      'onError': onPlayerError
    }
  });
}

