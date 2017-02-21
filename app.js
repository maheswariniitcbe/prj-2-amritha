(function() {

  'use strict';

  var app = angular.module("myMap", ["ngRoute", "google-maps"]);

  app.factory('myDataService', function($http, $q) {
    var svc = {};

    svc.getInfo = function() {
      //console.log('mySvc getColors entered');
      var dfr = $q.defer();

      // Simulate an async Ajax request.
      $http.get('data.json').success(function(data) {
        dfr.resolve(data);
      }).error(function() {
        dfr.reject("An error occured while fetching items");
      });

      return dfr.promise;
    };

    svc.getMarkers = function() {
      var dfr = $q.defer();

      // Simulate an async Ajax request.
      $http.get('markers.json').success(function(data) {
        dfr.resolve(data);
      }).error(function() {
        dfr.reject("An error occured while fetching items");
      });

      return dfr.promise;
    };


    return svc;
  });

  var MapUsersController = app.controller('MapUsersController', function($scope, $log, myInfo, myMarkers) {

    // Enable the new Google Maps visuals until it gets enabled by default.
    // See http://googlegeodevelopers.blogspot.ca/2013/05/a-fresh-new-look-for-maps-api-for-all.html
    google.maps.visualRefresh = true;
    $scope.model = {
      message: "Map Controller"
    };

 $scope.onMarkerClicked = function (marker) {
            marker.showWindow = true;
            //window.alert("Marker: lat: " + marker.latitude + ", lon: " + marker.longitude + " clicked!!")
        };


    $scope.myInfo = myInfo;

    $scope.myMarkers = myMarkers;

    $scope.map = {
      center: {
        //latitude: 45,
        //longitude: -73
        latitude: $scope.myInfo.latitude,
        longitude: $scope.myInfo.longitude
      },
      zoom: 3,
      markers: $scope.myMarkers,
      dragging: true,
      options: {
        

      },
      clickedMarker: {
        title: 'You clicked here',
        latitude: null,
        longitude: null
      },
      events: {
        tilesloaded: function(map, eventName, originalEventArgs) {},
        click: function(mapModel, eventName, originalEventArgs) {
          // 'this' is the directive's scope
          $log.log("user defined event: " + eventName, mapModel, originalEventArgs);

          var e = originalEventArgs[0];

          if (!$scope.map.clickedMarker) {
            $scope.map.clickedMarker = {
              title: 'You clicked here',
              latitude: e.latLng.lat(),
              longitude: e.latLng.lng()
            };
          } else {
            $scope.map.clickedMarker.latitude = e.latLng.lat();
            $scope.map.clickedMarker.longitude = e.latLng.lng();
          }

          $scope.$apply();
        }
      }
    };


       

    _.each($scope.map.markers, function(marker) {
      marker.closeClick = function() {
        marker.showWindow = false;
        $scope.$apply();
      };
      marker.onClicked = function() {
        onMarkerClicked(marker);
      };
    });

  });

  MapUsersController.resolve = {
    myInfo: function(myDataService) {
      return myDataService.getInfo();
    },
    myMarkers: function(myDataService) {
      return myDataService.getMarkers();
    }
  };

  app.config(function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: "app.html",
        controller: 'MapUsersController',
        resolve: MapUsersController.resolve,


      });
  });


}());