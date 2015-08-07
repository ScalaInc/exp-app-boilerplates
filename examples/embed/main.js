(function () {
    window.addEventListener('scala', function () {
	window.document.getElementById('embed').setAttribute('src', scala.app.config.src);
    });
}());
