angular.module('ionic.fantasy.directives', [])

.constant('JERSEY_ICON', {
  'partlycloudy': 'ion-ios7-person-outline',
  'mostlycloudy': 'ion-ios7-person-outline',
  'cloudy': 'ion-ios7-person-outline',
  'rain': 'ion-ios7-person-outline',
  'tstorms': 'ion-ios7-person-outline',
  'sunny': 'ion-ios7-person-outline',
  'clear-day': 'ion-ios7-person-outline',
  'nt_clear': 'ion-ios7-person-outline',
  'clear-night': 'ion-ios7-person-outline'
})

.directive('jerseyIcon', function(JERSEY_ICON) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      icon: '='
    },
    template: '<i class="icon" ng-class="jerseyIcon"></i>',
    link: function($scope) {

      $scope.$watch('icon', function(v) {
        if(!v) { return; }

        var icon = v;

        if(icon in JERSEY_ICON) {
          $scope.jerseyIcon = JERSEY_ICON[icon];
        } else {
          $scope.jerseyIcon = JERSEY_ICON['cloudy'];
        }
      });
    }
  }
})

.directive('currentStatistics', function($timeout, $rootScope, Settings) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'templates/current-statistics.html',
    scope: true,
    compile: function(element, attr) {
      return function($scope, $element, $attr) {

        $rootScope.$on('settings.changed', function(settings) {
          var units = Settings.get('tempUnits');

          if($scope.forecast) {

            var forecast = $scope.forecast;
            var current = $scope.current;

            if(units == 'f') {
              $scope.highTemp = forecast.forecastday[0].high.fahrenheit;
              $scope.lowTemp = forecast.forecastday[0].low.fahrenheit;
              $scope.currentTemp = Math.floor(current.temp_f);
            } else {
              $scope.highTemp = forecast.forecastday[0].high.celsius;
              $scope.lowTemp = forecast.forecastday[0].low.celsius;
              $scope.currentTemp = Math.floor(current.temp_c);
            }
          }
        });

        $scope.$watch('current', function(current) {
          var units = Settings.get('tempUnits');

          if(current) {
            if(units == 'f') {
              $scope.currentTemp = Math.floor(current.currently.temperature);
            } else {
              $scope.currentTemp = Math.floor(current.currently.temperature);
            }
            if(units == 'f') {
              $scope.highTemp = Math.floor(current.daily.data[0].temperatureMax);
              $scope.lowTemp = Math.floor(current.daily.data[0].temperatureMin);
            } else {
              $scope.highTemp = Math.floor(current.daily.data[0].temperatureMax);
              $scope.lowTemp = Math.floor(current.daily.data[0].temperatureMin);
            }
          }
        });

      // Delay so we are in the DOM and can calculate sizes
      $timeout(function() {
        var windowHeight = window.innerHeight;
        var thisHeight = $element[0].offsetHeight;
        var headerHeight = document.querySelector('#header').offsetHeight;
        $element[0].style.paddingTop = (windowHeight - (thisHeight)) + 'px';
        angular.element(document.querySelector('.content')).css('-webkit-overflow-scrolling', 'auto');
        $timeout(function() {
          angular.element(document.querySelector('.content')).css('-webkit-overflow-scrolling', 'touch');
        }, 50);
      });
      }
    }
  }
})

.directive('forecast', function($timeout) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'templates/forecast.html',
    link: function($scope, $element, $attr) {
    }
  }
})

.directive('weatherBox', function($timeout) {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    scope: {
      title: '@'
    },
    template: '<div class="weather-box"><h4 class="title">{{title}}</h4><div ng-transclude></div></div>',
    link: function($scope, $element, $attr) {
    }
  }
})

.directive('scrollEffects', function() {
  return {
    restrict: 'A',
    link: function($scope, $element, $attr) {
      var amt, st, header, bg;
     // var bgCollection = document.getElementsByClassName('bg-image');

      //console.log("bgCollection is:" ,bgCollection)

      /*if(bgCollection.length >0){
        bg = bgCollection[0];
        console.log('bg', bg);
      }*/

      $element.bind('scroll', function(e) {
      console.log("in scrollEffects")
        if(!header) {
          header = document.getElementById('header');
        }
        if(!bg){
          bg = document.querySelector(".bg-image");
/*          bgCollection = document.getElementsByClassName('bg-image');
          if(bgCollection.length >0){
            console.log("bgCollection is:" ,bgCollection)
            bg = bgCollection[0];
            console.log('bg', bg);
          } */
        }
        st = e.detail.scrollTop;
        if(st >= 0) {
          header.style.webkitTransform = 'translate3d(0, 0, 0)';
        } else if(st < 0) {
          header.style.webkitTransform = 'translate3d(0, ' + -st + 'px, 0)';
        }
        amt = Math.min(0.6, st / 1000);

        ionic.requestAnimationFrame(function() {
          console.log("header opacity: "+header.style.filter);
          header.style.opacity = 1 - amt;
          console.log("header opacity: "+header.style.filter);
          if(bg) {
            console.log("bg opacity: "+bg.style.filter);
            bg.style.opacity = 1 - amt;
            console.log("bg opacity: "+bg.style.filter);
          }
        });
      });
    }
  }
})

.directive('backgroundCycler', function($compile, $animate) {
  var animate = function($scope, $element, newImageUrl) {
    var child = $element.children()[0];

    var scope = $scope.$new();
    scope.url = newImageUrl;
    var img = $compile('<background-image></background-image>')(scope);

    $animate.enter(img, $element, null, function() {
      console.log('Inserted');
    });
    if(child) {
      $animate.leave(angular.element(child), function() {
        console.log('Removed');
      });
    }
  };

  return {
    restrict: 'E',
    link: function($scope, $element, $attr) {
      $scope.$watch('activeBgImage', function(v) {
        if(!v) { return; }
        console.log('Active bg image changed', v);
        var item = v;
        var url = "http://farm"+ item.farm +".static.flickr.com/"+ item.server +"/"+ item.id +"_"+ item.secret + "_z.jpg";
        animate($scope, $element, url);
      });
    }
  }
})

.directive('backgroundImage', function($compile, $animate) {
  return {
    restrict: 'E',
    template: '<div class="bg-image"></div>',
    replace: true,
    scope: true,
    link: function($scope, $element, $attr) {
      if($scope.url) {
        $element[0].style.backgroundImage = 'url(' + $scope.url + ')';
      }
    }
  }
});
