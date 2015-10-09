'use strict';

app.factory('twitterFactory', ['$http', 'config', 'lodash',
  function ($http, config, lodash) {
    // define the factory to return
    var factory = {};

    factory.getTwitterFeed = function (twitterData, orientation, descriptionTextSize, aboutTextSize) {
      var returnFeed = {};
      returnFeed.items = [];
      var tempMedia = {};
      var item = {};

      // ------ page info ------

      // Get twitter logo or custom logo if no logo is found default to the twitter logo
      if (config.hasOwnProperty('page_logo')) {
        returnFeed.logo = {
          'background-image': 'url(' + config.page_logo + ')',
          'background-size': 'cover',
          'background-repeat': 'no-repeat',
          'background-position': 'center'
        };
      } else if (twitterData.profile.hasOwnProperty('profile_image')) {
        returnFeed.logo = {
          'background-image': 'url(' + twitterData.profile.profile_image + ')',
          'background-size': 'cover',
          'background-repeat': 'no-repeat',
          'background-position': 'center'
        };
      } else {
        returnFeed.logo = {
          'background-image': 'url(app/assets/' + twitterData.search.source + '/twitter_logo2.svg)',
          'background-size': 'cover',
          'background-repeat': 'no-repeat',
          'background-position': 'center'
        };
      }

      // setting cover image, if no image is found from user and twitter default to the twitter banner
      if ((config.hasOwnProperty('cover_image_landscape')) && (orientation === 'landscape')) {
        returnFeed.cover = {
          'background-image': 'url(' + config.cover_image_landscape + ')',
          'background-size': 'cover',
          'background-position': 'center',
          'background-repeat': 'no-repeat'
        };
        returnFeed.hasCover = true;
      } else if ((config.hasOwnProperty('cover_image_portrait')) && (orientation === 'portrait')) {
        returnFeed.cover = {
          'background-image': 'url(' + config.cover_image_portrait + ')',
          'background-size': 'cover',
          'background-position': 'center',
          'background-repeat': 'no-repeat'
        };
        returnFeed.page.hasCover = true;
      } else if ((twitterData.profile.hasOwnProperty('background_image')) && (orientation === 'portrait')) {
        returnFeed.cover = {
          'background-image': 'url(' + twitterData.profile.background_image + ')',
          'background-size': 'cover',
          'background-position': 'center',
          'background-repeat': 'no-repeat'
        };
        returnFeed.hasCover = true;
      } else {
        returnFeed.cover = {
          'background-image': 'url(app/assets/' + twitterData.search.source + '/twitter_cover.svg)',
          'background-size': 'cover',
          'background-position': 'center',
          'background-repeat': 'no-repeat'
        };
        returnFeed.hasCover = false;
      }

      // general feed info
      returnFeed.logoOverlay = 'app/assets/' + twitterData.search.source + '/twitter_logo.svg';
      returnFeed.value1Icon = {'background-image': 'url(app/assets/' + twitterData.search.source + '/twitter_tweets.svg)'};
      returnFeed.value1Text = 'Tweets';
      returnFeed.value1 = twitterData.profile.tweets;
      returnFeed.value2Icon = {'background-image': 'url(app/assets/' + twitterData.search.source + '/twitter_followers.svg)'};
      returnFeed.value2Text = 'Followers';
      returnFeed.value2 = twitterData.profile.followers;
      returnFeed.search = twitterData.search;
      returnFeed.name = twitterData.profile.name;
      returnFeed.description = formatText(twitterData.profile.description, aboutTextSize);

      // check for post items
      if (twitterData.hasOwnProperty('tweets')) {

        // loop through items
        lodash.forEach(twitterData.tweets, function (post_item) {

          // include items with text search value set in the config file
          if (lodash.contains(post_item.text, lodash.get(config, 'include_item_text_search', '')) || ( lodash.get(config, 'include_item_text_search', '') === '')) {

            // creating list of post items
            item = {};
            item.mediaItems = [];

            // adding general post information
            item.creationDate = post_item.date;
            item.dateFormat = config.date_format;
            item.text = formatText(post_item.text, descriptionTextSize);
            item.value1Icon = {'background-image': 'url(app/assets/' + twitterData.search.source + '/twitter_tweets.svg)'};
            item.value1 = post_item.retweets + ' retweets';
            item.value2Icon = {'background-image': 'url(app/assets/' + twitterData.search.source + '/twitter_favorites.svg)'};
            item.value2 = post_item.favorites + ' favorites';
            item.value3Icon = {'background-image': 'url(app/assets/' + twitterData.search.source + '/twitter_followers.svg)'};
            item.value3 = twitterData.profile.name;
            item.rowspan = 1;

            // adding media items from post
            if (post_item.hasOwnProperty('media')) {
              lodash.forEach(post_item.media, function (mediaItem) {
                tempMedia = {};
                tempMedia.style = {
                  'background-image': 'url(' + mediaItem.media_url_https + ')',
                  'background-size': 'cover',
                  'background-position': 'center',
                  'background-repeat': 'no-repeat'
                };
                tempMedia.type = mediaItem.type;
                item.mediaItems.push(tempMedia);
              });
            } else { // adding page logo if no media exits
              tempMedia = {};
              tempMedia.style = {
                'background-image': 'url(app/assets/' + twitterData.search.source + '/twitter_logo2.svg)',
                'background-size': 'cover',
                'background-position': 'center',
                'background-repeat': 'no-repeat'
              };
              tempMedia.type = 'image';
              item.mediaItems.push(tempMedia);
            }

            // Adding item to feed list
            returnFeed.items.push(item);
          }

        });
      }

      // return twitter feed
      return returnFeed;
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
  }
]);

