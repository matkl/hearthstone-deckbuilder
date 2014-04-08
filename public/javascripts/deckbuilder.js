(function() {

var costs = {
  common: 40,
  rare: 100,
  epic: 400,
  legendary: 1600
};

function ManaCostsViewModel(mana, cards) {
  this.mana = mana;
  this.cards = cards;
  this.count = ko.computed(function() {
    var count = 0;
    this.cards.forEach(function(card) {
      if ((this.mana == 7 && card.mana >= 7) || card.mana == this.mana) {
        count += card.count();
      }
    }, this);
    return count;
  }, this);
};

function ViewModel(cards, className) {
  var self = this;
  this.cards = cards;
  this.className = ko.observable(className);
  this.arena = ko.observable(false);
  this.cards.forEach(function(card) {
    card.count = ko.observable(0);
    card.available = ko.computed(function() {
      if (self.arena()) return true; // No restrictions for arena decks.
      var count = this.count();
      if (this.quality == 'legendary' && count >= 1) return false;
      if (count >= 2) return false;
      return true;
    }, card);
  });
  this.showNeutral = ko.observable(false);
  this.search = ko.observable('');
  this.filters = {
    'class': ko.computed(function() {
      return this.className();
    }, this),
    'collectible': ko.observable(true)
  };
  this.filteredCards = ko.computed(function() {
    var search = this.search().toLowerCase();
    return this.cards.filter(function(card) {
      if (search &&
        card.name.toLowerCase().indexOf(search) == -1 &&
        card.description.toLowerCase().indexOf(search) == -1 &&
        card.race.toLowerCase().indexOf(search) == -1 &&
        card.quality.toLowerCase().indexOf(search) == -1
      ) {
        return false;
      }
      if (card.type == 'hero') return false;
      if (card.type == 'ability') return false;
      for (var prop in this.filters) {
        if (this.filters[prop]() != null && card[prop] != this.filters[prop]()) return false;
      }
      return true;
    }, this);
  }, this);
  this.manaCosts = [];
  for (var i = 0; i < 8; i++) {
    this.manaCosts[i] = new ManaCostsViewModel(i, cards);
  }
  this.manaCostsScale = ko.computed(function() {
    var max = 10;
    this.manaCosts.forEach(function(mana) {
      max = Math.max(max, mana.count());
    });
    var scale = 100 / max;
    return scale;
  }, this);
  this.size = ko.computed(function() {
    var size = 0;
    this.cards.forEach(function(card) {
      size += card.count();
    });
    return size;
  }, this);
  this.cost = ko.computed(function() {
    var cost = 0;
    this.cards.forEach(function(card) {
      if (costs[card.quality]) cost += card.count() * costs[card.quality];
    });
    return cost;
  }, this);
  this.selectedCards = ko.computed(function() {
    var cards = this.cards.filter(function(card) {
      return card.count() > 0;
    });
    return cards;
  }, this);
}

ViewModel.prototype.toString = function() {
  var strParts = [];
  this.cards.forEach(function(card) {
    var count = card.count();
    if (count == 0) return;
    var strPart = count == 1 ? card.id : card.id + ':' + count;
    strParts.push(strPart);
  });
  var str = strParts.join(',');
  return str;
};

ViewModel.prototype.fromString = function(str) {
  var strParts = str.split(',');
  strParts.forEach(function(strPart) {
    var index = strPart.indexOf(':');
    var id = parseInt(index >= 0 ? strPart.substr(0, index) : strPart);
    var count = index >= 0 ? parseInt(strPart.substr(index + 1)) : 1;
    for (var i = 0; i < this.cards.length; i++) {
      if (this.cards[i].id == id) {
        this.cards[i].count(count);
        break;
      }
    }
  }, this);
};

ViewModel.prototype.selectCard = function(card, event) {
  console.log(arguments);
  if (!card.available()) return;
  card.count(card.count() + 1);
  updateLocation(this.toString());
  return false;
};

ViewModel.prototype.unselectCard = function(card, event) {
  if (card.count() == 0) return;
  card.count(card.count() - 1);
  updateLocation(this.toString());
};

ViewModel.prototype.clearDeck = function() {
  this.cards.forEach(function(card) {
    card.count(0);
  });
};

ViewModel.prototype.toggleNeutral = function() {
  this.showNeutral(!this.showNeutral());
};

ViewModel.prototype.toggleArena = function() {
  this.arena(!this.arena());
};

function requestCards() {
  var req = new XMLHttpRequest();
  req.open('GET', '/cards', false);
  req.send();
  var cards = JSON.parse(req.responseText);
  return cards;
}

function sortCards(cards) {
  cards.sort(function(left, right) {
    var manaOrder = right.mana < left.mana ? 1 : right.mana > left.mana ? -1 : 0;
    if (manaOrder != 0) return manaOrder;
    return right.name < left.name ? 1 : right.name > left.name ? -1 : 0;
  });
  return cards;
}

function updateLocation(str) {
  var segments = window.location.pathname.split('/', 3);
  segments.push(str);
  var pathname = segments.join('/');
  if (window.history) {
    window.history.replaceState(null, document.title, pathname);
  }
}

function init() {
  var cards = sortCards(requestCards());
  var segments = window.location.pathname.split('/');
  var className = segments[2];
  var str = segments[3];
  vm = new ViewModel(cards, className);
  if (str) vm.fromString(str);
  window.addEventListener('DOMContentLoaded', function() {
    ko.applyBindings(vm);
  });
}

init();

}());
