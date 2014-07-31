angular.module('app.directives', [])
  .directive('watchLoad', function() {
    return {
      link: function(scope, element, attr) {
        element.on('load', function(event) {
          element.addClass('loaded');
        });
      },
      restrict: 'A'
    };
  })
  .directive('cardListItem', function() {
    var tooltip = angular.element('<img id="card-tooltip"></img>');

    return {
      link: function(scope, element, attr) {
        element.on('mouseenter', function() {
          tooltip.attr('src', scope.card.image_url);
          angular.element(document.body).append(tooltip);

          var rect = element[0].getBoundingClientRect();
          var clientHeight = document.documentElement.clientHeight;
          var topOffset = rect.top + 303 >= clientHeight ? -303 : 0;

          tooltip.css({
            left: rect.left - 210 + 'px',
            top: rect.top + topOffset + 'px'
          });
        });
        element.on('mousemove', function(event) {
        });
        element.on('mouseleave', function(event) {
          tooltip.remove();
        });
        scope.$on('$destroy', function() {
          tooltip.remove();
        });
      },
      restrict: 'EA',
      scope: {
        card: '=',
        count: '='
      },
      template:
        '<div class="image" style="background-image: url(\'{{card.image_url}}\');">{{count}}</div>' +
        '<div class="content">' +
        '  <div class="mana">{{card.mana}}</div>' +
        '  <div class="name">{{card.name}}</div>' +
        '  <div class="count" ng-show="count > 1">{{count}}</div>' +
        '</div>'
    };
  });
