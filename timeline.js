$(document).ready(function () {
    //Construct a timeline with an endtime at 45 minutes
    //todo: maybe have it take in two timestamps (or human readable date-times)
    //and derive duration from that, some sort of gradation ticks
    Popcorn.player("baseplayer");
    var timeline = Popcorn.baseplayer("#base");
    //timeline.endtime = Popcorn.util.toSeconds($('#primary').attr('data-duration')); //45 minutes
    timeline.endtime = 300; // 6 minutes
    $("#maintimeline").attr("data-duration", timeline.endtime);
    timeline.cue(timeline.endtime, function () {
        this.pause();
        console.log("pausing");
    });

    //as videos become ready, produce timelines for them
    $('video').bind('loadedmetadata', function () {

        var pop = Popcorn('#' + $(this).attr('id'));

        var totalwidth = $("#primary").width();
        var offset = getOffset($(this).attr('data-offset'));
        //console.log("timeline should trigger at " + $(this).attr('data-offset'));
        timeline.exec($(this).attr('data-offset'), function () {
            console.log("trigger");
            if (!timeline.media.paused) {
                console.log("playing");
                pop.play();
            }
        });
        /*
        var dataid = $(this).attr('data-id');
        var newtimeline = $("<div/>", {
            class: "timeline",
            id: dataid
        }).appendTo("#timelineframe");


        var offsetdiv = $("<div/>", {
            class: "clipbox",
            id: "clip" + dataid
        }).appendTo(newtimeline);
        offsetdiv.css('left', offset);
        offsetdiv.css('width', getOffset(pop.duration()));
        $("#timepos").css({
            height: $('#timelineframe').height(),
            display: "block"
        });
        */

    });


    //as main timeline is "playing", move the position element
    timeline.listen("timeupdate", function () {
        //var fulldur = Popcorn.util.toSeconds($('#primary').attr('data-duration'));
        var fulldur = timeline.endtime;
        var totalwidth = $("#maintimeline").width();
        //var pct = this.currentTime() / fulldur ;
        var newoffset = totalwidth * this.currentTime() / fulldur;
        $(".timeloc").text( sec2hms(this.currentTime() ) );
        $("#timepos").css('left', newoffset);
        

    });

    $("#play").click(function () {
        $("#play").toggle();
        $("#stop").toggle();
        console.log(timeline.currentTime() + "of " + timeline.endtime);
        if (timeline.currentTime() < timeline.endtime) {  
            console.log("Playing timeline");
            timeline.play();
            /*
            $('.rashomon').each(function () {
                var pp = Popcorn("#" + $(this).attr('id'));
                var of = parseFloat($(this).attr('data-offset'));
                if (timeline.currentTime() > of && timeline.currentTime() < of + pp.duration()) {
                    console.log("pos is > " + $(this).attr('data-offset') + " < " + $(this).attr('data-offset') + pp.duration());
                    console.log("dur " + pp.duration());
                    pp.play();
                }
            }); */
        }
    });

    $("#stop").click(function () {
        timeline.pause();
        $("#play").toggle();
        $("#stop").toggle();
        /*$('.rashomon').each(function () {
            Popcorn("#" + $(this).attr('id')).pause();
        }); */
    });

    $("#primary").click(function (e) {
        var clickleft = e.pageX - $(this).offset().left;
        var pct = clickleft / $(this).width();
        var tldur = Popcorn.util.toSeconds($('#primary').attr('data-duration'));
        timeline.currentTime(tldur * pct);

        $('.rashomon').each(function () {
            var pp = Popcorn("#" + $(this).attr('id'));
            var of = parseFloat($(this).attr('data-offset'));

            var timediff = timeline.currentTime() - of;
            if (timediff < 0) {
                timediff = 0;
                pp.pause();
            } else if (timediff > $(this).attr('data-offset') + pp.duration()) {
                timediff = pp.duration();
                pp.pause();
            } else if (timeline.currentTime() > of && timeline.currentTime() < of + pp.duration() && !timeline.media.paused) {
                pp.play();
            }


            pp.currentTime(timediff);


        });



    });




});


function getOffset(time) {
    return $("#maintimeline").width() * time / Popcorn.util.toSeconds($('#primary').attr('data-duration'));
}


