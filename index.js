/*
  The script for disconnect.me.

  Copyright 2010, 2011 Disconnect, Inc.

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  This program is distributed in the hope that it will be useful, but WITHOUT
  ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
  FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

  You should have received a copy of the GNU General Public License along with
  this program. If not, see <http://www.gnu.org/licenses/>.

  Authors (one per line):

    Brian Kennish <byoogle@gmail.com>
*/

/* Emphasizes a clickable element. */
function highlight(
  control, timeout, prefix, color, highlightedColor, unhighlight
) {
  control = $(control);

  setTimeout(function() {
    control[unhighlight ? 'removeClass' : 'addClass']('highlighted');
  }, timeout);

  // CurvyCorners draws nested containers with style attributes.
  control.find(prefix + '-surface div').each(function() {
    var container = $(this);
    var background = 'background-color';

    switch (container.css(background)) {
      case color:
      container.css(background, highlightedColor);
      break;

      case highlightedColor: container.css(background, color);
    }
  });
}

/* De-emphasizes a clickable element. */
function unhighlight(control, timeout, prefix, color, highlightedColor) {
  highlight(control, timeout, prefix, color, highlightedColor, true);
}

/* Choreographs a feature dance. */
function preview() {
  var screenshots = '#preview img';
  var visible = ':visible';
  var visibleScreenshots = screenshots + visible;
  $(visibleScreenshots + ':lt(5)').hide();
  $(visibleScreenshots).fadeOut();
  var timeout = 0;
  var features = '.feature';

  $(screenshots).each(function(index) {
    var remainder = index % 2;

    !remainder && setTimeout(function() {
      $(features + visible).fadeOut();
      setTimeout(function() { $(features).eq(index / 2).fadeIn(); }, 1000);
    }, timeout);

    var screenshot = this;

    setTimeout(function() { $(screenshot).fadeIn(); }, timeout + 2000);

    timeout += 1000 + remainder * 2000;
  });

  setTimeout(preview, 30000);
}

/* Registers tabbing, installation, and subscription handlers. */
$(function($) {
  var tabPrefix = '.tab';
  var tab = $(tabPrefix + '.inactive');
  var tabTimeout = 100;
  var tabColor = '#edeff4';
  var highlightedTabColor = '#f6f7fa';

  tab.bind('mouseenter focus', function() {
    highlight(this, tabTimeout, tabPrefix, tabColor, highlightedTabColor);
  }).bind('mouseleave blur', function() {
    unhighlight(this, tabTimeout, tabPrefix, tabColor, highlightedTabColor);
  }).click(function() {
    var id = this.id;
    location = '/' + (id == 'homepage' ? '' : id);
  });

  setTimeout(preview, 1000);
  var browser = $.browser;
  var mozilla = browser.mozilla;
  var tokens;
  var className = 'inactive';
  var textbox = $('#mce-EMAIL');
  var button = $('#mc-embedded-subscribe');

  if (mozilla || browser.webkit) {
    tokens = navigator.userAgent;

    setTimeout(function() {
      var buttonPrefix = '.button';
      var attribute = 'tabindex';
      var buttonTimeout = 150;
      var buttonColor = '#357ae8';
      var highlightedButtonColor = '#4d90fe';

      $(buttonPrefix).
        removeClass(className).
        attr(attribute, 1).
        bind('mouseenter focus', function() {
          highlight(
            this,
            buttonTimeout,
            buttonPrefix,
            buttonColor,
            highlightedButtonColor
          );
        }).
        bind('mouseleave blur', function() {
          unhighlight(
            this,
            buttonTimeout,
            buttonPrefix,
            buttonColor,
            highlightedButtonColor
          );
        }).
        click(function() {
          location =
              mozilla ?
                  'https://addons.mozilla.org/en-US/firefox/addon/disconnect/' :
                      tokens.indexOf('Chrome') >= 0 ?
                          'https://chrome.google.com/extensions/detail/jeoacafpbcihiomhlakheieifhpjdfeo'
                              : 'disconnect.safariextz'
        });
      textbox.attr(attribute, 2);
      button.attr(attribute, 3);
      tab.each(function(index) { $(this).attr(attribute, 4 + index); });
    }, 1000);

    if (tokens.indexOf('iPhone') >= 0) textbox.addClass('iphone');
  } else if (browser.msie) $('#tabs').add(button).addClass('ie');

  textbox.focus(function() {
    if (textbox.hasClass(className)) textbox.removeClass(className).val('');
  }).blur(function() {
    if (textbox.val() == '') textbox.addClass(className).val('Email address');
  }).val('').blur();
});
