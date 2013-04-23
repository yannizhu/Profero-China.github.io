/* ==========================================================
 * bootstrap-carousel.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#carousel
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* CAROUSEL CLASS DEFINITION
  * ========================= */

  var Carousel = function (element, options) {
    this.$element = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options = options
    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.prototype = {

    cycle: function (e) {
      if (!e) this.paused = false
      if (this.interval) clearInterval(this.interval);
      this.options.interval
        && !this.paused
        && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))
      return this
    }

  , getActiveIndex: function () {
      this.$active = this.$element.find('.item.active')
      this.$items = this.$active.parent().children()
      return this.$items.index(this.$active)
    }

  , to: function (pos) {
      var activeIndex = this.getActiveIndex()
        , that = this

      if (pos > (this.$items.length - 1) || pos < 0) return

      if (this.sliding) {
        return this.$element.one('slid', function () {
          that.to(pos)
        })
      }

      if (activeIndex == pos) {
        return this.pause().cycle()
      }

      return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
    }

  , pause: function (e) {
      if (!e) this.paused = true
      if (this.$element.find('.next, .prev').length && $.support.transition.end) {
        this.$element.trigger($.support.transition.end)
        this.cycle(true)
      }
      clearInterval(this.interval)
      this.interval = null
      return this
    }

  , next: function () {
      if (this.sliding) return
      return this.slide('next')
    }

  , prev: function () {
      if (this.sliding) return
      return this.slide('prev')
    }

  , slide: function (type, next) {
      var $active = this.$element.find('.item.active')
        , $next = next || $active[type]()
        , isCycling = this.interval
        , direction = type == 'next' ? 'left' : 'right'
        , fallback  = type == 'next' ? 'first' : 'last'
        , that = this
        , e

      this.sliding = true

      isCycling && this.pause()

      $next = $next.length ? $next : this.$element.find('.item')[fallback]()

      e = $.Event('slide', {
        relatedTarget: $next[0]
      , direction: direction
      })

      if ($next.hasClass('active')) return

      if (this.$indicators.length) {
        this.$indicators.find('.active').removeClass('active')
        this.$element.one('slid', function () {
          var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
          $nextIndicator && $nextIndicator.addClass('active')
        })
      }

      if ($.support.transition && this.$element.hasClass('slide')) {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $next.addClass(type)
        $next[0].offsetWidth // force reflow
        $active.addClass(direction)
        $next.addClass(direction)
        this.$element.one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid') }, 0)
        })
      } else {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $active.removeClass('active')
        $next.addClass('active')
        this.sliding = false
        this.$element.trigger('slid')
      }

      isCycling && this.cycle()

      return this
    }

  }


 /* CAROUSEL PLUGIN DEFINITION
  * ========================== */

  var old = $.fn.carousel

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('carousel')
        , options = $.extend({}, $.fn.carousel.defaults, typeof option == 'object' && option)
        , action = typeof option == 'string' ? option : options.slide
      if (!data) $this.data('carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  $.fn.carousel.defaults = {
    interval: 5000
  , pause: 'hover'
  }

  $.fn.carousel.Constructor = Carousel


 /* CAROUSEL NO CONFLICT
  * ==================== */

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }

 /* CAROUSEL DATA-API
  * ================= */

  $(document).on('click.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var $this = $(this), href
      , $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      , options = $.extend({}, $target.data(), $this.data())
      , slideIndex

    $target.carousel(options)

    if (slideIndex = $this.attr('data-slide-to')) {
      $target.data('carousel').pause().to(slideIndex).cycle()
    }

    e.preventDefault()
  })

}(window.jQuery);
/* =========================================================
 * bootstrap-modal.js v2.3.0
 * http://twitter.github.com/bootstrap/javascript.html#modals
 * =========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */


!function ($) {

  "use strict"; // jshint ;_;


 /* MODAL CLASS DEFINITION
  * ====================== */

  var Modal = function (element, options) {
    this.options = options
    this.$element = $(element)
      .delegate('[data-dismiss="modal"]', 'click.dismiss.modal', $.proxy(this.hide, this))
    this.options.remote && this.$element.find('.modal-body').load(this.options.remote)
  }

  Modal.prototype = {

      constructor: Modal

    , toggle: function () {
        return this[!this.isShown ? 'show' : 'hide']()
      }

    , show: function () {
        var that = this
          , e = $.Event('show')

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.backdrop(function () {
          var transition = $.support.transition && that.$element.hasClass('fade')

          if (!that.$element.parent().length) {
            that.$element.appendTo(document.body) //don't move modals dom position
          }

          that.$element.show()

          if (transition) {
            that.$element[0].offsetWidth // force reflow
          }
          /*
          that.$element
            .addClass('in')
            .attr('aria-hidden', false)
          */
          that.$element.show(1).addClass('in')
          that.enforceFocus()

          transition ?
            that.$element.one($.support.transition.end, function () { that.$element.focus().trigger('shown') }) :
            that.$element.focus().trigger('shown')

        })
      }

    , hide: function (e) {
        e && e.preventDefault()

        var that = this

        e = $.Event('hide')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        this.escape()

        $(document).off('focusin.modal')

        this.$element
          .removeClass('in')
          .attr('aria-hidden', true)

        $.support.transition && this.$element.hasClass('fade') ?
          this.hideWithTransition() :
          this.hideModal()
      }

    , enforceFocus: function () {
        var that = this
        $(document).on('focusin.modal', function (e) {
          if (that.$element[0] !== e.target && !that.$element.has(e.target).length) {
            that.$element.focus()
          }
        })
      }

    , escape: function () {
        var that = this
        if (this.isShown && this.options.keyboard) {
          this.$element.on('keyup.dismiss.modal', function ( e ) {
            e.which == 27 && that.hide()
          })
        } else if (!this.isShown) {
          this.$element.off('keyup.dismiss.modal')
        }
      }

    , hideWithTransition: function () {
        var that = this
          , timeout = setTimeout(function () {
              that.$element.off($.support.transition.end)
              that.hideModal()
            }, 500)

        this.$element.one($.support.transition.end, function () {
          clearTimeout(timeout)
          that.hideModal()
        })
      }

    , hideModal: function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
          that.removeBackdrop()
          that.$element.trigger('hidden')
        })
      }

    , removeBackdrop: function () {
        this.$backdrop.remove()
        this.$backdrop = null
      }

    , backdrop: function (callback) {
        var that = this
          , animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
          var doAnimate = $.support.transition && animate

          this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
            .appendTo(document.body)

          this.$backdrop.click(
            this.options.backdrop == 'static' ?
              $.proxy(this.$element[0].focus, this.$element[0])
            : $.proxy(this.hide, this)
          )

          if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

          this.$backdrop.addClass('in')

          if (!callback) return

          doAnimate ?
            this.$backdrop.one($.support.transition.end, callback) :
            callback()

        } else if (!this.isShown && this.$backdrop) {
          this.$backdrop.removeClass('in')

          $.support.transition && this.$element.hasClass('fade')?
            this.$backdrop.one($.support.transition.end, callback) :
            callback()

        } else if (callback) {
          callback()
        }
      }
  }


 /* MODAL PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.modal

  $.fn.modal = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('modal')
        , options = $.extend({}, $.fn.modal.defaults, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option]()
      else if (options.show) data.show()
    })
  }

  $.fn.modal.defaults = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  $.fn.modal.Constructor = Modal


 /* MODAL NO CONFLICT
  * ================= */

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


 /* MODAL DATA-API
  * ============== */

  $(document).on('click.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this = $(this)
      , href = $this.attr('href')
      , $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
      , option = $target.data('modal') ? 'toggle' : $.extend({ remote:!/#/.test(href) && href }, $target.data(), $this.data())

    e.preventDefault()

    $target
      .modal(option)
      .one('hide', function () {
        $this.focus()
      })
  })

}(window.jQuery);

/* ===================================================
 * bootstrap-transition.js v2.3.0
 * http://twitter.github.com/bootstrap/javascript.html#transitions
 * ===================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


  /* CSS TRANSITION SUPPORT (http://www.modernizr.com/)
   * ======================================================= */

  $(function () {

    $.support.transition = (function () {

      var transitionEnd = (function () {

        var el = document.createElement('bootstrap')
          , transEndEventNames = {
               'WebkitTransition' : 'webkitTransitionEnd'
            ,  'MozTransition'    : 'transitionend'
            ,  'OTransition'      : 'oTransitionEnd otransitionend'
            ,  'transition'       : 'transitionend'
            }
          , name

        for (name in transEndEventNames){
          if (el.style[name] !== undefined) {
            return transEndEventNames[name]
          }
        }

      }())

      return transitionEnd && {
        end: transitionEnd
      }

    })()

  })

}(window.jQuery);
// enquire.js v2.0.0 - Awesome Media Queries in JavaScript
// Copyright (c) 2013 Nick Williams - http://wicky.nillia.ms/enquire.js
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

window.enquire=function(t){"use strict";function i(t,i){var n,s=0,e=t.length;for(s;e>s&&(n=i(t[s],s),n!==!1);s++);}function n(t){return"[object Array]"===Object.prototype.toString.apply(t)}function s(t){return"function"==typeof t}function e(t){this.options=t,!t.deferSetup&&this.setup()}function o(i,n){this.query=i,this.isUnconditional=n,this.handlers=[],this.mql=t(i);var s=this;this.listener=function(t){s.mql=t,s.assess()},this.mql.addListener(this.listener)}function r(){if(!t)throw Error("matchMedia not present, legacy browsers require a polyfill");this.queries={},this.browserIsIncapable=!t("only all").matches}return e.prototype={setup:function(){this.options.setup&&this.options.setup(),this.initialised=!0},on:function(){!this.initialised&&this.setup(),this.options.match&&this.options.match()},off:function(){this.options.unmatch&&this.options.unmatch()},destroy:function(){this.options.destroy?this.options.destroy():this.off()},equals:function(t){return this.options===t||this.options.match===t}},o.prototype={addHandler:function(t){var i=new e(t);this.handlers.push(i),this.mql.matches&&i.on()},removeHandler:function(t){var n=this.handlers;i(n,function(i,s){return i.equals(t)?(i.destroy(),!n.splice(s,1)):void 0})},clear:function(){i(this.handlers,function(t){t.destroy()}),this.mql.removeListener(this.listener),this.handlers.length=0},assess:function(){var t=this.mql.matches||this.isUnconditional?"on":"off";i(this.handlers,function(i){i[t]()})}},r.prototype={register:function(t,e,r){var h=this.queries,a=r&&this.browserIsIncapable;return h[t]||(h[t]=new o(t,a)),s(e)&&(e={match:e}),n(e)||(e=[e]),i(e,function(i){h[t].addHandler(i)}),this},unregister:function(t,i){var n=this.queries[t];return n&&(i?n.removeHandler(i):(n.clear(),delete this.queries[t])),this}},new r}(window.matchMedia);
/*! Sidr - v1.1.1 - 2013-03-14
 * https://github.com/artberri/sidr
 * Copyright (c) 2013 Alberto Varela; Licensed MIT */
