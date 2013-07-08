describe "PasswordProtect", ->

	beforeEach ->
		pp = PasswordProtect()
		pp.deleteCookie()
		
	delay = (ms, func) -> setTimeout func, ms

	it "should be able to confirm when the required cookie does not exist", ->
		pp = PasswordProtect()
		expect(pp.getCookie()?).toEqual false

	it "should be able to check if the required cookie exists", ->
		pp = PasswordProtect()
		pp.setCookie("test")
		expect(pp.getCookie()?).toEqual true

	it "should be able to set a cookie with any value", ->
		pp = PasswordProtect()
		pp.setCookie("test")
		expect(pp.getCookie()).toEqual "test"
		pp.setCookie("123456789")
		expect(pp.getCookie()).toEqual "123456789"

	it "should be able to add the panel", ->
		pp = PasswordProtect()
		delay 1000, -> expect($(".password-panel").length).toBeGreaterThan(0)

	it "should be able to remove the panel", ->
		pp = PasswordProtect()
		pp.hidePanel()
		expect($(".password-panel").length).toBeLessThan(1)

	it "should attach DOM elements once the panel has loaded in", ->
		pp = PasswordProtect()
		expect(pp.el.passwordInput).toEqual(undefined)
		spyOn(pp, "attachDOMElements")
		delay 1000, ->
			expect(pp.attachDOMElements()).toHaveBeenCalled()

	it "should register when the password is changed", ->
		pp = PasswordProtect()
		delay 1000, -> 
			pp.el.passwordInput.value('test1')
			c = pp.el.passwordInput.val()
			pp.el.passwordInput.value('test2')
			expect(pp.selectedValues.password).not.toEqual(c)

	it "should set a cookie with an explicit expiry date when the form is submitted", ->
		
		getCookie = ->
			nameEQ = "proferotech-blog="
			cookieItems = document.cookie.split(";")
			for cookieItem in cookieItems
				while cookieItem.charAt(0)==' '
					cookieItem = cookieItem.substring(1, cookieItem.length)
				if cookieItem.indexOf(nameEQ) == 0
					cookieExpiry = cookieItem.substring(";expires=".length, cookieItem.length)
					cookieExpiry = cookieExpiry.replace(/'/g,'"')
			cookieExpiry

		pp = PasswordProtect()
		delay 1000, ->
			pp.el.passwordInput.val("pr0f3r0")
			pp.changePassword()
			pp.validatePassword()
			delay 100, ->
				expect(getCookie()).not.toBe(undefined)


	it "should disappear only when a valid data has been submitted", ->
		pp = PasswordProtect()
		delay 1000, ->
			pp.el.passwordInput.val("hvjhvjhvk")
			pp.changePassword()
			pp.validatePassword()
			delay 100, ->
				expect(pp.el.pp).not.toBe(undefined)
				expect(pp.el.passwordError.hasClass("hide")).toEqual(false)

			pp.el.passwordInput.val("pr0f3r0")
			pp.changePassword()
			pp.validatePassword()
			delay 100, ->
				expect(pp.el.pp).toBe(undefined)