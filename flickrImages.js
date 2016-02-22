(function(angular) {
  'use strict';
  var flickrImages = angular.module('flickrImages', ['ngSanitize']);


  flickrImages.factory('RequestFactory', ['$http',function($http){
    var flickrAPI = "https://api.flickr.com/services/feeds/photos_public.gne?format=json&amp;per_page=10",
  //var flickrAPI = 'http://api.flickr.com/services/rest?&amp;method=flickr.photos.getRecent&amp;per_page=10&amp;format=json&amp;nojsoncallback=1&amp;user_id=140371164@N06&amp;api_key=109e2a78f6fd612de60bdfed8e1dc593',
  //var flickrAPI = 'http://api.flickr.com/services/rest/?&amp;method=flickr.photosets.getPhotos&amp;api_key=' + apiKey + '&amp;photoset_id=72157619415192530&amp;format=json&amp;jsoncallback=?'
        query = "",
        url = "",
        searching = true;

    var sendRequest = function(callback){
      window.jsonFlickrFeed = callback;
      url = flickrAPI+query;
      $http.jsonp(flickrAPI);
    };

    return {
      sendRequest:sendRequest
    };
  }]);

  flickrImages.controller('FlickrImageController', ['$scope','RequestFactory', function($scope,RequestFactory) {
    $scope.flickrImages = [];
    $scope.error = "";
    $scope.loading = true;

    if ( localStorage.pagevisits ) localStorage.pagevisits = Number(localStorage.pagevisits) + 1
    else localStorage.pagevisits = 1;
    var banners = [5312,5314,5316,5318,5324,5326,5328,5330,5332,5334,5336,5338,5340,5342,5344,5346,5348,5350,5352,5354,5356,5358,5360,5362,5364],
        pageVisits = Number(localStorage.pagevisits),
        owl = false;

    var searchCallback = function(result){
      console.log(result);
      $scope.loading = false;
      if (result.error) {
        $scope.error = result.error;
        $scope.flickrImages = [];
      } else {
        $scope.flickrImages = [];
        for(var i=0;i<10;i++) {
          if ( (4-pageVisits%4)-1 == i%4){//if they're on their 4th page visit, show banner when i=0,4,8 etc
            var randomBanner = Math.floor(Math.random() * banners.length);
            $scope.flickrImages.push({
              img: "//static.chameleon.ad/banner/"+banners[randomBanner], 
              callToAction: "Chameleon", 
              href: "//chameleon.ad" 
            });
          }
          $scope.flickrImages.push({
            img: result.items[i].media.m, 
            callToAction: "Flickr", 
            href: result.items[i].link
          });
        }
        $scope.error = "";
      }
      //$scope.$apply();
      console.log($scope.flickrImages);
   
      setTimeout(function(){
        var $carousel = $("#flickr-images");
        owl = $carousel.data('owlCarousel');
        if (owl) owl.destroy()
        $carousel.owlCarousel({
          navigation : false,
          pagination : false,
          singleItem:true,
          autoHeight : true,
          transitionStyle:"fade"
        });
        owl = $carousel.data('owlCarousel');
      },10);

    }

    $scope.refresh = function() {
      //ensure the search string matches the requirements of the API
      $scope.loading = true;
      RequestFactory.sendRequest(searchCallback);
      return ;
    };

    $scope.jumpTo = function(leftOrRight) {
      if (owl) owl.jumpTo( owl.currentItem + (leftOrRight=="left"?-1:1) );
    };

    //invoke own
    $scope.refresh();

  }]);
})(window.angular);