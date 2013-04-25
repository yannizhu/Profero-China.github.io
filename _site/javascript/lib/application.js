(function() {
  var $, PortfolioItem, PortfolioApp, PortfolioItems;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  $ = jQuery;

  PortfolioItem = (function() {

    __extends(PortfolioItem, Spine.Model);

    function PortfolioItem() {
      PortfolioItem.__super__.constructor.apply(this, arguments);
    }

    PortfolioItem.configure("PortfolioItem", "name", "category", "tagline", "slug", "url", "images", "description", "liveurl");

    PortfolioItem.extend(Spine.Model.Local);

    PortfolioItem.active = function() {
      return this.select(function(item) {
        return !item.done;
      });
    };

    return PortfolioItem;

  })();

  PortfolioItems = (function() {

    __extends(PortfolioItems, Spine.Controller);

    PortfolioItems.prototype.events = {
      "change   input[type=checkbox]": "toggle",
      "click    .destroy": "remove",
      "dblclick .view": "edit",
      "keypress input[type=text]": "blurOnEnter",
      "blur     input[type=text]": "close"
    };

    PortfolioItems.prototype.elements = {
      "input[type=text]": "input"
    };

    function PortfolioItems() {
      this.render = __bind(this.render, this);
      PortfolioItems.__super__.constructor.apply(this, arguments);
      this.item.bind("update", this.render);
      this.item.bind("destroy", this.release);
    }

    PortfolioItems.prototype.render = function() {
      this.replace($("#taskTemplate").tmpl(this.item));
      return this;
    };

    PortfolioItems.prototype.toggle = function() {
      this.item.done = !this.item.done;
      return this.item.save();
    };

    PortfolioItems.prototype.remove = function() {
      return this.item.destroy();
    };

    PortfolioItems.prototype.edit = function() {
      this.el.addClass("editing");
      return this.input.focus();
    };

    PortfolioItems.prototype.blurOnEnter = function(e) {
      if (e.keyCode === 13) return e.target.blur();
    };

    PortfolioItems.prototype.close = function() {
      this.el.removeClass("editing");
      return this.item.updateAttributes({
        name: this.input.val()
      });
    };

    return PortfolioItems;

  })();

  PortfolioApp = (function() {

    __extends(PortfolioApp, Spine.Controller);

    PortfolioApp.prototype.events = {
      "submit form": "create",
      "click  .clear": "clear"
    };

    PortfolioApp.prototype.elements = {
      ".items": "items",
      ".countVal": "count",
      ".clear": "clear",
      "form input": "input"
    };

    function PortfolioApp() {
      this.renderCount = __bind(this.renderCount, this);
      this.addAll = __bind(this.addAll, this);
      this.addOne = __bind(this.addOne, this);      PortfolioApp.__super__.constructor.apply(this, arguments);
      PortfolioItem.bind("create", this.addOne);
      PortfolioItem.bind("refresh", this.addAll);
      PortfolioItem.bind("refresh change", this.renderCount);
      PortfolioItem.fetch();
    }

    PortfolioApp.prototype.addOne = function(task) {
      var view;
      view = new PortfolioItems({
        item: task
      });
      return this.items.append(view.render().el);
    };

    PortfolioApp.prototype.addAll = function() {
      return PortfolioItem.each(this.addOne);
    };

    PortfolioApp.prototype.create = function(e) {
      e.preventDefault();
      PortfolioItem.create({
        name: this.input.val()
      });
      return this.input.val("");
    };

    PortfolioApp.prototype.clear = function() {
      return PortfolioItem.destroyDone();
    };

    PortfolioApp.prototype.renderCount = function() {
      var active, inactive;
      active = PortfolioItem.active().length;
      this.count.text(active);
      inactive = PortfolioItem.done().length;
      if (inactive) {
        return this.clear.show();
      } else {
        return this.clear.hide();
      }
    };

    return PortfolioApp;

  })();

  $(function() {
    return new PortfolioApp({
      el: $("#portfolio")
    });
  });

}).call(this);
