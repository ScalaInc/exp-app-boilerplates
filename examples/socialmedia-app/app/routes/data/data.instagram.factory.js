'use strict';

app.factory('instagramFactory', ['$http', 'config', 'lodash',
  function ($http, config, lodash) {
    // define the factory to return
    var factory = {};

    factory.getInstagramFeed = function (instagramData, orientation, descriptionTextSize, aboutTextSize) {
      var returnFeed = {};
      returnFeed.items = [];
      var tempMedia = {};
      var item = {};

      // ------ page info ------

      // Get instagram logo or custom logo if no logo is found default to the instagram logo
      if (config.hasOwnProperty('page_logo')) {
        returnFeed.logo = {
          'background-image': 'url(' + config.page_logo + ')',
          'background-size': 'cover',
          'background-repeat': 'no-repeat',
          'background-position': 'center'
        };
      } else if (instagramData.profile.hasOwnProperty('profile_image')) {
        returnFeed.logo = {
          'background-image': 'url(' + instagramData.profile.profile_image + ')',
          'background-size': 'cover',
          'background-repeat': 'no-repeat',
          'background-position': 'center'
        };
      } else {
        returnFeed.logo = {
          'background-image': 'url(app/assets/' + instagramData.search.source + '/instagram_logo2.svg)',
          'background-size': 'cover',
          'background-repeat': 'no-repeat',
          'background-position': 'center'
        };
      }

      // setting cover image, if no image is found from user and instagram default to the instagram banner
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
      } else {
        returnFeed.cover = {
          'background-image': 'url(app/assets/' + instagramData.search.source + '/instagram_cover.svg)',
          'background-size': 'cover',
          'background-position': 'center',
          'background-repeat': 'no-repeat'
        };
        returnFeed.hasCover = false;
      }

      // general feed info
      returnFeed.logoOverlay = 'app/assets/' + instagramData.search.source + '/instagram_logo.svg';
      returnFeed.value1Icon = {'background-image': 'url(app/assets/' + instagramData.search.source + '/instagram_media.svg)'};
      returnFeed.value1Text = 'Media';
      returnFeed.value1 = instagramData.profile.media;
      returnFeed.value2Icon = {'background-image': 'url(app/assets/' + instagramData.search.source + '/instagram_followers.svg)'};
      returnFeed.value2Text = 'Followed';
      returnFeed.value2 = instagramData.profile.followed;
      returnFeed.search = instagramData.search;
      returnFeed.name = instagramData.profile.name;
      returnFeed.description = formatText(instagramData.profile.bio, aboutTextSize);

      // check for post items
      if (instagramData.hasOwnProperty('post')) {

        // loop through items
        lodash.forEach(instagramData.post, function (post_item) {

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
            item.value1Icon = {'background-image': 'url(app/assets/' + instagramData.search.source + '/instagram_like.svg)'};
            item.value1 = post_item.likes + ' likes';
            item.value2Icon = {'background-image': 'url(app/assets/' + instagramData.search.source + '/instagram_comments.svg)'};
            item.value2 = post_item.comments + ' comments';
            item.value3Icon = {'background-image': 'url(app/assets/' + instagramData.search.source + '/instagram_followers.svg)'};
            item.value3 = instagramData.profile.name;
            item.rowspan = 1;
			item.textBackground = {'background-color': 'WhiteSmoke'};
			item.providerLogo = {'background-image': 'url(app/assets/' + instagramData.search.source + '/instagram_logo2.svg)','background-size': 'cover','background-position': 'center','background-repeat': 'no-repeat'};
			

            // adding media item from post
			tempMedia = {};
			item.imageFound = true;
            tempMedia.style = {
              'background-image': 'url(' + post_item.image_url_standard + ')',
              'background-size': 'cover',
              'background-position': 'center',
              'background-repeat': 'no-repeat'
            };
			tempMedia.type = post_item.type;
            
			item.mediaItems.push(tempMedia);

            // Adding item to feed list
            returnFeed.items.push(item);
          }

        });
      }

      // return instagram feed
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


