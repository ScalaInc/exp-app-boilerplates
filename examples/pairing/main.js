(function () {
  window.addEventListener('scala', function () {
    var element = window.document.getElementById('code');    
    element.textContent = window.scala.app.config.code.slice(0, 3) + '-' + window.scala.app.config.code.slice(3, 6);
    setTimeout(function () {
      // Hack      
      window.parent.location.reload(true); // Peace out dudes.
    }, 5 * 60 * 1000);
    
  });
}());
