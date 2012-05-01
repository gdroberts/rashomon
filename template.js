/* A video object - holds all of the information to display this video's footprint on the timeline.
@param offset is the offset relative to the beginning of the time frame
@param length is the length of the video
@param is this video's identification number - to be able to link to the actual video
@param name is the name of this video
*/
function video(offset, length, id, name, file) {
    this.offset = offset;
    this.length = length;
    this.id = id;
    this.name = name;
    this.file = file;
}

function displayVids(files, activeFiles, pageNumber, numVideosToDisplay) {
    activeFiles = [];
    transferElements(files, activeFiles, (pageNumber - 1)*numVideosToDisplay, pageNumber*numVideosToDisplay - 1);
        $.each(activeFiles, function(key, val) {
        var vid;
        $.getJSON(val, function(data) {
            var offset = data.Timeline.Offset;
            var length = data.Temporal.Length;
            var id = data.ID.VideoID;
            var name = data.ID.Name;
            vid = new video(offset, length, id, name);
            displayVideo(id, offset, length, name);
        });
    });
}

$(document).ready(function () {

    var isLocked = false;

    $("#feedControl").click(function() {
        if (!isLocked) {
            $("#feedControl").text("Unfreeze Twitter Feed");
        } else {
            $("#feedControl").text("Freeze Twitter Feed");
        }
        isLocked = !isLocked;
    });

    $("#tweetPart").tweetable({username: 'UCBerkeley'});
    
    var twitterList = ['UCBerkeley', 'ucdavis', 'ucsc'];
    var i = 1;
    
    if (twitterList.length != 0) {
        var twitterInterval = setInterval(function() {
            if (!isLocked) {
                $("#tweetPart").empty();
                $("#tweetPart").tweetable({username: twitterList[i % twitterList.length]});
                //var lostButton = $("<span class='button' id='feedControl'>Freeze Twitter Feed</span>");
                //lostButton.appendTo("#videoTweets");
                i += 1;
            }
        }, 3000);
    }
        
    /*clicking the pager will change this pageNumber either up or down*/
    var pageNumber = 1; //start on page 1

    /* Temporary list of JSON filenames - will come from elsewhere */
    var fileNames = [/*"vid2.json", "vid1.json", "vid3.json"*/];
    
    /* Temporary list of video locations that match up in order with the JSON files in FILENAMES */
    var vidList = [];

    /*These are the active videos being displayed right now it has
    length NUMVIDEOSTODISPLAY*/
    var activeFiles = [];
    
    /* Initially fill the activeFiles with the first NUMVIDEOSTODISPLAY videos */
    
    /* This can be changed if more videos want to be displayed before paging */
    var numVideosToDisplay = 5;
    
    var colorList = ["AliceBlue", "Aqua", "DarkBlue", "DarkGoldenRod", "DarkGreen", "Crimson", "ForestGreen", "DarkSeaGreen", "DarkSalmon", "Darkorange", "IndianRed", "Indigo"];

    /* Populate the events for ALL videos. */
    /*$.each(fileNames, function(key, val) {
        $.getJSON(val, function(data) {
            var offset = data.Timeline.Offset;
            var length = data.Temporal.Length;
            var id = data.ID.VideoID;
            var name = data.ID.Name;
            $.each(data.Events, function(k, v) {
                var eventName = v.EventName;
                var eventID = v.EventID;
                var offsetFromClip = v.InstanceTime;
                var eventTime = offset + offsetFromClip;
                var color = colorList[Math.floor(Math.random()*12)];
                displayEvent(eventID, eventName, color, eventTime);
            });
        });
    });*/
    //displayVids(fileNames, activeFiles, pageNumber, numVideosToDisplay);
    /* focusDistance is a flag that says if a point has been specified to place a region of interest*/
    var focusDistance = false;
    /* dotCoords holds the first point specified by the user on the page*/
    var dotCoords = [];
    /* focusRegion holds the current region of interest specified by the user.  This will be used to play videos from a specific point in time.*/
    var focusRegion = [];
    
    /* This handles the focus region when the user clicks the MAINTIMELINE*/
    $("#maintimeline").click(function(mouse) {
        var offset = $("#maintimeline").offset();
        var fixedX = mouse.pageX - offset.left;
        if (!focusDistance) {
            focusDistance = true;
            placeDot("#maintimeline", fixedX, mouse.pageY);
            dotCoords = [];
            dotCoords.push(fixedX, mouse.pageY);
        } else {
            placeBeam("#maintimeline", fixedX, mouse.pageY, dotCoords);
            focusDistance = false;
            focusRegion = [];
            focusRegion.push(Math.min(fixedX, dotCoords[0]), Math.max(mouse.pageX, dotCoords[0]));
        }
    });

    /*A flag specifying if it is ok to click the up paging arrow*/
    var upPagerActive = true;
    /*A flag specifying if it is ok to click the down paging arrow*/
    var downPagerActive = true;

    /* This is the maximum number of pages to display*/
    var maxPageNumber = 2/* = Math.floor(videoList.length / numVideosToDisplay) + 1 */;
    
    /* This variable should be set to the length of the video list to be displayed*/
    /* It is manually set as of now */
    var numVideos = 8//fileNames.length;
    //example add video, soon to replaced with a getJSON & $each!
    //displayVideo(1, 100, 153, "student protest");
    //displayVideo(2, 100, 253, "cat playing piano");
    //displayVideo(3, 200, 309, "pandas snoring");
    //displayVideo(4, 130, 500, "tickle me elmo on fire");
    //displayVideo(5, 300, 408, "untitled");
    //displayVideo(6, 32, 485, "Harry Potter IV");
    //example event build
    
    displayEvent(1, "something happened right then", "orange", 15);
    displayEvent(2, "something else happened here", "aqua", 40);
    displayEvent(3, "another something", "BlueViolet", 212);
    displayEvent(4, "yet another", "Khaki", 512);
    displayEvent(5, "wwwhwat?", "Green", 432);
    displayEvent(6, "crazy", "Olive", 79);
    var v1 = new video(151, 432, 1, "v1", "Vid2.MOV");
    var v2 = new video(374, 321, 2, "v2", "Vid3.MOV");
    var v3 = new video(35, 236, 3, "v3", "Vid4.MOV");
    var v4 = new video(143, 673, 4, "v4", "Vid6.MOV");
    var v5 = new video(251, 421, 5, "v5", "test.MOV");
    var v6 = new video(174, 189, 6, "v6", "hat.mov");
    var v7 = new video(120, 456, 7, "v7", "monkey.mov");
    var v8 = new video(105, 75, 8, "v8", "Cache.mov");
    
    testVids = [v1, v2, v3, v4, v5, v6, v7, v8];
    testActive = [];
    transferElements(testVids, testActive, (pageNumber - 1)*numVideosToDisplay, pageNumber*numVideosToDisplay - 1);
     $.each(testActive, function(key, val) {
            displayVideo(val.id, val.offset, val.length, val.name);
    });
    
    /*If there are five or less videos, then don't display the pagers*/
    if (numVideos <= numVideosToDisplay) {
        $(".pager").toggleClass("pagerDisappear");
        upPagerActive = false;
        downPagerActive = false;
    }
    /*If this is the first page, down display the up pager*/
    if (pageNumber == 1) {
        upPagerActive = false;
        pagerDisappear(".pager.#up");
    }
    /*If a pager is clicked, this handles changing the page number and
    making the down pager disappear if the last page becomes active
    or making the up pager disappear if the first page becomes active.*/
    $(".pager").click(function() {
        var pageNumberPrevious = pageNumber;
        if ($(this).attr('id') == "up" && upPagerActive) {
            pageNumber -= 1;
        } else if (downPagerActive && $(this).attr('id') == "down") {
            pageNumber += 1;
        }
        if (pageNumber == maxPageNumber) {
            pagerDisappear(".pager.#down");
            pagerAppear(".pager.#up");
            downPagerActive = false;
        } else {
            downPagerActive = true;
            pagerAppear(".pager.#down");
        }
        if (pageNumber == 1) {
            pagerDisappear(".pager.#up");
            upPagerActive = false;
        } else {
            pagerAppear(".pager.#up");
            upPagerActive = true;
        }
        if (pageNumberPrevious != pageNumber) {
            /*change the videos in the active video list*/
            $.each(testActive, function(key, val) {
                $("div#vid"+val.id+".vidline").hide();
            });
            testActive = [];
            transferElements(testVids, testActive, (pageNumber - 1)*numVideosToDisplay, pageNumber*numVideosToDisplay - 1);
            $.each(testActive, function(key, val) {
            //alert($("div#vid"+val.id+".vidline").is(":visible"));
                if (!$("div#vid"+val.id+".vidline").is(":hidden")) {
                    displayVideo(val.id, val.offset, val.length, val.name);
                    $(".vidnum"+"#vid"+val.id).click(function() {
                        var num = $(this).html();
        if ($.inArray(num, testVidsToDisplay) != -1) {
        temp = [];
            $.each(testVidsToDisplay, function(k, v) {
                if (v != num) {
                    temp.push(v);
                }
            });
        testVidsToDisplay = [];
        $.each(temp, function(key, val) {
            testVidsToDisplay.push(val);
        });
    } else {
        testVidsToDisplay.push(num);
    }
        $(this).toggleClass("vidactive");
        toggleVid($(this).text());
                    });
                } else {
                    $("div#vid"+val.id+".vidline").show();
                }
            });
        }
    });
        
    var testVidsToDisplay = [];
    var temp = [];

    $(".vidnum").click(function() {
        var num = $(this).html();
        if ($.inArray(num, testVidsToDisplay) != -1) {
        temp = [];
            $.each(testVidsToDisplay, function(k, v) {
                if (v != num) {
                    temp.push(v);
                }
            });
        testVidsToDisplay = [];
        $.each(temp, function(key, val) {
            testVidsToDisplay.push(val);
        });
    } else {
        testVidsToDisplay.push(num);
    }
        $(this).toggleClass("vidactive");
        toggleVid($(this).text());
    });
    
    $("#ready").click(function() {
        var coords = $("#videos").offset();
       var spaceY = .7*coords.top;
       var spaceX = 0;
       var spaceWidth = $("body").width();
       var spaceHeight = screen.height - spaceY;
       positionVideos(testVidsToDisplay, spaceX, spaceY, spaceWidth, spaceHeight, 10);
    });

});

