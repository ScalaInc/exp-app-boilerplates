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
      self.isReady = false;
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

var slides = [];

window.addEventListener('load', function () {
  document.getElementById('loading').style.display = 'block';
  document.getElementById('viewport').style.display = 'none';
});

var transition;


window.addEventListener('scala', function () {
  setTimeout(function () {
    // Create a slide for each asset.
    scala.app.config.assets.split(',').forEach(function (src) {
      var slide = new Slide(src);
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
    
    // Start the slideshow.
    digest();
  });

});



var current;
var next;
function digest () {
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
    slide.$asset[0].play();
    slide.$asset.on('ended', function () {
      slide.$asset.off('ended');
      setTimeout(function () {
        if (slide.$asset[0].ended) {
          slide.$asset[0].currentTime = 0;          
          slide.$asset[0].load();
        }
      }, 2000);
      digest();
    });    
  } else {;
    setTimeout(digest, (parseFloat(scala.app.config.duration) || 1) * 1000);
  }
}
