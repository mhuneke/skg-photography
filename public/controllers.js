(function(angular, $, _) {
  'use strict';

  var controllers = angular.module('app.controllers', []);

  controllers.controller('HomeCtrl', ['$scope', '$log', function($scope, $log) {
    // Setup backstretch when you land
    setTimeout(function() {
      $scope.backstretch = $.backstretch(["/images/astoria.jpg", "/images/aspen.jpg"], {fade: 500, duration: 4000});
    }, 1000);

    // Kill backstretch when you change routes from home
    $scope.$on('$routeChangeStart', function(route) {
      $log.log(route);
      $scope.backstretch.destroy();
    });
  }]);

  controllers.controller('ThumbnailsCtrl', ['$scope', '$log', '$http', function($scope, $log, $http) {
    $scope.collections = [];
    $http.get('/json/evergreen.json').success(function(data) {
      $scope.collections.push(data);
    });
  }]);

  controllers.controller('CollectionCtrl', ['$scope', '$routeParams', '$log', '$http', '$location', function($scope, $routeParams, $log, $http, $location) {
    $log.log($routeParams);
    $http.get('/json/' + $routeParams.id + ".json").success(function(data) {
      $scope.collection = data;
      $scope.photoUrls = _.map($scope.collection.photos, function(photo) {
        return photo.image;
      });
      $scope.thumbnailUrls = _.map($scope.collection.photos, function(photo) {
        return photo.thumbnail;
      });

      $('#collection-image-preview').backstretch($scope.photoUrls, {fade: 500, duration: 4000});
      $('#collection-image-preview').data('backstretch').pause();

      $scope.$watch('currentImageIndex', function() {
        $('#collection-image-preview').data('backstretch').show($scope.currentImageIndex);
        $scope.currentImageTitle = $scope.collection.photos[$scope.currentImageIndex].title;
      });

      $scope.currentImageIndex = $routeParams.imageId || 0;
    });

    $scope.nextImage = function() {
      if ($scope.currentImageIndex === ($scope.photoUrls.length - 1)) {
        return;
      }
      $scope.currentImageIndex++;
    };

    $scope.previousImage = function() {
      if ($scope.currentImageIndex === 0) {
        return;
      }
      $scope.currentImageIndex--;
    };

    $scope.playSlideshow = function() {
      $('#collection-image-preview').data('backstretch').resume();
    };

    $scope.pauseSlideshow = function() {
      $('#collection-image-preview').data('backstretch').pause();
    };

    $scope.gotoImage = function(index) {
      $scope.currentImageIndex = index;
    };
  }]);
}(angular, $, _));
