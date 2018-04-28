/*!
 * liScroll 1.0
 * http://heiniaozhi.cn
 * 2015 Gian Carlo Mingati
 */


jQuery.fn.liScroll = function (settings) {
    settings = jQuery.extend({
        travelocity: 0.005
    }, settings);
    return this.each(function () {
        var $strip = jQuery(this);

        $strip.addClass("newsticker")

        var stripWidth = document.body.offsetWidth;

        $strip.find("li").each(function (i) {
            stripWidth += jQuery(this, i).outerWidth(true); // thanks to Michael Haszprunar and Fabien Volpi
        });
        var $mask = $strip.wrap("<div class='mask'></div>");

        var $tickercontainer = $strip.parent().wrap("<div class='tickercontainer'></div>");

        var containerWidth = $strip.parent().parent().parent().width();	//a.k.a. 'mask' width


        $strip.width(stripWidth);

        var totalTravel = stripWidth + containerWidth + 1000;

        var defTiming = totalTravel / settings.travelocity;	// thanks to Scott Waye

        function scrollnews(spazio, tempo) {
            $strip.animate({left: '-=' + spazio}, tempo, "linear",
                function () {
                    $strip.css("left", containerWidth);
                    scrollnews(totalTravel, defTiming);
                });
        }

        scrollnews(totalTravel, defTiming);

        $strip.hover(function () {
                jQuery(this).stop();
            },

            function () {
                var offset = jQuery(this).offset();
                var residualSpace = offset.left + stripWidth;
                var residualTime = residualSpace / settings.travelocity;
                scrollnews(residualSpace, residualTime);
            });
    });
};
