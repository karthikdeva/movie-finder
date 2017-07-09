(function() {
    'use strict';
    angular.module('search', []).directive("search", ['searchMovies', 'moviesFactory', function(searchMovies, moviesFactory) {
        return {
            replace: true,
            restrict: 'AE',
            templateUrl: 'components/search/search.html',
            link: function(scope, element) {
                try {
                    var language = "en-US";
                    scope.movieName = "";
                    scope.movies = [];
                    scope.recentSearchMovies = moviesFactory.getRecentSearchMovie();
                    scope.getMovies = function(movieName) {
                        if (movieName.length > 2) {
                            var promise = searchMovies.getMovies(movieName, language);
                            promise.then(function(res) {
                                if (res.hasOwnProperty('data')) {
                                    moviesFactory.setMoviesList(res.data.results);
                                    scope.movies = moviesFactory.getMovies();
                                }
                            }, function(error) {
                                console.log(error);
                            });
                        }
                    }

                } catch (e) {
                    console.warn("Error ", e.message);
                }
            }
        }
    }]);
})();