(function(e){var t=!1,i=!1,o={isUrl:function(e){var t=RegExp("^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$","i");return t.test(e)?!0:!1},loadContent:function(e,t){e.html(t)},addPrefix:function(e){var t=e.attr("id"),i=e.attr("class");"string"==typeof t&&""!==t&&e.attr("id",t.replace(/([A-Za-z0-9_.\-]+)/g,"sidr-id-$1")),"string"==typeof i&&""!==i&&"sidr-inner"!==i&&e.attr("class",i.replace(/([A-Za-z0-9_.\-]+)/g,"sidr-class-$1")),e.removeAttr("style")},execute:function(o,n,s){"function"==typeof n?(s=n,n="sidr"):n||(n="sidr");var a,d,l,c=e("#"+n),f=e(c.data("body")),u=e("html"),p=c.outerWidth(!0),y=c.data("speed"),v=c.data("side");if("open"===o||"toogle"===o&&!c.is(":visible")){if(c.is(":visible")||t)return;if(i!==!1)return r.close(i,function(){r.open(n)}),void 0;t=!0,"left"===v?(a={left:p+"px"},d={left:"0px"}):(a={right:p+"px"},d={right:"0px"}),l=u.scrollTop(),u.css("overflow-x","hidden").scrollTop(l),f.css({width:f.width(),position:"absolute"}).animate(a,y),c.css("display","block").animate(d,y,function(){t=!1,i=n,"function"==typeof s&&s(n)})}else{if(!c.is(":visible")||t)return;t=!0,"left"===v?(a={left:0},d={left:"-"+p+"px"}):(a={right:0},d={right:"-"+p+"px"}),l=u.scrollTop(),u.removeAttr("style").scrollTop(l),f.animate(a,y),c.animate(d,y,function(){c.removeAttr("style"),f.removeAttr("style"),e("html").removeAttr("style"),t=!1,i=!1,"function"==typeof s&&s(n)})}}},r={open:function(e,t){o.execute("open",e,t)},close:function(e,t){o.execute("close",e,t)},toogle:function(e,t){o.execute("toogle",e,t)}};e.sidr=function(t){return r[t]?r[t].apply(this,Array.prototype.slice.call(arguments,1)):"function"!=typeof t&&"string"!=typeof t&&t?(e.error("Method "+t+" does not exist on jQuery.sidr"),void 0):r.toogle.apply(this,arguments)},e.fn.sidr=function(t){var i=e.extend({name:"sidr",speed:200,side:"left",source:null,renaming:!0,body:"body"},t),n=i.name,s=e("#"+n);if(0===s.length&&(s=e("<div />").attr("id",n).appendTo(e("body"))),s.addClass("sidr").addClass(i.side).data({speed:i.speed,side:i.side,body:i.body}),"function"==typeof i.source){var a=i.source(n);o.loadContent(s,a)}else if("string"==typeof i.source&&o.isUrl(i.source))e.get(i.source,function(e){o.loadContent(s,e)});else if("string"==typeof i.source){var d="",l=i.source.split(",");if(e.each(l,function(t,i){d+='<div class="sidr-inner">'+e(i).html()+"</div>"}),i.renaming){var c=e("<div />").html(d);c.find("*").each(function(t,i){var r=e(i);o.addPrefix(r)}),d=c.html()}o.loadContent(s,d)}else null!==i.source&&e.error("Invalid Sidr Source");return this.each(function(){var t=e(this),i=t.data("sidr");i||(t.data("sidr",n),t.click(function(e){e.preventDefault(),r.toogle(n)}))})}})(jQuery);
/**
 * jQuery Plugin to obtain touch gestures from iPhone, iPod Touch and iPad, should also work with Android mobile phones (not tested yet!)
 * Common usage: wipe images (left and right to show the previous or next image)
 * 
 * @author Andreas Waltl, netCU Internetagentur (http://www.netcu.de)
 * @version 1.1.1 (9th December 2010) - fix bug (older IE's had problems)
 * @version 1.1 (1st September 2010) - support wipe up and wipe down
 * @version 1.0 (15th July 2010)
 */
(function($){$.fn.touchwipe=function(settings){var config={min_move_x:20,min_move_y:20,wipeLeft:function(){},wipeRight:function(){},wipeUp:function(){},wipeDown:function(){},preventDefaultEvents:true};if(settings)$.extend(config,settings);this.each(function(){var startX;var startY;var isMoving=false;function cancelTouch(){this.removeEventListener('touchmove',onTouchMove);startX=null;isMoving=false}function onTouchMove(e){if(config.preventDefaultEvents){e.preventDefault()}if(isMoving){var x=e.touches[0].pageX;var y=e.touches[0].pageY;var dx=startX-x;var dy=startY-y;if(Math.abs(dx)>=config.min_move_x){cancelTouch();if(dx>0){config.wipeLeft()}else{config.wipeRight()}}else if(Math.abs(dy)>=config.min_move_y){cancelTouch();if(dy>0){config.wipeDown()}else{config.wipeUp()}}}}function onTouchStart(e){if(e.touches.length==1){startX=e.touches[0].pageX;startY=e.touches[0].pageY;isMoving=true;this.addEventListener('touchmove',onTouchMove,false)}}if('ontouchstart'in document.documentElement){this.addEventListener('touchstart',onTouchStart,false)}});return this}})(jQuery);
/* ==========================================================
 * bootstrap-carousel.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#carousel
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* CAROUSEL CLASS DEFINITION
  * ========================= */

  var Carousel = function (element, options) {
    this.$element = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options = options
    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.prototype = {

    cycle: function (e) {
      if (!e) this.paused = false
      if (this.interval) clearInterval(this.interval);
      this.options.interval
        && !this.paused
        && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))
      return this
    }

  , getActiveIndex: function () {
      this.$active = this.$element.find('.item.active')
      this.$items = this.$active.parent().children()
      return this.$items.index(this.$active)
    }

  , to: function (pos) {
      var activeIndex = this.getActiveIndex()
        , that = this

      if (pos > (this.$items.length - 1) || pos < 0) return

      if (this.sliding) {
        return this.$element.one('slid', function () {
          that.to(pos)
        })
      }

      if (activeIndex == pos) {
        return this.pause().cycle()
      }

      return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
    }

  , pause: function (e) {
      if (!e) this.paused = true
      if (this.$element.find('.next, .prev').length && $.support.transition.end) {
        this.$element.trigger($.support.transition.end)
        this.cycle(true)
      }
      clearInterval(this.interval)
      this.interval = null
      return this
    }

  , next: function () {
      if (this.sliding) return
      return this.slide('next')
    }

  , prev: function () {
      if (this.sliding) return
      return this.slide('prev')
    }

  , slide: function (type, next) {
      var $active = this.$element.find('.item.active')
        , $next = next || $active[type]()
        , isCycling = this.interval
        , direction = type == 'next' ? 'left' : 'right'
        , fallback  = type == 'next' ? 'first' : 'last'
        , that = this
        , e

      this.sliding = true

      isCycling && this.pause()

      $next = $next.length ? $next : this.$element.find('.item')[fallback]()

      e = $.Event('slide', {
        relatedTarget: $next[0]
      , direction: direction
      })

      if ($next.hasClass('active')) return

      if (this.$indicators.length) {
        this.$indicators.find('.active').removeClass('active')
        this.$element.one('slid', function () {
          var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
          $nextIndicator && $nextIndicator.addClass('active')
        })
      }

      if ($.support.transition && this.$element.hasClass('slide')) {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $next.addClass(type)
        $next[0].offsetWidth // force reflow
        $active.addClass(direction)
        $next.addClass(direction)
        this.$element.one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid') }, 0)
        })
      } else {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $active.removeClass('active')
        $next.addClass('active')
        this.sliding = false
        this.$element.trigger('slid')
      }

      isCycling && this.cycle()

      return this
    }

  }


 /* CAROUSEL PLUGIN DEFINITION
  * ========================== */

  var old = $.fn.carousel

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('carousel')
        , options = $.extend({}, $.fn.carousel.defaults, typeof option == 'object' && option)
        , action = typeof option == 'string' ? option : options.slide
      if (!data) $this.data('carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  $.fn.carousel.defaults = {
    interval: 5000
  , pause: 'hover'
  }

  $.fn.carousel.Constructor = Carousel


 /* CAROUSEL NO CONFLICT
  * ==================== */

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }

 /* CAROUSEL DATA-API
  * ================= */

  $(document).on('click.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var $this = $(this), href
      , $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      , options = $.extend({}, $target.data(), $this.data())
      , slideIndex

    $target.carousel(options)

    if (slideIndex = $this.attr('data-slide-to')) {
      $target.data('carousel').pause().to(slideIndex).cycle()
    }

    e.preventDefault()
  })

}(window.jQuery);
/* =========================================================
 * bootstrap-modal.js v2.3.0
 * http://twitter.github.com/bootstrap/javascript.html#modals
 * =========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */


