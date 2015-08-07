(function () {
  window.addEventListener('scala', function () {
    var element = window.document.getElementById('code');    
    element.textContent = window.scala.app.config.code.slice(0, 3) + '-' + window.scala.app.config.code.slice(3, 6);
  });
}());
