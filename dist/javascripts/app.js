angular.module('app', [
  'ngRoute',
  'app.controllers',
  'app.services',
  'app.filters',
  'app.directives'
  ])
  .config(function($routeProvider, $locationProvider) {
    $routeProvider.when('/:className', {
      templateUrl: 'builder.html',
      controller: 'BuilderCtrl',
      reloadOnSearch: false
    }).otherwise({
      templateUrl: 'heroes.html',
      controller: 'HeroesCtrl'
    });

    $locationProvider.html5Mode(true);
  });
