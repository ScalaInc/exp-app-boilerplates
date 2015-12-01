'use strict';

app.controller('dataController', ['$scope', '$mdMedia', '$interval', 'feedFactory', 'facebookFactory', 'twitterFactory', 'instagramFactory', '$location', 'config', 'lodash', '$q', function ($scope, $mdMedia, $interval, feedFactory, facebookFactory, twitterFactory, instagramFactory, $location, config, lodash, $q) {

    // scope variables
    $scope.dataFeed = {};
    $scope.currentDate = new Date();
    $scope.postItems = [];
    $scope.sideBarIcon1 = {};
    $scope.sideBarIcon2 = {};
    $scope.hideSideBar = false;
    $scope.maxWindow = {};
    $scope.tileSize = config.tile_size;

    // local variables
    var currentIndex = 0;
    var intervalPromise;
    var descriptionTextSize = 0;
    var aboutTextSize = 0;

    // const variables
    const LANDSCAPE = 'landscape';
    const PORTRAIT = 'portrait';
    const FACEBOOK = 'facebook';
    const TWITTER = 'twitter';
    const INSTAGRAM = 'instagram';

    // check to hide bars
    if (config.side_bars === 'true') {
        $scope.maxWindow = {
            'width': '100%',
            'height': '100%'
        };
        $scope.hideSideBar = true;
    } else {
        $scope.maxWindow = {};
        $scope.hideSideBar = false;
    }


    // set the effect
    if (lodash.get(config, 'effect', ' ') === 'fade') {
        $scope.effect = 'postGridTileFormatFade';
    } else if (lodash.get(config, 'effect', ' ') === 'bounce') {
        $scope.effect = 'postGridTileFormatBounce';
    } else if (lodash.get(config, 'effect', ' ') === 'rotate') {
        $scope.effect = 'postGridTileFormatRotate';
    } else if (lodash.get(config, 'effect', ' ') === 'zoom') {
        $scope.effect = 'postGridTileFormatZoom';
    } else if (lodash.get(config, 'effect', ' ') === 'flip') {
        $scope.effect = 'postGridTileFormatFlip';
    } else {
        $scope.effect = 'postGridTileFormatFade';
    }

    // watching for landscape
    $scope.$watch(function () {
        return $mdMedia('(orientation: landscape)');
    }, function (value) {
        if (value) {

            // check for side bar settings
            if ($scope.hideSideBar) {

                // check for tile size settings
                if ($scope.tileSize === 'big') {

                    descriptionTextSize = 400;
                    $scope.start(1, LANDSCAPE);
                    $scope.gridRowHeight = '100%';
                    $scope.gridColumns = 1;

                }
                if ($scope.tileSize === 'normal') {

                    descriptionTextSize = 140;
                    $scope.start(8, LANDSCAPE);
                    $scope.gridRowHeight = '24%';
                    $scope.gridColumns = 2;

                }
                if ($scope.tileSize === 'small') {

                    descriptionTextSize = 55;
                    $scope.start(18, LANDSCAPE);
                    $scope.gridRowHeight = '32%';
                    $scope.gridColumns = 6;

                }

            } else {

                // check for tile size settings
                if ($scope.tileSize === 'big') {

                    descriptionTextSize = 400;
                    $scope.start(1, LANDSCAPE);
                    $scope.gridRowHeight = '100%';
                    $scope.gridColumns = 1;

                }
                if ($scope.tileSize === 'normal') {

                    descriptionTextSize = 240;
                    $scope.start(6, LANDSCAPE);
                    $scope.gridRowHeight = '32%';
                    $scope.gridColumns = 2;

                }
                if ($scope.tileSize === 'small') {

                    descriptionTextSize = 30;
                    $scope.start(18, LANDSCAPE);
                    $scope.gridRowHeight = '32%';
                    $scope.gridColumns = 6;

                }

            }

            // general landscape settings
            $scope.htmlOrientationStyle = LANDSCAPE;
            aboutTextSize = 300;
            $scope.screenOrientation = 'row';
            $scope.flexOrderPageinfo = 1;
            $scope.flexOrderPagePosts = 2;
            $scope.PageInfoLayout = 'column';
            $scope.PageInfoValuesLayout = 'column';

        }

    });

    // watching for portrait
    $scope.$watch(function () {
        return $mdMedia('(orientation: portrait)');
    }, function (value) {
        if (value) {

            // starting the interval loop
            if ($scope.hideSideBar) {

                // check for tile size settings
                if ($scope.tileSize === 'big') {

                    descriptionTextSize = 200;
                    $scope.start(1, PORTRAIT);
                    $scope.gridRowHeight = '100%';
                    $scope.gridColumns = 1;

                }
                if ($scope.tileSize === 'normal') {

                    descriptionTextSize = 140;
                    $scope.start(6, PORTRAIT);
                    $scope.gridRowHeight = '15%';
                    $scope.gridColumns = 1;

                }
                if ($scope.tileSize === 'small') {

                    descriptionTextSize = 30;
                    $scope.start(12, PORTRAIT);
                    $scope.gridRowHeight = '24%';
                    $scope.gridColumns = 3;

                }

            } else {

                // check for tile size settings
                if ($scope.tileSize === 'big') {

                    descriptionTextSize = 150;
                    $scope.start(1, PORTRAIT);
                    $scope.gridRowHeight = '100%';
                    $scope.gridColumns = 1;

                }
                if ($scope.tileSize === 'normal') {

                    descriptionTextSize = 120;
                    $scope.start(4, PORTRAIT);
                    $scope.gridRowHeight = '23%';
                    $scope.gridColumns = 1;

                }
                if ($scope.tileSize === 'small') {

                    descriptionTextSize = 35;
                    $scope.start(9, PORTRAIT);
                    $scope.gridRowHeight = '32%';
                    $scope.gridColumns = 3;

                }

            }

            // general portrait settings
            aboutTextSize = 150;
            $scope.htmlOrientationStyle = PORTRAIT;
            $scope.screenOrientation = 'column';
            $scope.flexOrderPageinfo = 2;
            $scope.flexOrderPagePosts = 1;
            $scope.PageInfoLayout = 'row';
            $scope.PageInfoValuesLayout = 'row';

        }
    });

    // get facebook data from factory
    var callData = function (orientation) {
        return feedFactory.getScalaSocialMediaFeed()
            .then(function (result) {
                if (typeof result !== 'undefined') {

                    // select the format of the data feed
                    if (result.search.source === FACEBOOK) {
                        return facebookFactory.getFacebookFeed(result, orientation, descriptionTextSize, aboutTextSize, getUrlList());
                    } else if (result.search.source === TWITTER) {
                        return twitterFactory.getTwitterFeed(result, orientation, descriptionTextSize, aboutTextSize, getUrlList());
                    } else if (result.search.source === INSTAGRAM) {
                        return instagramFactory.getInstagramFeed(result, orientation, descriptionTextSize, aboutTextSize, getUrlList());
                    }

                } else {
                    throw new Error('no data received');
                }
            });
    };

    var getUrlList = function () {
        var deferred = $q.defer();

        var promiseList = [getImageUrl('page_logo'), getImageUrl('cover_image_landscape'), getImageUrl('cover_image_portrait')];
        $q.all(promiseList).then(function (values) {
            deferred.resolve(values);
        });

        return deferred.promise;
    }

    var getImageUrl = function (fieldName) {
        var deferred = $q.defer();

        if (config.hasOwnProperty(fieldName)) {

            if (config[fieldName].length > 0) {

                scala.api.getContentNode(config[fieldName].uuid)
                    .then(function (node) {
                        var tempUrl = node.getUrl();

                        if (tempUrl !== null) {
                            deferred.resolve(tempUrl);
                        } else {
                            deferred.resolve('');
                        }

                    });

            } else {
                deferred.resolve('');
            }

        } else {
            deferred.resolve('');
        }

        return deferred.promise;
    };

    // get list of orientationIndex items from the current index to fill the html grid
    var generateTempPostList = function (maxIndex, feed, maxItems, orientation, p1, p2) {
        var max = 0;
        var counter = 0;
        var rowIndex = 0;
        var maxValue = 0;
        var maxValueIndex = 0;
        var tempStore = 0;
        var postItems = [];

        // check current index. If end of array reset current index to 0
        if (currentIndex + maxIndex < maxItems) {
            max = currentIndex + maxIndex;
        } else {
            max = maxItems;
        }

        // loop through feed from current index
        for (var index = currentIndex; index < max; index++) {

            // add item
            var item = feed.items[index];
            item.imagePosition = p1;
            item.textPosition = p2;

            // set the row span of the tile.
            item.rowspan = 1;

            // switch the values around so the image and text position is different on each post when in portrait
            if (orientation === 'portrait') {
                tempStore = p1;
                p1 = p2;
                p2 = tempStore;
            }

            // find the max value1
            if (parseInt(feed.items[index].value1, 10) > maxValue) {
                maxValue = parseInt(feed.items[index].value1, 10);
                maxValueIndex = counter;
            }

            // pushing items in array
            postItems.push(item);
            rowIndex = index;
            counter++;

        }

        // add list to orientationIndex items if necessary
        var completeArray = completeList(rowIndex, maxIndex, postItems, p1, p2, tempStore, orientation);
        rowIndex = completeArray[1];
        postItems = completeArray[0];

        // apply row span 2 to tile with most likes
        postItems[maxValueIndex].rowspan = 2;

        // set the current index for the next run
        currentIndex = getIndex(rowIndex, maxItems);

        var returnList = [postItems, p1, p2];

        // return the new post items list
        return returnList;
    };

    // fill up list to orientationIndex empty elements if necessary
    var completeList = function (rowIndex, maxIndex, postItems, p1, p2, tempStore, orientation) {
        var ListLength = postItems.length;

        if (ListLength < maxIndex) {

            for (var index = 0; index < maxIndex - ListLength; index++) {

                // create empty item
                var item = {};
                item.creation_date = '';
                item.commentsCount = '0 comments';
                item.date_format = '';
                item.text = '';
                item.caption = '';
                item.likes = '0 likes';
                item.rowspan = 1;
                item.media = [];
                item.shares = '0 shares';
                item.imagePosition = p1;
                item.textPosition = p2;

                // add item
                postItems.push(item);
                rowIndex++;

                // switch the values around so the image and text position is different on each post when in portrait
                if (orientation === 'portrait') {
                    tempStore = p1;
                    p1 = p2;
                    p2 = tempStore;
                }

            }

        }

        // return rowIndex
        return [postItems, rowIndex];
    };

    // get the current index for the next run
    var getIndex = function (rowIndex, maxItems) {

        if (rowIndex >= maxItems - 1) {
            return 0;
        } else {
            return rowIndex + 1;
        }

    };

    // starting the interval loop getting data and showing it
    $scope.start = function (orientationIndex, orientation) {

        // stop any loop that is already running
        $scope.stop();

        // run initial data fetch and then do a automated polling every X seconds
        callData(orientation).then(function (data) {
                var p1 = 2;
                var p2 = 1;
                var ListObject = [];

                // apply the data
                $scope.dataFeed = data;

                // get next five post items
                ListObject = generateTempPostList(orientationIndex, $scope.dataFeed, $scope.dataFeed.items.length, orientation, p1, p2);
                $scope.postItems = ListObject[0];

                // get interval timing
                var intervalValue = parseInt(config.refresh_rate_seconds) * 1000;

                //run interval
                intervalPromise = $interval(function () {

                    // check if loop post list is finished. If yes refresh data. If no continue loop.
                    if (currentIndex === 0) {
                        callData(orientation).then(function (data) {

                            // apply the data
                            $scope.dataFeed = data;

                            // get next five post items
                            ListObject = generateTempPostList(orientationIndex, $scope.dataFeed, $scope.dataFeed.items.length, orientation, ListObject[1], ListObject[2]);
                            $scope.postItems = ListObject[0];

                        });
                    } else {

                        // get next five post items
                        ListObject = generateTempPostList(orientationIndex, $scope.dataFeed, $scope.dataFeed.items.length, orientation, ListObject[1], ListObject[2]);
                        $scope.postItems = ListObject[0];

                    }

                }, intervalValue);
            }
        );
    };

    // stops the interval
    $scope.stop = function () {

        // stop the interval
        $interval.cancel(intervalPromise);
        // reset the current index to 0
        currentIndex = 0;

    };

    // if scope is destroyed stop interval
    $scope.$on('$destroy', function () {

        // stopping interval
        $scope.stop();

    });

}]);
