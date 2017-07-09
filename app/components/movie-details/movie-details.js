(function() {
    'use strict';
    angular.module('movieDetails', []).directive("movieDetails", ['moviesFactory', '$stateParams', function(moviesFactory, $stateParams) {
        return {
            replace: true,
            restrict: 'AE',
            templateUrl: 'components/movie-details/movie-details.html',
            link: function(scope, element) {
                try {
                    scope.movie = moviesFactory.getMovieDetailsById($stateParams.id);
                } catch (e) {
                    console.warn("Error ", e.message);
                }
            }
        }
    }]);
})();
