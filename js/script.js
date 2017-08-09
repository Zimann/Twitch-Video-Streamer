$(window).load(function() {

    //cache DOM elements
    var bars = $('.fa-bars');
    var offCanvasElement = $('.off-canvas-element');
    var option = $('.option');
    var onlineOption = $('.online-option-on');
    var offlineOption = $('.online-option-off');
    var channel = $('.channel');
    var textOption = $('.option-text');
    var optionALl = $('.online-option-all');
    var asideOptions = $('.aside-option');
    var channelLink = $('.channel-link');
    var channelDescription = $('.channel-description');
    var profilePicture = $('.profile-pic');
    //client ID provided by the Twitch TV API
    var twitchClientId = '4b1qtlwr2kbaf6yzqw08ma7vcbnsl0';
    var url = 'https://api.twitch.tv/kraken/streams/';
    var tvUrl = 'https://www.twitch.tv/';
    //array with a set of streamers which will be used when sending the GET request
    var streamersArray = ['ESL_SC2', 'OgamingSC2', 'storbeck'];
    var pictureLogo;
    var channelStatus;

    //array in which we store the separate responses for every request
    var responseArray = [];

    //variables to use while manipulating the channel title
    var completeLink;
    var splittedLink;

    //loop over the "streamersArray" to perform requests per array entry
    for (var i = 0, len = streamersArray.length; i < len; i++) {
        $.ajax({
            url: url + streamersArray[i],
            type: "GET",
            dataType: 'json',
            //extra parameter requested by the Twitch TV API for the content to be retrieved
            headers: {
                'Client-ID': twitchClientId
            },
            success: function(data) {
                //push the separate retrieved data into a different array to work with it
                responseArray.push(data);

                //set a condition to execute our main code when the array has been filled to equal the "streamersArray" length
                if (responseArray.length === streamersArray.length) {

                    responseArray.forEach(function(element, index) {

                        completeLink = element._links.self;
                        //split the string into an array, separating the base URL from the username of the streamer
                        splittedLink = completeLink.split(url);
                        //fill the channel title html with the last element in the splitted string (the username of the streamer)
                        channelLink.eq(index).html(splittedLink[1]);
                        channelLink.eq(index).attr('href', tvUrl + splittedLink[1]);
                        if ('stream' in responseArray) {
                            console.log('stream');
                        }
                        //toggle classes based on the "stream" property of the retrieved objects
                        if (element.stream === null) {
                            channel.eq(index).toggleClass('offline-class');
                            //load a sample profile picture in case the object's stream property is "null"
                            $('.profile-pic').eq(index).attr('src', 'https://mobileimages.lowes.com/product/converted/035777/035777292891sm.jpg');
                            $('.channel-description').eq(index).html('offline');

                            //handle the rest of the objects that have stream property that is not "null"
                        } else {
                            pictureLogo = element.stream.channel.logo;
                            channelStatus = element.stream.channel.status;
                            console.log(element.stream.channel.status);
                            channel.eq(index).toggleClass('online-class');
                            profilePicture.eq(index).attr('src', pictureLogo);
                            channelDescription.eq(index).html(channelStatus);
                        }
                    });
                }
            }
        });
    }

    //general purpose function to use to easily swtich between two classes
    function classChanger(firstClass, secondClass, addedClass) {
        firstClass.addClass(addedClass);
        secondClass.removeClass(addedClass);
    }

    function iconSwitcher(item, classToRemove, classToAdd) {
        item.toggleClass(classToRemove);
        item.toggleClass(classToAdd);
    }


    //switching classes to display and hide elements accordingly
    onlineOption.click(function() {
        classChanger($('.offline-class'), $('.online-class'), 'hide-element');
    });


    offlineOption.click(function() {
        classChanger($('.online-class'), $('.offline-class'), 'hide-element');
    });


    optionALl.click(function() {
        $('.online-class').removeClass('hide-element');
        $('.offline-class').removeClass('hide-element');
    });

    asideOptions.click(function() {
        iconSwitcher(bars, 'fa-bars', 'fa-times');
        offCanvasElement.toggleClass('off-canvas-bringer');
    });


    // function to use for changing the width of the upper-right category boxes when hovering over them
    function widthChange(optionBox, optionText) {
        optionBox.hover(function() {
            optionBox.css('transition', '0.7s');
            optionBox.toggleClass('size-changer');
            optionText.toggleClass('show-text');
        });
    }

    for (var i = 1, len = option.length; i <= len; i++) {
        widthChange(option.eq(i), textOption.eq(i));
    }

    //switch between classes for the "hamburger" font-icon
    bars.click(function() {
        iconSwitcher(bars, 'fa-bars', 'fa-times');
        offCanvasElement.toggleClass('off-canvas-bringer');
    });

    //track window size and reset the class of the upper left font-icon (hamburger) as well as check if the off-canvas element is slided in so we can push it back off the screen
    $(window).resize(function() {

        if ($(window).innerWidth() > 1145) {
            iconSwitcher($('.fa-times'), 'fa-times', 'fa-bars');
            if (offCanvasElement.hasClass('off-canvas-bringer')) {
                offCanvasElement.toggleClass('off-canvas-bringer');
            }
        } else {
            return;
        }

    });
});