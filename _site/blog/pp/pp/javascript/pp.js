(function(win) {
  return win.PasswordProtect = function() {
    var appendNoCookiesError, attachDOMElements, bindEvents, changePassword, checkIfCookieExists, cookiesEnabled, deleteCookie, el, getCookie, hidePanel, init, loaded, passGateway, selectedValues, setCookie, showPanel, validatePassword;
    el = {
      pp: $(".pp")
    };
    selectedValues = {
      password: "password"
    };
    loaded = false;
    init = function() {
      if (!cookiesEnabled()) {
        return appendNoCookiesError();
      } else {
        return checkIfCookieExists();
      }
    };
    cookiesEnabled = function() {
      var cookieEnabled, _ref, _ref1;
      cookieEnabled = (_ref = navigator.cookieEnabled) != null ? _ref : {
        "true": false
      };
      if (typeof navigator.cookieEnabled === "undefined" && !cookieEnabled) {
        document.cookie = "testcookie";
        cookieEnabled = (_ref1 = document.cookie.indexOf("testcookie") !== -1) != null ? _ref1 : {
          "true": false
        };
      }
      if (!cookieEnabled) {
        document.cookie = "testcookie";
        cookieEnabled = document.cookie.substring(document.cookie.length - 10, document.cookie.length) === 'testcookie';
      }
      return cookieEnabled;
    };
    appendNoCookiesError = function() {
      return el.pp.load("/blog/pp/pp/nocookies.html", function(data) {});
    };
    checkIfCookieExists = function() {
      if (getCookie()) {
        return hidePanel();
      } else {
        return showPanel();
      }
    };
    getCookie = function() {
      var cookieItem, cookieItems, cookieValue, nameEQ, _i, _len;
      nameEQ = "proferotech-blog=";
      cookieItems = document.cookie.split(";");
      for (_i = 0, _len = cookieItems.length; _i < _len; _i++) {
        cookieItem = cookieItems[_i];
        while (cookieItem.charAt(0) === ' ') {
          cookieItem = cookieItem.substring(1, cookieItem.length);
        }
        if (cookieItem.indexOf(nameEQ) === 0) {
          cookieValue = cookieItem.substring(nameEQ.length, cookieItem.length);
          cookieValue = cookieValue.replace(/'/g, '"');
        }
      }
      return cookieValue;
    };
    setCookie = function(value) {
      var expires, expiryDate;
      value = value.replace(/"/g, "'");
      expiryDate = new Date();
      expiryDate.setTime(expiryDate.getTime() + (30 * 24 * 60 * 60 * 1000));
      expires = ";expires=" + expiryDate.toGMTString();
      return document.cookie = "proferotech-blog=" + value + expires + ";domain=proferotech.com;path=/";
    };
    deleteCookie = function() {
      return document.cookie = "proferotech-blog=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    };
    showPanel = function() {
      return $.get("/blog/pp/pp/pp.html", function(data) {
        el.pp.append(data);
        attachDOMElements();
        return loaded = true;
      });
    };
    hidePanel = function() {
      return el.pp.remove();
    };
    attachDOMElements = function() {
      el.allErrors = $(".password-panel .alert");
      el.passwordError = $(".password-error");
      el.passwordInput = $(".pp-password-textbox");
      el.submitButton = $(".password-submit");
      el.passwordInput.focus();
      return bindEvents();
    };
    bindEvents = function() {
      el.passwordInput.on("change", changePassword);
      return el.submitButton.on("click", validatePassword);
    };
    changePassword = function() {
      return selectedValues.password = $(this).val();
    };
    validatePassword = function(event) {
      var shouldbe;
      event.preventDefault();
      el.allErrors.addClass("hide");
      shouldbe = "pr0f3r0";
      if (selectedValues.password === shouldbe) {
        return passGateway();
      } else {
        el.passwordError.removeClass("hide");
        return el.passwordInput.focus();
      }
    };
    passGateway = function() {
      setCookie("pass");
      return el.pp.fadeOut().remove();
    };
    return init();
  };
})(this);
