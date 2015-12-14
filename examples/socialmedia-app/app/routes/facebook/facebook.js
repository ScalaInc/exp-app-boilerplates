'use strict';

window.app.controller('facebookController', function ($scope, config) {
  $scope.data = { items: [] }; 
  var $grid = $('.grid').masonry({
    itemSelector: '.grid-item',
    columnWidth: '.grid-sizer'
  });
  var path = config.feed_configuration.path;
  var uuid = config.feed_configuration.uuid;
  var url = ['/', path, uuid, 'data'].join('/');
  exp.api.get(url).then(function (data) {
    $('<div>')
      .addClass('grid-item')
      .append(
        $('<img>')
          .attr('src', data.details.imageUrl)
      ).appendTo($grid);
    data.items.forEach(function (item) {
      if (item.text.length > 140) {
        item.text = item.text.slice(0, 140) + '...';
      }
      $('<div>')
        .addClass('grid-item')
        .addClass('vin')
        .append(
          $('<img>')
            .attr('src', item.images[0].url)
        )
        .append(
          $('<div>')
            .addClass('text')
            .text(moment(item.date).fromNow() + ': ' + item.text)
        )
        .appendTo($grid);
    });
    $grid.masonry('reloadItems');
    $grid.imagesLoaded().progress(function () {
      $grid.masonry('layout');
    });

  });



});
