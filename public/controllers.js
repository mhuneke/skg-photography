(function(angular, $, _) {
  'use strict';

  var url = function(relativePath) {
    return "https://s3.amazonaws.com/skg-photography" + relativePath;
  };

  var controllers = angular.module('app.controllers', []);

  controllers.controller('HomeCtrl', ['$scope', '$log', function($scope, $log) {
    var bannerImages = [];
    bannerImages.push(url('/evergreen/Muse of Avalon.jpg'));
    bannerImages.push(url('/portraits/Chapeau.jpg'));
    bannerImages.push(url('/misc/Peonies.jpg'));
    bannerImages.push(url('/evergreen/Astoria.jpg'));
    bannerImages.push(url('/portraits/Violets are blue.jpg'));
    bannerImages.push(url('/misc/Golden Gate.JPG'));
    bannerImages.push(url('/song-of-songs/Hot landscape.JPG'));
    bannerImages.push(url('/song-of-songs/Chameau rotant.JPG'));
    bannerImages.push(url('/song-of-songs/Schawarma.JPG'));
    bannerImages.push(url('/evergreen/Aspen, WA.jpg'));
    bannerImages.push(url('/evergreen/Dew.jpg'));
    bannerImages.push(url('/evergreen/Setting Forth, Forks.jpg'));
    bannerImages.push(url('/misc/foretvierge.jpg'));
    bannerImages.push(url('/misc/seafoam.jpg'));
    bannerImages.push(url('/misc/Sunbeam.JPG'));
    bannerImages.push(url('/misc/Untitled.jpg'));

    // Setup backstretch when you land
    setTimeout(function() {
      $scope.backstretch = $.backstretch(bannerImages, {fade: 500, duration: 4000});
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

    $scope.url = function(relativePath) {
      return url(relativePath);
    }
  }]);

  controllers.controller('CollectionCtrl', ['$scope', '$routeParams', '$log', '$http', '$location', function($scope, $routeParams, $log, $http, $location) {
    $log.log($routeParams);
    $http.get('/json/' + $routeParams.id + ".json").success(function(data) {
      $scope.collection = data;
      $scope.photoUrls = _.map($scope.collection.photos, function(photo) {
        return url(photo.image);
      });
      $scope.thumbnailUrls = _.map($scope.collection.photos, function(photo) {
        return url(photo.thumbnail);
      });

      $('#collection-image-preview').backstretch($scope.photoUrls, {fade: 500, duration: 4000});
      $('#collection-image-preview').data('backstretch').pause();

      $scope.$watch('currentImageIndex', function() {
        $('#collection-image-preview').data('backstretch').show($scope.currentImageIndex);
        $scope.currentImageTitle = $scope.collection.photos[$scope.currentImageIndex].title;
      });

      $scope.currentImageIndex = $routeParams.imageId ? parseInt($routeParams.imageId) : 0;
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
