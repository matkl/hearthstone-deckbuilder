angular.module('app.filters', [])
  .filter('capitalize', function() {
    return function(str) {
      if (!str) return str;
      return str.charAt(0).toUpperCase() + str.slice(1);
    };
  });
