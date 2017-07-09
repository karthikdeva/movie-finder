(function() {
    "use strict";
    angular.module('searchMovies', [])
        .service('searchMovies', ['$q', '$http', 'commonUtilService', function($q, $http, commonUtilService) {
            return {
                getMovies: function(movieName,language) {
                    var deferred = $q.defer();
                    var apiUrl = commonUtilService.apiUrl + "&query=" + movieName+"&language="+language;
                    $http.get(apiUrl).then(function(data) {
                        deferred.resolve(data);
                    }, function myError(response) {
                      deferred.reject(response);
                    });
                    return deferred.promise;
                },

            };
        }]);
})();
