//user arrives on the page from outside the site - check cookie
//	cookie doesn't exist
//		check browser language
//			english
//				do nothing
//			chinese
//				check if language is the one currently displayed
//					yes
//						do nothing
//					no
//						redirect to chinese
//	cookie exists - get language preference
//		check if language is the one currently displayed
//			yes
//				do nothing
//			no
//				redirect to language preference

var languagePreference = getCookie("proferotech-language");
var currentLanguage = window.location.href.indexOf("cn") !== -1 ? "chinese" : "english";
var browserLanguage = window.navigator.userLanguage || window.navigator.language;
browserLanguage = browserLanguage.indexOf("zh") !==-1 ? "chinese" : "english";
if(!languagePreference) {
	if(browserLanguage !== "english" && browserLanguage !== currentLanguage) {
		console.log("no cookie, browser language is chinese, current language isn't chinese, redirecting");
		window.location = window.location.href.replace('http://proferotech.com/','http://proferotech.com/cn/');
	}
} else {
	if(languagePreference !== currentLanguage) {
		console.log("cookie language isn't the one the page is currently displayed in")
		if(languagePreference === "english") {
			console.log("cookie language is english so redirecting");
			window.location = window.location.href.replace('http://proferotech.com/cn/','http://proferotech.com/');
		} else {
			console.log("cookie language is chinese so redirecting");
			window.location = window.location.href.replace('http://proferotech.com/','http://proferotech.com/cn/');		
		}
	}

}

$(".language-toggle").click(function() {
	if($(this).hasClass('chinese'))
		setCookie('chinese');
	else
		setCookie('english');
});

function setCookie(language) {
	document.cookie = "proferotech-language="+language+"; domain=proferotech.com; path=/";
}

function getCookie(name) {
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
}