'use strict';

app.factory('facebookFactory', ['$http', 'config', 'lodash',
  function ($http, config, lodash) {
    // define the factory to return
    var factory = {};

    factory.getFacebookFeed = function (facebookData, orientation, descriptionTextSize, aboutTextSize) {
      var returnFeed = {};
      returnFeed.items = [];
      var tempMedia = {};
      var item = {};
      // ------ page info ------

      // Get facebook logo or custom logo if no logo is found default to the facebook logo
      if (config.hasOwnProperty('page_logo')) {
        returnFeed.logo = {
          'background-image': 'url(' + config.page_logo + ')',
          'background-size': 'cover',
          'background-repeat': 'no-repeat',
          'background-position': 'center'
        };
      } else if (facebookData.page.hasOwnProperty('logo')) {
        returnFeed.logo = {
          'background-image': 'url(' + facebookData.page.logo + ')',
          'background-size': 'cover',
          'background-repeat': 'no-repeat',
          'background-position': 'center'
        };
      } else {
        returnFeed.logo = {
          'background-image': 'url(app/assets/' + facebookData.search.source + '/facebook_logo2.svg)',
          'background-size': 'cover',
          'background-repeat': 'no-repeat',
          'background-position': 'center'
        };
      }

      // setting cover image, if no image is found from user and facebook default to the facebook banner
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
      } else if ((facebookData.page.hasOwnProperty('cover')) && (orientation === 'portrait')) {
        returnFeed.cover = {
          'background-image': 'url(' + facebookData.page.cover + ')',
          'background-size': 'cover',
          'background-position': 'center',
          'background-repeat': 'no-repeat'
        };
        returnFeed.hasCover = true;
      } else {
        returnFeed.cover = {
          'background-image': 'url(app/assets/' + facebookData.search.source + '/facebook_cover.svg)',
          'background-size': 'cover',
          'background-position': 'center',
          'background-repeat': 'no-repeat'
        };
        returnFeed.hasCover = false;
      }
	  
	  console.log(config.cover_image_landscape);
      
	  // general feed info
      returnFeed.logoOverlay = {
        'background-image': 'url(app/assets/' + facebookData.search.source + '/facebook_logo.svg)',
        'background-size': 'cover',
        'background-position': 'center',
        'background-repeat': 'no-repeat'
      };
      returnFeed.value1Icon = {'background-image': 'url(app/assets/' + facebookData.search.source + '/facebook_like.svg)'};
      returnFeed.value1Text = 'Likes';
      returnFeed.value1 = facebookData.page.likes;
      returnFeed.value2Icon = {'background-image': 'url(app/assets/' + facebookData.search.source + '/facebook_checkins.svg)'};
      returnFeed.value2Text = 'Check-ins';
      returnFeed.value2 = facebookData.page.checkins;
      returnFeed.search = facebookData.search;
      returnFeed.name = facebookData.page.about;
      returnFeed.description = formatText(facebookData.page.description, aboutTextSize);

      // check for post items
      if (facebookData.hasOwnProperty('post_items')) {

        // loop through items
        lodash.forEach(facebookData.post_items, function (post_item) {

          // include items with text search value set in the config file
          if (lodash.contains(post_item.text, lodash.get(config, 'include_item_text_search', '')) || ( lodash.get(config, 'include_item_text_search', '') === '')) {

            // creating list of post items
            item = {};
            item.mediaItems = [];

            // adding general post information
            item.creationDate = post_item.creation_date;
            item.dateFormat = config.date_format;
			item.text = formatText(post_item.text, descriptionTextSize);
			item.fullText = post_item.text;
            item.value1Icon = {'background-image': 'url(app/assets/' + facebookData.search.source + '/facebook_like.svg)'};
            item.value1 = post_item.likes + ' likes';
            item.value2Icon = {'background-image': 'url(app/assets/' + facebookData.search.source + '/facebook_share.svg)'};
            item.value2 = post_item.shares + ' shares';
            item.value3Icon = {'background-image': 'url(app/assets/' + facebookData.search.source + '/facebook_comments.svg)'};
            item.value3 = post_item.comments.length.toString() + ' comments';
            item.rowpan = 1;
			item.textBackground = {'background-color': 'WhiteSmoke'};
			item.providerLogo = {'background-image': 'url(app/assets/' + facebookData.search.source + '/facebook_logo2.svg)','background-size': 'cover','background-position': 'center','background-repeat': 'no-repeat'};
			
			// adding media items from post
            if (post_item.media.length > 0) {
			  item.imageFound = true;
              lodash.forEach(post_item.media, function (mediaItem) {
                tempMedia = {};
                tempMedia.style = {
                  'background-image': 'url(' + mediaItem.url + ')',
                  'background-size': 'cover',
                  'background-position': 'center',
                  'background-repeat': 'no-repeat'
                };
                tempMedia.type = mediaItem.type;
                item.mediaItems.push(tempMedia);
              });
            } else { // adding page logo if no media exits
              item.imageFound = false;
              tempMedia = {};
              tempMedia.style = {
                'background-image': 'url(app/assets/' + facebookData.search.source + '/facebook_logo2.svg)',
                'background-size': 'cover',
                'background-position': 'center',
                'background-repeat': 'no-repeat'
              };
              tempMedia.type = 'photo';
              item.mediaItems.push(tempMedia);
            }

            // Adding item to feed list
            returnFeed.items.push(item);
          }

        });
      }

      // return facebook feed
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
