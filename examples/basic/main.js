window.addEventListener('scala', function () {
  // scala.app.config.[name]
  document.getElementById('title').textContent = 'Hello World!';
});

setTimeout(function () {
  document.getElementById('title').textContent = 'Couldn\'t connect to EXP.';
}, 2000);
