app = angular.module 'TFTM', ["ngRoute"]

app.config	['$routeProvider', '$locationProvider', ($routeProvider, $locationProvider) ->
	$routeProvider.when '/', {
		templateUrl: '../templates/home.html',
		controller: 'HomePageController'
	}

	$routeProvider.when '/battleship', {
		templateUrl: '../templates/battleship/home.html',
		controller: 'BattleshipController'
	}

	$routeProvider.when '/about', {
		templateUrl: '../templates/about.html',
	}

	$locationProvider.html5Mode on
]

app.directive 'navBar', -> {
		restrict: 'E',
		templateUrl: '../templates/navbar/nav.html',
		controller: 'NavBarController',
		controllerAs: 'navBar'
	}

app.directive 'contentFooter', -> {
		restrict: 'E'
		templateUrl: '../templates/footer.html'
	}

app.directive 'pageList', -> {
		restrict: 'A',
		templateUrl: '../templates/navbar/page-list.html'
	}

app.controller 'HomePageController', ($rootScope) ->
	$rootScope.doc_title = 'TFTM | Online multiplayer browser games'

app.controller 'NavBarController', ($scope, $location) -> 
	$scope.pages = [
		{url: '/', name: 'Главная'},
		{
			name: 'Игры',
			pages: [
				{url: '/battleship', name: 'Морской бой'}
			]
		}
	]
	$scope.rightPages = [
		{url: '/about', name: 'О проекте'}
	]
	$scope.current = ->
		$location.path()

app.controller 'BattleshipController', ($scope) ->
	$scope.pages = [
		{url: '/battleship', name: 'Battleship'}
	]