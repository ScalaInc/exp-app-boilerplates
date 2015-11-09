function Slide (src) {

  var self = this;
  var timeout;
  var assetTag;
  var readyEvents = '';
  var errorEvents = '';

  self.$element = $('<div>')
    .addClass('slide')
    .appendTo('#slideshow');

  self.$asset = null;

  self.isReady = false;

  if(/\.(jpg|jpeg|png|gif|svg)$/i.test(src)) {
    assetTag = '<img/>';
    readyEvents = 'load';
    errorEvents = 'error';
    self.assetType = 'image';
  } else if (/\.(mp4|avi|3gp|webm)$/i.test(src)) {
    assetTag = '<video/>';
    readyEvents = 'canplay';
    errorEvents = 'error abort';
    self.assetType = 'video';
  } else if (/^youtube\/index\.html/.test(src)) {
    assetTag = '<iframe/>';
    readyEvents = 'load';
    errorEvents = 'error abort';
    self.assetType = 'youtube';
  } else {
    assetTag = '<iframe/>';
    readyEvents = 'load';
    self.assetType = 'frame';
  }

  self.reset = function () {
    clearTimeout(timeout);
    self.$element.empty();
    self.isReady = false;
  };


  self.loadAsset = function () {

    function onReady () {
      console.log('Slide ready for playback.', src);
      self.isReady = true;
      clearTimeout(timeout);
    }

    function onError () {
      console.log('Slide failed to load.', src);
      //self.isReady = false;
      clearTimeout(timeout);
    }

    console.log('Loading asset.', src);
    self.isReady = false;

    clearTimeout(timeout);
    self.$asset = $(assetTag)
      .addClass('asset')
      .on(readyEvents, onReady)
      .on(errorEvents, onError)
      .attr('src', src)
      .appendTo(self.$element);

    if (self.assetType === 'frame') {
      self.$asset.attr('scrolling', 'no');
    }

    timeout = setTimeout(onError, 30000);
  };

  self.show = function (options) {
    self.slide.css('opacity', 1);
    self.slide.css('visibility', 'visible');
  };

  self.hide = function (options) {
    self.slide.css('opacity', 0);
  };

}

var re = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
var slides = [];

window.addEventListener('load', function () {
  document.getElementById('loading').style.display = 'block';
  document.getElementById('viewport').style.display = 'none';
});

var transition;
var doUnload = false;

window.addEventListener('scala', function () {

  // Start the slideshow when play event fires.
  scala.app.runtime.on('load', function () {

    if ( scala.app.config.src && !Array.isArray(scala.app.config.src) ) {
      scala.app.config.src = [scala.app.config.src];
    }

    // Create a slide for each asset.
    return Promise.all(scala.app.config.src.map( function (uuid) {
      return scala.api.getContentNode(uuid);
    }))
    .then(function (data) {

      // take the promise.all data, which has no guaranteed order, and enforce
      // the order of uuid's from `scala.app.config.src`
      /*srcArray = scala.app.config.src.map(function (uuid) {
        
        var index = data.findIndex(function (content) {
          return content.document.uuid === uuid;
        }, uuid)

        return data[index];
      }, data);*/

      // Promise.all should preserve order. -JD
      srcArray = data;

      // iterate over the ordered array of content nodes, create new slides by path
      srcArray.forEach(function (src) {
        var srcPath = src.hasVariant('vector.svg') ? src.getVariantUrl('vector.svg') : src.hasVariant('video.mp4') ? src.getVariantUrl('video.mp4') : src.getUrl();

        // check for youtube urls
        var matches = re.exec(srcPath);
        if (matches && matches[1]) {
          var videoId = matches[1];
          srcPath = 'youtube/index.html?videoId=' + videoId;
        }

        var slide = new Slide(srcPath);
        slide.loadAsset();
        slides.push(slide);
      });

      // Default transition.
      transition = window.transitions.fade;

      // Get configured transition.
      if (scala.app.config.transition && scala.app.config.transition.name) {
        if (window.transitions[scala.app.config.transition.name]) {
          transition = window.transitions[scala.app.config.transition.name];
        }
      }

      // Configure the transition.
      transition.configure({
        slides: slides,
        config: scala.app.config.transition
      });

    });
  });

  scala.app.runtime.on('play', digest);
  scala.app.runtime.on('unload', function () {
    doUnload = true; // Indicate that the app is unloading.
  });

});



var current;
var next;
function digest () {
  if (doUnload) return; // Stop everything if the app is unloading.
  if (current === undefined && next === undefined) {
    next = 0;
  } else {
    next++;
  }
  if (next === slides.length) next = 0;
  if (next === current) {
    wait();
    return;
  }
  var slide = slides[next];
  if (slide.isReady) {
    transition.execute({
      current: current,
      next: next
    });
    current = next;
    wait();
    return;
  } else {
    setTimeout(digest, 50);
  }
}

function wait () {
  var slide = slides[current];
  document.getElementById('loading').style.display = 'none';
  document.getElementById('viewport').style.display = 'block';
  if (slide.assetType === 'video') {
    slide.$asset[0].currentTime = 0;
    if (slide.$asset[0].error) {
      return setTimeout(function () {
        slide.$asset[0].load();
        slide.$asset[0].pause();
        digest();
      }, 2000);
    }
    var stop = function (err) {
      slide.$asset.off('ended');
      slide.$asset.off('abort');
      slide.$asset.off('error');
      setTimeout(function () {
        if (slide.$asset[0].ended) {
          slide.$asset[0].currentTime = 0;
          slide.$asset[0].load();
        }
      }, 2000);
      digest();
    };
    slide.$asset.on('abort', stop);
    slide.$asset.on('error', stop);
    slide.$asset.on('ended', stop);
    slide.$asset[0].play();
  } else if (slide.assetType === 'youtube') {
    var done = function(e) {
      // remove this handler
      e.target.removeEventListener(e.type, arguments.callee);
      digest();
    };
    slide.$asset[0].contentWindow.addEventListener('ended', done);
    slide.$asset[0].contentWindow.addEventListener('error', done);

    if (slide.$asset[0].contentWindow.playerReady) {
      slide.$asset[0].contentWindow.player.playVideo();
    } else {
      setTimeout(digest, 500);
    }
  } else {
    setTimeout(digest, (parseFloat(scala.app.config.duration) || 1) * 1000);
  }
}
