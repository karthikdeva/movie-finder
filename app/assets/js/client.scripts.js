;(function(window, document) {
(function() {
    "use strict";
    angular.module('movieFinderApp', ['ui.select','ngSanitize','run','router','commonUtilService','searchMovies','search','movieDetails','moviesFactory']);
})();

(function() {
    'use strict';
    angular
        .module('router', ['ui.router'])
        .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/');
            $stateProvider
                .state('movies', {
                    url: '/',
                    views: {
                        '': {
                            template: "<search></search>"
                        }
                    }
                }).state('details', {
                    url: '/details/:id',
                    views: {
                        '': {
                            template: "<movie-details></movie-details>"
                        }
                    }
                });
        }]);
})();

(function() {
    'use strict';
    angular.module('run', ['ui.router']).run(['$rootScope', '$state', '$stateParams', function($rootScope, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    }]);
})();

(function() {
    "use strict";
    angular.module('commonUtilService', [])
        .service('commonUtilService', [function() {
            return {
                apiUrl: "https://api.themoviedb.org/3/search/movie?api_key=49907b6cffad87bf22d3f0d5127c30e2",
            };
        }]);
})();

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

(function() {
    'use strict';
    angular.module('moviesFactory', [])
        .factory('moviesFactory', [function() {
            try {

                var movieListObj = {
                    movieList: [],
                    setMoviesList: function(movies) {
                        this.movieList = movies;
                    },
                    getMovies: function() {
                        return this.movieList;
                    },
                    getMovieDetailsById: function(id) {
                        var storedMovies = JSON.parse(localStorage.getItem("recentSearchMovies"));
                        if (storedMovies !== null) {
                            this.movieList = this.movieList.concat(storedMovies);
                        }

                        var selectedMovie = this.movieList.filter(function(v) {
                            return v.id == id;
                        });
                        if (!selectedMovie.length) {
                            return null;
                        }
                        this.setRecentSearchMovie(selectedMovie);
                        return selectedMovie[0];
                    },
                    setRecentSearchMovie: function(selectedMovie) {
                        var movies = JSON.parse(localStorage.getItem("recentSearchMovies"));
                        if (movies == null) {
                            movies = [];
                        }
                        if (typeof movies == "string") {
                            movies = JSON.parse(movies);
                        }
                        var isMovieAlreadyExist = movies.filter(function(v) {
                            return v.id == selectedMovie[0].id;
                        });
                        if (isMovieAlreadyExist.length) {
                            return;
                        }

                        if (movies.length > 5) {
                            movies.shift();
                        }
                        movies.push(selectedMovie[0])
                        localStorage.setItem("recentSearchMovies", JSON.stringify(movies));
                    },
                    getRecentSearchMovie: function() {
                        var storedMovies = localStorage.getItem("recentSearchMovies");
                        return JSON.parse(storedMovies);

                    }
                }
                return movieListObj;
            } catch (e) {
                console.warn('Error on moviesFactory factory' + e.message);
            }
        }]);
})();

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

})(window, document);