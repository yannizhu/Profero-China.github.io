var portfolio = angular.module("portfolio", []);

portfolio.config(function($routeProvider) {

	$routeProvider.when('/',
		{
			templateUrl: "../home/index.html"

		}
	).when('/work/blossomhill',
		{
			templateUrl: "../work/blossomhill/index.html"
		}
	).when('/work/catalent',
		{
			templateUrl: "../work/catalent/index.html"
		}
	).when('/work/malts',
		{
			templateUrl: "../work/malts/index.html"
		}
	).when('/work/omo',
		{
			templateUrl: "../work/omo/index.html"
		}
	).when('/work/roadshow',
		{
			templateUrl: "../work/roadshow/index.html"
		}
	).when('/work/smirnoff',
		{
			templateUrl: "../work/smirnoff/index.html"
		}
	).otherwise({redirectTo:'/'});

});