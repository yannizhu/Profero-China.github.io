((win) ->
	win.PasswordProtect = ->

		el =
			pp: 			$(".pp")

		selectedValues =
			password:			"password"

		loaded = false

		init = ->
			if not cookiesEnabled() then appendNoCookiesError() else checkIfCookieExists()


		cookiesEnabled = ->
			cookieEnabled = (navigator.cookieEnabled) ? true : false
		
			if (typeof navigator.cookieEnabled == "undefined" && !cookieEnabled)
				document.cookie = "testcookie"
				cookieEnabled = (document.cookie.indexOf("testcookie") != -1) ? true : false
		
			if(!cookieEnabled)
				document.cookie = "testcookie"
				cookieEnabled = (document.cookie.substring(document.cookie.length-10, document.cookie.length)=='testcookie')
	
			cookieEnabled


		appendNoCookiesError = ->
			el.pp.load "/blog/pp/pp/nocookies.html", (data) ->


		checkIfCookieExists = ->
			if getCookie() then hidePanel() else showPanel()


		getCookie = ->
			nameEQ = "proferotech-blog="
			cookieItems = document.cookie.split(";")
			for cookieItem in cookieItems
				while cookieItem.charAt(0)==' '
					cookieItem = cookieItem.substring(1, cookieItem.length)
				if cookieItem.indexOf(nameEQ) == 0
					cookieValue = cookieItem.substring(nameEQ.length, cookieItem.length)
					cookieValue = cookieValue.replace(/'/g,'"')
			cookieValue


		setCookie = (value) ->
			value = value.replace(/"/g,"'")
			expiryDate = new Date()
			expiryDate.setTime(expiryDate.getTime() + (30*24*60*60*1000))
			expires = ";expires=" + expiryDate.toGMTString()
			document.cookie = "proferotech-blog=" + value + expires + ";domain=proferotech.com;path=/"
			# FOR TESTING ON LOCALHOST - no domain
			# document.cookie = "proferotech-blog=" + value + expires + ";path=/"


		deleteCookie = ->
			document.cookie = "proferotech-blog=;expires=Thu, 01 Jan 1970 00:00:01 GMT;"


		showPanel = ->
			$.get "/blog/pp/pp/pp.html", (data) ->
				el.pp.append(data)
				attachDOMElements()
				loaded = true


		hidePanel = ->
			el.pp.remove()


		attachDOMElements = ->
			el.allErrors = 			$(".password-panel .alert")
			el.passwordError = 		$(".password-error")
			el.passwordInput =		$(".pp-password-textbox")
			el.submitButton =		$(".password-submit")

			el.passwordInput.focus()

			bindEvents()


		bindEvents = ->
			el.passwordInput.on "change", changePassword
			el.submitButton.on "click", validatePassword


		changePassword = ->
			selectedValues.password = $(this).val()


		validatePassword = (event) ->
			event.preventDefault()

			el.allErrors.addClass("hide")

			shouldbe = "pr0f3r0"

			if selectedValues.password == shouldbe then passGateway() else
				el.passwordError.removeClass("hide")
				el.passwordInput.focus()

		passGateway = ->
			setCookie("pass")
			el.pp.fadeOut().remove()

		#auto-invoke the gateway
		init()

		# REMOVE OR COMMENT THIS OUT BEFORE PRODUCTION!
		# For testing only
		# return {} =
		# 	attachDOMElements:			attachDOMElements
		# 	changePassword:				changePassword
		# 	deleteCookie:				deleteCookie
		# 	el: 						el
		# 	hidePanel:					hidePanel
		# 	getCookie:					getCookie
		# 	selectedValues:				selectedValues
		# 	setCookie:					setCookie

) this