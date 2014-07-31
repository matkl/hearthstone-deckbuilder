angular.module('app.services', [])
  .factory('hearthstoneDb', function($http) {
    return {
      get: function() {
        return $http.get('all-collectibles.json').then(function(response) {
          return response.data;
        });
      }
    };
  });