!function ($) {

  "use strict"; // jshint ;_;


 /* MODAL CLASS DEFINITION
  * ====================== */

  var Modal = function (element, options) {
    this.options = options
    this.$element = $(element)
      .delegate('[data-dismiss="modal"]', 'click.dismiss.modal', $.proxy(this.hide, this))
    this.options.remote && this.$element.find('.modal-body').load(this.options.remote)
  }

  Modal.prototype = {

      constructor: Modal

    , toggle: function () {
        return this[!this.isShown ? 'show' : 'hide']()
      }

    , show: function () {
        var that = this
          , e = $.Event('show')

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.backdrop(function () {
          var transition = $.support.transition && that.$element.hasClass('fade')

          if (!that.$element.parent().length) {
            that.$element.appendTo(document.body) //don't move modals dom position
          }

          that.$element.show()

          if (transition) {
            that.$element[0].offsetWidth // force reflow
          }
          /*
          that.$element
            .addClass('in')
            .attr('aria-hidden', false)
          */
          that.$element.show(1).addClass('in')
          that.enforceFocus()

          transition ?
            that.$element.one($.support.transition.end, function () { that.$element.focus().trigger('shown') }) :
            that.$element.focus().trigger('shown')

        })
      }

    , hide: function (e) {
        e && e.preventDefault()

        var that = this

        e = $.Event('hide')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        this.escape()

        $(document).off('focusin.modal')

        this.$element
          .removeClass('in')
          .attr('aria-hidden', true)

        $.support.transition && this.$element.hasClass('fade') ?
          this.hideWithTransition() :
          this.hideModal()
      }

    , enforceFocus: function () {
        var that = this
        $(document).on('focusin.modal', function (e) {
          if (that.$element[0] !== e.target && !that.$element.has(e.target).length) {
            that.$element.focus()
          }
        })
      }

    , escape: function () {
        var that = this
        if (this.isShown && this.options.keyboard) {
          this.$element.on('keyup.dismiss.modal', function ( e ) {
            e.which == 27 && that.hide()
          })
        } else if (!this.isShown) {
          this.$element.off('keyup.dismiss.modal')
        }
      }

    , hideWithTransition: function () {
        var that = this
          , timeout = setTimeout(function () {
              that.$element.off($.support.transition.end)
              that.hideModal()
            }, 500)

        this.$element.one($.support.transition.end, function () {
          clearTimeout(timeout)
          that.hideModal()
        })
      }

    , hideModal: function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
          that.removeBackdrop()
          that.$element.trigger('hidden')
        })
      }

    , removeBackdrop: function () {
        this.$backdrop.remove()
        this.$backdrop = null
      }

    , backdrop: function (callback) {
        var that = this
          , animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
          var doAnimate = $.support.transition && animate

          this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
            .appendTo(document.body)

          this.$backdrop.click(
            this.options.backdrop == 'static' ?
              $.proxy(this.$element[0].focus, this.$element[0])
            : $.proxy(this.hide, this)
          )

          if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

          this.$backdrop.addClass('in')

          if (!callback) return

          doAnimate ?
            this.$backdrop.one($.support.transition.end, callback) :
            callback()

        } else if (!this.isShown && this.$backdrop) {
          this.$backdrop.removeClass('in')

          $.support.transition && this.$element.hasClass('fade')?
            this.$backdrop.one($.support.transition.end, callback) :
            callback()

        } else if (callback) {
          callback()
        }
      }
  }


 /* MODAL PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.modal

  $.fn.modal = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('modal')
        , options = $.extend({}, $.fn.modal.defaults, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option]()
      else if (options.show) data.show()
    })
  }

  $.fn.modal.defaults = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  $.fn.modal.Constructor = Modal


 /* MODAL NO CONFLICT
  * ================= */

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


 /* MODAL DATA-API
  * ============== */

  $(document).on('click.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this = $(this)
      , href = $this.attr('href')
      , $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
      , option = $target.data('modal') ? 'toggle' : $.extend({ remote:!/#/.test(href) && href }, $target.data(), $this.data())

    e.preventDefault()

    $target
      .modal(option)
      .one('hide', function () {
        $this.focus()
      })
  })

}(window.jQuery);

/* ===================================================
 * bootstrap-transition.js v2.3.0
 * http://twitter.github.com/bootstrap/javascript.html#transitions
 * ===================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


  /* CSS TRANSITION SUPPORT (http://www.modernizr.com/)
   * ======================================================= */

  $(function () {

    $.support.transition = (function () {

      var transitionEnd = (function () {

        var el = document.createElement('bootstrap')
          , transEndEventNames = {
               'WebkitTransition' : 'webkitTransitionEnd'
            ,  'MozTransition'    : 'transitionend'
            ,  'OTransition'      : 'oTransitionEnd otransitionend'
            ,  'transition'       : 'transitionend'
            }
          , name

        for (name in transEndEventNames){
          if (el.style[name] !== undefined) {
            return transEndEventNames[name]
          }
        }

      }())

      return transitionEnd && {
        end: transitionEnd
      }

    })()

  })

}(window.jQuery);
// enquire.js v2.0.0 - Awesome Media Queries in JavaScript
// Copyright (c) 2013 Nick Williams - http://wicky.nillia.ms/enquire.js
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

window.enquire=function(t){"use strict";function i(t,i){var n,s=0,e=t.length;for(s;e>s&&(n=i(t[s],s),n!==!1);s++);}function n(t){return"[object Array]"===Object.prototype.toString.apply(t)}function s(t){return"function"==typeof t}function e(t){this.options=t,!t.deferSetup&&this.setup()}function o(i,n){this.query=i,this.isUnconditional=n,this.handlers=[],this.mql=t(i);var s=this;this.listener=function(t){s.mql=t,s.assess()},this.mql.addListener(this.listener)}function r(){if(!t)throw Error("matchMedia not present, legacy browsers require a polyfill");this.queries={},this.browserIsIncapable=!t("only all").matches}return e.prototype={setup:function(){this.options.setup&&this.options.setup(),this.initialised=!0},on:function(){!this.initialised&&this.setup(),this.options.match&&this.options.match()},off:function(){this.options.unmatch&&this.options.unmatch()},destroy:function(){this.options.destroy?this.options.destroy():this.off()},equals:function(t){return this.options===t||this.options.match===t}},o.prototype={addHandler:function(t){var i=new e(t);this.handlers.push(i),this.mql.matches&&i.on()},removeHandler:function(t){var n=this.handlers;i(n,function(i,s){return i.equals(t)?(i.destroy(),!n.splice(s,1)):void 0})},clear:function(){i(this.handlers,function(t){t.destroy()}),this.mql.removeListener(this.listener),this.handlers.length=0},assess:function(){var t=this.mql.matches||this.isUnconditional?"on":"off";i(this.handlers,function(i){i[t]()})}},r.prototype={register:function(t,e,r){var h=this.queries,a=r&&this.browserIsIncapable;return h[t]||(h[t]=new o(t,a)),s(e)&&(e={match:e}),n(e)||(e=[e]),i(e,function(i){h[t].addHandler(i)}),this},unregister:function(t,i){var n=this.queries[t];return n&&(i?n.removeHandler(i):(n.clear(),delete this.queries[t])),this}},new r}(window.matchMedia);
/*! Sidr - v1.1.1 - 2013-03-14
 * https://github.com/artberri/sidr
 * Copyright (c) 2013 Alberto Varela; Licensed MIT */
(function(e){var t=!1,i=!1,o={isUrl:function(e){var t=RegExp("^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$","i");return t.test(e)?!0:!1},loadContent:function(e,t){e.html(t)},addPrefix:function(e){var t=e.attr("id"),i=e.attr("class");"string"==typeof t&&""!==t&&e.attr("id",t.replace(/([A-Za-z0-9_.\-]+)/g,"sidr-id-$1")),"string"==typeof i&&""!==i&&"sidr-inner"!==i&&e.attr("class",i.replace(/([A-Za-z0-9_.\-]+)/g,"sidr-class-$1")),e.removeAttr("style")},execute:function(o,n,s){"function"==typeof n?(s=n,n="sidr"):n||(n="sidr");var a,d,l,c=e("#"+n),f=e(c.data("body")),u=e("html"),p=c.outerWidth(!0),y=c.data("speed"),v=c.data("side");if("open"===o||"toogle"===o&&!c.is(":visible")){if(c.is(":visible")||t)return;if(i!==!1)return r.close(i,function(){r.open(n)}),void 0;t=!0,"left"===v?(a={left:p+"px"},d={left:"0px"}):(a={right:p+"px"},d={right:"0px"}),l=u.scrollTop(),u.css("overflow-x","hidden").scrollTop(l),f.css({width:f.width(),position:"absolute"}).animate(a,y),c.css("display","block").animate(d,y,function(){t=!1,i=n,"function"==typeof s&&s(n)})}else{if(!c.is(":visible")||t)return;t=!0,"left"===v?(a={left:0},d={left:"-"+p+"px"}):(a={right:0},d={right:"-"+p+"px"}),l=u.scrollTop(),u.removeAttr("style").scrollTop(l),f.animate(a,y),c.animate(d,y,function(){c.removeAttr("style"),f.removeAttr("style"),e("html").removeAttr("style"),t=!1,i=!1,"function"==typeof s&&s(n)})}}},r={open:function(e,t){o.execute("open",e,t)},close:function(e,t){o.execute("close",e,t)},toogle:function(e,t){o.execute("toogle",e,t)}};e.sidr=function(t){return r[t]?r[t].apply(this,Array.prototype.slice.call(arguments,1)):"function"!=typeof t&&"string"!=typeof t&&t?(e.error("Method "+t+" does not exist on jQuery.sidr"),void 0):r.toogle.apply(this,arguments)},e.fn.sidr=function(t){var i=e.extend({name:"sidr",speed:200,side:"left",source:null,renaming:!0,body:"body"},t),n=i.name,s=e("#"+n);if(0===s.length&&(s=e("<div />").attr("id",n).appendTo(e("body"))),s.addClass("sidr").addClass(i.side).data({speed:i.speed,side:i.side,body:i.body}),"function"==typeof i.source){var a=i.source(n);o.loadContent(s,a)}else if("string"==typeof i.source&&o.isUrl(i.source))e.get(i.source,function(e){o.loadContent(s,e)});else if("string"==typeof i.source){var d="",l=i.source.split(",");if(e.each(l,function(t,i){d+='<div class="sidr-inner">'+e(i).html()+"</div>"}),i.renaming){var c=e("<div />").html(d);c.find("*").each(function(t,i){var r=e(i);o.addPrefix(r)}),d=c.html()}o.loadContent(s,d)}else null!==i.source&&e.error("Invalid Sidr Source");return this.each(function(){var t=e(this),i=t.data("sidr");i||(t.data("sidr",n),t.click(function(e){e.preventDefault(),r.toogle(n)}))})}})(jQuery);
/**
 * jQuery Plugin to obtain touch gestures from iPhone, iPod Touch and iPad, should also work with Android mobile phones (not tested yet!)
 * Common usage: wipe images (left and right to show the previous or next image)
 * 
 * @author Andreas Waltl, netCU Internetagentur (http://www.netcu.de)
 * @version 1.1.1 (9th December 2010) - fix bug (older IE's had problems)
 * @version 1.1 (1st September 2010) - support wipe up and wipe down
 * @version 1.0 (15th July 2010)
 */
