(function(angular) {
  'use strict';
  var tumblrImages = angular.module('tumblrImages', ['ngSanitize']);


  tumblrImages.factory('RequestFactory', ['$http',function($http){
    var tumblrAPI = "https://api.flickr.com/services/feeds/photos_public.gne?format=json",
  //var tumblrAPI = 'http://api.flickr.com/services/rest?&amp;method=flickr.photos.getRecent&amp;per_page=20&amp;format=json&amp;api_key=109e2a78f6fd612de60bdfed8e1dc593',
  //var tumblrAPI = 'http://api.flickr.com/services/rest/?&amp;method=flickr.photosets.getPhotos&amp;api_key=' + apiKey + '&amp;photoset_id=72157619415192530&amp;format=json&amp;jsoncallback=?'
        query = "",
        url = "",
        searching = true;

    var sendRequest = function(callback){
      window.jsonFlickrFeed = callback;
      url = tumblrAPI+query;
      $http.jsonp("https://api.flickr.com/services/feeds/photos_public.gne?format=json");
    };

    return {
      sendRequest:sendRequest
    };
  }]);

  tumblrImages.controller('TumblrImageController', ['$scope','RequestFactory', function($scope,RequestFactory) {
    $scope.tumblrImages = [];
    $scope.error = "";
    $scope.loading = true;

    var searchCallback = function(result){
      console.log(result);
      $scope.loading = false;
      if (result.error) {
        $scope.error = result.error;
        $scope.tumblrImages = [];
      } else {
        $scope.tumblrImages = result.items;
        $scope.error = "";
      }
      //$scope.$apply();
   
      $("#tumblr-images").owlCarousel({
        navigation : true,
        slideSpeed : 300,
        paginationSpeed : 400,
        singleItem:true,
        autoHeight:true
      });

    }

    $scope.refresh = function() {
      //ensure the search string matches the requirements of the API
      $scope.loading = true;
      RequestFactory.sendRequest(searchCallback);
      return ;
    };

    //invoke own
    $scope.refresh();

  }]);
})(window.angular);