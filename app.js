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
// serve all public files
app.use(express.static(__dirname + '/public'));

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
  var movie = {Title: req.body.movie.Title, ID: req.body.movie.ID}
  for (var i = 0; i < savedMovies.length; i++) {
    if (savedMovies[i].ID === movie.ID) {
      return;
    }
  };
  savedMovies.push(movie);
  console.log(movie);
  res.redirect('/');
});

app.get('/favorites', function(req, res) {
  res.render('movies/favorites', {favMovies: savedMovies});
});

app.listen(3000, function() {
  console.log("THE SERVER IS LISTENING ON localhost:3000");
});