(function($){$.fn.touchwipe=function(settings){var config={min_move_x:20,min_move_y:20,wipeLeft:function(){},wipeRight:function(){},wipeUp:function(){},wipeDown:function(){},preventDefaultEvents:true};if(settings)$.extend(config,settings);this.each(function(){var startX;var startY;var isMoving=false;function cancelTouch(){this.removeEventListener('touchmove',onTouchMove);startX=null;isMoving=false}function onTouchMove(e){if(config.preventDefaultEvents){e.preventDefault()}if(isMoving){var x=e.touches[0].pageX;var y=e.touches[0].pageY;var dx=startX-x;var dy=startY-y;if(Math.abs(dx)>=config.min_move_x){cancelTouch();if(dx>0){config.wipeLeft()}else{config.wipeRight()}}else if(Math.abs(dy)>=config.min_move_y){cancelTouch();if(dy>0){config.wipeDown()}else{config.wipeUp()}}}}function onTouchStart(e){if(e.touches.length==1){startX=e.touches[0].pageX;startY=e.touches[0].pageY;isMoving=true;this.addEventListener('touchmove',onTouchMove,false)}}if('ontouchstart'in document.documentElement){this.addEventListener('touchstart',onTouchStart,false)}});return this}})(jQuery);
/* Modernizr 2.6.2 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-csstransitions-shiv-cssclasses-testprop-testallprops-domprefixes-load
 */
