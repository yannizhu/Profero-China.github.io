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

//initialise the carousel when the page has loaded
$("document").ready(function(){
    $( '.testimonials-carousel' ).cbpQTRotator();
});