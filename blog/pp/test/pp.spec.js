(function() {
  describe("PasswordProtect", function() {
    var delay;
    beforeEach(function() {
      var pp;
      pp = PasswordProtect();
      return pp.deleteCookie();
    });
    delay = function(ms, func) {
      return setTimeout(func, ms);
    };
    it("should be able to confirm when the required cookie does not exist", function() {
      var pp;
      pp = PasswordProtect();
      return expect(pp.getCookie() != null).toEqual(false);
    });
    it("should be able to check if the required cookie exists", function() {
      var pp;
      pp = PasswordProtect();
      pp.setCookie("test");
      return expect(pp.getCookie() != null).toEqual(true);
    });
    it("should be able to set a cookie with any value", function() {
      var pp;
      pp = PasswordProtect();
      pp.setCookie("test");
      expect(pp.getCookie()).toEqual("test");
      pp.setCookie("123456789");
      return expect(pp.getCookie()).toEqual("123456789");
    });
    it("should be able to add the panel", function() {
      var pp;
      pp = PasswordProtect();
      return delay(1000, function() {
        return expect($(".password-panel").length).toBeGreaterThan(0);
      });
    });
    it("should be able to remove the panel", function() {
      var pp;
      pp = PasswordProtect();
      pp.hidePanel();
      return expect($(".password-panel").length).toBeLessThan(1);
    });
    it("should attach DOM elements once the panel has loaded in", function() {
      var pp;
      pp = PasswordProtect();
      expect(pp.el.passwordInput).toEqual(void 0);
      spyOn(pp, "attachDOMElements");
      return delay(1000, function() {
        return expect(pp.attachDOMElements()).toHaveBeenCalled();
      });
    });
    it("should register when the password is changed", function() {
      var pp;
      pp = PasswordProtect();
      return delay(1000, function() {
        var c;
        pp.el.passwordInput.value('test1');
        c = pp.el.passwordInput.val();
        pp.el.passwordInput.value('test2');
        return expect(pp.selectedValues.password).not.toEqual(c);
      });
    });
    it("should set a cookie with an explicit expiry date when the form is submitted", function() {
      var getCookie, pp;
      getCookie = function() {
        var cookieExpiry, cookieItem, cookieItems, nameEQ, _i, _len;
        nameEQ = "proferotech-blog=";
        cookieItems = document.cookie.split(";");
        for (_i = 0, _len = cookieItems.length; _i < _len; _i++) {
          cookieItem = cookieItems[_i];
          while (cookieItem.charAt(0) === ' ') {
            cookieItem = cookieItem.substring(1, cookieItem.length);
          }
          if (cookieItem.indexOf(nameEQ) === 0) {
            cookieExpiry = cookieItem.substring(";expires=".length, cookieItem.length);
            cookieExpiry = cookieExpiry.replace(/'/g, '"');
          }
        }
        return cookieExpiry;
      };
      pp = PasswordProtect();
      return delay(1000, function() {
        pp.el.passwordInput.val("pr0f3r0");
        pp.changePassword();
        pp.validatePassword();
        return delay(100, function() {
          return expect(getCookie()).not.toBe(void 0);
        });
      });
    });
    return it("should disappear only when a valid data has been submitted", function() {
      var pp;
      pp = PasswordProtect();
      return delay(1000, function() {
        pp.el.passwordInput.val("hvjhvjhvk");
        pp.changePassword();
        pp.validatePassword();
        delay(100, function() {
          expect(pp.el.pp).not.toBe(void 0);
          return expect(pp.el.passwordError.hasClass("hide")).toEqual(false);
        });
        pp.el.passwordInput.val("pr0f3r0");
        pp.changePassword();
        pp.validatePassword();
        return delay(100, function() {
          return expect(pp.el.pp).toBe(void 0);
        });
      });
    });
  });

}).call(this);
