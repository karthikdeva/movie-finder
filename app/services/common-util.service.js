(function() {
    "use strict";
    angular.module('commonUtilService', [])
        .service('commonUtilService', [function() {
            return {
                apiUrl: "https://api.themoviedb.org/3/search/movie?api_key=49907b6cffad87bf22d3f0d5127c30e2",
            };
        }]);
})();
