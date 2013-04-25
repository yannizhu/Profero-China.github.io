( function( $, window, undefined ) {
 
    'use strict';
 
    // global
    var Modernizr = window.Modernizr;
 
    $.CBPQTRotator = function( options, element ) {
        this.$el = $( element );
        this._init( options );
    };
 
    // the options
    $.CBPQTRotator.defaults = {
        // default transition speed (ms)
        speed : 700,
        // default transition easing
        easing : 'ease',
        // rotator interval (ms)
        interval : 8000
    };
 
    $.CBPQTRotator.prototype = {
        _init : function( options ) {
            // options
            this.options = $.extend( true, {}, $.CBPQTRotator.defaults, options );
            // cache some elements and initialize some variables
            this._config();
            // show current item
            this.$items.eq( this.current ).addClass( 'current' );
            // set the transition to the items
            if( this.support ) {
                this._setTransition();
            }
            // start rotating the items
            this._startRotator();
 
        },
        _config : function() {
 
            // the content items
            this.$items = this.$el.children( '.testimonial' );
            // total items
            this.itemsCount = this.$items.length;
            // current item´s index
            this.current = 0;
            // support for CSS Transitions
            this.support = Modernizr.csstransitions;
            // add the progress bar
            if( this.support ) {
                this.$progress = $( '<span class="progress"></span>' ).appendTo( this.$el );
            }
 
        },
        _setTransition : function() {
            setTimeout( $.proxy( function() {
                this.$items.css( 'transition', 'all ' + this.options.speed + 'ms ' + this.options.easing );
            }, this ), 25 );
        },
        _startRotator: function() {
 
            if( this.support ) {
                this._startProgress();
            }
 
            setTimeout( $.proxy( function() {
                if( this.support ) {
                    this._resetProgress();
                }
                this._next();
                this._startRotator();
            }, this ), this.options.interval );
 
        },
        _next : function() {
 
            // hide previous item
            this.$items.eq( this.current ).removeClass( 'current' );
            // update current value
            this.current = this.current < this.itemsCount - 1 ? this.current + 1 : 0;
            // show next item
            this.$items.eq( this.current ).addClass('current');
 
        },
        _startProgress : function() {
             
            setTimeout( $.proxy( function() {
                this.$progress.css( { transition : 'width ' + this.options.interval + 'ms linear', width : '100%' } );
            }, this ), 25 );
 
        },
        _resetProgress : function() {
            this.$progress.css( { transition : 'none', width : '0%' } );
        },
        destroy : function() {
            if( this.support ) {
                this.$items.css( 'transition', 'none' );
                this.$progress.remove();
            }
            this.$items.removeClass( 'current' ).css( {
                'position' : 'relative',
                'z-index' : 100,
                'pointer-events' : 'auto',
                'opacity' : 1
            } );
        }
    };
 
    var logError = function( message ) {
        if ( window.console ) {
            window.console.error( message );
        }
    };
 
    $.fn.cbpQTRotator = function( options ) {
        if ( typeof options === 'string' ) {
            var args = Array.prototype.slice.call( arguments, 1 );
            this.each(function() {
                var instance = $.data( this, 'cbpQTRotator' );
                if ( !instance ) {
                    logError( "cannot call methods on cbpQTRotator prior to initialization; " +
                    "attempted to call method '" + options + "'" );
                    return;
                }
                if ( !$.isFunction( instance[options] ) || options.charAt(0) === "_" ) {
                    logError( "no such method '" + options + "' for cbpQTRotator instance" );
                    return;
                }
                instance[ options ].apply( instance, args );
            });
        } 
        else {
            this.each(function() {
                var instance = $.data( this, 'cbpQTRotator' );
                if ( instance ) {
                    instance._init();
                }
                else {
                    instance = $.data( this, 'cbpQTRotator', new $.CBPQTRotator( options, this ) );
                }
            });
        }
        return this;
    };
 
} )( jQuery, window );

