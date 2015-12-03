'use strict';

app.factory('instagramFactory', ['$http', 'config', 'lodash', function ($http, config, lodash) {
    // define the factory to return
    var factory = {};

    factory.getInstagramFeed = function (instagramData, orientation, descriptionTextSize, aboutTextSize, urlPromise) {
        var returnFeed = {};
        returnFeed.items = [];
        var tempMedia = {};
        var item = {};

        // ------ page info ------
        return urlPromise.then(function (urls) {

            // Get instagram logo or custom logo if no logo is found default to the instagram logo
            if (urls[0]) {
                returnFeed.logo = {
                    'background-image': 'url(' + urls[0] + ')',
                    'background-size': 'cover',
                    'background-repeat': 'no-repeat',
                    'background-position': 'center'
                };
            } else if (instagramData.profile.imageUrl) {
                returnFeed.logo = {
                    'background-image': 'url(' + instagramData.profile.imageUrl + ')',
                    'background-size': 'cover',
                    'background-repeat': 'no-repeat',
                    'background-position': 'center'
                };
            } else {
                returnFeed.logo = {
                    'background-image': 'url(app/assets/instagram/instagram_logo2.svg)',
                    'background-size': 'cover',
                    'background-repeat': 'no-repeat',
                    'background-position': 'center'
                };
            }

            // setting cover image, if no image is found from user and instagram default to the instagram banner
            if (urls[1] && orientation === 'landscape') {
                returnFeed.cover = {
                    'background-image': 'url(' + urls[1] + ')',
                    'background-size': 'cover',
                    'background-position': 'center',
                    'background-repeat': 'no-repeat'
                };
                returnFeed.hasCover = true;
            } else if (urls[2] && orientation === 'portrait') {
                returnFeed.cover = {
                    'background-image': 'url(' + urls[2] + ')',
                    'background-size': 'cover',
                    'background-position': 'center',
                    'background-repeat': 'no-repeat'
                };
                returnFeed.page.hasCover = true;
            } else {
                returnFeed.cover = {
                    'background-image': 'url(app/assets/instagram/instagram_cover.svg)',
                    'background-size': 'cover',
                    'background-position': 'center',
                    'background-repeat': 'no-repeat'
                };
                returnFeed.hasCover = false;
            }

            // general feed info
            returnFeed.logoOverlay = 'app/assets/instagram/instagram_logo.svg';
            returnFeed.value1Icon = {'background-image': 'url(app/assets/instagram/instagram_media.svg)'};
            returnFeed.value1Text = 'Media';
            returnFeed.value1 = instagramData.profile.posts;
            returnFeed.value2Icon = {'background-image': 'url(app/assets/instagram/instagram_followers.svg)'};
            returnFeed.value2Text = 'Followers';
            returnFeed.value2 = instagramData.profile.followers;
            returnFeed.search = instagramData.search;
            returnFeed.name = instagramData.profile.name;
            returnFeed.description = formatText(instagramData.profile.description, aboutTextSize);

            // check for post items
            if (instagramData.items) {

                // loop through items
                lodash.forEach(instagramData.items, function (post_item) {

                    // include items with text search value set in the config file
                    if (lodash.contains(post_item.text, lodash.get(config, 'include_item_text_search', '')) || ( lodash.get(config, 'include_item_text_search', '') === '')) {

                        // creating list of post items
                        item = {};
                        item.mediaItems = [];

                        // adding general post information
                        item.creationDate = post_item.date;
                        item.dateFormat = config.date_format;
                        item.text = formatText(post_item.text, descriptionTextSize);
                        item.fullText = post_item.text;
                        item.value1Icon = {'background-image': 'url(app/assets/instagram/instagram_like.svg)'};
                        item.value1 = post_item.likes + ' likes';
                        item.value2Icon = {'background-image': 'url(app/assets/instagram/instagram_comments.svg)'};
                        item.value2 = post_item.comments + ' comments';
                        item.value3Icon = {'background-image': 'url(app/assets/instagram/instagram_followers.svg)'};
                        item.value3 = instagramData.profile.name;
                        item.rowspan = 1;
                        item.textBackground = {'background-color': 'WhiteSmoke'};
                        item.providerLogo = {
                            'background-image': 'url(app/assets/instagram/instagram_logo2.svg)',
                            'background-size': 'cover',
                            'background-position': 'center',
                            'background-repeat': 'no-repeat'
                        };

                        // adding media item from post
                        if (post_item.images && post_item.images.length > 0) {
                            item.imageFound = true;
                            lodash.forEach(post_item.images, function (mediaItem) {
                                tempMedia = {};
                                tempMedia.style = {
                                    'background-image': 'url(' + post_item.images[0].url + ')',
                                    'background-size': 'cover',
                                    'background-position': 'center',
                                    'background-repeat': 'no-repeat'
                                };
                                tempMedia.type = 'image';
                                item.mediaItems.push(tempMedia);
                            });
                        }

                        // Adding item to feed list
                        // TODO support videos
                        returnFeed.items.push(item);
                    }

                });
            }

            // return instagram feed
            return returnFeed;
        });

    };


    // max text allowed per post item, if text is to long add .... at the end
    var formatText = function (itemText, maxLength) {
        var returnText = '';

        // check if there is text in the post
        if (typeof itemText !== 'undefined') {

            // if text is to long reformat it with .... at the end
            if (itemText.length > maxLength) {
                returnText = itemText.substr(0, maxLength - 4) + '....';
            } else {
                returnText = itemText;
            }

        }

        // return text
        return returnText;
    };

    return factory;
}]);
