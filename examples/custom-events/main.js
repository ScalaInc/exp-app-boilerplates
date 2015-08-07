window.addEventListener('scala', function () {
  setInterval(function () {
    scala.channels.organization.broadcast({ name: 'hey!' });
  }, 10000);
  scala.channels.organization.listen({ name: 'hey!' }, function () {
    console.log('Another player said hey!');
  });
});