;window.Modernizr=function(a,b,c){function x(a){j.cssText=a}function y(a,b){return x(prefixes.join(a+";")+(b||""))}function z(a,b){return typeof a===b}function A(a,b){return!!~(""+a).indexOf(b)}function B(a,b){for(var d in a){var e=a[d];if(!A(e,"-")&&j[e]!==c)return b=="pfx"?e:!0}return!1}function C(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:z(f,"function")?f.bind(d||b):f}return!1}function D(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+" "+n.join(d+" ")+d).split(" ");return z(b,"string")||z(b,"undefined")?B(e,b):(e=(a+" "+o.join(d+" ")+d).split(" "),C(e,b,c))}var d="2.6.2",e={},f=!0,g=b.documentElement,h="modernizr",i=b.createElement(h),j=i.style,k,l={}.toString,m="Webkit Moz O ms",n=m.split(" "),o=m.toLowerCase().split(" "),p={},q={},r={},s=[],t=s.slice,u,v={}.hasOwnProperty,w;!z(v,"undefined")&&!z(v.call,"undefined")?w=function(a,b){return v.call(a,b)}:w=function(a,b){return b in a&&z(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=t.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(t.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(t.call(arguments)))};return e}),p.csstransitions=function(){return D("transition")};for(var E in p)w(p,E)&&(u=E.toLowerCase(),e[u]=p[E](),s.push((e[u]?"":"no-")+u));return e.addTest=function(a,b){if(typeof a=="object")for(var d in a)w(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof f!="undefined"&&f&&(g.className+=" "+(b?"":"no-")+a),e[a]=b}return e},x(""),i=k=null,function(a,b){function k(a,b){var c=a.createElement("p"),d=a.getElementsByTagName("head")[0]||a.documentElement;return c.innerHTML="x<style>"+b+"</style>",d.insertBefore(c.lastChild,d.firstChild)}function l(){var a=r.elements;return typeof a=="string"?a.split(" "):a}function m(a){var b=i[a[g]];return b||(b={},h++,a[g]=h,i[h]=b),b}function n(a,c,f){c||(c=b);if(j)return c.createElement(a);f||(f=m(c));var g;return f.cache[a]?g=f.cache[a].cloneNode():e.test(a)?g=(f.cache[a]=f.createElem(a)).cloneNode():g=f.createElem(a),g.canHaveChildren&&!d.test(a)?f.frag.appendChild(g):g}function o(a,c){a||(a=b);if(j)return a.createDocumentFragment();c=c||m(a);var d=c.frag.cloneNode(),e=0,f=l(),g=f.length;for(;e<g;e++)d.createElement(f[e]);return d}function p(a,b){b.cache||(b.cache={},b.createElem=a.createElement,b.createFrag=a.createDocumentFragment,b.frag=b.createFrag()),a.createElement=function(c){return r.shivMethods?n(c,a,b):b.createElem(c)},a.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+l().join().replace(/\w+/g,function(a){return b.createElem(a),b.frag.createElement(a),'c("'+a+'")'})+");return n}")(r,b.frag)}function q(a){a||(a=b);var c=m(a);return r.shivCSS&&!f&&!c.hasCSS&&(c.hasCSS=!!k(a,"article,aside,figcaption,figure,footer,header,hgroup,nav,section{display:block}mark{background:#FF0;color:#000}")),j||p(a,c),a}var c=a.html5||{},d=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,e=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,f,g="_html5shiv",h=0,i={},j;(function(){try{var a=b.createElement("a");a.innerHTML="<xyz></xyz>",f="hidden"in a,j=a.childNodes.length==1||function(){b.createElement("a");var a=b.createDocumentFragment();return typeof a.cloneNode=="undefined"||typeof a.createDocumentFragment=="undefined"||typeof a.createElement=="undefined"}()}catch(c){f=!0,j=!0}})();var r={elements:c.elements||"abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video",shivCSS:c.shivCSS!==!1,supportsUnknownElements:j,shivMethods:c.shivMethods!==!1,type:"default",shivDocument:q,createElement:n,createDocumentFragment:o};a.html5=r,q(b)}(this,b),e._version=d,e._domPrefixes=o,e._cssomPrefixes=n,e.testProp=function(a){return B([a])},e.testAllProps=D,g.className=g.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(f?" js "+s.join(" "):""),e}(this,this.document),function(a,b,c){function d(a){return"[object Function]"==o.call(a)}function e(a){return"string"==typeof a}function f(){}function g(a){return!a||"loaded"==a||"complete"==a||"uninitialized"==a}function h(){var a=p.shift();q=1,a?a.t?m(function(){("c"==a.t?B.injectCss:B.injectJs)(a.s,0,a.a,a.x,a.e,1)},0):(a(),h()):q=0}function i(a,c,d,e,f,i,j){function k(b){if(!o&&g(l.readyState)&&(u.r=o=1,!q&&h(),l.onload=l.onreadystatechange=null,b)){"img"!=a&&m(function(){t.removeChild(l)},50);for(var d in y[c])y[c].hasOwnProperty(d)&&y[c][d].onload()}}var j=j||B.errorTimeout,l=b.createElement(a),o=0,r=0,u={t:d,s:c,e:f,a:i,x:j};1===y[c]&&(r=1,y[c]=[]),"object"==a?l.data=c:(l.src=c,l.type=a),l.width=l.height="0",l.onerror=l.onload=l.onreadystatechange=function(){k.call(this,r)},p.splice(e,0,u),"img"!=a&&(r||2===y[c]?(t.insertBefore(l,s?null:n),m(k,j)):y[c].push(l))}function j(a,b,c,d,f){return q=0,b=b||"j",e(a)?i("c"==b?v:u,a,b,this.i++,c,d,f):(p.splice(this.i++,0,a),1==p.length&&h()),this}function k(){var a=B;return a.loader={load:j,i:0},a}var l=b.documentElement,m=a.setTimeout,n=b.getElementsByTagName("script")[0],o={}.toString,p=[],q=0,r="MozAppearance"in l.style,s=r&&!!b.createRange().compareNode,t=s?l:n.parentNode,l=a.opera&&"[object Opera]"==o.call(a.opera),l=!!b.attachEvent&&!l,u=r?"object":l?"script":"img",v=l?"script":u,w=Array.isArray||function(a){return"[object Array]"==o.call(a)},x=[],y={},z={timeout:function(a,b){return b.length&&(a.timeout=b[0]),a}},A,B;B=function(a){function b(a){var a=a.split("!"),b=x.length,c=a.pop(),d=a.length,c={url:c,origUrl:c,prefixes:a},e,f,g;for(f=0;f<d;f++)g=a[f].split("="),(e=z[g.shift()])&&(c=e(c,g));for(f=0;f<b;f++)c=x[f](c);return c}function g(a,e,f,g,h){var i=b(a),j=i.autoCallback;i.url.split(".").pop().split("?").shift(),i.bypass||(e&&(e=d(e)?e:e[a]||e[g]||e[a.split("/").pop().split("?")[0]]),i.instead?i.instead(a,e,f,g,h):(y[i.url]?i.noexec=!0:y[i.url]=1,f.load(i.url,i.forceCSS||!i.forceJS&&"css"==i.url.split(".").pop().split("?").shift()?"c":c,i.noexec,i.attrs,i.timeout),(d(e)||d(j))&&f.load(function(){k(),e&&e(i.origUrl,h,g),j&&j(i.origUrl,h,g),y[i.url]=2})))}function h(a,b){function c(a,c){if(a){if(e(a))c||(j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}),g(a,j,b,0,h);else if(Object(a)===a)for(n in m=function(){var b=0,c;for(c in a)a.hasOwnProperty(c)&&b++;return b}(),a)a.hasOwnProperty(n)&&(!c&&!--m&&(d(j)?j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}:j[n]=function(a){return function(){var b=[].slice.call(arguments);a&&a.apply(this,b),l()}}(k[n])),g(a[n],j,b,n,h))}else!c&&l()}var h=!!a.test,i=a.load||a.both,j=a.callback||f,k=j,l=a.complete||f,m,n;c(h?a.yep:a.nope,!!i),i&&c(i)}var i,j,l=this.yepnope.loader;if(e(a))g(a,0,l,0);else if(w(a))for(i=0;i<a.length;i++)j=a[i],e(j)?g(j,0,l,0):w(j)?B(j):Object(j)===j&&h(j,l);else Object(a)===a&&h(a,l)},B.addPrefix=function(a,b){z[a]=b},B.addFilter=function(a){x.push(a)},B.errorTimeout=1e4,null==b.readyState&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",A=function(){b.removeEventListener("DOMContentLoaded",A,0),b.readyState="complete"},0)),a.yepnope=k(),a.yepnope.executeStack=h,a.yepnope.injectJs=function(a,c,d,e,i,j){var k=b.createElement("script"),l,o,e=e||B.errorTimeout;k.src=a;for(o in d)k.setAttribute(o,d[o]);c=j?h:c||f,k.onreadystatechange=k.onload=function(){!l&&g(k.readyState)&&(l=1,c(),k.onload=k.onreadystatechange=null)},m(function(){l||(l=1,c(1))},e),i?k.onload():n.parentNode.insertBefore(k,n)},a.yepnope.injectCss=function(a,c,d,e,g,i){var e=b.createElement("link"),j,c=i?h:c||f;e.href=a,e.rel="stylesheet",e.type="text/css";for(j in d)e.setAttribute(j,d[j]);g||(n.parentNode.insertBefore(e,n),m(c,0))}}(this,document),Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0))};
;( function( $, window, undefined ) {
 
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

    $(".portfolio-item a").click(function(e) {
        e.preventDefault();
        var t = $(this).attr("href");
        var d = $(this).data("slug");
        var p = $("#portfolio");
        p.addClass("fadeOut");
        window.setTimeout(p.load(t, function() {
            history.pushState(null, null, d);
            p.removeClass("fadeOut");
        }),1500);
        //return false;
    });

    $(".back").on("click", function(e) {
        e.preventDefault();
        var p = $("#portfolio");
        p.addClass("fadeOut");
        window.setTimeout(p.load("portfolio.html", function() {
            history.pushState(null, null, "/");
            p.removeClass("fadeOut");
        }), 1500);
        return false;
    });    

    function resizePortfolioItems() {

        var items = $(".portfolio-item").get();
        for(i=0;i<items.length;i++) {
            var _this = $(items[i]);
            var w = _this.width();
            var offset = (-i*w) + "px 0";
            console.log(offset);
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
function beforePrint(){$(".testimonials").cbpQTRotator("destroy")}function afterPrint(){$(".testimonials").cbpQTRotator("_init")}if(!function(t){"use strict";var e=function(e,n){this.$element=t(e),this.$indicators=this.$element.find(".carousel-indicators"),this.options=n,"hover"==this.options.pause&&this.$element.on("mouseenter",t.proxy(this.pause,this)).on("mouseleave",t.proxy(this.cycle,this))};e.prototype={cycle:function(e){return e||(this.paused=!1),this.interval&&clearInterval(this.interval),this.options.interval&&!this.paused&&(this.interval=setInterval(t.proxy(this.next,this),this.options.interval)),this},getActiveIndex:function(){return this.$active=this.$element.find(".item.active"),this.$items=this.$active.parent().children(),this.$items.index(this.$active)},to:function(e){var n=this.getActiveIndex(),i=this;if(!(e>this.$items.length-1||0>e))return this.sliding?this.$element.one("slid",function(){i.to(e)}):n==e?this.pause().cycle():this.slide(e>n?"next":"prev",t(this.$items[e]))},pause:function(e){return e||(this.paused=!0),this.$element.find(".next, .prev").length&&t.support.transition.end&&(this.$element.trigger(t.support.transition.end),this.cycle(!0)),clearInterval(this.interval),this.interval=null,this},next:function(){return this.sliding?void 0:this.slide("next")},prev:function(){return this.sliding?void 0:this.slide("prev")},slide:function(e,n){var i,o=this.$element.find(".item.active"),s=n||o[e](),r=this.interval,a="next"==e?"left":"right",c="next"==e?"first":"last",l=this;if(this.sliding=!0,r&&this.pause(),s=s.length?s:this.$element.find(".item")[c](),i=t.Event("slide",{relatedTarget:s[0],direction:a}),!s.hasClass("active")){if(this.$indicators.length&&(this.$indicators.find(".active").removeClass("active"),this.$element.one("slid",function(){var e=t(l.$indicators.children()[l.getActiveIndex()]);e&&e.addClass("active")})),t.support.transition&&this.$element.hasClass("slide")){if(this.$element.trigger(i),i.isDefaultPrevented())return;s.addClass(e),s[0].offsetWidth,o.addClass(a),s.addClass(a),this.$element.one(t.support.transition.end,function(){s.removeClass([e,a].join(" ")).addClass("active"),o.removeClass(["active",a].join(" ")),l.sliding=!1,setTimeout(function(){l.$element.trigger("slid")},0)})}else{if(this.$element.trigger(i),i.isDefaultPrevented())return;o.removeClass("active"),s.addClass("active"),this.sliding=!1,this.$element.trigger("slid")}return r&&this.cycle(),this}}};var n=t.fn.carousel;t.fn.carousel=function(n){return this.each(function(){var i=t(this),o=i.data("carousel"),s=t.extend({},t.fn.carousel.defaults,"object"==typeof n&&n),r="string"==typeof n?n:s.slide;o||i.data("carousel",o=new e(this,s)),"number"==typeof n?o.to(n):r?o[r]():s.interval&&o.pause().cycle()})},t.fn.carousel.defaults={interval:5e3,pause:"hover"},t.fn.carousel.Constructor=e,t.fn.carousel.noConflict=function(){return t.fn.carousel=n,this},t(document).on("click.carousel.data-api","[data-slide], [data-slide-to]",function(e){var n,i,o=t(this),s=t(o.attr("data-target")||(n=o.attr("href"))&&n.replace(/.*(?=#[^\s]+$)/,"")),r=t.extend({},s.data(),o.data());s.carousel(r),(i=o.attr("data-slide-to"))&&s.data("carousel").pause().to(i).cycle(),e.preventDefault()})}(window.jQuery),!function(t){"use strict";var e=function(e,n){this.options=n,this.$element=t(e).delegate('[data-dismiss="modal"]',"click.dismiss.modal",t.proxy(this.hide,this)),this.options.remote&&this.$element.find(".modal-body").load(this.options.remote)};e.prototype={constructor:e,toggle:function(){return this[this.isShown?"hide":"show"]()},show:function(){var e=this,n=t.Event("show");this.$element.trigger(n),this.isShown||n.isDefaultPrevented()||(this.isShown=!0,this.escape(),this.backdrop(function(){var n=t.support.transition&&e.$element.hasClass("fade");e.$element.parent().length||e.$element.appendTo(document.body),e.$element.show(),n&&e.$element[0].offsetWidth,e.$element.show(1).addClass("in"),e.enforceFocus(),n?e.$element.one(t.support.transition.end,function(){e.$element.focus().trigger("shown")}):e.$element.focus().trigger("shown")}))},hide:function(e){e&&e.preventDefault(),e=t.Event("hide"),this.$element.trigger(e),this.isShown&&!e.isDefaultPrevented()&&(this.isShown=!1,this.escape(),t(document).off("focusin.modal"),this.$element.removeClass("in").attr("aria-hidden",!0),t.support.transition&&this.$element.hasClass("fade")?this.hideWithTransition():this.hideModal())},enforceFocus:function(){var e=this;t(document).on("focusin.modal",function(t){e.$element[0]===t.target||e.$element.has(t.target).length||e.$element.focus()})},escape:function(){var t=this;this.isShown&&this.options.keyboard?this.$element.on("keyup.dismiss.modal",function(e){27==e.which&&t.hide()}):this.isShown||this.$element.off("keyup.dismiss.modal")},hideWithTransition:function(){var e=this,n=setTimeout(function(){e.$element.off(t.support.transition.end),e.hideModal()},500);this.$element.one(t.support.transition.end,function(){clearTimeout(n),e.hideModal()})},hideModal:function(){var t=this;this.$element.hide(),this.backdrop(function(){t.removeBackdrop(),t.$element.trigger("hidden")})},removeBackdrop:function(){this.$backdrop.remove(),this.$backdrop=null},backdrop:function(e){var n=this.$element.hasClass("fade")?"fade":"";if(this.isShown&&this.options.backdrop){var i=t.support.transition&&n;if(this.$backdrop=t('<div class="modal-backdrop '+n+'" />').appendTo(document.body),this.$backdrop.click("static"==this.options.backdrop?t.proxy(this.$element[0].focus,this.$element[0]):t.proxy(this.hide,this)),i&&this.$backdrop[0].offsetWidth,this.$backdrop.addClass("in"),!e)return;i?this.$backdrop.one(t.support.transition.end,e):e()}else!this.isShown&&this.$backdrop?(this.$backdrop.removeClass("in"),t.support.transition&&this.$element.hasClass("fade")?this.$backdrop.one(t.support.transition.end,e):e()):e&&e()}};var n=t.fn.modal;t.fn.modal=function(n){return this.each(function(){var i=t(this),o=i.data("modal"),s=t.extend({},t.fn.modal.defaults,i.data(),"object"==typeof n&&n);o||i.data("modal",o=new e(this,s)),"string"==typeof n?o[n]():s.show&&o.show()})},t.fn.modal.defaults={backdrop:!0,keyboard:!0,show:!0},t.fn.modal.Constructor=e,t.fn.modal.noConflict=function(){return t.fn.modal=n,this},t(document).on("click.modal.data-api",'[data-toggle="modal"]',function(e){var n=t(this),i=n.attr("href"),o=t(n.attr("data-target")||i&&i.replace(/.*(?=#[^\s]+$)/,"")),s=o.data("modal")?"toggle":t.extend({remote:!/#/.test(i)&&i},o.data(),n.data());e.preventDefault(),o.modal(s).one("hide",function(){n.focus()})})}(window.jQuery),!function(t){"use strict";t(function(){t.support.transition=function(){var t=function(){var t,e=document.createElement("bootstrap"),n={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(t in n)if(void 0!==e.style[t])return n[t]}();return t&&{end:t}}()})}(window.jQuery),window.enquire=function(t){"use strict";function e(t,e){var n,i=0,o=t.length;for(i;o>i&&(n=e(t[i],i),n!==!1);i++);}function n(t){return"[object Array]"===Object.prototype.toString.apply(t)}function i(t){return"function"==typeof t}function o(t){this.options=t,!t.deferSetup&&this.setup()}function s(e,n){this.query=e,this.isUnconditional=n,this.handlers=[],this.mql=t(e);var i=this;this.listener=function(t){i.mql=t,i.assess()},this.mql.addListener(this.listener)}function r(){if(!t)throw Error("matchMedia not present, legacy browsers require a polyfill");this.queries={},this.browserIsIncapable=!t("only all").matches}return o.prototype={setup:function(){this.options.setup&&this.options.setup(),this.initialised=!0},on:function(){!this.initialised&&this.setup(),this.options.match&&this.options.match()},off:function(){this.options.unmatch&&this.options.unmatch()},destroy:function(){this.options.destroy?this.options.destroy():this.off()},equals:function(t){return this.options===t||this.options.match===t}},s.prototype={addHandler:function(t){var e=new o(t);this.handlers.push(e),this.mql.matches&&e.on()},removeHandler:function(t){var n=this.handlers;e(n,function(e,i){return e.equals(t)?(e.destroy(),!n.splice(i,1)):void 0})},clear:function(){e(this.handlers,function(t){t.destroy()}),this.mql.removeListener(this.listener),this.handlers.length=0},assess:function(){var t=this.mql.matches||this.isUnconditional?"on":"off";e(this.handlers,function(e){e[t]()})}},r.prototype={register:function(t,o,r){var a=this.queries,c=r&&this.browserIsIncapable;return a[t]||(a[t]=new s(t,c)),i(o)&&(o={match:o}),n(o)||(o=[o]),e(o,function(e){a[t].addHandler(e)}),this},unregister:function(t,e){var n=this.queries[t];return n&&(e?n.removeHandler(e):(n.clear(),delete this.queries[t])),this}},new r}(window.matchMedia),function(t){var e=!1,n=!1,i={isUrl:function(t){var e=RegExp("^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$","i");return e.test(t)?!0:!1},loadContent:function(t,e){t.html(e)},addPrefix:function(t){var e=t.attr("id"),n=t.attr("class");"string"==typeof e&&""!==e&&t.attr("id",e.replace(/([A-Za-z0-9_.\-]+)/g,"sidr-id-$1")),"string"==typeof n&&""!==n&&"sidr-inner"!==n&&t.attr("class",n.replace(/([A-Za-z0-9_.\-]+)/g,"sidr-class-$1")),t.removeAttr("style")},execute:function(i,s,r){"function"==typeof s?(r=s,s="sidr"):s||(s="sidr");var a,c,l,u=t("#"+s),d=t(u.data("body")),h=t("html"),f=u.outerWidth(!0),p=u.data("speed"),m=u.data("side");if("open"===i||"toogle"===i&&!u.is(":visible")){if(u.is(":visible")||e)return;if(n!==!1)return o.close(n,function(){o.open(s)}),void 0;e=!0,"left"===m?(a={left:f+"px"},c={left:"0px"}):(a={right:f+"px"},c={right:"0px"}),l=h.scrollTop(),h.css("overflow-x","hidden").scrollTop(l),d.css({width:d.width(),position:"absolute"}).animate(a,p),u.css("display","block").animate(c,p,function(){e=!1,n=s,"function"==typeof r&&r(s)})}else{if(!u.is(":visible")||e)return;e=!0,"left"===m?(a={left:0},c={left:"-"+f+"px"}):(a={right:0},c={right:"-"+f+"px"}),l=h.scrollTop(),h.removeAttr("style").scrollTop(l),d.animate(a,p),u.animate(c,p,function(){u.removeAttr("style"),d.removeAttr("style"),t("html").removeAttr("style"),e=!1,n=!1,"function"==typeof r&&r(s)})}}},o={open:function(t,e){i.execute("open",t,e)},close:function(t,e){i.execute("close",t,e)},toogle:function(t,e){i.execute("toogle",t,e)}};t.sidr=function(e){return o[e]?o[e].apply(this,Array.prototype.slice.call(arguments,1)):"function"!=typeof e&&"string"!=typeof e&&e?(t.error("Method "+e+" does not exist on jQuery.sidr"),void 0):o.toogle.apply(this,arguments)},t.fn.sidr=function(e){var n=t.extend({name:"sidr",speed:200,side:"left",source:null,renaming:!0,body:"body"},e),s=n.name,r=t("#"+s);if(0===r.length&&(r=t("<div />").attr("id",s).appendTo(t("body"))),r.addClass("sidr").addClass(n.side).data({speed:n.speed,side:n.side,body:n.body}),"function"==typeof n.source){var a=n.source(s);i.loadContent(r,a)}else if("string"==typeof n.source&&i.isUrl(n.source))t.get(n.source,function(t){i.loadContent(r,t)});else if("string"==typeof n.source){var c="",l=n.source.split(",");if(t.each(l,function(e,n){c+='<div class="sidr-inner">'+t(n).html()+"</div>"}),n.renaming){var u=t("<div />").html(c);u.find("*").each(function(e,n){var o=t(n);i.addPrefix(o)}),c=u.html()}i.loadContent(r,c)}else null!==n.source&&t.error("Invalid Sidr Source");return this.each(function(){var e=t(this),n=e.data("sidr");n||(e.data("sidr",s),e.click(function(t){t.preventDefault(),o.toogle(s)}))})}}(jQuery),function(t){t.fn.touchwipe=function(e){var n={min_move_x:20,min_move_y:20,wipeLeft:function(){},wipeRight:function(){},wipeUp:function(){},wipeDown:function(){},preventDefaultEvents:!0};return e&&t.extend(n,e),this.each(function(){function t(){this.removeEventListener("touchmove",e),o=null,r=!1}function e(e){if(n.preventDefaultEvents&&e.preventDefault(),r){var i=e.touches[0].pageX,a=e.touches[0].pageY,c=o-i,l=s-a;Math.abs(c)>=n.min_move_x?(t(),c>0?n.wipeLeft():n.wipeRight()):Math.abs(l)>=n.min_move_y&&(t(),l>0?n.wipeDown():n.wipeUp())}}function i(t){1==t.touches.length&&(o=t.touches[0].pageX,s=t.touches[0].pageY,r=!0,this.addEventListener("touchmove",e,!1))}var o,s,r=!1;"ontouchstart"in document.documentElement&&this.addEventListener("touchstart",i,!1)}),this}}(jQuery),window.Modernizr=function(t,e,n){function i(t){y.cssText=t}function o(t,e){return typeof t===e}function s(t,e){return!!~(""+t).indexOf(e)}function r(t,e){for(var i in t){var o=t[i];if(!s(o,"-")&&y[o]!==n)return"pfx"==e?o:!0}return!1}function a(t,e,i){for(var s in t){var r=e[t[s]];if(r!==n)return i===!1?t[s]:o(r,"function")?r.bind(i||e):r}return!1}function c(t,e,n){var i=t.charAt(0).toUpperCase()+t.slice(1),s=(t+" "+$.join(i+" ")+i).split(" ");return o(e,"string")||o(e,"undefined")?r(s,e):(s=(t+" "+b.join(i+" ")+i).split(" "),a(s,e,n))}var l,u,d,h="2.6.2",f={},p=!0,m=e.documentElement,v="modernizr",g=e.createElement(v),y=g.style,w=({}.toString,"Webkit Moz O ms"),$=w.split(" "),b=w.toLowerCase().split(" "),C={},x=[],T=x.slice,k={}.hasOwnProperty;d=o(k,"undefined")||o(k.call,"undefined")?function(t,e){return e in t&&o(t.constructor.prototype[e],"undefined")}:function(t,e){return k.call(t,e)},Function.prototype.bind||(Function.prototype.bind=function(t){var e=this;if("function"!=typeof e)throw new TypeError;var n=T.call(arguments,1),i=function(){if(this instanceof i){var o=function(){};o.prototype=e.prototype;var s=new o,r=e.apply(s,n.concat(T.call(arguments)));return Object(r)===r?r:s}return e.apply(t,n.concat(T.call(arguments)))};return i}),C.csstransitions=function(){return c("transition")};for(var E in C)d(C,E)&&(u=E.toLowerCase(),f[u]=C[E](),x.push((f[u]?"":"no-")+u));return f.addTest=function(t,e){if("object"==typeof t)for(var i in t)d(t,i)&&f.addTest(i,t[i]);else{if(t=t.toLowerCase(),f[t]!==n)return f;e="function"==typeof e?e():e,p!==void 0&&p&&(m.className+=" "+(e?"":"no-")+t),f[t]=e}return f},i(""),g=l=null,function(t,e){function n(t,e){var n=t.createElement("p"),i=t.getElementsByTagName("head")[0]||t.documentElement;return n.innerHTML="x<style>"+e+"</style>",i.insertBefore(n.lastChild,i.firstChild)}function i(){var t=g.elements;return"string"==typeof t?t.split(" "):t}function o(t){var e=v[t[p]];return e||(e={},m++,t[p]=m,v[m]=e),e}function s(t,n,i){if(n||(n=e),u)return n.createElement(t);i||(i=o(n));var s;return s=i.cache[t]?i.cache[t].cloneNode():f.test(t)?(i.cache[t]=i.createElem(t)).cloneNode():i.createElem(t),s.canHaveChildren&&!h.test(t)?i.frag.appendChild(s):s}function r(t,n){if(t||(t=e),u)return t.createDocumentFragment();n=n||o(t);for(var s=n.frag.cloneNode(),r=0,a=i(),c=a.length;c>r;r++)s.createElement(a[r]);return s}function a(t,e){e.cache||(e.cache={},e.createElem=t.createElement,e.createFrag=t.createDocumentFragment,e.frag=e.createFrag()),t.createElement=function(n){return g.shivMethods?s(n,t,e):e.createElem(n)},t.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+i().join().replace(/\w+/g,function(t){return e.createElem(t),e.frag.createElement(t),'c("'+t+'")'})+");return n}")(g,e.frag)}function c(t){t||(t=e);var i=o(t);return g.shivCSS&&!l&&!i.hasCSS&&(i.hasCSS=!!n(t,"article,aside,figcaption,figure,footer,header,hgroup,nav,section{display:block}mark{background:#FF0;color:#000}")),u||a(t,i),t}var l,u,d=t.html5||{},h=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,f=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,p="_html5shiv",m=0,v={};(function(){try{var t=e.createElement("a");t.innerHTML="<xyz></xyz>",l="hidden"in t,u=1==t.childNodes.length||function(){e.createElement("a");var t=e.createDocumentFragment();return t.cloneNode===void 0||t.createDocumentFragment===void 0||t.createElement===void 0}()}catch(n){l=!0,u=!0}})();var g={elements:d.elements||"abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video",shivCSS:d.shivCSS!==!1,supportsUnknownElements:u,shivMethods:d.shivMethods!==!1,type:"default",shivDocument:c,createElement:s,createDocumentFragment:r};t.html5=g,c(e)}(this,e),f._version=h,f._domPrefixes=b,f._cssomPrefixes=$,f.testProp=function(t){return r([t])},f.testAllProps=c,m.className=m.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(p?" js "+x.join(" "):""),f}(this,this.document),function(t,e,n){function i(t){return"[object Function]"==v.call(t)}function o(t){return"string"==typeof t}function s(){}function r(t){return!t||"loaded"==t||"complete"==t||"uninitialized"==t}function a(){var t=g.shift();y=1,t?t.t?p(function(){("c"==t.t?h.injectCss:h.injectJs)(t.s,0,t.a,t.x,t.e,1)},0):(t(),a()):y=0}function c(t,n,i,o,s,c,l){function u(e){if(!f&&r(d.readyState)&&(w.r=f=1,!y&&a(),d.onload=d.onreadystatechange=null,e)){"img"!=t&&p(function(){b.removeChild(d)},50);for(var i in E[n])E[n].hasOwnProperty(i)&&E[n][i].onload()}}var l=l||h.errorTimeout,d=e.createElement(t),f=0,v=0,w={t:i,s:n,e:s,a:c,x:l};1===E[n]&&(v=1,E[n]=[]),"object"==t?d.data=n:(d.src=n,d.type=t),d.width=d.height="0",d.onerror=d.onload=d.onreadystatechange=function(){u.call(this,v)},g.splice(o,0,w),"img"!=t&&(v||2===E[n]?(b.insertBefore(d,$?null:m),p(u,l)):E[n].push(d))}function l(t,e,n,i,s){return y=0,e=e||"j",o(t)?c("c"==e?x:C,t,e,this.i++,n,i,s):(g.splice(this.i++,0,t),1==g.length&&a()),this}function u(){var t=h;return t.loader={load:l,i:0},t}var d,h,f=e.documentElement,p=t.setTimeout,m=e.getElementsByTagName("script")[0],v={}.toString,g=[],y=0,w="MozAppearance"in f.style,$=w&&!!e.createRange().compareNode,b=$?f:m.parentNode,f=t.opera&&"[object Opera]"==v.call(t.opera),f=!!e.attachEvent&&!f,C=w?"object":f?"script":"img",x=f?"script":C,T=Array.isArray||function(t){return"[object Array]"==v.call(t)},k=[],E={},S={timeout:function(t,e){return e.length&&(t.timeout=e[0]),t}};h=function(t){function e(t){var e,n,i,t=t.split("!"),o=k.length,s=t.pop(),r=t.length,s={url:s,origUrl:s,prefixes:t};for(n=0;r>n;n++)i=t[n].split("="),(e=S[i.shift()])&&(s=e(s,i));for(n=0;o>n;n++)s=k[n](s);return s}function r(t,o,s,r,a){var c=e(t),l=c.autoCallback;c.url.split(".").pop().split("?").shift(),c.bypass||(o&&(o=i(o)?o:o[t]||o[r]||o[t.split("/").pop().split("?")[0]]),c.instead?c.instead(t,o,s,r,a):(E[c.url]?c.noexec=!0:E[c.url]=1,s.load(c.url,c.forceCSS||!c.forceJS&&"css"==c.url.split(".").pop().split("?").shift()?"c":n,c.noexec,c.attrs,c.timeout),(i(o)||i(l))&&s.load(function(){u(),o&&o(c.origUrl,a,r),l&&l(c.origUrl,a,r),E[c.url]=2})))}function a(t,e){function n(t,n){if(t){if(o(t))n||(d=function(){var t=[].slice.call(arguments);h.apply(this,t),f()}),r(t,d,e,0,l);else if(Object(t)===t)for(c in a=function(){var e,n=0;for(e in t)t.hasOwnProperty(e)&&n++;return n}(),t)t.hasOwnProperty(c)&&(!n&&!--a&&(i(d)?d=function(){var t=[].slice.call(arguments);h.apply(this,t),f()}:d[c]=function(t){return function(){var e=[].slice.call(arguments);t&&t.apply(this,e),f()}}(h[c])),r(t[c],d,e,c,l))}else!n&&f()}var a,c,l=!!t.test,u=t.load||t.both,d=t.callback||s,h=d,f=t.complete||s;n(l?t.yep:t.nope,!!u),u&&n(u)}var c,l,d=this.yepnope.loader;if(o(t))r(t,0,d,0);else if(T(t))for(c=0;t.length>c;c++)l=t[c],o(l)?r(l,0,d,0):T(l)?h(l):Object(l)===l&&a(l,d);else Object(t)===t&&a(t,d)},h.addPrefix=function(t,e){S[t]=e},h.addFilter=function(t){k.push(t)},h.errorTimeout=1e4,null==e.readyState&&e.addEventListener&&(e.readyState="loading",e.addEventListener("DOMContentLoaded",d=function(){e.removeEventListener("DOMContentLoaded",d,0),e.readyState="complete"},0)),t.yepnope=u(),t.yepnope.executeStack=a,t.yepnope.injectJs=function(t,n,i,o,c,l){var u,d,f=e.createElement("script"),o=o||h.errorTimeout;f.src=t;for(d in i)f.setAttribute(d,i[d]);n=l?a:n||s,f.onreadystatechange=f.onload=function(){!u&&r(f.readyState)&&(u=1,n(),f.onload=f.onreadystatechange=null)},p(function(){u||(u=1,n(1))},o),c?f.onload():m.parentNode.insertBefore(f,m)},t.yepnope.injectCss=function(t,n,i,o,r,c){var l,o=e.createElement("link"),n=c?a:n||s;o.href=t,o.rel="stylesheet",o.type="text/css";for(l in i)o.setAttribute(l,i[l]);r||(m.parentNode.insertBefore(o,m),p(n,0))}}(this,document),Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0))},function(t,e){"use strict";var n=e.Modernizr;t.CBPQTRotator=function(e,n){this.$el=t(n),this._init(e)},t.CBPQTRotator.defaults={speed:700,easing:"ease",interval:8e3},t.CBPQTRotator.prototype={_init:function(e){this.options=t.extend(!0,{},t.CBPQTRotator.defaults,e),this._config(),this.$items.eq(this.current).addClass("current"),this.support&&this._setTransition(),this._startRotator()},_config:function(){this.$items=this.$el.children(".testimonial"),this.itemsCount=this.$items.length,this.current=0,this.support=n.csstransitions,this.support&&(this.$progress=t('<span class="progress"></span>').appendTo(this.$el))},_setTransition:function(){setTimeout(t.proxy(function(){this.$items.css("transition","all "+this.options.speed+"ms "+this.options.easing)},this),25)},_startRotator:function(){this.support&&this._startProgress(),setTimeout(t.proxy(function(){this.support&&this._resetProgress(),this._next(),this._startRotator()},this),this.options.interval)},_next:function(){this.$items.eq(this.current).removeClass("current"),this.current=this.current<this.itemsCount-1?this.current+1:0,this.$items.eq(this.current).addClass("current")},_startProgress:function(){setTimeout(t.proxy(function(){this.$progress.css({transition:"width "+this.options.interval+"ms linear",width:"100%"})},this),25)},_resetProgress:function(){this.$progress.css({transition:"none",width:"0%"})},destroy:function(){this.support&&(this.$items.css("transition","none"),this.$progress.remove()),this.$items.removeClass("current").css({position:"relative","z-index":100,"pointer-events":"auto",opacity:1})}};var i=function(t){e.console&&e.console.error(t)};t.fn.cbpQTRotator=function(e){if("string"==typeof e){var n=Array.prototype.slice.call(arguments,1);this.each(function(){var o=t.data(this,"cbpQTRotator");return o?t.isFunction(o[e])&&"_"!==e.charAt(0)?(o[e].apply(o,n),undefined):(i("no such method '"+e+"' for cbpQTRotator instance"),undefined):(i("cannot call methods on cbpQTRotator prior to initialization; attempted to call method '"+e+"'"),undefined)})}else this.each(function(){var n=t.data(this,"cbpQTRotator");n?n._init():n=t.data(this,"cbpQTRotator",new t.CBPQTRotator(e,this))});return this}}(jQuery,window),$("document").ready(function(){function t(){var t=$(".portfolio-item").get();for(i=0;t.length>i;i++){var e=$(t[i]),n=e.width(),o=-i*n+"px 0";console.log(o),e.css({"background-position":o,height:n})}}function e(t,e,n,i){var o=new google.maps.Marker({map:r,position:new google.maps.LatLng(t,e),title:n||""});return o.setIcon(i),o}function n(){o=r.getCenter()}$(".portfolio-item a").click(function(t){t.preventDefault();var e=$(this).attr("href"),n=$(this).data("slug"),i=$("#portfolio");i.addClass("fadeOut"),window.setTimeout(i.load(e,function(){history.pushState(null,null,n),i.removeClass("fadeOut")}),1500)}),$(".back").on("click",function(t){t.preventDefault();var e=$("#portfolio");return e.addClass("fadeOut"),window.setTimeout(e.load("portfolio.html",function(){history.pushState(null,null,"/"),e.removeClass("fadeOut")}),1500),!1}),t(),$(window).resize(function(){t()}),$(".testimonials").cbpQTRotator(),$(".toggle-menu").sidr({name:"sidr-right",side:"right",source:"#menu-content"}),$(".sidr a").bind("click",function(){$.sidr("close","sidr-right")}),enquire.register("screen and (min-width:980px)",{match:function(){$.sidr("close","sidr-right")}}),$(".year").html((new Date).getFullYear()),$(".carousel").carousel(),$(".carousel").touchwipe({wipeLeft:function(){$(".carousel").carousel("next")},wipeRight:function(){$(".carousel").carousel("prev")}});var o,s=$(".map-container"),r=new google.maps.Map(s[0],{zoom:15,disableDefaultUI:!0,disableDoubleClickZoom:!0,draggable:!1,keyboardShortcuts:!1,scrollwheel:!1,center:new google.maps.LatLng(39.917774,116.453311),mapTypeId:google.maps.MapTypeId.ROADMAP});if(google.maps.event.addDomListener(r,"idle",function(){n()}),google.maps.event.addDomListener(window,"resize",function(){r.setCenter(o)}),!c&&(c=e(39.917815,116.453311,"Us!","http://maps.google.com/mapfiles/ms/icons/red-dot.png"),navigator.geolocation)){var a,c=null;navigator.geolocation.getCurrentPosition(function(t){if(!a&&!c){var e={origin:new google.maps.LatLng(t.coords.latitude,t.coords.longitude),destination:new google.maps.LatLng(39.917815,116.453311),travelMode:google.maps.DirectionsTravelMode.DRIVING},n=new google.maps.DirectionsService,i=new google.maps.DirectionsRenderer;i.setMap(r),n.route(e,function(t,e){e==google.maps.DirectionsStatus.OK&&i.setDirections(t)})}})}}),window.addEventListener("load",function(){window.applicationCache.addEventListener("updateready",function(){window.applicationCache.status==window.applicationCache.UPDATEREADY&&(window.applicationCache.swapCache(),window.location.reload())},!1)},!1),window.matchMedia){var mediaQueryList=window.matchMedia("print");mediaQueryList.addListener(function(t){t.matches?beforePrint():afterPrint()})}window.onbeforeprint=beforePrint,window.onafterprint=afterPrint;
/* Modernizr 2.6.2 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-csstransitions-shiv-cssclasses-testprop-testallprops-domprefixes-load
 */
;window.Modernizr=function(a,b,c){function x(a){j.cssText=a}function y(a,b){return x(prefixes.join(a+";")+(b||""))}function z(a,b){return typeof a===b}function A(a,b){return!!~(""+a).indexOf(b)}function B(a,b){for(var d in a){var e=a[d];if(!A(e,"-")&&j[e]!==c)return b=="pfx"?e:!0}return!1}function C(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:z(f,"function")?f.bind(d||b):f}return!1}function D(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+" "+n.join(d+" ")+d).split(" ");return z(b,"string")||z(b,"undefined")?B(e,b):(e=(a+" "+o.join(d+" ")+d).split(" "),C(e,b,c))}var d="2.6.2",e={},f=!0,g=b.documentElement,h="modernizr",i=b.createElement(h),j=i.style,k,l={}.toString,m="Webkit Moz O ms",n=m.split(" "),o=m.toLowerCase().split(" "),p={},q={},r={},s=[],t=s.slice,u,v={}.hasOwnProperty,w;!z(v,"undefined")&&!z(v.call,"undefined")?w=function(a,b){return v.call(a,b)}:w=function(a,b){return b in a&&z(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=t.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(t.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(t.call(arguments)))};return e}),p.csstransitions=function(){return D("transition")};for(var E in p)w(p,E)&&(u=E.toLowerCase(),e[u]=p[E](),s.push((e[u]?"":"no-")+u));return e.addTest=function(a,b){if(typeof a=="object")for(var d in a)w(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof f!="undefined"&&f&&(g.className+=" "+(b?"":"no-")+a),e[a]=b}return e},x(""),i=k=null,function(a,b){function k(a,b){var c=a.createElement("p"),d=a.getElementsByTagName("head")[0]||a.documentElement;return c.innerHTML="x<style>"+b+"</style>",d.insertBefore(c.lastChild,d.firstChild)}function l(){var a=r.elements;return typeof a=="string"?a.split(" "):a}function m(a){var b=i[a[g]];return b||(b={},h++,a[g]=h,i[h]=b),b}function n(a,c,f){c||(c=b);if(j)return c.createElement(a);f||(f=m(c));var g;return f.cache[a]?g=f.cache[a].cloneNode():e.test(a)?g=(f.cache[a]=f.createElem(a)).cloneNode():g=f.createElem(a),g.canHaveChildren&&!d.test(a)?f.frag.appendChild(g):g}function o(a,c){a||(a=b);if(j)return a.createDocumentFragment();c=c||m(a);var d=c.frag.cloneNode(),e=0,f=l(),g=f.length;for(;e<g;e++)d.createElement(f[e]);return d}function p(a,b){b.cache||(b.cache={},b.createElem=a.createElement,b.createFrag=a.createDocumentFragment,b.frag=b.createFrag()),a.createElement=function(c){return r.shivMethods?n(c,a,b):b.createElem(c)},a.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+l().join().replace(/\w+/g,function(a){return b.createElem(a),b.frag.createElement(a),'c("'+a+'")'})+");return n}")(r,b.frag)}function q(a){a||(a=b);var c=m(a);return r.shivCSS&&!f&&!c.hasCSS&&(c.hasCSS=!!k(a,"article,aside,figcaption,figure,footer,header,hgroup,nav,section{display:block}mark{background:#FF0;color:#000}")),j||p(a,c),a}var c=a.html5||{},d=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,e=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,f,g="_html5shiv",h=0,i={},j;(function(){try{var a=b.createElement("a");a.innerHTML="<xyz></xyz>",f="hidden"in a,j=a.childNodes.length==1||function(){b.createElement("a");var a=b.createDocumentFragment();return typeof a.cloneNode=="undefined"||typeof a.createDocumentFragment=="undefined"||typeof a.createElement=="undefined"}()}catch(c){f=!0,j=!0}})();var r={elements:c.elements||"abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video",shivCSS:c.shivCSS!==!1,supportsUnknownElements:j,shivMethods:c.shivMethods!==!1,type:"default",shivDocument:q,createElement:n,createDocumentFragment:o};a.html5=r,q(b)}(this,b),e._version=d,e._domPrefixes=o,e._cssomPrefixes=n,e.testProp=function(a){return B([a])},e.testAllProps=D,g.className=g.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(f?" js "+s.join(" "):""),e}(this,this.document),function(a,b,c){function d(a){return"[object Function]"==o.call(a)}function e(a){return"string"==typeof a}function f(){}function g(a){return!a||"loaded"==a||"complete"==a||"uninitialized"==a}function h(){var a=p.shift();q=1,a?a.t?m(function(){("c"==a.t?B.injectCss:B.injectJs)(a.s,0,a.a,a.x,a.e,1)},0):(a(),h()):q=0}function i(a,c,d,e,f,i,j){function k(b){if(!o&&g(l.readyState)&&(u.r=o=1,!q&&h(),l.onload=l.onreadystatechange=null,b)){"img"!=a&&m(function(){t.removeChild(l)},50);for(var d in y[c])y[c].hasOwnProperty(d)&&y[c][d].onload()}}var j=j||B.errorTimeout,l=b.createElement(a),o=0,r=0,u={t:d,s:c,e:f,a:i,x:j};1===y[c]&&(r=1,y[c]=[]),"object"==a?l.data=c:(l.src=c,l.type=a),l.width=l.height="0",l.onerror=l.onload=l.onreadystatechange=function(){k.call(this,r)},p.splice(e,0,u),"img"!=a&&(r||2===y[c]?(t.insertBefore(l,s?null:n),m(k,j)):y[c].push(l))}function j(a,b,c,d,f){return q=0,b=b||"j",e(a)?i("c"==b?v:u,a,b,this.i++,c,d,f):(p.splice(this.i++,0,a),1==p.length&&h()),this}function k(){var a=B;return a.loader={load:j,i:0},a}var l=b.documentElement,m=a.setTimeout,n=b.getElementsByTagName("script")[0],o={}.toString,p=[],q=0,r="MozAppearance"in l.style,s=r&&!!b.createRange().compareNode,t=s?l:n.parentNode,l=a.opera&&"[object Opera]"==o.call(a.opera),l=!!b.attachEvent&&!l,u=r?"object":l?"script":"img",v=l?"script":u,w=Array.isArray||function(a){return"[object Array]"==o.call(a)},x=[],y={},z={timeout:function(a,b){return b.length&&(a.timeout=b[0]),a}},A,B;B=function(a){function b(a){var a=a.split("!"),b=x.length,c=a.pop(),d=a.length,c={url:c,origUrl:c,prefixes:a},e,f,g;for(f=0;f<d;f++)g=a[f].split("="),(e=z[g.shift()])&&(c=e(c,g));for(f=0;f<b;f++)c=x[f](c);return c}function g(a,e,f,g,h){var i=b(a),j=i.autoCallback;i.url.split(".").pop().split("?").shift(),i.bypass||(e&&(e=d(e)?e:e[a]||e[g]||e[a.split("/").pop().split("?")[0]]),i.instead?i.instead(a,e,f,g,h):(y[i.url]?i.noexec=!0:y[i.url]=1,f.load(i.url,i.forceCSS||!i.forceJS&&"css"==i.url.split(".").pop().split("?").shift()?"c":c,i.noexec,i.attrs,i.timeout),(d(e)||d(j))&&f.load(function(){k(),e&&e(i.origUrl,h,g),j&&j(i.origUrl,h,g),y[i.url]=2})))}function h(a,b){function c(a,c){if(a){if(e(a))c||(j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}),g(a,j,b,0,h);else if(Object(a)===a)for(n in m=function(){var b=0,c;for(c in a)a.hasOwnProperty(c)&&b++;return b}(),a)a.hasOwnProperty(n)&&(!c&&!--m&&(d(j)?j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}:j[n]=function(a){return function(){var b=[].slice.call(arguments);a&&a.apply(this,b),l()}}(k[n])),g(a[n],j,b,n,h))}else!c&&l()}var h=!!a.test,i=a.load||a.both,j=a.callback||f,k=j,l=a.complete||f,m,n;c(h?a.yep:a.nope,!!i),i&&c(i)}var i,j,l=this.yepnope.loader;if(e(a))g(a,0,l,0);else if(w(a))for(i=0;i<a.length;i++)j=a[i],e(j)?g(j,0,l,0):w(j)?B(j):Object(j)===j&&h(j,l);else Object(a)===a&&h(a,l)},B.addPrefix=function(a,b){z[a]=b},B.addFilter=function(a){x.push(a)},B.errorTimeout=1e4,null==b.readyState&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",A=function(){b.removeEventListener("DOMContentLoaded",A,0),b.readyState="complete"},0)),a.yepnope=k(),a.yepnope.executeStack=h,a.yepnope.injectJs=function(a,c,d,e,i,j){var k=b.createElement("script"),l,o,e=e||B.errorTimeout;k.src=a;for(o in d)k.setAttribute(o,d[o]);c=j?h:c||f,k.onreadystatechange=k.onload=function(){!l&&g(k.readyState)&&(l=1,c(),k.onload=k.onreadystatechange=null)},m(function(){l||(l=1,c(1))},e),i?k.onload():n.parentNode.insertBefore(k,n)},a.yepnope.injectCss=function(a,c,d,e,g,i){var e=b.createElement("link"),j,c=i?h:c||f;e.href=a,e.rel="stylesheet",e.type="text/css";for(j in d)e.setAttribute(j,d[j]);g||(n.parentNode.insertBefore(e,n),m(c,0))}}(this,document),Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0))};
;( function( $, window, undefined ) {
 
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

    $(".portfolio-item a").click(function(e) {
        e.preventDefault();
        var t = $(this).attr("href");
        var d = $(this).data("slug");
        var p = $("#portfolio");
        p.addClass("fadeOut");
        window.setTimeout(p.load(t, function() {
            history.pushState(null, null, d);
            p.removeClass("fadeOut");
        }),1500);
        //return false;
    });

    $(".back").on("click", function(e) {
        e.preventDefault();
        var p = $("#portfolio");
        p.addClass("fadeOut");
        window.setTimeout(p.load("portfolio.html", function() {
            history.pushState(null, null, "/");
            p.removeClass("fadeOut");
        }), 1500);
        return false;
    });    

    function resizePortfolioItems() {

        var items = $(".portfolio-item").get();
        for(i=0;i<items.length;i++) {
            var _this = $(items[i]);
            var w = _this.width();
            var offset = (-i*w) + "px 0";
            console.log(offset);
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