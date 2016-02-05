/******************************
Controller for the video player
*******************************/

/*
Retrieving the parameters if they exist
*/
if (QueryString.proj == undefined
    ||QueryString.prevMenu == undefined
    || QueryString.projMode == undefined
    ) {
    window.location = "../main-menu/main-menu.html";
} else {
    var projId = QueryString.proj;
    var projMode = (QueryString.projMode === 'true');
    var prevMenu = QueryString.prevMenu;
}

/*
Display a nice error message in case of error
*/
var displayError = function() {
    document.getElementById('current-video').style.display = "none";
    document.getElementById('alternat').style.display = "block";
}
$(document).ready(function() {
    var errorDirective = {
        '#video-src@onerror': "displayError()"
    };
    $('body').render({}, errorDirective);
})


if (projMode) {
    /*
    The player reads all the videos in the projection one after the otherwise
    then reverts to the projection menu
    */
    if (videos[projId] == undefined) {
        window.location = "../main-menu/main-menu.html";
    }
    var videosToPlay = videos[projId].videos;
    var pathPrefix = videos[projId].videoPathPrefix;
    var currentVideoIndex = 0;
    var videoSrcDirective = {
        '#video-src@src': pathPrefix+videosToPlay[0].src
    };
    $('body').render({}, videoSrcDirective);

    var onEndedVideo = function() {
        currentVideoIndex++;
        if (currentVideoIndex == videosToPlay.length) {
            window.location = "../projection/projection.html?id="+projId+"&prev="+prevMenu;
        } else {
            var videoSrcDirective = {
                '#video-src@src': pathPrefix+videosToPlay[currentVideoIndex].src
            };
            $('body').render({}, videoSrcDirective);
        }
    }
} else {
    /*
    The player reads one video then reverts to the associated projection menu
    */
    if (QueryString.video == undefined) {
        window.location = "../projection/projection.html?id="+projId+"&prev="+prevMenu;
    }
    var pathPrefix = videos[projId].videoPathPrefix;
    var videoSrc = pathPrefix + videos[projId].videos[QueryString.video].src;
    var videoSrcDirective = {
        '#video-src@src': videoSrc,
    };
    $('body').render({}, videoSrcDirective);
    //TBelow is a trick in order to solve a bug where the video is played twice due to cache
    //http://stackoverflow.com/questions/5927573/html5-video-playing-twice-audio-doubled-with-jquery-append
    $(document).ready(function() {
            $('#current-video').attr('autoplay','autoplay');
    });

    var onEndedVideo = function() {
        if (QueryString.prevSlide != undefined) {
            var prevSlide = QueryString.prevSlide;
        } else {
            var prevSlide = 0;
        }
        window.location = "../projection/projection.html?id="+projId+"&prev="+prevMenu+"&slide="+prevSlide;
    }
}