/*Place box around region of interest specified by the user
@param where is the place on the page to put this box
@param coords is [xcoord, ycoord] of one bound
@param  x, y is the [xcoord, ycoord] of the other bound
Note : the order of these bounds does not matter
*/
function placeBeam(where, x, y, coords) {
    $(".dot").css("visibility", "hidden");
    $("<div/>", {"class": 'beam'}).css({'width': Math.abs(coords[0] - x) + "px", 'left': Math.min(coords[0], x), 'background': "yellow"}).appendTo(where);
}

/*Place a dot to show the user they specified one of the bounds of a region they are interested in
@param where is the place on the page to put this dot
@param x, y is the [xcoord, ycoord] of this dot
*/
function placeDot(where, x, y) {
    $(".beam").css("visibility", "hidden");
    $("<div/>", { "class": 'dot'}).css({'left': x, 'background': "yellow"}).appendTo(where);
}
function displayEvent(id, title, color, time){
    //todo need to figure out how to distribute colors, convert time to space
    $("<div/>", { "class": 'event', "id": "event_" + id, "title": title}).css({'left': 143 + time, 'background': color}).appendTo("#maintimeline"); 
}

/*Fills an array with the elements from another array within specified bounds.
This function does bound checking on FROM.  The function assumes TO is big enough to hold
all of the elements.
@param from is the array transferring from
@param to is the array transferrring to
@param start is the starting index in FROM
@param end is the ending index in FROM
*/

