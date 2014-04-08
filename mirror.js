/**
 * Mirror images to local/public/images
 */

var fs = require('fs');
var hearthstone = require('hearthstone-card-repo');
var path = require('path');
var request = require('request');

fs.mkdirSync(path.join(__dirname, 'local'));
fs.mkdirSync(path.join(__dirname, 'local/public'));
fs.mkdirSync(path.join(__dirname, 'local/public/images'));
fs.mkdirSync(path.join(__dirname, 'local/public/images/cards'));

hearthstone.cards.forEach(function(card) {
  if (card.image.substr(-4).toLowerCase() != '.png') {
    return console.warn('Image of card with id',  card.id, 'does not have .png extension.');
  }
  request.get(card.image).pipe(fs.createWriteStream(path.join(__dirname, 'local/public/images/cards', card.id + '.png')));
});

