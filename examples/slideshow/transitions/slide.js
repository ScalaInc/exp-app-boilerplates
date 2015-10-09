window.transitions.slide = {};
window.transitions.slide.configure = function (options) {
  var duration = (options.duration || 1000) / 1000;
  $('.slide')
    .css('transform', 'translateX(-100%)')
    .on('animationend', function (event) {
      if (event.originalEvent.animationName === 'slide-in') {
        $(this)
          .css('animation', '')
          .css('transform', 'translateX(0%)');
        
      } else {
        $(this)
          .css('animation', '')
          .css('transform', 'translateX(-100%)');
      }
    });
  window.transitions.slide.execute = function (payload) {
    if (payload.current === undefined) {
      $('.slide')
        .eq(payload.next)
        .css('transform', 'translateX(0%)');
      return;
    }
    $('.slide')
      .eq(payload.current)
      .css('animation', 'slide-out ' + duration + 's');
    $('.slide')
      .eq(payload.next)
      .css('animation', 'slide-in ' + duration + 's');
  };
};
