(function() {

	var ProferoTech = {

		settings: {
			debug: 						true,
			domainName: 				"proferotech.com"
		},

		//All DOM elements that need manipulating
		el: {
			_window:					$(window),
			page:						$('html, body'),
			navigationLink:				$('nav a[href*=#]'),
			backtotopButton:			$('.backtotop'),
			pageHeader:					$('.page-header'),
			whatwedoSection:			$('#whatwedo'),
			whyusSection:				$('#whyus'),
			workSection:				$('#work'),
			clientsSection:				$('#clients'),
			testimonialsSection:		$('#testimonials'),
			contactSection:				$('#contact'),
			otherServices:				$('.service-wrapper:not(:nth-child(5)) .service'),
			bigService:					$('.service-wrapper:nth-child(5) .service'),
			otherReasons:				$('.reason-wrapper:not(:nth-child(5)) .reason'),
			bigReason:					$('.reason-wrapper:nth-child(5) .reason'),
			workCarousel:				$('#work-carousel'),
			workItems:					$('.work-item'),
			workItemImagesCarousels:	function() {

											//return array of jQuery objects
											//NOTE: hardcoded number of work items!!!
											var itemArray = [];

											for(var i=0; i<6; i++) {
												itemArray.push($("#work-images-carousel"+i));
											}

											return itemArray;

										},
			workImages:					$('.work-image-item'),
			clientLogoWrappers:			$('.img-wrapper'),
			clientLogos:				$('.client-logo img'),
			contactDetails:				$('.contact-details'),
			mapContainer:				$('.map-container'),
			getStartedButton: 			$('[data-reveal-id="letsgetstarted"]')
		},

		init: function() {

			if(this.settings.debug)
				this.settings.domainName = "localhost:8000";

			this.resizeStuff();
			this.showRandomWorkItem();
			this.bindEvents();
			this.initialiseCarousels();
			this.setWayPoints();
			this.setLanguage();

			if(this.checkForURLParameter('preview'))
				location.href = "/preview";

		},

		bindEvents: function() {

			var el = this.el;

			el._window.on("resize", this.resizeStuff);
			el._window.on("scroll", this.scrollStuff);

			el.backtotopButton.on("click", this.handleNavigationClick);
			el.navigationLink.on("click", this.handleNavigationClick);
			el.getStartedButton.on("click", function(e){e.preventDefault();});

		},

		checkForURLParameter: function(name) {

			var url = window.location.href;
			if(url.indexOf('?' + name) != -1)
				return true;
			else if(url.indexOf('&' + name) != -1)
				return true;
			return false;

		},

		getURLParameter: function(name) {

			var value = decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
			if(value)
				return value;
			else
				return null

		},

		setLanguage: function() {

			//check for cookie, 
			//	if has cookie, check URL parameter for new language preference
			//		if has URL parameter, check if it's different to the cookie value
			//			use URL parameter for current location
			//			set cookie for new language preference
			//		else
			//			use cookie value for current location
			//	else, check for URL parameter
			//		if has URL parameter
			//			use URL parameter for current location
			//			set cookie for new language preference
			//		else, no preference specified
			//			use browser language for current location

			var currentLanguage = window.location.href.indexOf("/cn/") !== -1 ? "cn" : "en",
				targetLanguage = currentLanguage,
				cookieLanguage = this.getCookie("proferotech-language");

			if(cookieLanguage) {
				//use cookie
				//see if they are wanting to see a different version based on URL

				var languagePreferenceFromCookie = cookieLanguage;

				if(this.checkForURLParameter("lang")) {
					//check if URL parameter is the same language preference as the cookie

					var urlParameter = this.getURLParameter("lang");

					if(languagePreferenceFromCookie !== urlParameter) {
						//URL parameter indicates NEW language preference
						//target language = URL parameter
						//set cookie for language preference
						targetLanguage = urlParameter;
						this.setLanguageCookie(targetLanguage);
						this.redirectPage(currentLanguage, targetLanguage);
					} else {
						//no new language preference specified
						//target language = cookie
						targetLanguage = languagePreferenceFromCookie;
						this.redirectPage(currentLanguage, targetLanguage);
					}

				} else {
					//no new language preference specified
					//target language = cookie
					targetLanguage = languagePreferenceFromCookie;
					this.redirectPage(currentLanguage, targetLanguage);
				}

			} else {

				//no cookie so check URL parameter for language preference

				if(this.checkForURLParameter("lang")) {
					//target language = URL parameter
					//set cookie for language preference
					targetLanguage = this.getURLParameter("lang");
					this.setLanguageCookie(targetLanguage);
					this.redirectPage(currentLanguage, targetLanguage);
				} else {
					//target language = browser language
					//use browser language but do not set cookie (no preference specified)
					targetLanguage = this.detectBrowserLanguage();
					this.redirectPage(currentLanguage, targetLanguage);
				}

			}

		},

		redirectPage: function(currentlanguage, targetlanguage) {

			var settings = this.settings,
				newURL = "";

			//redirect to the correct language based on URL parameter, cookie value, or browser language
			//if the user is currently viewing the wrong language

			if(targetlanguage !== currentlanguage) {

				if(targetlanguage=="en") {
					
					newURL = window.location.href.replace('http://proferotech.com/cn/', 'http://proferotech.com/');
					//newURL = newURL.indexOf('?')==-1 ? newURL : newURL.substring(0,newURL.indexOf('?'));

					console.log("redirecting to: " + newURL);
					window.location = newURL;

				} else {
					
					newURL = window.location.href.replace('http://proferotech.com/', 'http://proferotech.com/cn/');
					//newURL = newURL.indexOf('?')==-1 ? newURL : newURL.substring(0,newURL.indexOf('?'));

					console.log("redirecting to: " + newURL);
					window.location = newURL;

				}

			}

		},

		setLanguageCookie: function(language) {

			var settings = this.settings;

			document.cookie = "proferotech-language="+language+"; domain="+settings.domainName+"; path=/";
		},

		getCookie: function(name) {
			var nameEQ = name + "=";
			var ca = document.cookie.split(';');
			for(var i=0;i < ca.length;i++) {
				var c = ca[i];
				while (c.charAt(0)==' ') c = c.substring(1,c.length);
				if (c.indexOf(nameEQ) == 0) {
					var tmp = c.substring(nameEQ.length,c.length);
					tmp=tmp.replace(/'/g,'"');
					return tmp;
				}
			}
			return null;
		},

		detectBrowserLanguage: function() {

			var browserLanguage = window.navigator.userLanguage || window.navigator.language;
			return browserLanguage = browserLanguage.indexOf("zh") !==-1 ? "cn" : "en";

		},

		handleNavigationClick: function(event) {

			event.preventDefault();

			var el = ProferoTech.el;

			var target = $(event.target);
			if(event.target.tagName!=="A") {
				target = target.parent();
				if(target.prop("tagName")!=="A") {
					target = target.parent();
				}
			}

			var href = target.attr("href");

			if(href==="#")
				el.page.animate({scrollTop: 0}, 800);
			else
				el.page.animate({scrollTop: $(href).offset().top - 96}, 800);

		},

		checkBackToTopButton: function(st) {

			var el = this.el;

			if(st > 50)
				el.backtotopButton.css({marginLeft:0});
			else
				el.backtotopButton.css({marginLeft:"-2em"});

		},

		showRandomWorkItem: function() {

			var el = this.el;

			el.workItems.eq(Math.floor((Math.random() * el.workItems.length))).addClass("active");

		},

		initialiseCarousels: function() {

			var el = this.el;

			el.workCarousel.carousel({
				interval:	false,
				itemname:	'.work-item'
			});

			//resize height of carousel after sliding
			el.workCarousel.bind('slid', function(e) {
				el.workCarousel.css('height', $(".work-item.active").height());
			});

			//the sprite is a big horizontal list of images
			//each image needs to be given a corresponding negative left margin
			//so for example, the fifth image (catalent) need a left margin
			//of -400%
			var imageCounter = 0;
			el.workImages.each(function() {
				$(this).find("img").css('marginLeft',imageCounter+"%");
				imageCounter-=100;
			});

			var imageCarousels = el.workItemImagesCarousels();

			for(var i=0; i<el.workItems.length; i++) {
				currentCarousel = imageCarousels[i];
			
				//initialise
				currentCarousel.carousel({
					interval: 	4000,
					itemname:	'.work-image-item'
				});

				//automatically cycle through images
				currentCarousel.carousel('cycle');

				//make the carousel swipable
				currentCarousel.touchwipe({
					wipeLeft: function() { currentCarousel.carousel('next'); },
					wipeRight: function() { currentCarousel.carousel('prev'); }
				});
			}

		},

		resizeStuff: function() {

			var el = ProferoTech.el;

			//set fixed height for page header on desktop version
			//to prevent resize after navigation hover
			if(el._window.width()<960)
				el.pageHeader.css({height:"auto"});
			else
				el.pageHeader.height(498);

			//make all the 'what we do' services equal height
			//(one of them is longer/taller than the others)
			el.otherServices.height(el.bigService.height());

			//make all the 'why us' reasons equal height
			//(one of them is longer/taller than the others)
			el.otherReasons.height(el.bigReason.height());

			//make all the client logos scale with square ratio
			var w = el.clientLogoWrappers.width();
			el.clientLogos.css({width:w*el.clientLogos.length, height:w});

			//equal height columns for map and contact details
			el.mapContainer.height(el.contactDetails.height());

			//ensure the work images maintain aspect ratio
			//because only the width is set in CSS because we're using
			//an image sprite
			el.workImages.each(function() {
				$(this).find("img").css('height',$(this).width()*0.729);
			});

		},

		scrollStuff: function() {

			el = ProferoTech.el;
			ProferoTech.checkBackToTopButton(el._window.scrollTop());

		},

		setWayPoints: function() {

			var el = this.el,
				headerLoaded = false,
				whatwedoLoaded = false,
				whyusLoaded = false,
				workLoaded = false,
				clientsLoaded = false,
				testimonialsLoaded = false,
				contactLoaded = false,
				arrayOfThings = [];

			el.pageHeader.waypoint(function(direction) {
				if(direction == "down" && !headerLoaded){
					arrayOfThings = [];
					$(".hgroup").children().each(function() {
						arrayOfThings.push($(this));
					});
					arrayOfThings.push($("nav"));
					ProferoTech.fadeInItems(arrayOfThings);
				}
			}, { offset: $(window).height()*0.7 });

			el.whatwedoSection.waypoint(function(direction) {
				if(direction == "down" && !whatwedoLoaded){
					arrayOfThings = [];
					arrayOfThings.push($(".whatwedo h1"));
					$(".whatwedo .services").children().each(function() {
						arrayOfThings.push($(this));
					});
					arrayOfThings.push();
					ProferoTech.fadeInItems(arrayOfThings);
				}
			}, { offset: $(window).height()*0.7 });

			el.whyusSection.waypoint(function(direction) {
				if(direction == "down" && !whyusLoaded){
					arrayOfThings = [];
					arrayOfThings.push($(".whyus h1"));
					$(".whyus .reasons").children().each(function() {
						arrayOfThings.push($(this));
					});
					arrayOfThings.push();
					ProferoTech.fadeInItems(arrayOfThings);
				}
			}, { offset: $(window).height()*0.7 });

			el.workSection.waypoint(function(direction) {
				if(direction == "down" && !workLoaded){
					arrayOfThings = [];
					arrayOfThings.push($(".work h1"));
					arrayOfThings.push($(".work-carousel"));
					ProferoTech.fadeInItems(arrayOfThings);
				}
			}, { offset: $(window).height()*0.7 });

			el.clientsSection.waypoint(function(direction) {
				if(direction == "down" && !clientsLoaded){
					arrayOfThings = [];
					arrayOfThings.push($(".clients h1"));
					$(".client-logos").children().each(function() {
						arrayOfThings.push($(this));
					});
					ProferoTech.fadeInItems(arrayOfThings);
				}
			}, { offset: $(window).height()*0.7 });

			el.testimonialsSection.waypoint(function(direction) {
				if(direction == "down" && !testimonialsLoaded){
					arrayOfThings = [];
					arrayOfThings.push($(".testimonials h1"));
					arrayOfThings.push($(".testimonials-wrapper"));
					ProferoTech.fadeInItems(arrayOfThings);
				}
			}, { offset: $(window).height()*0.7 });

			el.contactSection.waypoint(function(direction) {
				if(direction == "down" && !contactLoaded){
					arrayOfThings = [];
					arrayOfThings.push($(".banner"));
					$(".address").children().each(function() {
						arrayOfThings.push($(this));
					});
					arrayOfThings.push($(".map-container"));
					ProferoTech.fadeInItems(arrayOfThings);
				}
			}, { offset: $(window).height()*0.7 });

		},

		fadeInItems: function(things) {
			$(things).each(function(i){
				$(this).delay(200*i).queue(function(next) {
					$(this).removeClass("fadedout");
					next();
				});
			});
		}

	};
	ProferoTech.init();

})();