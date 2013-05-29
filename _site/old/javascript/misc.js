//copied from underscore js
throttle = function(func, wait) {
    var context, args, timeout, result;
    var previous = 0;
    var later = function() {
        previous = new Date;
        timeout = null;
        result = func.apply(context, args);
    };
    return function() {
        var now = new Date;
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0) {
            clearTimeout(timeout);
            timeout = null;
            previous = now;
            result = func.apply(context, args);
        } else if (!timeout) {
            timeout = setTimeout(later, remaining);
        }
        return result;
    };
};

//when the page is loaded and resized
//the size of the portfolio items needs
//to be adjusted. the width is fluid %
//so the height needs to match in order
//to keep the circle shapes
function resizePortfolioItems() {

    var items = $(".portfolio-item").get();
    for(i=0;i<items.length;i++) {
        var _this = $(items[i]);
        var w = _this.width();
        var o = _this.data("bgoffset");
        var offset = (-o*w) + "px 0";
        _this.css({
            "background-position":offset,
            "height":w
        });
    }
}

$("document").ready(function(){

    //ensure circles
    resizePortfolioItems();
    $(window).resize(function(){
        resizePortfolioItems();
    });

    //on the portfolio detail view, make the carousel swipable
    $('.carousel').carousel();
    $(".carousel").touchwipe({
        wipeLeft: function() {
            $('.carousel').carousel('next');
        },
        wipeRight: function() {
            $('.carousel').carousel('prev');
        }
    });

    //scroll to the top when the button is clicked
    $('#backtotop').click(
        function (e) {
            $('html, body').animate({scrollTop: '0px'}, 800);
        }
    );

    //scroll to part of the page when navigation item is clicked
    $('.menu a').click(
        function () {
            var target = $(this).attr("href");
            var pos = $(target).offset().top;
            $('html, body').animate({scrollTop: pos}, 800);
        }
    );

    //only show the 'back to top' button after the user
    //has scrolled down 150px
    var throttled = throttle(showbacktotopbutton, 100);
    $(window).scroll(throttled);
    function showbacktotopbutton(){
        if($(this).scrollTop() > 150) {
            $('#backtotop').addClass("shown");
        } else {
            $('#backtotop').removeClass("shown");
        }
    }

});