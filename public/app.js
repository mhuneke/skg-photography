(function(angular) {
  'use strict';

  var app = angular.module('app', ['app.controllers']);

  app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $routeProvider.when('/', {templateUrl: '/partials/home.html', controller: 'HomeCtrl'});
    $routeProvider.when('/collection/evergreen', {templateUrl: '/partials/evergreen-intro.html', controller: 'CollectionIntroCtrl'});
    $routeProvider.when('/collection/:id/:imageId', {templateUrl: '/partials/view-collection.html', controller: 'CollectionCtrl'});
    $routeProvider.when('/thumbnails', {templateUrl: '/partials/view-thumbnails.html', controller: 'ThumbnailsCtrl'});

    $routeProvider.when('/about', {templateUrl: '/partials/about.html'});
    $routeProvider.when('/contact', {templateUrl: '/partials/contact.html'});

    $routeProvider.otherwise({redirectTo: '/'});
  }]);

}(angular));