function transferElements(from, to, start, end) {
    var lastIndex = Math.min(end + 1, from.length);
    for (i = start, j = 0; i < lastIndex; i += 1, j += 1) {
        to.push(from[i]);
    }
}

/*Changed the css of the pager to make it disappear
@param name is which pager it is - .pager.#up or .pager.#down */
function pagerDisappear(name) {
    $(name).css("background", "#aaa");
    $(name).css("color", "#aaa");
}

/*Changed the css of the pager to make it appear
@param name is which pager it is - .pager.#up or .pager.#down */
function pagerAppear(name) {
    $(name).css("background", "#c8c8c8");
    $(name).css("color", "#333");
}

function displayVideo(id, start, duration, meta){
    //todo duration->space, match meta to real meta
    
    var vidline = $("<div/>", { "class": "vidline", "id": "vid"+id});
    var vidnum = $("<div/>", { "class": "vidnum", "id": "vid"+id, text: id}).appendTo(vidline);
    var vidmeta = $("<div/>", { "class": "vidmeta"}).appendTo(vidline);
    $("<p/>", {text: meta}).appendTo(vidmeta);
    $("<p/>", {text: "start: " + sec2hms(start)}).appendTo(vidmeta);
    $("<p/>", {text: "duration: " + sec2hms(duration)}).appendTo(vidmeta);
    var vidtime = $("<div/>", { "class": "vidtime"}).css({"left": 143 + start, "width": duration}).appendTo(vidline);
    vidline.appendTo("#vidlines");
}

