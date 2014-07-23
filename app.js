var express = require('express'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  request = require('request'),
  app = express();

var app = express();

var savedMovies = [];

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded());
// add middleware to handle overriding POST requests
// for both PUT and DELETE
app.use(methodOverride("_method"));

app.get('/', function(req, res) {
  res.render('movies/index');
});

app.get('/search', function(req, res){
  var query = req.query.searchterm;
  var url = "http://www.omdbapi.com/?s=" + query;
  request(url, function(error, response, body) {
    if (!error) {
      var data = JSON.parse(body);
      console.log(data);
      res.render('movies/results', {movieList: data.Search});
    }    
  });
});

app.get('/movies/:id', function(req, res) {
  var id = req.params.id;
  var url = "http://www.omdbapi.com/?i=" + id;
  request(url, function(error, response, body) {
    if (!error) {
      var data = JSON.parse(body);
      console.log(data);
      res.render('movies/details', {movieDetails: data})
    }
  });
});

app.post('/movies', function(req, res) {
  movieID = req.body.movie.ID;
  for (var i = 0; i < savedMovies.length; i++) {
    if (savedMovies[i] === movieID) {
      return;
    }
  };
  savedMovies.push(movieID);
  console.log(movieID);
  res.redirect('/');
});

app.get('/favorites', function(req, res) {
  var movieList = {};
  var url = "http://www.omdbapi.com/?i=";
  savedMovies.forEach(function(item, index) {
    request(url + item, function(error, response, body) {
      if (!error) {
        var data = JSON.parse(body);
        movieList.index = data;
        console.log("Favorite movies");
        console.log(data);
      }
    });
  }); 
  console.log('array of fav movies');
  console.log(movieList);
  res.render('movies/favorites', {favMovies: movieList});
});

app.listen(3000, function() {
  console.log("THE SERVER IS LISTENING ON localhost:3000");
});







