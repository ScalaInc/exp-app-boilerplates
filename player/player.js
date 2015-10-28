function MockPlayer(url, config) {
  // load iframe
  var iframe = window.document.createElement('iframe');
  iframe.style.border = 'none';
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.opacity = 1;
  iframe.style.visibility = 'visible';
  iframe.setAttribute('src', url);
  iframe.onload = function() {
    var runtime = new exp.utilities.EventNode();

    iframe.contentWindow.scala = exp;
    iframe.contentWindow.scala.app = {
      config: config,
      runtime: runtime
    };

    iframe.contentWindow.dispatchEvent(new iframe.contentWindow.Event('scala'));

    runtime.trigger('load');
    setTimeout(function() {
      runtime.trigger('play');
    }, 3000);
  };

  this.iframe = iframe;

  document.getElementById('experience').appendChild(iframe);
}
