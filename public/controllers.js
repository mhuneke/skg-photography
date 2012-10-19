(function(angular, $, _, setTimeout, setInterval, clearInterval) {
  'use strict';

  var controllers = angular.module('app.controllers', []);

  var url = function(relativePath) {
    return "https://s3.amazonaws.com/skg-photography" + relativePath;
  };

  var slideshowInterval = 4000;

  controllers.controller('HomeCtrl', ['$scope', '$log', function($scope, $log) {
    var bannerImages = [];
    bannerImages.push(url('/evergreen/Muse of Avalon.jpg'));
    bannerImages.push(url('/portraits/Chapeau.jpg'));
    // bannerImages.push(url('/misc/Peonies.jpg'));
    bannerImages.push(url('/misc/Astoria.jpg'));
    bannerImages.push(url('/portraits/Violets are blue.jpg'));
    // bannerImages.push(url('/misc/Golden Gate.JPG'));
    bannerImages.push(url('/song-of-songs/Hot landscape.JPG'));
    bannerImages.push(url('/song-of-songs/Chameau rotant.JPG'));
    bannerImages.push(url('/song-of-songs/Schawarma.JPG'));
    // bannerImages.push(url('/evergreen/Aspen, WA.jpg'));
    bannerImages.push(url('/evergreen/Dew.jpg'));
    bannerImages.push(url('/evergreen/Setting Forth, Forks.jpg'));
    // bannerImages.push(url('/misc/foretvierge.jpg'));
    bannerImages.push(url('/misc/seafoam.jpg'));
    bannerImages.push(url('/misc/Sunbeam.JPG'));
    bannerImages.push(url('/misc/Untitled.jpg'));
    bannerImages.push(url('/misc/Morning chalk.jpg'));
    bannerImages.push(url('/misc/Gooey.jpg'));
    bannerImages.push(url('/misc/Levres et lumieres.jpg'));
    bannerImages.push(url('/song-of-songs/Call to Prayer.JPG'));
    bannerImages.push(url('/portraits/Orlene (2).jpg'));

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
    $scope.collectionAliases = ['evergreen', 'song-of-songs', 'portraits'];
    _.each($scope.collectionAliases, function(alias) {
      $http.get('/json/' + alias + '.json').success(function(data) {
        $scope.collections.push(data);
      });
    });
  }]);

  controllers.controller('CollectionCtrl', ['$scope', '$routeParams', '$log', '$http', '$location', function($scope, $routeParams, $log, $http, $location) {
    $log.log($routeParams);

    $scope.setImage = function() {
      var $container = $("#preview-image-container");
      var $image = $("#preview-image-container img");
      
      var createImage = function() {
        $container.empty();
        var $img = $('<img />')
          .css("display", "none")
          .bind('load', function (e) {
            $img.fadeIn('fast');
          })
          .appendTo($container);

        $img.attr('src', $scope.photoUrls[$scope.currentImageIndex]);
      };

      if ($image) {
        $image.fadeOut('fast', createImage());
      } else {
        createImage();
      }
    };

    $http.get('/json/' + $routeParams.id + ".json").success(function(data) {
      $scope.collection = data;
      $scope.photoUrls = _.map($scope.collection.photos, function(photo) {
        return photo.image;
      });

      $scope.$watch('currentImageIndex', function() {
        $scope.currentImageTitle = $scope.collection.photos[$scope.currentImageIndex].title;
        $scope.setImage();
      });

      $scope.currentImageIndex = $routeParams.imageId ? parseInt($routeParams.imageId, 0) : 0;
      $scope.currentImageSource = $scope.photoUrls[$scope.currentImageIndex];
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
      $scope.slideshowPlaying = true;
      $scope.slideshowIntervalId = setInterval(function() {
        $scope.$apply(function() {
          // reset the slideshow if at the end
          if ($scope.currentImageIndex === $scope.photoUrls.length - 1) {
            $scope.currentImageIndex = 0;
          } else {
            $scope.currentImageIndex++;
          }
        });
      }, slideshowInterval);
    };

    $scope.pauseSlideshow = function() {
      $scope.slideshowPlaying = false;
      clearInterval($scope.slideshowIntervalId);
    };
  }]);
}(angular, $, _, setTimeout, setInterval, clearInterval));
