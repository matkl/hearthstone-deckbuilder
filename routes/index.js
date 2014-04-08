var hearthstone = require('hearthstone-card-repo');

var classes = [
  { className: 'warrior', image: '/images/garrosh.png' },
  { className: 'shaman', image: '/images/thrall.png' },
  { className: 'rogue', image: '/images/valeera.png' },
  { className: 'paladin', image: '/images/uther.png' },
  { className: 'hunter', image: '/images/rexxar.png' },
  { className: 'druid', image: '/images/malfurion.png' },
  { className: 'warlock', image: '/images/guldan.png' },
  { className: 'mage', image: '/images/jaina.png' },
  { className: 'priest', image: '/images/anduin.png' }
];

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.substr(1);
}

exports.index = function(req, res) {
  res.redirect(301, '/decks');
};

exports.decks = function(req, res) {
  res.render('decks', {
    classes: classes,
    title: 'Hearthstone Deck Builder'
  });
};

exports.deck = function(req, res) {
  res.render('deck', {
    className: req.params.className,
    capitalizedClassName: capitalize(req.params.className),
    title: 'Hearthstone Deck Builder'
  });
};

exports.cards = function(req, res) {
  if (Object.keys(req.query).length == 0) return res.send(hearthstone.cards);
  var cards = hearthstone.cards.filter(function(card) {
    for (var i in req.query) {
      if (card[i] != req.query[i]) return false;
    }
    return true;
  });
  res.send(cards);
};

exports.card = function(req, res) {
  for (var i = 0; i < hearthstone.cards.length; i++) {
    if (hearthstone.cards[i].id == req.params.id) return res.send(hearthstone.cards[i]);
  }
  res.send(404);
};
