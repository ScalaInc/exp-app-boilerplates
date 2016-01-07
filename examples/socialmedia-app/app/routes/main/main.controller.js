'use strict';

window.app.controller('mainController', function ($scope, $q, config) {

  var path = config.feed_configuration.path;
  var uuid = config.feed_configuration.uuid;
  var url = ['/', path, uuid, 'data'].join('/');
  var rows = parseFloat(config.numberRows) || Math.round(4 * window.innerWidth / 1920);
  var font = parseFloat(config.fontSize) || 14;
  var width = (1 / rows) * 100;
  var gutter = parseFloat(config.gutterSize) || 4;
  var $facebook = $('#facebook');
  
  var removeGrid = function(){
	// set src to empty using #  
	$('#facebook video source').attr('src', '');
	// remove the grid
	$facebook.children('.grid').remove();		
  }
  
  var refresh = function() {
	removeGrid();
	var $grid = $('<div>').addClass('grid');
    var $sizer = $('<div>').addClass('sizer');
    $sizer.css('width', width + '%');
    $sizer.appendTo($grid);

    window.exp.api.get(url).then(function (data) {
      var $wrapper = $('<div>').addClass('wrapper');
      $wrapper.css('width', width + '%');
      var $item = $('<div>').addClass('item');
      $item.css('max-width', '100%');
      $item.css('padding', gutter + 'px');
      var $image = $('<img>').attr('src', data.details.imageUrl);
      $image.appendTo($item);
      $item.appendTo($wrapper);
      $wrapper.appendTo($grid);
      data.items.forEach(function (item) {

        var $wrapper = $('<div>').addClass('wrapper');
        $wrapper.css('width', width + '%');
        var $item = $('<div>').addClass('item');
        $item.css('max-width', '100%');
        $item.css('padding', gutter + 'px');
        
	  		// check for image or video
	  		if(item.type === 'video'){
	  			if(item.hasOwnProperty('videos')){
	  				var $video = $('<video>').attr('muted','true').attr('loop','true').attr('autoplay','true');
	  				var $source = $('<source>').attr('src',item.videos[0].url).attr('type','video/mp4');
					$source.appendTo($video);
					$video.appendTo($item);
	  			}
	  		}else{
	  			if(item.hasOwnProperty('images')){
	  				var $image = $('<img>').attr('src', item.images[0].url);
	  		        $image.appendTo($item);
	  			}
	  		}

	  	$item.appendTo($wrapper);
        $wrapper.appendTo($grid);


	  });
	  
      $grid.appendTo($facebook);
      
	  $grid.masonry({
        itemSelector: '.wrapper',
        columnWidth: '.sizer'
      });
	  
	  $grid.masonry('reloadItems');
	  
	  $grid.imagesLoaded().progress(function () {
		  $grid.masonry('layout');
		  setTimeout(function(){
			  $grid.masonry('layout');
		  }, 2000);
	  });
	  
    });

  }


  setInterval(refresh, config.refresh_rate_seconds * 1000);
  refresh();

});
