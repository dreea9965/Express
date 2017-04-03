var Promise = require("bluebird");
var fs = require('fs');

const express = require('express');
const bodyParser = require('body-parser');

const pgp = require('pg-promise') ({
  promiseLib: Promise
});
// const dbConfig = require('./db-config');
const db = pgp({
  database: 'dreea' });

var app = express();


app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));

app.get('/', function(request, res) {
  res.render('form.hbs');
});

app.get('/search-field', function(req,res){
  let term = req.query.searchTerm;
  db.any(`
    select * from restaurant
    where restaurant.name ilike '%${term}%' `)
    .then(function(results) {
      res.render('search-results.hbs', {
        results: results
      });
    });
});


app.get('/restaurant/:id', function(req,res, next){
  let param = req.params.id;
  db.one(`
    select * from restaurant where restaurant.id = ${param}
    `)
    .then(function(restaurant) {
      res.render('restaurant.hbs', {
        restaurant: restaurant
      });
    })
    .catch(next);

  });

app.listen(3000, function() {
  console.log('Listening on port 3000!');
});
