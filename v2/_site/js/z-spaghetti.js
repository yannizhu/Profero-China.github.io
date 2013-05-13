function resizeStuff() {
	var header = $(".page-header h1").height();
	$(".menu").css({
		height: header,
		lineHeight: header + "px"
	});
	$(".work-item a").height($(".work-item a").width());
	$(".clients-logos li").height($(".clients-logos li").width());
    if($('.portfolio-container').html()) $(".work").height($('.portfolio-container').height());
}
$(window).on("resize", function() {
	resizeStuff();
});
resizeStuff();

$(".hgroup h2").fitText();
$(".hgroup h3").fitText(1.7);
$(".work-item h4").fitText();

$(".why-toggle").click(function(e) {
	e.preventDefault();
	$(this).fadeOut();
	$(".whychooseprofero").fadeIn();
});

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

//on the portfolio detail view, make the carousel swipable
/*
$('.carousel').carousel();
$(".carousel").touchwipe({
    wipeLeft: function() {
        $('.carousel').carousel('next');
    },
    wipeRight: function() {
        $('.carousel').carousel('prev');
    }
});
*/
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

//initialise sidr off-canvas menu
$('.menu-toggle').sidr({
    name: 'sidr-right',
    side: 'right',
    source: '#menu-content'
});
//open the off-canvas menu
$(".sidr a").bind("click", function() {
	var target = $(this).attr("href");
    var pos = $(target).offset().top;
    $('html, body').animate({scrollTop: pos}, 800);
    $.sidr('close', 'sidr-right');
});
//close the menu when going from mobile to desktop
if ( window.matchMedia ) {
    enquire.register("screen and (min-width:480px)", {
        match : function() {
            $.sidr('close', 'sidr-right');
        }
    });
}

setTimeout(function() {
    $('.nav').addClass("fadeIn");
}, 450);

setTimeout(function() {
    $('.intro h2').addClass("fadeIn");
}, 500);

setTimeout(function() {
    $('.intro h3').addClass("fadeIn");
}, 550);

setTimeout(function() {
    $('.cta').addClass("fadeIn");
}, 600);

setTimeout(function() {
    $('.work').addClass("fadeIn");
}, 650);

$(window).bind("load", function() {
        var
        testimonialsloaded = null,
        logosloaded = null,
        maploaded = null;

        $('.testimonials').waypoint(function() {
            if(!testimonialsloaded) {
                $('.testimonials').addClass("fadeIn");
                testimonialsloaded = true;
            }
        }, { offset: 500 });

        $('.clients-logos').waypoint(function() {
            if(!logosloaded) {
                $('.clients-logos').addClass("fadeIn");
                logosloaded = true;
            }
        }, { offset: 500 });

        $('.map').waypoint(function() {
            if(!maploaded) {
                $('.map').addClass("fadeIn");
                maploaded = true;
            }
        }, { offset: 500 });
});