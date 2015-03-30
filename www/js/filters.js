angular.module('ionic.fantasy.filters', ['ionic.fantasy.services'])

.filter('temp', function(Settings) {
  return function(input) {
    if(Settings.getTempUnits() == 'f') {
      return input.fahrenheit;
    }
    return input.celsius;
  };
})

// Silly Wunderground uses a different name for f/c in the hourly forecast
.filter('tempEnglish', function(Settings) {
  return function(input) {
    if(Settings.getTempUnits() == 'f') {
      return input.english;
    }
    return input.metric;
  };
})

.filter('tempInt', function() {
  return function(input) {
    return parseInt(input);
  }
});
