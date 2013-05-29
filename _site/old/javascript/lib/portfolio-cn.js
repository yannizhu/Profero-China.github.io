var portfolio = angular.module("portfolio", ['ngSanitize']);

portfolio.factory('projects', function($http) {
	//using a factory so that the data can be shared by all controllers
	//the controller will load first so need to use promises to ensure it will get the
	//data from the json file once it loads.
	var allProjects = {
		async: function() {
			var promise = $http.get('../../projects-cn.json').then(function (response) {
				//console.log(response);
				return response.data;
			});
			return promise;
		}
	};
	return allProjects;
});

portfolio.config(function($routeProvider) {

	$routeProvider.when('/',
		{
			templateUrl: "../../templates/list-cn.html",
			controller: "ShowList"

		}
	).when('/portfolio/:projectname',
		{
			templateUrl: "../../templates/detail-cn.html",
			controller: "ShowOne"
		}
	).otherwise({redirectTo:'/'});

});

portfolio.directive("resizeportfolioitems", function() {
	return function($scope, element, attrs) {
		$scope.$watch('projects', function() {
			var items = element.find(".portfolio-item").get();
			for(i=0;i<items.length;i++) {
				var _this = $(items[i]);
				var w = _this.width();
				_this.css({
					"height":w
				});
			}
		});
	};
});

portfolio.directive("setbackgroundoffset", function() {
	return function($scope, element, attrs) {
		var w = element.width();
		var offset = attrs.setbackgroundoffset * -1* w + "px 0";
		element.css({
			"background-position": offset
		});
	};
});

portfolio.directive("setactive", function() {
	return function($scope, element, attrs) {
		$scope.$watch('project', function() {
			element.children(":first").addClass("active");
		});
	};
});

portfolio.controller("ShowList", function($scope, projects) {
	//listen for the json file to be read
	projects.async().then(function(data) {
		//console.log(data);
		$scope.projects = data;
	});
});

portfolio.controller("ShowOne", function($scope, $routeParams, projects) {
	//listen for the json file to be read
	projects.async().then(function(data) {
		//console.log(data);
		allprojects = data;
		project = allprojects.filter(function(project) {
			if(project.slug === $routeParams.projectname)
				return project;
		});
		$scope.project = project[0];
	});
});