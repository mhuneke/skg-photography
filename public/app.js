(function(angular) {
  'use strict';

  var app = angular.module('app', ['app.controllers']);

  app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/', {templateUrl: '/partials/home.html'});
  }]);

}(angular));
