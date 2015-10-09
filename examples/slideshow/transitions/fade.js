window.transitions.fade = {};
window.transitions.fade.configure = function (options) {
  var duration = (options.duration || 1000) / 1000;
  $('.slide').css('opacity', 0);
  window.transitions.fade.execute = function (payload) {
    $('.slide')
      .css('transition', 'opacity ' + duration + 's');
    $('.slide')
      .eq(payload.current)
      .css('opacity', 0);
    $('.slide')
      .eq(payload.next)
      .css('opacity', 1);
  };
};
