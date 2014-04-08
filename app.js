var express = require('express');
var fs = require('fs');
var hearthstone = require('hearthstone-card-repo');
var http = require('http');
var nib = require('nib');
var path = require('path');
var routes = require('./routes');
var stylus = require('stylus');


var app = express();

// Use local images if available.
hearthstone.cards.forEach(function(card) {
  fs.exists(path.join(__dirname, 'local/public/images/cards', card.id + '.png'), function(exists) {
    if (exists) card.image = '/images/' + card.id + '.png';
  });
});

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(stylus.middleware({
  src: path.join(__dirname, 'public'),
  compile: function(str, path) {
    return stylus(str).set('filename', path).set('compress', true).use(nib());
  }
}));
app.use(express.static(path.join(__dirname, 'local/public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/decks', routes.decks);
app.get('/decks/:className/:str?', routes.deck);
app.get('/cards', routes.cards);
app.get('/cards/:id', routes.card);

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