$("document").ready(function(){
/*
    $(".portfolio-item a").click(function(e) {
        e.preventDefault();
        var t = $(this).attr("href");
        var d = $(this).data("slug");
        var p = $("#portfolio");
        p.addClass("fadeOut");
        window.setTimeout(p.load(t, function() {
            //history.pushState(null, null, d);
            p.removeClass("fadeOut");
        }),1500);
        //return false;
    });

    $(".back").on("click", function(e) {
        e.preventDefault();
        var p = $("#portfolio");
        p.addClass("fadeOut");
        window.setTimeout(p.load("portfolio.html", function() {
            //history.pushState(null, null, "/");
            p.removeClass("fadeOut");
        }), 1500);
        return false;
    });    
*/
    function resizePortfolioItems() {

        var items = $(".portfolio-item").get();
        for(i=0;i<items.length;i++) {
            var _this = $(items[i]);
            var w = _this.width();
            var offset = (-i*w) + "px 0";
            _this.css({
                "background-position":offset,
                "height":w
            });
        }
    }
    resizePortfolioItems();
    $(window).resize(function(){
        resizePortfolioItems();
    });

    $( '.testimonials' ).cbpQTRotator();

    $('.toggle-menu').sidr({
        name: 'sidr-right',
        side: 'right',
        source: '#menu-content'
    });

    $(".sidr a").bind("click", function() {
        $.sidr('close', 'sidr-right');
    });

    enquire.register("screen and (min-width:980px)", {
        match : function() {
            $.sidr('close', 'sidr-right');
        }
    });

    $(".year").html(new Date().getFullYear());

    $('.carousel').carousel();
    $(".carousel").touchwipe({
        wipeLeft: function() {
            $('.carousel').carousel('next');
        },
        wipeRight: function() {
            $('.carousel').carousel('prev');
        }
    });

    var mapContainer = $(".map-container");

    var map = new google.maps.Map(mapContainer[0],{
        zoom: 15,
        disableDefaultUI:true,
        disableDoubleClickZoom:true,
        draggable:false,
        keyboardShortcuts:false,
        scrollwheel:false,
        center: new google.maps.LatLng(39.917774,116.453311),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    function addMarker( latitude, longitude, label, colour ){
        var marker = new google.maps.Marker({
            map: map,
            position: new google.maps.LatLng(latitude,longitude),
            title: (label || "")
        });
        marker.setIcon(colour);
        return(marker);
    }
    var center;
    function calculateCenter() {
        center = map.getCenter();
    }
    google.maps.event.addDomListener(map, 'idle', function() {
        calculateCenter();
    });
    google.maps.event.addDomListener(window, 'resize', function() {
        map.setCenter(center);
    });
    if(usLocationMarker) return;
    usLocationMarker = addMarker(
        39.917815,
        116.453311,
        "Us!",
        "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
    );
    if (navigator.geolocation) {
        var youLocationMarker, usLocationMarker = null;
        navigator.geolocation.getCurrentPosition(function(pos) {
            if (youLocationMarker || usLocationMarker){
                return;
            }
            /*
            youLocationMarker = addMarker(
                pos.coords.latitude,
                pos.coords.longitude,
                "You!",
                "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
            );
            */
            var request = {
                origin: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                destination: new google.maps.LatLng(39.917815, 116.453311),
                travelMode: google.maps.DirectionsTravelMode.DRIVING
            };
            var directionsService = new google.maps.DirectionsService();
            var directionsDisplay = new google.maps.DirectionsRenderer();
            directionsDisplay.setMap(map);
            directionsService.route(request, function(response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                }
            });
        });
    }

    $('#backtotop').click(
        function (e) {
            $('html, body').animate({scrollTop: '0px'}, 800);
        }
    );
    $('.menu a').click(
        function () {
            var target = $(this).attr("href");
            var pos = $(target).offset().top;
            $('html, body').animate({scrollTop: pos}, 800);
        }
    );

    $(window).scroll(function(){
        if($(this).scrollTop() > 150) {
            $('#backtotop').addClass("shown");
        } else {
            $('#backtotop').removeClass("shown");
        }
    });

});

window.addEventListener('load', function(e) {
    window.applicationCache.addEventListener('updateready', function(e) {
        if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
            window.applicationCache.swapCache();
            window.location.reload();
        } else {
            // Manifest didn't change. Nothing new to serve.
        }
    }, false);
}, false);


if(window.matchMedia) {
    var mediaQueryList = window.matchMedia('print');
    mediaQueryList.addListener(function(mql) {
        if (mql.matches) {
            beforePrint();
        } else {
            afterPrint();
        }
    });
}

window.onbeforeprint = beforePrint;
window.onafterprint = afterPrint;
function beforePrint() {
    $( '.testimonials' ).cbpQTRotator("destroy");
}
function afterPrint() {
    $( '.testimonials' ).cbpQTRotator("_init");
}