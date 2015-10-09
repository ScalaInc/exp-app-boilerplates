function getScale () {
  var w = window.innerWidth;
  var p = 5000;
  return 1 - w / (2 * p);
}


window.transitions.cube = {};
window.transitions.cube.configure = function (options) {
  var duration = (options.duration || 2000) / 1000;
  $('#viewport')
    .css('background', 'white')
    .css('perspective', '5000px');

  $('#slideshow')
    .css('transform', 'rotateY(0deg) scale(' + getScale() + ')')
    .css('transform-style', 'preserve-3d');

  $('.slide')
    .css('visibility', 'hidden');

  $.keyframe.debug = true;
  
  window.transitions.cube.execute = function (payload) {
    $.keyframe.define([{
      name: 'cube',
      '0%': { transform:  'scale(' + getScale() + ') rotateY(0deg)' },
      '20%': { transform:  'scale(.5) rotateY(0deg)' },
      '80%': { transform:  'scale(.5) rotateY(-90deg)' },
      '100%': { transform:  'scale(' + getScale() + ') rotateY(-90deg)' }
    }]);


    if (payload.current === undefined) {
      $('.slide')
        .eq(payload.next)
        .css('visibility', 'visible')
        .css('transform', 'rotateY(90deg) translateX(-50%) rotateY(-90deg)');
      return;
    }
    $('#slideshow')
      .css('animation', 'cube ' + duration + 's')
      .on('animationend', function () {
        $(this)
          .off('animationend')
          .css('animation', '')
          .css('transform', 'rotateY(0deg)');

        $('.slide')
          .eq(payload.next)
          .css('transform', 'rotateY(90deg) translateX(-50%) rotateY(-90deg)');

        $('.slide')
          .eq(payload.current)
          .css('visibility', 'hidden');
        $('#slideshow').css('transform', 'scale(' + getScale() + ')');
        
      });

    $('.slide')
      .eq(payload.current)
      .css('transform', 'rotateY(90deg) translateX(-50%) rotateY(-90deg)');

    $('.slide')
      .eq(payload.next)
      .css('visibility', 'visible')
      .css('transform', 'translateX(50%) rotateY(90deg)');

  };
};
