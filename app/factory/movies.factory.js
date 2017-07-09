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