/** Function to position videos in the space (the space is the area in
the page where the videos should be positioned).  It enforces square video dimensions.
@param VideoList is the Javascript Array of video names to position in the space - these should only be videos that have
been selected to be viewed.  
@param spaceX is the x dimension of the space in the page
@param spaceY is the y dimension of the space in the page
@param spaceWidth is the total width of the space
@param spaceHeight is the total height of the space
@param spacing is a parameter to customize how far the gap is between videos and between the border of the space in the x-direction
*/
function positionVideos(videoList, spaceX, spaceY, spaceWidth, spaceHeight, spacing) {
    var spaceSquareDim = Math.min(spaceHeight, spaceWidth);
    var numberOfVideos = videoList.length;
    var numberY = Math.sqrt(numberOfVideos);
    var numberX = Math.ceil(numberOfVideos / numberY);
    var vidWidth = vidDimCalc(numberX, spaceSquareDim, spacing);
    //var vidHeight = vidDimCalc(numberY, spaceHeight, spacing);
    vidHeight = vidWidth;
    var spacingX = spacing;
    var spacingY = ySpacingCalc(spaceHeight, vidHeight, numberY);
    var lastRowStart = numberX*(numberY - 1);
    $.each(videoList, function(index, value) {
    var current = $("<video>" +
        "<source src="+value.file+ "type='video/mov'/>" +
        "<source src="+value.file+ "type='video/mp4'/>" 
        + "</video>");
    /*Set the width of this video*/
    /*Set the height of this video*/
    $(current).css("width", vidWidth + "px");
    $(current).css("height", vidHeight + "px");
    if (index >= lastRowStart) {
        /*if is last row, special calculation*/
        var specialPos = lastRowPositioning(index % numberX, numberOfVideos - lastRowStart, index % numberY, spaceWidth, spaceX, spaceY, spacingY, vidWidth, vidHeight);
        $(current).css("left", specialPos[0]);
        $(current).css("top", specialPos[1]);
        /* Set the x and y positions of this video using specialPos */
    } else {
        /*if not last row, find position regularly*/
        var pos = regularPositioning(index % numberX, index % numberY, spaceX, spaceY, spacingX, spacingY, vidWidth, vidHeight);
        /* Set the x and y positions of this video using pos */
        $(current).css("left", pos[0]);
        $(current).css("top", pos[1]);
    }
    $(current).appendTo("#videos");
    });
}

/** Function to calculate how much spacing there should be in the y direction given that the videos have same height and width dimensions.
@param spaceHeight is the height of the space being positioned in
@param vidHeight is the height of each video
@param numberY is the number of videos being positioned in the y direction.
*/
function ySpacingCalc(spaceHeight, vidHeight, numberY) {
    var fringeLeftover = spaceHeight - vidHeight*numberY;
    return (fringeLeftover / numberY);
}

/** Function to calculate a given dimension of a video.  This has been generalized to calculate either the video height or the video width.
@param number is the number of videos that will be in this dimension of the space
@param spaceDim is the dimension of the space being placed into
@param spacing is the amount of space between two videos in this dimension as well as the amount of space between the edges of the space and the videos
*/
function vidDimCalc(number, spaceDim, spacing) {
    var totalFringeSpace = (number + 1)*spacing;
    var remainingSpace = spaceDim - totalFringeSpace;
    var vidDim = remainingSpace / number;
    return vidDim;
}

/** Function to do special positioning for the last row.  It simply recalculates the spacing in the x direction and then lets regular positioning
do the positioning with this modified x-direction spacing.
@param totalInRow is the total amount of videos in the last row
@param spaceWidth is the width of the space being positioned in
See regularPositioning params list for the other parameters
*/
function lastRowPositioning(positionInRow, totalInRow, positionInCol, spaceWidth, spaceX, spaceY, spacingY, vidWidth, vidHeight) {
    var xFringeTotal = (totalInRow+1)*(vidWidth)
    var spacingX = spaceWidth - xFringeTotal;
    return regularPositioning(positionInRow, positionInCol, spaceX, spaceY, spacingX, spacingY, vidWidth, vidHeight);
}

/** Function to find the positioning of a video given it is not in the last row.  It returns the position as an array [x position, y position].
@param positionInRow is the index of this video in its given row starting from index 0
@param positionInCol is the index of this video in its given column starting from index 0
@param spaceX is the x-coordinate of the space being positioned in
@param spaceY is the y-coordinate of the space being positioned in
@param spacingX is the space between each video in the x-direction
@param spacingY is the space between each video in the y-direction
@param vidWidth is the width of a video
@param vidHeight is the height of a video
*/
function regularPositioning(positionInRow, positionInCol, spaceX, spaceY, spacingX, spacingY, vidWidth, vidHeight) {
    var xPos = (positionInRow)*(vidWidth) + (positionInRow + 1)*(spacingX) + spaceX;
    var yPos = (positionInCol)*(vidHeight) + (positionInCol + 1)*(spacingY) + spaceY;
    var pos = [xPos, yPos];
    return pos;
}

function sec2hms(time){
    var minutes = Math.floor(parseInt( time / 60 ) % 60);
    var seconds = Math.floor(time % 60);
    if (seconds < 10) {
        seconds = "0" + seconds; //modified this to add a zero to display 3:09 instead of 3:9 for example
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    return "00:" + minutes + ":" + seconds;
}

function toggleVid(id){
    console.log("toggling " + id);

}
