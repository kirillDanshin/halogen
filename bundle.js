require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var getVendorPropertyName = require('./getVendorPropertyName');

module.exports = function(target, sources) {
  var to = Object(target);
  var hasOwnProperty = Object.prototype.hasOwnProperty;

  for (var nextIndex = 1; nextIndex < arguments.length; nextIndex++) {
    var nextSource = arguments[nextIndex];
    if (nextSource == null) {
      continue;
    }

    var from = Object(nextSource);

    for (var key in from) {
      if (hasOwnProperty.call(from, key)) {
        to[key] = from[key];
      }
    }
  }

  var prefixed = {};
  for (var key in to) {
    prefixed[getVendorPropertyName(key)] = to[key]
  }

  return prefixed
}

},{"./getVendorPropertyName":4}],2:[function(require,module,exports){
'use strict';

module.exports = document.createElement('div').style;

},{}],3:[function(require,module,exports){
'use strict';

var cssVendorPrefix;

module.exports = function() {

  if (cssVendorPrefix) return cssVendorPrefix;

  var styles = window.getComputedStyle(document.documentElement, '');
  var pre = (Array.prototype.slice.call(styles).join('').match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o']))[1];

  return cssVendorPrefix = '-' + pre + '-';
}

},{}],4:[function(require,module,exports){
'use strict';

var builtinStyle = require('./builtinStyle');
var prefixes = ['Moz', 'Webkit', 'O', 'ms'];
var domVendorPrefix;

// Helper function to get the proper vendor property name. (transition => WebkitTransition)
module.exports = function(prop, isSupportTest) {

  var vendorProp;
  if (prop in builtinStyle) return prop;

  var UpperProp = prop.charAt(0).toUpperCase() + prop.substr(1);

  if (domVendorPrefix) {

    vendorProp = domVendorPrefix + UpperProp;
    if (vendorProp in builtinStyle) {
      return vendorProp;
    }
  } else {

    for (var i = 0; i < prefixes.length; ++i) {
      vendorProp = prefixes[i] + UpperProp;
      if (vendorProp in builtinStyle) {
        domVendorPrefix = prefixes[i];
        return vendorProp;
      }
    }
  }

  // if support test, not fallback to origin prop name
  if (!isSupportTest) {
    return prop;
  }

}

},{"./builtinStyle":2}],5:[function(require,module,exports){
'use strict';

var insertRule = require('./insertRule');
var vendorPrefix = require('./getVendorPrefix')();
var index = 0;

module.exports = function(keyframes) {
  // random name
  var name = 'anim_' + (++index) + (+new Date);
  var css = "@" + vendorPrefix + "keyframes " + name + " {";

  for (var key in keyframes) {
    css += key + " {";

    for (var property in keyframes[key]) {
      var part = ":" + keyframes[key][property] + ";";
      // We do vendor prefix for every property
      css += vendorPrefix + property + part;
      css += property + part;
    }

    css += "}";
  }

  css += "}";

  insertRule(css);

  return name
}

},{"./getVendorPrefix":3,"./insertRule":6}],6:[function(require,module,exports){
'use strict';

var extraSheet;

module.exports = function(css) {

  if (!extraSheet) {
    // First time, create an extra stylesheet for adding rules
    extraSheet = document.createElement('style');
    document.getElementsByTagName('head')[0].appendChild(extraSheet);
    // Keep reference to actual StyleSheet object (`styleSheet` for IE < 9)
    extraSheet = extraSheet.sheet || extraSheet.styleSheet;
  }

  var index = (extraSheet.cssRules || extraSheet.rules).length;
  extraSheet.insertRule(css, index);

  return extraSheet;
}

},{}],7:[function(require,module,exports){
'use strict';

var React = require('react');
var assign = require('domkit/appendVendorPrefix');
var insertKeyframesRule = require('domkit/insertKeyframesRule');

/**
 * @type {Object}
 */
var keyframes = {
    '50%': {
        transform: 'scale(0.75)',
        opacity: 0.2
    },
    '100%': {
        transform: 'scale(1)',
        opacity: 1
    }
};

var animationName = insertKeyframesRule(keyframes);

var Loader = React.createClass({
    displayName: 'Loader',

    /**
     * @type {Object}
     */
    propTypes: {
        loading: React.PropTypes.bool,
        color: React.PropTypes.string,
        size: React.PropTypes.string,
        margin: React.PropTypes.string
    },

    /**
     * @return {Object}
     */
    getDefaultProps: function getDefaultProps() {
        return {
            loading: true,
            color: '#ffffff',
            size: '15px',
            margin: '2px'
        };
    },

    /**
     * @return {Object}
     */
    getBallStyle: function getBallStyle() {
        return {
            backgroundColor: this.props.color,
            width: this.props.size,
            height: this.props.size,
            margin: this.props.margin,
            borderRadius: '100%',
            verticalAlign: this.props.verticalAlign
        };
    },

    /**
     * @param  {Number} i
     * @return {Object}
     */
    getAnimationStyle: function getAnimationStyle(i) {
        var animation = [animationName, '0.7s', i % 2 ? '0s' : '0.35s', 'infinite', 'linear'].join(' ');
        var animationFillMode = 'both';

        return {
            animation: animation,
            animationFillMode: animationFillMode
        };
    },

    /**
     * @param  {Number} i
     * @return {Object}
     */
    getStyle: function getStyle(i) {
        return assign(this.getBallStyle(i), this.getAnimationStyle(i), {
            display: 'inline-block',
            border: '0px solid transparent' // fix firefox/chrome/opera rendering
        });
    },

    /**
     * @param  {Boolean} loading
     * @return {ReactComponent || null}
     */
    renderLoader: function renderLoader(loading) {
        if (loading) {
            return React.createElement(
                'div',
                { id: this.props.id, className: this.props.className },
                React.createElement('div', { style: this.getStyle(1) }),
                React.createElement('div', { style: this.getStyle(2) }),
                React.createElement('div', { style: this.getStyle(3) })
            );
        }

        return null;
    },

    render: function render() {
        return this.renderLoader(this.props.loading);
    }
});

module.exports = Loader;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJlYXRMb2FkZXIuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJyZXF1aXJlIiwiYXNzaWduIiwiaW5zZXJ0S2V5ZnJhbWVzUnVsZSIsImtleWZyYW1lcyIsInRyYW5zZm9ybSIsIm9wYWNpdHkiLCJhbmltYXRpb25OYW1lIiwiTG9hZGVyIiwiY3JlYXRlQ2xhc3MiLCJwcm9wVHlwZXMiLCJsb2FkaW5nIiwiUHJvcFR5cGVzIiwiYm9vbCIsImNvbG9yIiwic3RyaW5nIiwic2l6ZSIsIm1hcmdpbiIsImdldERlZmF1bHRQcm9wcyIsImdldEJhbGxTdHlsZSIsImJhY2tncm91bmRDb2xvciIsInByb3BzIiwid2lkdGgiLCJoZWlnaHQiLCJib3JkZXJSYWRpdXMiLCJ2ZXJ0aWNhbEFsaWduIiwiZ2V0QW5pbWF0aW9uU3R5bGUiLCJpIiwiYW5pbWF0aW9uIiwiam9pbiIsImFuaW1hdGlvbkZpbGxNb2RlIiwiZ2V0U3R5bGUiLCJkaXNwbGF5IiwiYm9yZGVyIiwicmVuZGVyTG9hZGVyIiwiaWQiLCJjbGFzc05hbWUiLCJyZW5kZXIiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUlBLFFBQVFDLFFBQVEsT0FBUixDQUFaO0FBQ0EsSUFBSUMsU0FBU0QsUUFBUSwyQkFBUixDQUFiO0FBQ0EsSUFBSUUsc0JBQXNCRixRQUFRLDRCQUFSLENBQTFCOztBQUVBOzs7QUFHQSxJQUFJRyxZQUFZO0FBQ1osV0FBTztBQUNIQyxtQkFBVyxhQURSO0FBRUhDLGlCQUFTO0FBRk4sS0FESztBQUtaLFlBQVE7QUFDSkQsbUJBQVcsVUFEUDtBQUVKQyxpQkFBUztBQUZMO0FBTEksQ0FBaEI7O0FBV0EsSUFBSUMsZ0JBQWdCSixvQkFBb0JDLFNBQXBCLENBQXBCOztBQUVBLElBQUlJLFNBQVNSLE1BQU1TLFdBQU4sQ0FBa0I7QUFBQTs7QUFDM0I7OztBQUdBQyxlQUFXO0FBQ1BDLGlCQUFTWCxNQUFNWSxTQUFOLENBQWdCQyxJQURsQjtBQUVQQyxlQUFPZCxNQUFNWSxTQUFOLENBQWdCRyxNQUZoQjtBQUdQQyxjQUFNaEIsTUFBTVksU0FBTixDQUFnQkcsTUFIZjtBQUlQRSxnQkFBUWpCLE1BQU1ZLFNBQU4sQ0FBZ0JHO0FBSmpCLEtBSmdCOztBQVczQjs7O0FBR0FHLHFCQUFpQiwyQkFBVztBQUN4QixlQUFPO0FBQ0hQLHFCQUFTLElBRE47QUFFSEcsbUJBQU8sU0FGSjtBQUdIRSxrQkFBTSxNQUhIO0FBSUhDLG9CQUFRO0FBSkwsU0FBUDtBQU1ILEtBckIwQjs7QUF1QjNCOzs7QUFHQUUsa0JBQWMsd0JBQVc7QUFDckIsZUFBTztBQUNIQyw2QkFBaUIsS0FBS0MsS0FBTCxDQUFXUCxLQUR6QjtBQUVIUSxtQkFBTyxLQUFLRCxLQUFMLENBQVdMLElBRmY7QUFHSE8sb0JBQVEsS0FBS0YsS0FBTCxDQUFXTCxJQUhoQjtBQUlIQyxvQkFBUSxLQUFLSSxLQUFMLENBQVdKLE1BSmhCO0FBS0hPLDBCQUFjLE1BTFg7QUFNSEMsMkJBQWUsS0FBS0osS0FBTCxDQUFXSTtBQU52QixTQUFQO0FBUUgsS0FuQzBCOztBQXFDM0I7Ozs7QUFJQUMsdUJBQW1CLDJCQUFTQyxDQUFULEVBQVk7QUFDM0IsWUFBSUMsWUFBWSxDQUFDckIsYUFBRCxFQUFnQixNQUFoQixFQUF3Qm9CLElBQUUsQ0FBRixHQUFLLElBQUwsR0FBVyxPQUFuQyxFQUE0QyxVQUE1QyxFQUF3RCxRQUF4RCxFQUFrRUUsSUFBbEUsQ0FBdUUsR0FBdkUsQ0FBaEI7QUFDQSxZQUFJQyxvQkFBb0IsTUFBeEI7O0FBRUEsZUFBTztBQUNIRix1QkFBV0EsU0FEUjtBQUVIRSwrQkFBbUJBO0FBRmhCLFNBQVA7QUFJSCxLQWpEMEI7O0FBbUQzQjs7OztBQUlBQyxjQUFVLGtCQUFTSixDQUFULEVBQVk7QUFDbEIsZUFBT3pCLE9BQ0gsS0FBS2lCLFlBQUwsQ0FBa0JRLENBQWxCLENBREcsRUFFSCxLQUFLRCxpQkFBTCxDQUF1QkMsQ0FBdkIsQ0FGRyxFQUdIO0FBQ0lLLHFCQUFTLGNBRGI7QUFFUkMsb0JBQVEsdUJBRkEsQ0FFd0I7QUFGeEIsU0FIRyxDQUFQO0FBUUgsS0FoRTBCOztBQWtFM0I7Ozs7QUFJQUMsa0JBQWMsc0JBQVN2QixPQUFULEVBQWtCO0FBQzVCLFlBQUlBLE9BQUosRUFBYTtBQUNULG1CQUNJO0FBQUE7QUFBQSxrQkFBSyxJQUFJLEtBQUtVLEtBQUwsQ0FBV2MsRUFBcEIsRUFBd0IsV0FBVyxLQUFLZCxLQUFMLENBQVdlLFNBQTlDO0FBQ0ksNkNBQUssT0FBTyxLQUFLTCxRQUFMLENBQWMsQ0FBZCxDQUFaLEdBREo7QUFFSSw2Q0FBSyxPQUFPLEtBQUtBLFFBQUwsQ0FBYyxDQUFkLENBQVosR0FGSjtBQUdJLDZDQUFLLE9BQU8sS0FBS0EsUUFBTCxDQUFjLENBQWQsQ0FBWjtBQUhKLGFBREo7QUFPSDs7QUFFRCxlQUFPLElBQVA7QUFDSCxLQWxGMEI7O0FBb0YzQk0sWUFBUSxrQkFBVztBQUNmLGVBQU8sS0FBS0gsWUFBTCxDQUFrQixLQUFLYixLQUFMLENBQVdWLE9BQTdCLENBQVA7QUFDSDtBQXRGMEIsQ0FBbEIsQ0FBYjs7QUF5RkEyQixPQUFPQyxPQUFQLEdBQWlCL0IsTUFBakIiLCJmaWxlIjoiQmVhdExvYWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgYXNzaWduID0gcmVxdWlyZSgnZG9ta2l0L2FwcGVuZFZlbmRvclByZWZpeCcpO1xudmFyIGluc2VydEtleWZyYW1lc1J1bGUgPSByZXF1aXJlKCdkb21raXQvaW5zZXJ0S2V5ZnJhbWVzUnVsZScpO1xuXG4vKipcbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cbnZhciBrZXlmcmFtZXMgPSB7XG4gICAgJzUwJSc6IHtcbiAgICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoMC43NSknLFxuICAgICAgICBvcGFjaXR5OiAwLjJcbiAgICB9LFxuICAgICcxMDAlJzoge1xuICAgICAgICB0cmFuc2Zvcm06ICdzY2FsZSgxKScsXG4gICAgICAgIG9wYWNpdHk6IDFcbiAgICB9XG59O1xuXG52YXIgYW5pbWF0aW9uTmFtZSA9IGluc2VydEtleWZyYW1lc1J1bGUoa2V5ZnJhbWVzKTtcblxudmFyIExvYWRlciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICAvKipcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHByb3BUeXBlczoge1xuICAgICAgICBsb2FkaW5nOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcbiAgICAgICAgY29sb3I6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIHNpemU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIG1hcmdpbjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZ1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGxvYWRpbmc6IHRydWUsXG4gICAgICAgICAgICBjb2xvcjogJyNmZmZmZmYnLFxuICAgICAgICAgICAgc2l6ZTogJzE1cHgnLFxuICAgICAgICAgICAgbWFyZ2luOiAnMnB4J1xuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgZ2V0QmFsbFN0eWxlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogdGhpcy5wcm9wcy5jb2xvcixcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLnByb3BzLnNpemUsXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMucHJvcHMuc2l6ZSxcbiAgICAgICAgICAgIG1hcmdpbjogdGhpcy5wcm9wcy5tYXJnaW4sXG4gICAgICAgICAgICBib3JkZXJSYWRpdXM6ICcxMDAlJyxcbiAgICAgICAgICAgIHZlcnRpY2FsQWxpZ246IHRoaXMucHJvcHMudmVydGljYWxBbGlnblxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSAge051bWJlcn0gaVxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBnZXRBbmltYXRpb25TdHlsZTogZnVuY3Rpb24oaSkge1xuICAgICAgICB2YXIgYW5pbWF0aW9uID0gW2FuaW1hdGlvbk5hbWUsICcwLjdzJywgaSUyPyAnMHMnOiAnMC4zNXMnLCAnaW5maW5pdGUnLCAnbGluZWFyJ10uam9pbignICcpO1xuICAgICAgICB2YXIgYW5pbWF0aW9uRmlsbE1vZGUgPSAnYm90aCc7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGFuaW1hdGlvbjogYW5pbWF0aW9uLFxuICAgICAgICAgICAgYW5pbWF0aW9uRmlsbE1vZGU6IGFuaW1hdGlvbkZpbGxNb2RlXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtICB7TnVtYmVyfSBpXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIGdldFN0eWxlOiBmdW5jdGlvbihpKSB7XG4gICAgICAgIHJldHVybiBhc3NpZ24oXG4gICAgICAgICAgICB0aGlzLmdldEJhbGxTdHlsZShpKSxcbiAgICAgICAgICAgIHRoaXMuZ2V0QW5pbWF0aW9uU3R5bGUoaSksXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZGlzcGxheTogJ2lubGluZS1ibG9jaycsXG5cdFx0XHRcdGJvcmRlcjogJzBweCBzb2xpZCB0cmFuc3BhcmVudCcgLy8gZml4IGZpcmVmb3gvY2hyb21lL29wZXJhIHJlbmRlcmluZ1xuICAgICAgICAgICAgfVxuICAgICAgICApXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSAge0Jvb2xlYW59IGxvYWRpbmdcbiAgICAgKiBAcmV0dXJuIHtSZWFjdENvbXBvbmVudCB8fCBudWxsfVxuICAgICAqL1xuICAgIHJlbmRlckxvYWRlcjogZnVuY3Rpb24obG9hZGluZykge1xuICAgICAgICBpZiAobG9hZGluZykge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8ZGl2IGlkPXt0aGlzLnByb3BzLmlkfSBjbGFzc05hbWU9e3RoaXMucHJvcHMuY2xhc3NOYW1lfT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17dGhpcy5nZXRTdHlsZSgxKX0+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RoaXMuZ2V0U3R5bGUoMil9PjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt0aGlzLmdldFN0eWxlKDMpfT48L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyTG9hZGVyKHRoaXMucHJvcHMubG9hZGluZyk7XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gTG9hZGVyO1xuIl19
},{"domkit/appendVendorPrefix":1,"domkit/insertKeyframesRule":5,"react":undefined}],8:[function(require,module,exports){
'use strict';

var React = require('react');
var assign = require('domkit/appendVendorPrefix');
var insertKeyframesRule = require('domkit/insertKeyframesRule');

/**
 * @type {Object}
 */
var keyframes = {
    '0%, 100%': {
        transform: 'scale(0)'
    },
    '50%': {
        transform: 'scale(1.0)'
    }
};

/**
 * @type {String}
 */
var animationName = insertKeyframesRule(keyframes);

var Loader = React.createClass({
    displayName: 'Loader',

    /**
     * @type {Object}
     */
    propTypes: {
        loading: React.PropTypes.bool,
        color: React.PropTypes.string,
        size: React.PropTypes.string
    },

    /**
     * @return {Object}
     */
    getDefaultProps: function getDefaultProps() {
        return {
            loading: true,
            color: '#ffffff',
            size: '60px'
        };
    },

    /**
     * @return {Object}
     */
    getBallStyle: function getBallStyle() {
        return {
            backgroundColor: this.props.color,
            width: this.props.size,
            height: this.props.size,
            borderRadius: '100%',
            opacity: 0.6,
            position: 'absolute',
            top: 0,
            left: 0,
            verticalAlign: this.props.verticalAlign
        };
    },

    /**
     * @param  {Number} i
     * @return {Object}
     */
    getAnimationStyle: function getAnimationStyle(i) {
        var animation = [animationName, '2s', i == 1 ? '1s' : '0s', 'infinite', 'ease-in-out'].join(' ');
        var animationFillMode = 'both';

        return {
            animation: animation,
            animationFillMode: animationFillMode
        };
    },

    /**
     * @param  {Number} i
     * @return {Object}
     */
    getStyle: function getStyle(i) {
        if (i) {
            return assign(this.getBallStyle(i), this.getAnimationStyle(i), {
                border: '0px solid transparent' // fix firefox/chrome/opera rendering
            });
        }

        return assign({
            width: this.props.size,
            height: this.props.size,
            position: 'relative',
            border: '0px solid transparent' // fix firefox/chrome/opera rendering
        });
    },

    /**
     * @param  {Boolean} loading
     * @return {ReactComponent || null}
     */
    renderLoader: function renderLoader(loading) {
        if (loading) {
            return React.createElement(
                'div',
                { id: this.props.id, className: this.props.className },
                React.createElement(
                    'div',
                    { style: this.getStyle() },
                    React.createElement('div', { style: this.getStyle(1) }),
                    React.createElement('div', { style: this.getStyle(2) })
                )
            );
        }

        return null;
    },

    render: function render() {
        return this.renderLoader(this.props.loading);
    }
});

module.exports = Loader;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJvdW5jZUxvYWRlci5qcyJdLCJuYW1lcyI6WyJSZWFjdCIsInJlcXVpcmUiLCJhc3NpZ24iLCJpbnNlcnRLZXlmcmFtZXNSdWxlIiwia2V5ZnJhbWVzIiwidHJhbnNmb3JtIiwiYW5pbWF0aW9uTmFtZSIsIkxvYWRlciIsImNyZWF0ZUNsYXNzIiwicHJvcFR5cGVzIiwibG9hZGluZyIsIlByb3BUeXBlcyIsImJvb2wiLCJjb2xvciIsInN0cmluZyIsInNpemUiLCJnZXREZWZhdWx0UHJvcHMiLCJnZXRCYWxsU3R5bGUiLCJiYWNrZ3JvdW5kQ29sb3IiLCJwcm9wcyIsIndpZHRoIiwiaGVpZ2h0IiwiYm9yZGVyUmFkaXVzIiwib3BhY2l0eSIsInBvc2l0aW9uIiwidG9wIiwibGVmdCIsInZlcnRpY2FsQWxpZ24iLCJnZXRBbmltYXRpb25TdHlsZSIsImkiLCJhbmltYXRpb24iLCJqb2luIiwiYW5pbWF0aW9uRmlsbE1vZGUiLCJnZXRTdHlsZSIsImJvcmRlciIsInJlbmRlckxvYWRlciIsImlkIiwiY2xhc3NOYW1lIiwicmVuZGVyIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJQSxRQUFRQyxRQUFRLE9BQVIsQ0FBWjtBQUNBLElBQUlDLFNBQVNELFFBQVEsMkJBQVIsQ0FBYjtBQUNBLElBQUlFLHNCQUFzQkYsUUFBUSw0QkFBUixDQUExQjs7QUFFQTs7O0FBR0EsSUFBSUcsWUFBWTtBQUNaLGdCQUFZO0FBQ1JDLG1CQUFXO0FBREgsS0FEQTtBQUlaLFdBQU87QUFDSEEsbUJBQVc7QUFEUjtBQUpLLENBQWhCOztBQVNBOzs7QUFHQSxJQUFJQyxnQkFBZ0JILG9CQUFvQkMsU0FBcEIsQ0FBcEI7O0FBRUEsSUFBSUcsU0FBU1AsTUFBTVEsV0FBTixDQUFrQjtBQUFBOztBQUMzQjs7O0FBR0FDLGVBQVc7QUFDUEMsaUJBQVNWLE1BQU1XLFNBQU4sQ0FBZ0JDLElBRGxCO0FBRVBDLGVBQU9iLE1BQU1XLFNBQU4sQ0FBZ0JHLE1BRmhCO0FBR1BDLGNBQU1mLE1BQU1XLFNBQU4sQ0FBZ0JHO0FBSGYsS0FKZ0I7O0FBVTNCOzs7QUFHQUUscUJBQWlCLDJCQUFXO0FBQ3hCLGVBQU87QUFDSE4scUJBQVMsSUFETjtBQUVIRyxtQkFBTyxTQUZKO0FBR0hFLGtCQUFNO0FBSEgsU0FBUDtBQUtILEtBbkIwQjs7QUFxQjNCOzs7QUFHQUUsa0JBQWMsd0JBQVc7QUFDckIsZUFBTztBQUNIQyw2QkFBaUIsS0FBS0MsS0FBTCxDQUFXTixLQUR6QjtBQUVITyxtQkFBTyxLQUFLRCxLQUFMLENBQVdKLElBRmY7QUFHSE0sb0JBQVEsS0FBS0YsS0FBTCxDQUFXSixJQUhoQjtBQUlITywwQkFBYyxNQUpYO0FBS0hDLHFCQUFTLEdBTE47QUFNSEMsc0JBQVUsVUFOUDtBQU9IQyxpQkFBSyxDQVBGO0FBUUhDLGtCQUFNLENBUkg7QUFTSEMsMkJBQWUsS0FBS1IsS0FBTCxDQUFXUTtBQVR2QixTQUFQO0FBV0gsS0FwQzBCOztBQXNDM0I7Ozs7QUFJQUMsdUJBQW1CLDJCQUFTQyxDQUFULEVBQVk7QUFDM0IsWUFBSUMsWUFBWSxDQUFDeEIsYUFBRCxFQUFnQixJQUFoQixFQUFzQnVCLEtBQUcsQ0FBSCxHQUFNLElBQU4sR0FBWSxJQUFsQyxFQUF3QyxVQUF4QyxFQUFvRCxhQUFwRCxFQUFtRUUsSUFBbkUsQ0FBd0UsR0FBeEUsQ0FBaEI7QUFDQSxZQUFJQyxvQkFBb0IsTUFBeEI7O0FBRUEsZUFBTztBQUNIRix1QkFBV0EsU0FEUjtBQUVIRSwrQkFBbUJBO0FBRmhCLFNBQVA7QUFJSCxLQWxEMEI7O0FBb0QzQjs7OztBQUlBQyxjQUFVLGtCQUFTSixDQUFULEVBQVk7QUFDbEIsWUFBSUEsQ0FBSixFQUFPO0FBQ0gsbUJBQU8zQixPQUNILEtBQUtlLFlBQUwsQ0FBa0JZLENBQWxCLENBREcsRUFFSCxLQUFLRCxpQkFBTCxDQUF1QkMsQ0FBdkIsQ0FGRyxFQUdmO0FBQ0NLLHdCQUFRLHVCQURULENBQ2lDO0FBRGpDLGFBSGUsQ0FBUDtBQU9IOztBQUVELGVBQU9oQyxPQUNIO0FBQ0lrQixtQkFBTyxLQUFLRCxLQUFMLENBQVdKLElBRHRCO0FBRUlNLG9CQUFRLEtBQUtGLEtBQUwsQ0FBV0osSUFGdkI7QUFHSVMsc0JBQVUsVUFIZDtBQUlSVSxvQkFBUSx1QkFKQSxDQUl3QjtBQUp4QixTQURHLENBQVA7QUFRSCxLQTNFMEI7O0FBNkUzQjs7OztBQUlBQyxrQkFBYyxzQkFBU3pCLE9BQVQsRUFBa0I7QUFDNUIsWUFBSUEsT0FBSixFQUFhO0FBQ1QsbUJBQ0k7QUFBQTtBQUFBLGtCQUFLLElBQUksS0FBS1MsS0FBTCxDQUFXaUIsRUFBcEIsRUFBd0IsV0FBVyxLQUFLakIsS0FBTCxDQUFXa0IsU0FBOUM7QUFDSTtBQUFBO0FBQUEsc0JBQUssT0FBTyxLQUFLSixRQUFMLEVBQVo7QUFDSSxpREFBSyxPQUFPLEtBQUtBLFFBQUwsQ0FBYyxDQUFkLENBQVosR0FESjtBQUVJLGlEQUFLLE9BQU8sS0FBS0EsUUFBTCxDQUFjLENBQWQsQ0FBWjtBQUZKO0FBREosYUFESjtBQVFIOztBQUVELGVBQU8sSUFBUDtBQUNILEtBOUYwQjs7QUFnRzNCSyxZQUFRLGtCQUFXO0FBQ2YsZUFBTyxLQUFLSCxZQUFMLENBQWtCLEtBQUtoQixLQUFMLENBQVdULE9BQTdCLENBQVA7QUFDSDtBQWxHMEIsQ0FBbEIsQ0FBYjs7QUFxR0E2QixPQUFPQyxPQUFQLEdBQWlCakMsTUFBakIiLCJmaWxlIjoiQm91bmNlTG9hZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBhc3NpZ24gPSByZXF1aXJlKCdkb21raXQvYXBwZW5kVmVuZG9yUHJlZml4Jyk7XG52YXIgaW5zZXJ0S2V5ZnJhbWVzUnVsZSA9IHJlcXVpcmUoJ2RvbWtpdC9pbnNlcnRLZXlmcmFtZXNSdWxlJyk7XG5cbi8qKlxuICogQHR5cGUge09iamVjdH1cbiAqL1xudmFyIGtleWZyYW1lcyA9IHtcbiAgICAnMCUsIDEwMCUnOiB7XG4gICAgICAgIHRyYW5zZm9ybTogJ3NjYWxlKDApJ1xuICAgIH0sXG4gICAgJzUwJSc6IHtcbiAgICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoMS4wKSdcbiAgICB9XG59O1xuXG4vKipcbiAqIEB0eXBlIHtTdHJpbmd9XG4gKi9cbnZhciBhbmltYXRpb25OYW1lID0gaW5zZXJ0S2V5ZnJhbWVzUnVsZShrZXlmcmFtZXMpO1xuXG52YXIgTG9hZGVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgIC8qKlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgcHJvcFR5cGVzOiB7XG4gICAgICAgIGxvYWRpbmc6IFJlYWN0LlByb3BUeXBlcy5ib29sLFxuICAgICAgICBjb2xvcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgc2l6ZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZ1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGxvYWRpbmc6IHRydWUsXG4gICAgICAgICAgICBjb2xvcjogJyNmZmZmZmYnLFxuICAgICAgICAgICAgc2l6ZTogJzYwcHgnXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBnZXRCYWxsU3R5bGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiB0aGlzLnByb3BzLmNvbG9yLFxuICAgICAgICAgICAgd2lkdGg6IHRoaXMucHJvcHMuc2l6ZSxcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5wcm9wcy5zaXplLFxuICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnMTAwJScsXG4gICAgICAgICAgICBvcGFjaXR5OiAwLjYsXG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiB0aGlzLnByb3BzLnZlcnRpY2FsQWxpZ25cbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtICB7TnVtYmVyfSBpXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIGdldEFuaW1hdGlvblN0eWxlOiBmdW5jdGlvbihpKSB7XG4gICAgICAgIHZhciBhbmltYXRpb24gPSBbYW5pbWF0aW9uTmFtZSwgJzJzJywgaT09MT8gJzFzJzogJzBzJywgJ2luZmluaXRlJywgJ2Vhc2UtaW4tb3V0J10uam9pbignICcpO1xuICAgICAgICB2YXIgYW5pbWF0aW9uRmlsbE1vZGUgPSAnYm90aCc7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGFuaW1hdGlvbjogYW5pbWF0aW9uLFxuICAgICAgICAgICAgYW5pbWF0aW9uRmlsbE1vZGU6IGFuaW1hdGlvbkZpbGxNb2RlXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSAge051bWJlcn0gaVxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBnZXRTdHlsZTogZnVuY3Rpb24oaSkge1xuICAgICAgICBpZiAoaSkge1xuICAgICAgICAgICAgcmV0dXJuIGFzc2lnbihcbiAgICAgICAgICAgICAgICB0aGlzLmdldEJhbGxTdHlsZShpKSxcbiAgICAgICAgICAgICAgICB0aGlzLmdldEFuaW1hdGlvblN0eWxlKGkpLFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Ym9yZGVyOiAnMHB4IHNvbGlkIHRyYW5zcGFyZW50JyAvLyBmaXggZmlyZWZveC9jaHJvbWUvb3BlcmEgcmVuZGVyaW5nXG5cdFx0XHRcdH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYXNzaWduKFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLnByb3BzLnNpemUsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnByb3BzLnNpemUsXG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG5cdFx0XHRcdGJvcmRlcjogJzBweCBzb2xpZCB0cmFuc3BhcmVudCcgLy8gZml4IGZpcmVmb3gvY2hyb21lL29wZXJhIHJlbmRlcmluZ1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gIHtCb29sZWFufSBsb2FkaW5nXG4gICAgICogQHJldHVybiB7UmVhY3RDb21wb25lbnQgfHwgbnVsbH1cbiAgICAgKi9cbiAgICByZW5kZXJMb2FkZXI6IGZ1bmN0aW9uKGxvYWRpbmcpIHtcbiAgICAgICAgaWYgKGxvYWRpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPGRpdiBpZD17dGhpcy5wcm9wcy5pZH0gY2xhc3NOYW1lPXt0aGlzLnByb3BzLmNsYXNzTmFtZX0+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RoaXMuZ2V0U3R5bGUoKX0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt0aGlzLmdldFN0eWxlKDEpfT48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RoaXMuZ2V0U3R5bGUoMil9PjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyTG9hZGVyKHRoaXMucHJvcHMubG9hZGluZyk7XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gTG9hZGVyO1xuIl19
},{"domkit/appendVendorPrefix":1,"domkit/insertKeyframesRule":5,"react":undefined}],9:[function(require,module,exports){
'use strict';

var React = require('react');
var assign = require('domkit/appendVendorPrefix');
var insertKeyframesRule = require('domkit/insertKeyframesRule');

/**
 * @type {Object}
 */
var keyframes = {
    '0%': {
        transform: 'rotate(0deg) scale(1)'
    },
    '50%': {
        transform: 'rotate(180deg) scale(0.8)'
    },
    '100%': {
        transform: 'rotate(360deg) scale(1)'
    }
};

/**
 * @type {String}
 */
var animationName = insertKeyframesRule(keyframes);

var Loader = React.createClass({
    displayName: 'Loader',

    /**
     * @type {Object}
     */
    propTypes: {
        loading: React.PropTypes.bool,
        color: React.PropTypes.string,
        size: React.PropTypes.string
    },

    /**
     * @return {Object}
     */
    getDefaultProps: function getDefaultProps() {
        return {
            loading: true,
            color: '#ffffff',
            size: '35px'
        };
    },

    /**
     * @return {Object}
     */
    getBallStyle: function getBallStyle() {
        return {
            width: this.props.size,
            height: this.props.size,
            border: '2px solid',
            borderColor: this.props.color,
            borderBottomColor: 'transparent',
            borderRadius: '100%',
            background: 'transparent !important',
            verticalAlign: this.props.verticalAlign
        };
    },

    /**
     * @param  {Number} i
     * @return {Object}
     */
    getAnimationStyle: function getAnimationStyle(i) {
        var animation = [animationName, '0.75s', '0s', 'infinite', 'linear'].join(' ');
        var animationFillMode = 'both';

        return {
            animation: animation,
            animationFillMode: animationFillMode
        };
    },

    /**
     * @param  {Number} i
     * @return {Object}
     */
    getStyle: function getStyle(i) {
        return assign(this.getBallStyle(i), this.getAnimationStyle(i), {
            display: 'inline-block',
            border: '0px solid transparent' // fix firefox/chrome/opera rendering
        });
    },

    /**
     * @param  {Boolean} loading
     * @return {ReactComponent || null}
     */
    renderLoader: function renderLoader(loading) {
        if (loading) {
            return React.createElement(
                'div',
                { id: this.props.id, className: this.props.className },
                React.createElement('div', { style: this.getStyle() })
            );
        }

        return null;
    },

    render: function render() {
        return this.renderLoader(this.props.loading);
    }
});

module.exports = Loader;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNsaXBMb2FkZXIuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJyZXF1aXJlIiwiYXNzaWduIiwiaW5zZXJ0S2V5ZnJhbWVzUnVsZSIsImtleWZyYW1lcyIsInRyYW5zZm9ybSIsImFuaW1hdGlvbk5hbWUiLCJMb2FkZXIiLCJjcmVhdGVDbGFzcyIsInByb3BUeXBlcyIsImxvYWRpbmciLCJQcm9wVHlwZXMiLCJib29sIiwiY29sb3IiLCJzdHJpbmciLCJzaXplIiwiZ2V0RGVmYXVsdFByb3BzIiwiZ2V0QmFsbFN0eWxlIiwid2lkdGgiLCJwcm9wcyIsImhlaWdodCIsImJvcmRlciIsImJvcmRlckNvbG9yIiwiYm9yZGVyQm90dG9tQ29sb3IiLCJib3JkZXJSYWRpdXMiLCJiYWNrZ3JvdW5kIiwidmVydGljYWxBbGlnbiIsImdldEFuaW1hdGlvblN0eWxlIiwiaSIsImFuaW1hdGlvbiIsImpvaW4iLCJhbmltYXRpb25GaWxsTW9kZSIsImdldFN0eWxlIiwiZGlzcGxheSIsInJlbmRlckxvYWRlciIsImlkIiwiY2xhc3NOYW1lIiwicmVuZGVyIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJQSxRQUFRQyxRQUFRLE9BQVIsQ0FBWjtBQUNBLElBQUlDLFNBQVNELFFBQVEsMkJBQVIsQ0FBYjtBQUNBLElBQUlFLHNCQUFzQkYsUUFBUSw0QkFBUixDQUExQjs7QUFFQTs7O0FBR0EsSUFBSUcsWUFBWTtBQUNaLFVBQU07QUFDRkMsbUJBQVc7QUFEVCxLQURNO0FBSVosV0FBTztBQUNIQSxtQkFBVztBQURSLEtBSks7QUFPWixZQUFRO0FBQ0pBLG1CQUFXO0FBRFA7QUFQSSxDQUFoQjs7QUFZQTs7O0FBR0EsSUFBSUMsZ0JBQWdCSCxvQkFBb0JDLFNBQXBCLENBQXBCOztBQUVBLElBQUlHLFNBQVNQLE1BQU1RLFdBQU4sQ0FBa0I7QUFBQTs7QUFDM0I7OztBQUdBQyxlQUFXO0FBQ1BDLGlCQUFTVixNQUFNVyxTQUFOLENBQWdCQyxJQURsQjtBQUVQQyxlQUFPYixNQUFNVyxTQUFOLENBQWdCRyxNQUZoQjtBQUdQQyxjQUFNZixNQUFNVyxTQUFOLENBQWdCRztBQUhmLEtBSmdCOztBQVUzQjs7O0FBR0FFLHFCQUFpQiwyQkFBVztBQUN4QixlQUFPO0FBQ0hOLHFCQUFTLElBRE47QUFFSEcsbUJBQU8sU0FGSjtBQUdIRSxrQkFBTTtBQUhILFNBQVA7QUFLSCxLQW5CMEI7O0FBcUIzQjs7O0FBR0FFLGtCQUFjLHdCQUFXO0FBQ3JCLGVBQU87QUFDSEMsbUJBQU8sS0FBS0MsS0FBTCxDQUFXSixJQURmO0FBRUhLLG9CQUFRLEtBQUtELEtBQUwsQ0FBV0osSUFGaEI7QUFHSE0sb0JBQVEsV0FITDtBQUlIQyx5QkFBYSxLQUFLSCxLQUFMLENBQVdOLEtBSnJCO0FBS0hVLCtCQUFtQixhQUxoQjtBQU1IQywwQkFBYyxNQU5YO0FBT0hDLHdCQUFZLHdCQVBUO0FBUUhDLDJCQUFlLEtBQUtQLEtBQUwsQ0FBV087QUFSdkIsU0FBUDtBQVVILEtBbkMwQjs7QUFxQzNCOzs7O0FBSUFDLHVCQUFtQiwyQkFBU0MsQ0FBVCxFQUFZO0FBQzNCLFlBQUlDLFlBQVksQ0FBQ3ZCLGFBQUQsRUFBZ0IsT0FBaEIsRUFBeUIsSUFBekIsRUFBK0IsVUFBL0IsRUFBMkMsUUFBM0MsRUFBcUR3QixJQUFyRCxDQUEwRCxHQUExRCxDQUFoQjtBQUNBLFlBQUlDLG9CQUFvQixNQUF4Qjs7QUFFQSxlQUFPO0FBQ0hGLHVCQUFXQSxTQURSO0FBRUhFLCtCQUFtQkE7QUFGaEIsU0FBUDtBQUlILEtBakQwQjs7QUFtRDNCOzs7O0FBSUFDLGNBQVUsa0JBQVNKLENBQVQsRUFBWTtBQUNsQixlQUFPMUIsT0FDSCxLQUFLZSxZQUFMLENBQWtCVyxDQUFsQixDQURHLEVBRUgsS0FBS0QsaUJBQUwsQ0FBdUJDLENBQXZCLENBRkcsRUFHSDtBQUNJSyxxQkFBUyxjQURiO0FBRVJaLG9CQUFRLHVCQUZBLENBRXdCO0FBRnhCLFNBSEcsQ0FBUDtBQVFILEtBaEUwQjs7QUFrRTNCOzs7O0FBSUFhLGtCQUFjLHNCQUFTeEIsT0FBVCxFQUFrQjtBQUM1QixZQUFJQSxPQUFKLEVBQWE7QUFDVCxtQkFDSTtBQUFBO0FBQUEsa0JBQUssSUFBSSxLQUFLUyxLQUFMLENBQVdnQixFQUFwQixFQUF3QixXQUFXLEtBQUtoQixLQUFMLENBQVdpQixTQUE5QztBQUNJLDZDQUFLLE9BQU8sS0FBS0osUUFBTCxFQUFaO0FBREosYUFESjtBQUtIOztBQUVELGVBQU8sSUFBUDtBQUNILEtBaEYwQjs7QUFrRjNCSyxZQUFRLGtCQUFXO0FBQ2YsZUFBTyxLQUFLSCxZQUFMLENBQWtCLEtBQUtmLEtBQUwsQ0FBV1QsT0FBN0IsQ0FBUDtBQUNIO0FBcEYwQixDQUFsQixDQUFiOztBQXVGQTRCLE9BQU9DLE9BQVAsR0FBaUJoQyxNQUFqQiIsImZpbGUiOiJDbGlwTG9hZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBhc3NpZ24gPSByZXF1aXJlKCdkb21raXQvYXBwZW5kVmVuZG9yUHJlZml4Jyk7XG52YXIgaW5zZXJ0S2V5ZnJhbWVzUnVsZSA9IHJlcXVpcmUoJ2RvbWtpdC9pbnNlcnRLZXlmcmFtZXNSdWxlJyk7XG5cbi8qKlxuICogQHR5cGUge09iamVjdH1cbiAqL1xudmFyIGtleWZyYW1lcyA9IHtcbiAgICAnMCUnOiB7XG4gICAgICAgIHRyYW5zZm9ybTogJ3JvdGF0ZSgwZGVnKSBzY2FsZSgxKSdcbiAgICB9LFxuICAgICc1MCUnOiB7XG4gICAgICAgIHRyYW5zZm9ybTogJ3JvdGF0ZSgxODBkZWcpIHNjYWxlKDAuOCknXG4gICAgfSxcbiAgICAnMTAwJSc6IHtcbiAgICAgICAgdHJhbnNmb3JtOiAncm90YXRlKDM2MGRlZykgc2NhbGUoMSknXG4gICAgfVxufTtcblxuLyoqXG4gKiBAdHlwZSB7U3RyaW5nfVxuICovXG52YXIgYW5pbWF0aW9uTmFtZSA9IGluc2VydEtleWZyYW1lc1J1bGUoa2V5ZnJhbWVzKTtcblxudmFyIExvYWRlciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICAvKipcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHByb3BUeXBlczoge1xuICAgICAgICBsb2FkaW5nOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcbiAgICAgICAgY29sb3I6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIHNpemU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmdcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsb2FkaW5nOiB0cnVlLFxuICAgICAgICAgICAgY29sb3I6ICcjZmZmZmZmJyxcbiAgICAgICAgICAgIHNpemU6ICczNXB4J1xuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgZ2V0QmFsbFN0eWxlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLnByb3BzLnNpemUsXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMucHJvcHMuc2l6ZSxcbiAgICAgICAgICAgIGJvcmRlcjogJzJweCBzb2xpZCcsXG4gICAgICAgICAgICBib3JkZXJDb2xvcjogdGhpcy5wcm9wcy5jb2xvcixcbiAgICAgICAgICAgIGJvcmRlckJvdHRvbUNvbG9yOiAndHJhbnNwYXJlbnQnLFxuICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnMTAwJScsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAndHJhbnNwYXJlbnQgIWltcG9ydGFudCcsXG4gICAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiB0aGlzLnByb3BzLnZlcnRpY2FsQWxpZ25cbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtICB7TnVtYmVyfSBpXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIGdldEFuaW1hdGlvblN0eWxlOiBmdW5jdGlvbihpKSB7XG4gICAgICAgIHZhciBhbmltYXRpb24gPSBbYW5pbWF0aW9uTmFtZSwgJzAuNzVzJywgJzBzJywgJ2luZmluaXRlJywgJ2xpbmVhciddLmpvaW4oJyAnKTtcbiAgICAgICAgdmFyIGFuaW1hdGlvbkZpbGxNb2RlID0gJ2JvdGgnO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBhbmltYXRpb246IGFuaW1hdGlvbixcbiAgICAgICAgICAgIGFuaW1hdGlvbkZpbGxNb2RlOiBhbmltYXRpb25GaWxsTW9kZVxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gIHtOdW1iZXJ9IGlcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgZ2V0U3R5bGU6IGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgcmV0dXJuIGFzc2lnbihcbiAgICAgICAgICAgIHRoaXMuZ2V0QmFsbFN0eWxlKGkpLFxuICAgICAgICAgICAgdGhpcy5nZXRBbmltYXRpb25TdHlsZShpKSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJyxcblx0XHRcdFx0Ym9yZGVyOiAnMHB4IHNvbGlkIHRyYW5zcGFyZW50JyAvLyBmaXggZmlyZWZveC9jaHJvbWUvb3BlcmEgcmVuZGVyaW5nXG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSAge0Jvb2xlYW59IGxvYWRpbmdcbiAgICAgKiBAcmV0dXJuIHtSZWFjdENvbXBvbmVudCB8fCBudWxsfVxuICAgICAqL1xuICAgIHJlbmRlckxvYWRlcjogZnVuY3Rpb24obG9hZGluZykge1xuICAgICAgICBpZiAobG9hZGluZykge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8ZGl2IGlkPXt0aGlzLnByb3BzLmlkfSBjbGFzc05hbWU9e3RoaXMucHJvcHMuY2xhc3NOYW1lfT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17dGhpcy5nZXRTdHlsZSgpfT48L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyTG9hZGVyKHRoaXMucHJvcHMubG9hZGluZyk7XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gTG9hZGVyO1xuIl19
},{"domkit/appendVendorPrefix":1,"domkit/insertKeyframesRule":5,"react":undefined}],10:[function(require,module,exports){
'use strict';

var React = require('react');
var assign = require('domkit/appendVendorPrefix');
var insertKeyframesRule = require('domkit/insertKeyframesRule');

/**
 * @type {Object}
 */
var rotateKeyframes = {
    '100%': {
        transform: 'rotate(360deg)'
    }
};

/**
 * @type {Object}
 */
var bounceKeyframes = {
    '0%, 100%': {
        transform: 'scale(0)'
    },
    '50%': {
        transform: 'scale(1.0)'
    }
};

/**
 * @type {String}
 */
var rotateAnimationName = insertKeyframesRule(rotateKeyframes);

/**
 * @type {String}
 */
var bounceAnimationName = insertKeyframesRule(bounceKeyframes);

var Loader = React.createClass({
    displayName: 'Loader',

    /**
     * @type {Object}
     */
    propTypes: {
        loading: React.PropTypes.bool,
        color: React.PropTypes.string,
        size: React.PropTypes.string,
        margin: React.PropTypes.string
    },

    /**
     * @return {Object}
     */
    getDefaultProps: function getDefaultProps() {
        return {
            loading: true,
            color: '#ffffff',
            size: '60px'
        };
    },

    /**
     * @param  {String} size
     * @return {Object}
     */
    getBallStyle: function getBallStyle(size) {
        return {
            backgroundColor: this.props.color,
            width: size,
            height: size,
            borderRadius: '100%',
            verticalAlign: this.props.verticalAlign
        };
    },

    /**
     * @param  {Number} i
     * @return {Object}
     */
    getAnimationStyle: function getAnimationStyle(i) {
        var animation = [i == 0 ? rotateAnimationName : bounceAnimationName, '2s', i == 2 ? '-1s' : '0s', 'infinite', 'linear'].join(' ');
        var animationFillMode = 'forwards';

        return {
            animation: animation,
            animationFillMode: animationFillMode
        };
    },

    /**
     * @param  {Number} i
     * @return {Object}
     */
    getStyle: function getStyle(i) {
        var size = parseInt(this.props.size);
        var ballSize = size / 2;

        if (i) {
            return assign(this.getBallStyle(ballSize), this.getAnimationStyle(i), {
                position: 'absolute',
                top: i % 2 ? 0 : 'auto',
                bottom: i % 2 ? 'auto' : 0,
                border: '0px solid transparent' // fix firefox/chrome/opera rendering
            });
        }

        return assign(this.getAnimationStyle(i), {
            width: size,
            height: size,
            position: 'relative',
            border: '0px solid transparent' // fix firefox/chrome/opera rendering
        });
    },

    /**
     * @param  {Boolean} loading
     * @return {ReactComponent || null}
     */
    renderLoader: function renderLoader(loading) {
        if (loading) {
            return React.createElement(
                'div',
                { id: this.props.id, className: this.props.className },
                React.createElement(
                    'div',
                    { style: this.getStyle(0) },
                    React.createElement('div', { style: this.getStyle(1) }),
                    React.createElement('div', { style: this.getStyle(2) })
                )
            );
        }

        return null;
    },

    render: function render() {
        return this.renderLoader(this.props.loading);
    }
});

module.exports = Loader;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkRvdExvYWRlci5qcyJdLCJuYW1lcyI6WyJSZWFjdCIsInJlcXVpcmUiLCJhc3NpZ24iLCJpbnNlcnRLZXlmcmFtZXNSdWxlIiwicm90YXRlS2V5ZnJhbWVzIiwidHJhbnNmb3JtIiwiYm91bmNlS2V5ZnJhbWVzIiwicm90YXRlQW5pbWF0aW9uTmFtZSIsImJvdW5jZUFuaW1hdGlvbk5hbWUiLCJMb2FkZXIiLCJjcmVhdGVDbGFzcyIsInByb3BUeXBlcyIsImxvYWRpbmciLCJQcm9wVHlwZXMiLCJib29sIiwiY29sb3IiLCJzdHJpbmciLCJzaXplIiwibWFyZ2luIiwiZ2V0RGVmYXVsdFByb3BzIiwiZ2V0QmFsbFN0eWxlIiwiYmFja2dyb3VuZENvbG9yIiwicHJvcHMiLCJ3aWR0aCIsImhlaWdodCIsImJvcmRlclJhZGl1cyIsInZlcnRpY2FsQWxpZ24iLCJnZXRBbmltYXRpb25TdHlsZSIsImkiLCJhbmltYXRpb24iLCJqb2luIiwiYW5pbWF0aW9uRmlsbE1vZGUiLCJnZXRTdHlsZSIsInBhcnNlSW50IiwiYmFsbFNpemUiLCJwb3NpdGlvbiIsInRvcCIsImJvdHRvbSIsImJvcmRlciIsInJlbmRlckxvYWRlciIsImlkIiwiY2xhc3NOYW1lIiwicmVuZGVyIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJQSxRQUFRQyxRQUFRLE9BQVIsQ0FBWjtBQUNBLElBQUlDLFNBQVNELFFBQVEsMkJBQVIsQ0FBYjtBQUNBLElBQUlFLHNCQUFzQkYsUUFBUSw0QkFBUixDQUExQjs7QUFFQTs7O0FBR0EsSUFBSUcsa0JBQWtCO0FBQ2xCLFlBQVE7QUFDSkMsbUJBQVc7QUFEUDtBQURVLENBQXRCOztBQU1BOzs7QUFHQSxJQUFJQyxrQkFBa0I7QUFDbEIsZ0JBQVk7QUFDUkQsbUJBQVc7QUFESCxLQURNO0FBSWxCLFdBQU87QUFDSEEsbUJBQVc7QUFEUjtBQUpXLENBQXRCOztBQVNBOzs7QUFHQSxJQUFJRSxzQkFBc0JKLG9CQUFvQkMs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LEtBQUtqQixLQUFMLENBQVdWLE9BQTdCLENBQVA7QUFDSDtBQXZHMEIsQ0FBbEIsQ0FBYjs7QUEwR0ErQixPQUFPQyxPQUFQLEdBQWlCbkMsTUFBakIiLCJmaWxlIjoiRG90TG9hZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBhc3NpZ24gPSByZXF1aXJlKCdkb21raXQvYXBwZW5kVmVuZG9yUHJlZml4Jyk7XG52YXIgaW5zZXJ0S2V5ZnJhbWVzUnVsZSA9IHJlcXVpcmUoJ2RvbWtpdC9pbnNlcnRLZXlmcmFtZXNSdWxlJyk7XG5cbi8qKlxuICogQHR5cGUge09iamVjdH1cbiAqL1xudmFyIHJvdGF0ZUtleWZyYW1lcyA9IHtcbiAgICAnMTAwJSc6IHtcbiAgICAgICAgdHJhbnNmb3JtOiAncm90YXRlKDM2MGRlZyknXG4gICAgfVxufTtcblxuLyoqXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG52YXIgYm91bmNlS2V5ZnJhbWVzID0ge1xuICAgICcwJSwgMTAwJSc6IHtcbiAgICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoMCknXG4gICAgfSxcbiAgICAnNTAlJzoge1xuICAgICAgICB0cmFuc2Zvcm06ICdzY2FsZSgxLjApJ1xuICAgIH1cbn07XG5cbi8qKlxuICogQHR5cGUge1N0cmluZ31cbiAqL1xudmFyIHJvdGF0ZUFuaW1hdGlvbk5hbWUgPSBpbnNlcnRLZXlmcmFtZXNSdWxlKHJvdGF0ZUtleWZyYW1lcyk7XG5cbi8qKlxuICogQHR5cGUge1N0cmluZ31cbiAqL1xudmFyIGJvdW5jZUFuaW1hdGlvbk5hbWUgPSBpbnNlcnRLZXlmcmFtZXNSdWxlKGJvdW5jZUtleWZyYW1lcyk7XG5cbnZhciBMb2FkZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAgLyoqXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICBwcm9wVHlwZXM6IHtcbiAgICAgICAgbG9hZGluZzogUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG4gICAgICAgIGNvbG9yOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBzaXplOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBtYXJnaW46IFJlYWN0LlByb3BUeXBlcy5zdHJpbmdcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsb2FkaW5nOiB0cnVlLFxuICAgICAgICAgICAgY29sb3I6ICcjZmZmZmZmJyxcbiAgICAgICAgICAgIHNpemU6ICc2MHB4J1xuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IHNpemVcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgZ2V0QmFsbFN0eWxlOiBmdW5jdGlvbihzaXplKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHRoaXMucHJvcHMuY29sb3IsXG4gICAgICAgICAgICB3aWR0aDogc2l6ZSxcbiAgICAgICAgICAgIGhlaWdodDogc2l6ZSxcbiAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzEwMCUnLFxuICAgICAgICAgICAgdmVydGljYWxBbGlnbjogdGhpcy5wcm9wcy52ZXJ0aWNhbEFsaWduXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSAge051bWJlcn0gaVxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBnZXRBbmltYXRpb25TdHlsZTogZnVuY3Rpb24oaSkge1xuICAgICAgICB2YXIgYW5pbWF0aW9uID0gW2k9PTAgPyByb3RhdGVBbmltYXRpb25OYW1lIDogYm91bmNlQW5pbWF0aW9uTmFtZSwgJzJzJywgaT09Mj8gJy0xcyc6ICcwcycsICdpbmZpbml0ZScsICdsaW5lYXInXS5qb2luKCcgJyk7XG4gICAgICAgIHZhciBhbmltYXRpb25GaWxsTW9kZSA9ICdmb3J3YXJkcyc7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGFuaW1hdGlvbjogYW5pbWF0aW9uLFxuICAgICAgICAgICAgYW5pbWF0aW9uRmlsbE1vZGU6IGFuaW1hdGlvbkZpbGxNb2RlXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSAge051bWJlcn0gaVxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBnZXRTdHlsZTogZnVuY3Rpb24oaSkge1xuICAgICAgICB2YXIgc2l6ZSA9IHBhcnNlSW50KHRoaXMucHJvcHMuc2l6ZSk7XG4gICAgICAgIHZhciBiYWxsU2l6ZSA9IHNpemUvMjtcblxuICAgICAgICBpZiAoaSkge1xuICAgICAgICAgICAgcmV0dXJuIGFzc2lnbihcbiAgICAgICAgICAgICAgICB0aGlzLmdldEJhbGxTdHlsZShiYWxsU2l6ZSksXG4gICAgICAgICAgICAgICAgdGhpcy5nZXRBbmltYXRpb25TdHlsZShpKSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgICAgICB0b3A6IGklMj8gMDogJ2F1dG8nLFxuICAgICAgICAgICAgICAgICAgICBib3R0b206IGklMj8gJ2F1dG8nOiAwLFxuXHRcdFx0XHRcdGJvcmRlcjogJzBweCBzb2xpZCB0cmFuc3BhcmVudCcgLy8gZml4IGZpcmVmb3gvY2hyb21lL29wZXJhIHJlbmRlcmluZ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYXNzaWduKFxuICAgICAgICAgICAgdGhpcy5nZXRBbmltYXRpb25TdHlsZShpKSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB3aWR0aDogc2l6ZSxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IHNpemUsXG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG5cdFx0XHRcdGJvcmRlcjogJzBweCBzb2xpZCB0cmFuc3BhcmVudCcgLy8gZml4IGZpcmVmb3gvY2hyb21lL29wZXJhIHJlbmRlcmluZ1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gIHtCb29sZWFufSBsb2FkaW5nXG4gICAgICogQHJldHVybiB7UmVhY3RDb21wb25lbnQgfHwgbnVsbH1cbiAgICAgKi9cbiAgICByZW5kZXJMb2FkZXI6IGZ1bmN0aW9uKGxvYWRpbmcpIHtcbiAgICAgICAgaWYgKGxvYWRpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPGRpdiBpZD17dGhpcy5wcm9wcy5pZH0gY2xhc3NOYW1lPXt0aGlzLnByb3BzLmNsYXNzTmFtZX0+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RoaXMuZ2V0U3R5bGUoMCl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17dGhpcy5nZXRTdHlsZSgxKX0+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt0aGlzLmdldFN0eWxlKDIpfT48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlckxvYWRlcih0aGlzLnByb3BzLmxvYWRpbmcpO1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IExvYWRlcjtcbiJdfQ==
},{"domkit/appendVendorPrefix":1,"domkit/insertKeyframesRule":5,"react":undefined}],11:[function(require,module,exports){
'use strict';

var React = require('react');
var assign = require('domkit/appendVendorPrefix');
var insertKeyframesRule = require('domkit/insertKeyframesRule');

/**
 * @type {Object}
 */
var keyframes = {
    '50%': {
        opacity: 0.3
    },
    '100%': {
        opacity: 1
    }
};

/**
 * @type {String}
 */
var animationName = insertKeyframesRule(keyframes);

var Loader = React.createClass({
    displayName: 'Loader',

    /**
     * @type {Object}
     */
    propTypes: {
        loading: React.PropTypes.bool,
        color: React.PropTypes.string,
        height: React.PropTypes.string,
        width: React.PropTypes.string,
        margin: React.PropTypes.string,
        radius: React.PropTypes.string
    },

    /**
     * @return {Object}
     */
    getDefaultProps: function getDefaultProps() {
        return {
            loading: true,
            color: '#ffffff',
            height: '15px',
            width: '5px',
            margin: '2px',
            radius: '2px'
        };
    },

    /**
     * @param  {Number} i
     * @return {Object}
     */
    getLineStyle: function getLineStyle(i) {
        return {
            backgroundColor: this.props.color,
            height: this.props.height,
            width: this.props.width,
            margin: this.props.margin,
            borderRadius: this.props.radius,
            verticalAlign: this.props.verticalAlign
        };
    },

    /**
     * @param  {Number} i
     * @return {Object}
     */
    getAnimationStyle: function getAnimationStyle(i) {
        var animation = [animationName, '1.2s', i * 0.12 + 's', 'infinite', 'ease-in-out'].join(' ');
        var animationFillMode = 'both';

        return {
            animation: animation,
            animationFillMode: animationFillMode
        };
    },

    /**
     * @param  {Number} i
     * @return {Object}
     */
    getPosStyle: function getPosStyle(i) {
        var radius = '20';
        var quarter = radius / 2 + radius / 5.5;

        var lines = {
            l1: {
                top: radius,
                left: 0
            },
            l2: {
                top: quarter,
                left: quarter,
                transform: 'rotate(-45deg)'
            },
            l3: {
                top: 0,
                left: radius,
                transform: 'rotate(90deg)'
            },
            l4: {
                top: -quarter,
                left: quarter,
                transform: 'rotate(45deg)'
            },
            l5: {
                top: -radius,
                left: 0
            },
            l6: {
                top: -quarter,
                left: -quarter,
                transform: 'rotate(-45deg)'
            },
            l7: {
                top: 0,
                left: -radius,
                transform: 'rotate(90deg)'
            },
            l8: {
                top: quarter,
                left: -quarter,
                transform: 'rotate(45deg)'
            }
        };

        return lines['l' + i];
    },

    /**
     * @param  {Number} i
     * @return {Object}
     */
    getStyle: function getStyle(i) {
        return assign(this.getLineStyle(i), this.getPosStyle(i), this.getAnimationStyle(i), {
            position: 'absolute',
            border: '0px solid transparent' // fix firefox/chrome/opera rendering
        });
    },

    /**
     * @param  {Boolean} loading
     * @return {ReactComponent || null}
     */
    renderLoader: function renderLoader(loading) {
        if (loading) {
            var style = {
                position: 'relative',
                fontSize: 0
            };

            return React.createElement(
                'div',
                { id: this.props.id, className: this.props.className },
                React.createElement(
                    'div',
                    { style: style },
                    React.createElement('div', { style: this.getStyle(1) }),
                    React.createElement('div', { style: this.getStyle(2) }),
                    React.createElement('div', { style: this.getStyle(3) }),
                    React.createElement('div', { style: this.getStyle(4) }),
                    React.createElement('div', { style: this.getStyle(5) }),
                    React.createElement('div', { style: this.getStyle(6) }),
                    React.createElement('div', { style: this.getStyle(7) }),
                    React.createElement('div', { style: this.getStyle(8) })
                )
            );
        }

        return null;
    },

    render: function render() {
        return this.renderLoader(this.props.loading);
    }
});

module.exports = Loader;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkZhZGVMb2FkZXIuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJyZXF1aXJlIiwiYXNzaWduIiwiaW5zZXJ0S2V5ZnJhbWVzUnVsZSIsImtleWZyYW1lcyIsIm9wYWNpdHkiLCJhbmltYXRpb25OYW1lIiwiTG9hZGVyIiwiY3JlYXRlQ2xhc3MiLCJwcm9wVHlwZXMiLCJsb2FkaW5nIiwiUHJvcFR5cGVzIiwiYm9vbCIsImNvbG9yIiwic3RyaW5nIiwiaGVpZ2h0Iiwid2lkdGgiLCJtYXJnaW4iLCJyYWRpdXMiLCJnZXREZWZhdWx0UHJvcHMiLCJnZXRMaW5lU3R5bGUiLCJpIiwiYmFja2dyb3VuZENvbG9yIiwicHJvcHMiLCJib3JkZXJSYWRpdXMiLCJ2ZXJ0aWNhbEFsaWduIiwiZ2V0QW5pbWF0aW9uU3R5bGUiLCJhbmltYXRpb24iLCJqb2luIiwiYW5pbWF0aW9uRmlsbE1vZGUiLCJnZXRQb3NTdHlsZSIsInF1YXJ0ZXIiLCJsaW5lcyIsImwxIiwidG9wIiwibGVmdCIsImwyIiwidHJhbnNmb3JtIiwibDMiLCJsNCIsImw1IiwibDYiLCJsNyIsImw4IiwiZ2V0U3R5bGUiLCJwb3NpdGlvbiIsImJvcmRlciIsInJlbmRlckxvYWRlciIsInN0eWxlIiwiZm9udFNpemUiLCJpZCIsImNsYXNzTmFtZSIsInJlbmRlciIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEsUUFBUUMsUUFBUSxPQUFSLENBQVo7QUFDQSxJQUFJQyxTQUFTRCxRQUFRLDJCQUFSLENBQWI7QUFDQSxJQUFJRSxzQkFBc0JGLFFBQVEsNEJBQVIsQ0FBMUI7O0FBRUE7OztBQUdBLElBQUlHLFlBQVk7QUFDWixXQUFPO0FBQ0hDLGlCQUFTO0FBRE4sS0FESztBQUlaLFlBQVE7QUFDSkEsaUJBQVM7QUFETDtBQUpJLENBQWhCOztBQVNBOzs7QUFHQSxJQUFJQyxnQkFBZ0JILG9CQUFvQkMsU0FBcEIsQ0FBcEI7O0FBRUEsSUFBSUcsU0FBU1AsTUFBTVEsV0FBTixD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T0FBT0MsT0FBUCxHQUFpQi9DLE1BQWpCIiwiZmlsZSI6IkZhZGVMb2FkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIGFzc2lnbiA9IHJlcXVpcmUoJ2RvbWtpdC9hcHBlbmRWZW5kb3JQcmVmaXgnKTtcbnZhciBpbnNlcnRLZXlmcmFtZXNSdWxlID0gcmVxdWlyZSgnZG9ta2l0L2luc2VydEtleWZyYW1lc1J1bGUnKTtcblxuLyoqXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG52YXIga2V5ZnJhbWVzID0ge1xuICAgICc1MCUnOiB7XG4gICAgICAgIG9wYWNpdHk6IDAuM1xuICAgIH0sXG4gICAgJzEwMCUnOiB7XG4gICAgICAgIG9wYWNpdHk6IDFcbiAgICB9XG59O1xuXG4vKipcbiAqIEB0eXBlIHtTdHJpbmd9XG4gKi9cbnZhciBhbmltYXRpb25OYW1lID0gaW5zZXJ0S2V5ZnJhbWVzUnVsZShrZXlmcmFtZXMpO1xuXG52YXIgTG9hZGVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgIC8qKlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgcHJvcFR5cGVzOiB7XG4gICAgICAgIGxvYWRpbmc6IFJlYWN0LlByb3BUeXBlcy5ib29sLFxuICAgICAgICBjb2xvcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgaGVpZ2h0OiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICB3aWR0aDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgbWFyZ2luOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICByYWRpdXM6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmdcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsb2FkaW5nOiB0cnVlLFxuICAgICAgICAgICAgY29sb3I6ICcjZmZmZmZmJyxcbiAgICAgICAgICAgIGhlaWdodDogJzE1cHgnLFxuICAgICAgICAgICAgd2lkdGg6ICc1cHgnLFxuICAgICAgICAgICAgbWFyZ2luOiAnMnB4JyxcbiAgICAgICAgICAgIHJhZGl1czogJzJweCdcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtICB7TnVtYmVyfSBpXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIGdldExpbmVTdHlsZTogZnVuY3Rpb24oaSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiB0aGlzLnByb3BzLmNvbG9yLFxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnByb3BzLmhlaWdodCxcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLnByb3BzLndpZHRoLFxuICAgICAgICAgICAgbWFyZ2luOiB0aGlzLnByb3BzLm1hcmdpbixcbiAgICAgICAgICAgIGJvcmRlclJhZGl1czogdGhpcy5wcm9wcy5yYWRpdXMsXG4gICAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiB0aGlzLnByb3BzLnZlcnRpY2FsQWxpZ25cbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtICB7TnVtYmVyfSBpXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIGdldEFuaW1hdGlvblN0eWxlOiBmdW5jdGlvbihpKSB7XG4gICAgICAgIHZhciBhbmltYXRpb24gPSBbYW5pbWF0aW9uTmFtZSwgJzEuMnMnLCAoaSAqIDAuMTIpICsgJ3MnLCAnaW5maW5pdGUnLCAnZWFzZS1pbi1vdXQnXS5qb2luKCcgJyk7XG4gICAgICAgIHZhciBhbmltYXRpb25GaWxsTW9kZSA9ICdib3RoJztcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYW5pbWF0aW9uOiBhbmltYXRpb24sXG4gICAgICAgICAgICBhbmltYXRpb25GaWxsTW9kZTogYW5pbWF0aW9uRmlsbE1vZGVcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtICB7TnVtYmVyfSBpXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIGdldFBvc1N0eWxlOiBmdW5jdGlvbihpKSB7XG4gICAgICAgIHZhciByYWRpdXMgPSAnMjAnO1xuICAgICAgICB2YXIgcXVhcnRlciA9IChyYWRpdXMgLyAyKSArIChyYWRpdXMgLyA1LjUpO1xuXG4gICAgICAgIHZhciBsaW5lcyA9IHtcbiAgICAgICAgICAgIGwxOiB7XG4gICAgICAgICAgICAgICAgdG9wOiByYWRpdXMsXG4gICAgICAgICAgICAgICAgbGVmdDogMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGwyOiB7XG4gICAgICAgICAgICAgICAgdG9wOiBxdWFydGVyLFxuICAgICAgICAgICAgICAgIGxlZnQ6IHF1YXJ0ZXIsXG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOiAncm90YXRlKC00NWRlZyknXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbDM6IHtcbiAgICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgICAgbGVmdDogcmFkaXVzLFxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogJ3JvdGF0ZSg5MGRlZyknXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbDQ6IHtcbiAgICAgICAgICAgICAgICB0b3A6IC1xdWFydGVyLFxuICAgICAgICAgICAgICAgIGxlZnQ6IHF1YXJ0ZXIsXG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOiAncm90YXRlKDQ1ZGVnKSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBsNToge1xuICAgICAgICAgICAgICAgIHRvcDogLXJhZGl1cyxcbiAgICAgICAgICAgICAgICBsZWZ0OiAwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbDY6IHtcbiAgICAgICAgICAgICAgICB0b3A6IC1xdWFydGVyLFxuICAgICAgICAgICAgICAgIGxlZnQ6IC1xdWFydGVyLFxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogJ3JvdGF0ZSgtNDVkZWcpJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGw3OiB7XG4gICAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICAgIGxlZnQ6IC1yYWRpdXMsXG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOiAncm90YXRlKDkwZGVnKSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBsODoge1xuICAgICAgICAgICAgICAgIHRvcDogcXVhcnRlcixcbiAgICAgICAgICAgICAgICBsZWZ0OiAtcXVhcnRlcixcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm06ICdyb3RhdGUoNDVkZWcpJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBsaW5lc1snbCcraV07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSAge051bWJlcn0gaVxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBnZXRTdHlsZTogZnVuY3Rpb24oaSkge1xuICAgICAgICByZXR1cm4gYXNzaWduKFxuICAgICAgICAgICAgdGhpcy5nZXRMaW5lU3R5bGUoaSksXG4gICAgICAgICAgICB0aGlzLmdldFBvc1N0eWxlKGkpLFxuICAgICAgICAgICAgdGhpcy5nZXRBbmltYXRpb25TdHlsZShpKSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcblx0XHRcdFx0Ym9yZGVyOiAnMHB4IHNvbGlkIHRyYW5zcGFyZW50JyAvLyBmaXggZmlyZWZveC9jaHJvbWUvb3BlcmEgcmVuZGVyaW5nXG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSAge0Jvb2xlYW59IGxvYWRpbmdcbiAgICAgKiBAcmV0dXJuIHtSZWFjdENvbXBvbmVudCB8fCBudWxsfVxuICAgICAqL1xuICAgIHJlbmRlckxvYWRlcjogZnVuY3Rpb24obG9hZGluZykge1xuICAgICAgICBpZiAobG9hZGluZykge1xuICAgICAgICAgICAgdmFyIHN0eWxlID0ge1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgICAgICAgIGZvbnRTaXplOiAwXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxkaXYgaWQ9e3RoaXMucHJvcHMuaWR9IGNsYXNzTmFtZT17dGhpcy5wcm9wcy5jbGFzc05hbWV9PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtzdHlsZX0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt0aGlzLmdldFN0eWxlKDEpfT48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RoaXMuZ2V0U3R5bGUoMil9PjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17dGhpcy5nZXRTdHlsZSgzKX0+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt0aGlzLmdldFN0eWxlKDQpfT48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RoaXMuZ2V0U3R5bGUoNSl9PjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17dGhpcy5nZXRTdHlsZSg2KX0+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt0aGlzLmdldFN0eWxlKDcpfT48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RoaXMuZ2V0U3R5bGUoOCl9PjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyTG9hZGVyKHRoaXMucHJvcHMubG9hZGluZyk7XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gTG9hZGVyO1xuIl19
},{"domkit/appendVendorPrefix":1,"domkit/insertKeyframesRule":5,"react":undefined}],12:[function(require,module,exports){
'use strict';

var React = require('react');
var assign = require('domkit/appendVendorPrefix');
var insertKeyframesRule = require('domkit/insertKeyframesRule');

/**
 * @type {Object}
 */
var keyframes = {
    '0%': {
        transform: 'scale(1)'
    },
    '50%': {
        transform: 'scale(0.5)',
        opacity: 0.7
    },
    '100%': {
        transform: 'scale(1)',
        opacity: 1
    }
};

/**
 * @type {String}
 */
var animationName = insertKeyframesRule(keyframes);

/**
 * @param  {Number} top
 * @return {Number}
 */
function random(top) {
    return Math.random() * top;
}

var Loader = React.createClass({
    displayName: 'Loader',

    /**
     * @type {Object}
     */
    propTypes: {
        loading: React.PropTypes.bool,
        color: React.PropTypes.string,
        size: React.PropTypes.string,
        margin: React.PropTypes.string
    },

    /**
     * @return {Object}
     */
    getDefaultProps: function getDefaultProps() {
        return {
            loading: true,
            color: '#ffffff',
            size: '15px',
            margin: '2px'
        };
    },

    /**
     * @return {Object}
     */
    getBallStyle: function getBallStyle() {
        return {
            backgroundColor: this.props.color,
            width: this.props.size,
            height: this.props.size,
            margin: this.props.margin,
            borderRadius: '100%',
            verticalAlign: this.props.verticalAlign
        };
    },

    /**
     * @param  {Number} i
     * @return {Object}
     */
    getAnimationStyle: function getAnimationStyle(i) {
        var animationDuration = random(100) / 100 + 0.6 + 's';
        var animationDelay = random(100) / 100 - 0.2 + 's';

        var animation = [animationName, animationDuration, animationDelay, 'infinite', 'ease'].join(' ');
        var animationFillMode = 'both';

        return {
            animation: animation,
            animationFillMode: animationFillMode
        };
    },

    /**
     * @param  {Number} i
     * @return {Object}
     */
    getStyle: function getStyle(i) {
        return assign(this.getBallStyle(i), this.getAnimationStyle(i), {
            display: 'inline-block',
            border: '0px solid transparent' // fix firefox/chrome/opera rendering
        });
    },

    /**
     * @param  {Boolean} loading
     * @return {ReactComponent || null}
     */
    renderLoader: function renderLoader(loading) {
        if (loading) {
            var style = {
                width: parseFloat(this.props.size) * 3 + parseFloat(this.props.margin) * 6,
                fontSize: 0
            };

            return React.createElement(
                'div',
                { id: this.props.id, className: this.props.className },
                React.createElement(
                    'div',
                    { style: style },
                    React.createElement('div', { style: this.getStyle(1) }),
                    React.createElement('div', { style: this.getStyle(2) }),
                    React.createElement('div', { style: this.getStyle(3) }),
                    React.createElement('div', { style: this.getStyle(4) }),
                    React.createElement('div', { style: this.getStyle(5) }),
                    React.createElement('div', { style: this.getStyle(6) }),
                    React.createElement('div', { style: this.getStyle(7) }),
                    React.createElement('div', { style: this.getStyle(8) }),
                    React.createElement('div', { style: this.getStyle(9) })
                )
            );
        }

        return null;
    },

    render: function render() {
        return this.renderLoader(this.props.loading);
    }
});

module.exports = Loader;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkdyaWRMb2FkZXIuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJyZXF1aXJlIiwiYXNzaWduIiwiaW5zZXJ0S2V5ZnJhbWVzUnVsZSIsImtleWZyYW1lcyIsInRyYW5zZm9ybSIsIm9wYWNpdHkiLCJhbmltYXRpb25OYW1lIiwicmFuZG9tIiwidG9wIiwiTWF0aCIsIkxvYWRlciIsImNyZWF0ZUNsYXNzIiwicHJvcFR5cGVzIiwibG9hZGluZyIsIlByb3BUeXBlcyIsImJvb2wiLCJjb2xvciIsInN0cmluZyIsInNpemUiLCJtYXJnaW4iLCJnZXREZWZhdWx0UHJvcHMiLCJnZXRCYWxsU3R5bGUiLCJiYWNrZ3JvdW5kQ29sb3IiLCJwcm9wcyIsIndpZHRoIiwiaGVpZ2h0IiwiYm9yZGVyUmFkaXVzIiwidmVydGljYWxBbGlnbiIsImdldEFuaW1hdGlvblN0eWxlIiwiaSIsImFuaW1hdGlvbkR1cmF0aW9uIiwiYW5pbWF0aW9uRGVsYXkiLCJhbmltYXRpb24iLCJqb2luIiwiYW5pbWF0aW9uRmlsbE1vZGUiLCJnZXRTdHlsZSIsImRpc3BsYXkiLCJib3JkZXIiLCJyZW5kZXJMb2FkZXIiLCJzdHlsZSIsInBhcnNlRmxvYXQiLCJmb250U2l6ZSIsImlkIiwiY2xhc3NOYW1lIiwicmVuZGVyIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJQSxRQUFRQyxRQUFRLE9BQVIsQ0FBWjtBQUNBLElBQUlDLFNBQVNELFFBQVEsMkJBQVIsQ0FBYjtBQUNBLElBQUlFLHNCQUFzQkYsUUFBUSw0QkFBUixDQUExQjs7QUFFQTs7O0FBR0EsSUFBSUcsWUFBWTtBQUNaLFVBQU07QUFDRkMsbUJBQVc7QUFEVCxLQURNO0FBSVosV0FBTztBQUNIQSxtQkFBVyxZQURSO0FBRUhDLGlCQUFTO0FBRk4sS0FKSztBQVFaLFlBQVE7QUFDSkQsbUJBQVcsVUFEUDtBQUVKQyxpQkFBUztBQUZMO0FBUkksQ0FBaEI7O0FBY0E7OztBQUdBLElBQUlDLGdCQUFnQkos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S0FBS0EsUUFBTCxDQUFjLENBQWQsQ0FBWixHQUxKO0FBTUksaURBQUssT0FBTyxLQUFLQSxRQUFMLENBQWMsQ0FBZCxDQUFaLEdBTko7QUFPSSxpREFBSyxPQUFPLEtBQUtBLFFBQUwsQ0FBYyxDQUFkLENBQVosR0FQSjtBQVFJLGlEQUFLLE9BQU8sS0FBS0EsUUFBTCxDQUFjLENBQWQsQ0FBWixHQVJKO0FBU0ksaURBQUssT0FBTyxLQUFLQSxRQUFMLENBQWMsQ0FBZCxDQUFaO0FBVEo7QUFESixhQURKO0FBZUg7O0FBRUQsZUFBTyxJQUFQO0FBQ0gsS0FsRzBCOztBQW9HM0JTLFlBQVEsa0JBQVc7QUFDZixlQUFPLEtBQUtOLFlBQUwsQ0FBa0IsS0FBS2YsS0FBTCxDQUFXVixPQUE3QixDQUFQO0FBQ0g7QUF0RzBCLENBQWxCLENBQWI7O0FBeUdBZ0MsT0FBT0MsT0FBUCxHQUFpQnBDLE1BQWpCIiwiZmlsZSI6IkdyaWRMb2FkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIGFzc2lnbiA9IHJlcXVpcmUoJ2RvbWtpdC9hcHBlbmRWZW5kb3JQcmVmaXgnKTtcbnZhciBpbnNlcnRLZXlmcmFtZXNSdWxlID0gcmVxdWlyZSgnZG9ta2l0L2luc2VydEtleWZyYW1lc1J1bGUnKTtcblxuLyoqXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG52YXIga2V5ZnJhbWVzID0ge1xuICAgICcwJSc6IHtcbiAgICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoMSknXG4gICAgfSxcbiAgICAnNTAlJzoge1xuICAgICAgICB0cmFuc2Zvcm06ICdzY2FsZSgwLjUpJyxcbiAgICAgICAgb3BhY2l0eTogMC43XG4gICAgfSxcbiAgICAnMTAwJSc6IHtcbiAgICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoMSknLFxuICAgICAgICBvcGFjaXR5OiAxXG4gICAgfVxufTtcblxuLyoqXG4gKiBAdHlwZSB7U3RyaW5nfVxuICovXG52YXIgYW5pbWF0aW9uTmFtZSA9IGluc2VydEtleWZyYW1lc1J1bGUoa2V5ZnJhbWVzKTtcblxuLyoqXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IHRvcFxuICogQHJldHVybiB7TnVtYmVyfVxuICovXG5mdW5jdGlvbiByYW5kb20odG9wKSB7XG4gICAgcmV0dXJuIE1hdGgucmFuZG9tKCkgKiB0b3Bcbn1cblxudmFyIExvYWRlciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICAvKipcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHByb3BUeXBlczoge1xuICAgICAgICBsb2FkaW5nOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcbiAgICAgICAgY29sb3I6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIHNpemU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIG1hcmdpbjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZ1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGxvYWRpbmc6IHRydWUsXG4gICAgICAgICAgICBjb2xvcjogJyNmZmZmZmYnLFxuICAgICAgICAgICAgc2l6ZTogJzE1cHgnLFxuICAgICAgICAgICAgbWFyZ2luOiAnMnB4J1xuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgZ2V0QmFsbFN0eWxlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogdGhpcy5wcm9wcy5jb2xvcixcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLnByb3BzLnNpemUsXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMucHJvcHMuc2l6ZSxcbiAgICAgICAgICAgIG1hcmdpbjogdGhpcy5wcm9wcy5tYXJnaW4sXG4gICAgICAgICAgICBib3JkZXJSYWRpdXM6ICcxMDAlJyxcbiAgICAgICAgICAgIHZlcnRpY2FsQWxpZ246IHRoaXMucHJvcHMudmVydGljYWxBbGlnblxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gIHtOdW1iZXJ9IGlcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgZ2V0QW5pbWF0aW9uU3R5bGU6IGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgdmFyIGFuaW1hdGlvbkR1cmF0aW9uID0gKChyYW5kb20oMTAwKSAvIDEwMCkgKyAwLjYpICsgJ3MnO1xuICAgICAgICB2YXIgYW5pbWF0aW9uRGVsYXkgPSAoKHJhbmRvbSgxMDApIC8gMTAwKSAtIDAuMikgKyAncyc7XG5cbiAgICAgICAgdmFyIGFuaW1hdGlvbiA9IFthbmltYXRpb25OYW1lLCBhbmltYXRpb25EdXJhdGlvbiwgYW5pbWF0aW9uRGVsYXksICdpbmZpbml0ZScsICdlYXNlJ10uam9pbignICcpO1xuICAgICAgICB2YXIgYW5pbWF0aW9uRmlsbE1vZGUgPSAnYm90aCc7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGFuaW1hdGlvbjogYW5pbWF0aW9uLFxuICAgICAgICAgICAgYW5pbWF0aW9uRmlsbE1vZGU6IGFuaW1hdGlvbkZpbGxNb2RlXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSAge051bWJlcn0gaVxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBnZXRTdHlsZTogZnVuY3Rpb24oaSkge1xuICAgICAgICByZXR1cm4gYXNzaWduKFxuICAgICAgICAgICAgdGhpcy5nZXRCYWxsU3R5bGUoaSksXG4gICAgICAgICAgICB0aGlzLmdldEFuaW1hdGlvblN0eWxlKGkpLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLFxuXHRcdFx0XHRib3JkZXI6ICcwcHggc29saWQgdHJhbnNwYXJlbnQnIC8vIGZpeCBmaXJlZm94L2Nocm9tZS9vcGVyYSByZW5kZXJpbmdcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtICB7Qm9vbGVhbn0gbG9hZGluZ1xuICAgICAqIEByZXR1cm4ge1JlYWN0Q29tcG9uZW50IHx8IG51bGx9XG4gICAgICovXG4gICAgcmVuZGVyTG9hZGVyOiBmdW5jdGlvbihsb2FkaW5nKSB7XG4gICAgICAgIGlmIChsb2FkaW5nKSB7XG4gICAgICAgICAgICB2YXIgc3R5bGUgPSB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IChwYXJzZUZsb2F0KHRoaXMucHJvcHMuc2l6ZSkgKiAzKSArIHBhcnNlRmxvYXQodGhpcy5wcm9wcy5tYXJnaW4pICogNixcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogMFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8ZGl2IGlkPXt0aGlzLnByb3BzLmlkfSBjbGFzc05hbWU9e3RoaXMucHJvcHMuY2xhc3NOYW1lfT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17c3R5bGV9PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17dGhpcy5nZXRTdHlsZSgxKX0+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt0aGlzLmdldFN0eWxlKDIpfT48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RoaXMuZ2V0U3R5bGUoMyl9PjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17dGhpcy5nZXRTdHlsZSg0KX0+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt0aGlzLmdldFN0eWxlKDUpfT48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RoaXMuZ2V0U3R5bGUoNil9PjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17dGhpcy5nZXRTdHlsZSg3KX0+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt0aGlzLmdldFN0eWxlKDgpfT48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RoaXMuZ2V0U3R5bGUoOSl9PjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyTG9hZGVyKHRoaXMucHJvcHMubG9hZGluZyk7XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gTG9hZGVyO1xuIl19
},{"domkit/appendVendorPrefix":1,"domkit/insertKeyframesRule":5,"react":undefined}],13:[function(require,module,exports){
'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var React = require('react');
var assign = require('domkit/appendVendorPrefix');
var insertKeyframesRule = require('domkit/insertKeyframesRule');

/**
 * @type {Object}
 */
var keyframes = {
    '100%': {
        transform: 'rotate(360deg)'
    }
};

/**
 * @type {String}
 */
var animationName = insertKeyframesRule(keyframes);

var Loader = React.createClass({
    displayName: 'Loader',

    /**
     * @type {Object}
     */
    propTypes: {
        loading: React.PropTypes.bool,
        color: React.PropTypes.string,
        size: React.PropTypes.string,
        margin: React.PropTypes.string
    },

    /**
     * @return {Object}
     */
    getDefaultProps: function getDefaultProps() {
        return {
            loading: true,
            color: '#ffffff',
            size: '60px'
        };
    },

    /**
     * @param  {String} size
     * @return {Object}
     */
    getBallStyle: function getBallStyle(size) {
        return {
            width: size,
            height: size,
            borderRadius: '100%',
            verticalAlign: this.props.verticalAlign
        };
    },

    /**
     * @param  {Number} i
     * @return {Object}
     */
    getAnimationStyle: function getAnimationStyle(i) {
        var animation = [animationName, '0.6s', '0s', 'infinite', 'linear'].join(' ');
        var animationFillMode = 'forwards';

        return {
            animation: animation,
            animationFillMode: animationFillMode
        };
    },

    /**
     * @param  {Number} i
     * @return {Object}
     */
    getStyle: function getStyle(i) {
        var size = parseInt(this.props.size);
        var moonSize = size / 7;

        if (i == 1) {
            return assign(this.getBallStyle(moonSize), this.getAnimationStyle(i), {
                backgroundColor: this.props.color,
                opacity: '0.8',
                position: 'absolute',
                top: size / 2 - moonSize / 2,
                border: '0px solid transparent' // fix firefox/chrome/opera rendering
            });
        } else if (i == 2) {
            return assign(this.getBallStyle(size), _defineProperty({
                border: moonSize + 'px solid ' + this.props.color,
                opacity: 0.1
            }, 'border', '0px solid transparent'));
        } else {
            return assign(this.getAnimationStyle(i), {
                position: 'relative',
                border: '0px solid transparent' // fix firefox/chrome/opera rendering
            });
        }
    },

    /**
     * @param  {Boolean} loading
     * @return {ReactComponent || null}
     */
    renderLoader: function renderLoader(loading) {
        if (loading) {
            return React.createElement(
                'div',
                { id: this.props.id, className: this.props.className },
                React.createElement(
                    'div',
                    { style: this.getStyle(0) },
                    React.createElement('div', { style: this.getStyle(1) }),
                    React.createElement('div', { style: this.getStyle(2) })
                )
            );
        }

        return null;
    },

    render: function render() {
        return this.renderLoader(this.props.loading);
    }
});

module.exports = Loader;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1vb25Mb2FkZXIuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJyZXF1aXJlIiwiYXNzaWduIiwiaW5zZXJ0S2V5ZnJhbWVzUnVsZSIsImtleWZyYW1lcyIsInRyYW5zZm9ybSIsImFuaW1hdGlvbk5hbWUiLCJMb2FkZXIiLCJjcmVhdGVDbGFzcyIsInByb3BUeXBlcyIsImxvYWRpbmciLCJQcm9wVHlwZXMiLCJib29sIiwiY29sb3IiLCJzdHJpbmciLCJzaXplIiwibWFyZ2luIiwiZ2V0RGVmYXVsdFByb3BzIiwiZ2V0QmFsbFN0eWxlIiwid2lkdGgiLCJoZWlnaHQiLCJib3JkZXJSYWRpdXMiLCJ2ZXJ0aWNhbEFsaWduIiwicHJvcHMiLCJnZXRBbmltYXRpb25TdHlsZSIsImkiLCJhbmltYXRpb24iLCJqb2luIiwiYW5pbWF0aW9uRmlsbE1vZGUiLCJnZXRTdHlsZSIsInBhcnNlSW50IiwibW9vblNpemUiLCJiYWNrZ3JvdW5kQ29sb3IiLCJvcGFjaXR5IiwicG9zaXRpb24iLCJ0b3AiLCJib3JkZXIiLCJyZW5kZXJMb2FkZXIiLCJpZCIsImNsYXNzTmFtZSIsInJlbmRlciIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxJQUFJQSxRQUFRQyxRQUFRLE9BQVIsQ0FBWjtBQUNBLElBQUlDLFNBQVNELFFBQVEsMkJBQVIsQ0FBYjtBQUNBLElBQUlFLHNCQUFzQkYsUUFBUSw0QkFBUixDQUExQjs7QUFFQTs7O0FBR0EsSUFBSUcsWUFBWTtBQUNaLFlBQVE7QUFDSkMsbUJBQVc7QUFEUDtBQURJLENBQWhCOztBQU1BOzs7QUFHQSxJQUFJQyxnQkFBZ0JILG9CQUFvQkMsU0FBcEIsQ0FBcEI7O0FBRUEsSUFBSUcsU0FBU1AsTUFBTVEsV0FBTixDQUFrQjtBQUFBOztBQUMzQjs7O0FBR0FDLGVBQVc7QUFDUEMsaUJBQVNWLE1BQU1XLFNBQU4sQ0FBZ0JDLElBRGxCO0FBRVBDLGVBQU9iLE1BQU1XLFNBQU4sQ0FBZ0JHLE1BRmhCO0FBR1BDLGNBQU1mLE1BQU1XLFNBQU4sQ0FBZ0JHLE1BSGY7QUFJUEUsZ0JBQVFoQixNQUFNVyxTQUFOLENBQWdCRztBQUpqQixLQUpnQjs7QUFXM0I7OztBQUdBRyxxQkFBaUIsMkJBQVc7QUFDeEIsZUFBTztBQUNIUCxxQkFBUyxJQUROO0FBRUhHLG1CQUFPLFNBRko7QUFHSEUsa0JBQU07QUFISCxTQUFQO0FBS0gsS0FwQjBCOztBQXNCM0I7Ozs7QUFJQUcsa0JBQWMsc0JBQVNILElBQVQsRUFBZTtBQUN6QixlQUFPO0FBQ0hJLG1CQUFPSixJQURKO0FBRUhLLG9CQUFRTCxJQUZMO0FBR0hNLDBCQUFjLE1BSFg7QUFJSEMsMkJBQWUsS0FBS0MsS0FBTCxDQUFXRDtBQUp2QixTQUFQO0FBTUgsS0FqQzBCOztBQW1DM0I7Ozs7QUFJQUUsdUJBQW1CLDJCQUFTQyxDQUFULEVBQVk7QUFDM0IsWUFBSUMsWUFBWSxDQUFDcEIsYUFBRCxFQUFnQixNQUFoQixFQUF3QixJQUF4QixFQUE4QixVQUE5QixFQUEwQyxRQUExQyxFQUFvRHFCLElBQXBELENBQXlELEdBQXpELENBQWhCO0FBQ0EsWUFBSUMsb0JBQW9CLFVBQXhCOztBQUVBLGVBQU87QUFDSEYsdUJBQVdBLFNBRFI7QUFFSEUsK0JBQW1CQTtBQUZoQixTQUFQO0FBSUgsS0EvQzBCOztBQWlEM0I7Ozs7QUFJQUMsY0FBVSxrQkFBU0osQ0FBVCxFQUFZO0FBQ2xCLFlBQUlWLE9BQU9lLFNBQVMsS0FBS1AsS0FBTCxDQUFXUixJQUFwQixDQUFYO0FBQ0EsWUFBSWdCLFdBQVdoQixPQUFLLENBQXBCOztBQUVBLFlBQUlVLEtBQUssQ0FBVCxFQUFZO0FBQ1IsbUJBQU92QixPQUNILEtBQUtnQixZQUFMLENBQWtCYSxRQUFsQixDQURHLEVBRUgsS0FBS1AsaUJBQUwsQ0FBdUJDLENBQXZCLENBRkcsRUFHSDtBQUNJTyxpQ0FBaUIsS0FBS1QsS0FBTCxDQUFXVixLQURoQztBQUVJb0IseUJBQVMsS0FGYjtBQUdJQywwQkFBVSxVQUhkO0FBSUlDLHFCQUFLcEIsT0FBSyxDQUFMLEdBQVNnQixXQUFTLENBSjNCO0FBS1hLLHdCQUFRLHVCQUxHLENBS3FCO0FBTHJCLGFBSEcsQ0FBUDtBQVdILFNBWkQsTUFZTyxJQUFJWCxLQUFLLENBQVQsRUFBWTtBQUNmLG1CQUFPdkIsT0FDSCxLQUFLZ0IsWUFBTCxDQUFrQkgsSUFBbEIsQ0FERztBQUdDcUIsd0JBQVFMLFdBQVUsV0FBVixHQUF3QixLQUFLUixLQUFMLENBQVdWLEtBSDVDO0FBSUNvQix5QkFBUztBQUpWLHlCQUtOLHVCQUxNLEVBQVA7QUFRSCxTQVRNLE1BU0E7QUFDSCxtQkFBTy9CLE9BQ0gsS0FBS3NCLGlCQUFMLENBQXVCQyxDQUF2QixDQURHLEVBRUg7QUFDSVMsMEJBQVUsVUFEZDtBQUVYRSx3QkFBUSx1QkFGRyxDQUVxQjtBQUZyQixhQUZHLENBQVA7QUFPSDtBQUNKLEtBdkYwQjs7QUF5RjNCOzs7O0FBSUFDLGtCQUFjLHNCQUFTM0IsT0FBVCxFQUFrQjtBQUM1QixZQUFJQSxPQUFKLEVBQWE7QUFDVCxtQkFDSTtBQUFBO0FBQUEsa0JBQUssSUFBSSxLQUFLYSxLQUFMLENBQVdlLEVBQXBCLEVBQXdCLFdBQVcsS0FBS2YsS0FBTCxDQUFXZ0IsU0FBOUM7QUFDSTtBQUFBO0FBQUEsc0JBQUssT0FBTyxLQUFLVixRQUFMLENBQWMsQ0FBZCxDQUFaO0FBQ0ksaURBQUssT0FBTyxLQUFLQSxRQUFMLENBQWMsQ0FBZCxDQUFaLEdBREo7QUFFSSxpREFBSyxPQUFPLEtBQUtBLFFBQUwsQ0FBYyxDQUFkLENBQVo7QUFGSjtBQURKLGFBREo7QUFRSDs7QUFFRCxlQUFPLElBQVA7QUFDSCxLQTFHMEI7O0FBNEczQlcsWUFBUSxrQkFBVztBQUNmLGVBQU8sS0FBS0gsWUFBTCxDQUFrQixLQUFLZCxLQUFMLENBQVdiLE9BQTdCLENBQVA7QUFDSDtBQTlHMEIsQ0FBbEIsQ0FBYjs7QUFpSEErQixPQUFPQyxPQUFQLEdBQWlCbkMsTUFBakIiLCJmaWxlIjoiTW9vbkxvYWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgYXNzaWduID0gcmVxdWlyZSgnZG9ta2l0L2FwcGVuZFZlbmRvclByZWZpeCcpO1xudmFyIGluc2VydEtleWZyYW1lc1J1bGUgPSByZXF1aXJlKCdkb21raXQvaW5zZXJ0S2V5ZnJhbWVzUnVsZScpO1xuXG4vKipcbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cbnZhciBrZXlmcmFtZXMgPSB7XG4gICAgJzEwMCUnOiB7XG4gICAgICAgIHRyYW5zZm9ybTogJ3JvdGF0ZSgzNjBkZWcpJ1xuICAgIH1cbn07XG5cbi8qKlxuICogQHR5cGUge1N0cmluZ31cbiAqL1xudmFyIGFuaW1hdGlvbk5hbWUgPSBpbnNlcnRLZXlmcmFtZXNSdWxlKGtleWZyYW1lcyk7XG5cbnZhciBMb2FkZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAgLyoqXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICBwcm9wVHlwZXM6IHtcbiAgICAgICAgbG9hZGluZzogUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG4gICAgICAgIGNvbG9yOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBzaXplOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBtYXJnaW46IFJlYWN0LlByb3BUeXBlcy5zdHJpbmdcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsb2FkaW5nOiB0cnVlLFxuICAgICAgICAgICAgY29sb3I6ICcjZmZmZmZmJyxcbiAgICAgICAgICAgIHNpemU6ICc2MHB4J1xuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IHNpemVcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgZ2V0QmFsbFN0eWxlOiBmdW5jdGlvbihzaXplKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB3aWR0aDogc2l6ZSxcbiAgICAgICAgICAgIGhlaWdodDogc2l6ZSxcbiAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzEwMCUnLFxuICAgICAgICAgICAgdmVydGljYWxBbGlnbjogdGhpcy5wcm9wcy52ZXJ0aWNhbEFsaWduXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSAge051bWJlcn0gaVxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBnZXRBbmltYXRpb25TdHlsZTogZnVuY3Rpb24oaSkge1xuICAgICAgICB2YXIgYW5pbWF0aW9uID0gW2FuaW1hdGlvbk5hbWUsICcwLjZzJywgJzBzJywgJ2luZmluaXRlJywgJ2xpbmVhciddLmpvaW4oJyAnKTtcbiAgICAgICAgdmFyIGFuaW1hdGlvbkZpbGxNb2RlID0gJ2ZvcndhcmRzJztcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYW5pbWF0aW9uOiBhbmltYXRpb24sXG4gICAgICAgICAgICBhbmltYXRpb25GaWxsTW9kZTogYW5pbWF0aW9uRmlsbE1vZGVcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtICB7TnVtYmVyfSBpXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIGdldFN0eWxlOiBmdW5jdGlvbihpKSB7XG4gICAgICAgIHZhciBzaXplID0gcGFyc2VJbnQodGhpcy5wcm9wcy5zaXplKTtcbiAgICAgICAgdmFyIG1vb25TaXplID0gc2l6ZS83O1xuXG4gICAgICAgIGlmIChpID09IDEpIHtcbiAgICAgICAgICAgIHJldHVybiBhc3NpZ24oXG4gICAgICAgICAgICAgICAgdGhpcy5nZXRCYWxsU3R5bGUobW9vblNpemUpLFxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0QW5pbWF0aW9uU3R5bGUoaSksXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHRoaXMucHJvcHMuY29sb3IsXG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6ICcwLjgnLFxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICAgICAgdG9wOiBzaXplLzIgLSBtb29uU2l6ZS8yLFxuXHRcdFx0XHRcdGJvcmRlcjogJzBweCBzb2xpZCB0cmFuc3BhcmVudCcgLy8gZml4IGZpcmVmb3gvY2hyb21lL29wZXJhIHJlbmRlcmluZ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSBpZiAoaSA9PSAyKSB7XG4gICAgICAgICAgICByZXR1cm4gYXNzaWduKFxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0QmFsbFN0eWxlKHNpemUpLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiBtb29uU2l6ZSArJ3B4IHNvbGlkICcgKyB0aGlzLnByb3BzLmNvbG9yLFxuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAwLjEsXG5cdFx0XHRcdFx0Ym9yZGVyOiAnMHB4IHNvbGlkIHRyYW5zcGFyZW50JyAvLyBmaXggZmlyZWZveC9jaHJvbWUvb3BlcmEgcmVuZGVyaW5nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBhc3NpZ24oXG4gICAgICAgICAgICAgICAgdGhpcy5nZXRBbmltYXRpb25TdHlsZShpKSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuXHRcdFx0XHRcdGJvcmRlcjogJzBweCBzb2xpZCB0cmFuc3BhcmVudCcgLy8gZml4IGZpcmVmb3gvY2hyb21lL29wZXJhIHJlbmRlcmluZ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtICB7Qm9vbGVhbn0gbG9hZGluZ1xuICAgICAqIEByZXR1cm4ge1JlYWN0Q29tcG9uZW50IHx8IG51bGx9XG4gICAgICovXG4gICAgcmVuZGVyTG9hZGVyOiBmdW5jdGlvbihsb2FkaW5nKSB7XG4gICAgICAgIGlmIChsb2FkaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxkaXYgaWQ9e3RoaXMucHJvcHMuaWR9IGNsYXNzTmFtZT17dGhpcy5wcm9wcy5jbGFzc05hbWV9PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt0aGlzLmdldFN0eWxlKDApfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RoaXMuZ2V0U3R5bGUoMSl9PjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17dGhpcy5nZXRTdHlsZSgyKX0+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJMb2FkZXIodGhpcy5wcm9wcy5sb2FkaW5nKTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBMb2FkZXI7XG4iXX0=
},{"domkit/appendVendorPrefix":1,"domkit/insertKeyframesRule":5,"react":undefined}],14:[function(require,module,exports){
'use strict';

var React = require('react');
var assign = require('domkit/appendVendorPrefix');
var insertKeyframesRule = require('domkit/insertKeyframesRule');

/**
 * @type {Object}
 */
var animations = {};

var Loader = React.createClass({
    displayName: 'Loader',

    /**
     * @type {Object}
     */
    propTypes: {
        loading: React.PropTypes.bool,
        color: React.PropTypes.string,
        size: React.PropTypes.number,
        margin: React.PropTypes.number
    },

    /**
     * @return {Object}
     */
    getDefaultProps: function getDefaultProps() {
        return {
            loading: true,
            color: '#ffffff',
            size: 25,
            margin: 2
        };
    },

    /**
     * @return {Object}
     */
    getBallStyle: function getBallStyle() {
        return {
            backgroundColor: this.props.color,
            width: this.props.size,
            height: this.props.size,
            margin: this.props.margin,
            borderRadius: '100%',
            verticalAlign: this.props.verticalAlign
        };
    },

    /**
     * @param  {Number} i
     * @return {Object}
     */
    getAnimationStyle: function getAnimationStyle(i) {
        var size = this.props.size;
        var animationName = animations[size];

        if (!animationName) {
            var keyframes = {
                '75%': {
                    opacity: 0.7
                },
                '100%': {
                    transform: 'translate(' + -4 * size + 'px,' + -size / 4 + 'px)'
                }
            };
            animationName = animations[size] = insertKeyframesRule(keyframes);
        }

        var animation = [animationName, '1s', i * 0.25 + 's', 'infinite', 'linear'].join(' ');
        var animationFillMode = 'both';

        return {
            animation: animation,
            animationFillMode: animationFillMode
        };
    },

    /**
     * @param  {Number} i
     * @return {Object}
     */
    getStyle: function getStyle(i) {
        if (i == 1) {
            var s1 = this.props.size + 'px solid transparent';
            var s2 = this.props.size + 'px solid ' + this.props.color;

            return {
                width: 0,
                height: 0,
                borderRight: s1,
                borderTop: s2,
                borderLeft: s2,
                borderBottom: s2,
                borderRadius: this.props.size,
                border: '0px solid transparent' // fix firefox/chrome/opera rendering
            };
        }

        return assign(this.getBallStyle(i), this.getAnimationStyle(i), {
            width: 10,
            height: 10,
            transform: 'translate(0, ' + -this.props.size / 4 + 'px)',
            position: 'absolute',
            top: 25,
            left: 100,
            border: '0px solid transparent' // fix firefox/chrome/opera rendering
        });
    },

    /**
     * @param  {Boolean} loading
     * @return {ReactComponent || null}
     */
    renderLoader: function renderLoader(loading) {
        if (loading) {
            var style = {
                position: 'relative',
                fontSize: 0
            };

            return React.createElement(
                'div',
                { id: this.props.id, className: this.props.className },
                React.createElement(
                    'div',
                    { style: style },
                    React.createElement('div', { style: this.getStyle(1) }),
                    React.createElement('div', { style: this.getStyle(2) }),
                    React.createElement('div', { style: this.getStyle(3) }),
                    React.createElement('div', { style: this.getStyle(4) }),
                    React.createElement('div', { style: this.getStyle(5) })
                )
            );
        }

        return null;
    },

    render: function render() {
        return this.renderLoader(this.props.loading);
    }
});

module.exports = Loader;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBhY21hbkxvYWRlci5qcyJdLCJuYW1lcyI6WyJSZWFjdCIsInJlcXVpcmUiLCJhc3NpZ24iLCJpbnNlcnRLZXlmcmFtZXNSdWxlIiwiYW5pbWF0aW9ucyIsIkxvYWRlciIsImNyZWF0ZUNsYXNzIiwicHJvcFR5cGVzIiwibG9hZGluZyIsIlByb3BUeXBlcyIsImJvb2wiLCJjb2xvciIsInN0cmluZyIsInNpemUiLCJudW1iZXIiLCJtYXJnaW4iLCJnZXREZWZhdWx0UHJvcHMiLCJnZXRCYWxsU3R5bGUiLCJiYWNrZ3JvdW5kQ29sb3IiLCJwcm9wcyIsIndpZHRoIiwiaGVpZ2h0IiwiYm9yZGVyUmFkaXVzIiwidmVydGljYWxBbGlnbiIsImdldEFuaW1hdGlvblN0eWxlIiwiaSIsImFuaW1hdGlvbk5hbWUiLCJrZXlmcmFtZXMiLCJvcGFjaXR5IiwidHJhbnNmb3JtIiwiYW5pbWF0aW9uIiwiam9pbiIsImFuaW1hdGlvbkZpbGxNb2RlIiwiZ2V0U3R5bGUiLCJzMSIsInMyIiwiYm9yZGVyUmlnaHQiLCJib3JkZXJUb3AiLCJib3JkZXJMZWZ0IiwiYm9yZGVyQm90dG9tIiwiYm9yZGVyIiwicG9zaXRpb24iLCJ0b3AiLCJsZWZ0IiwicmVuZGVyTG9hZGVyIiwic3R5bGUiLCJmb250U2l6ZSIsImlkIiwiY2xhc3NOYW1lIiwicmVuZGVyIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJQSxRQUFRQyxRQUFRLE9BQVIsQ0FBWjtBQUNBLElBQUlDLFNBQVNELFFBQVEsMkJBQVIsQ0FBYjtBQUNBLElBQUlFLHNCQUFzQkYsUUFBUSw0QkFBUixDQUExQjs7QUFFQTs7O0FBR0EsSUFBSUcsYUFBYSxFQUFqQjs7QUFFQSxJQUFJQyxTQUFTTCxNQUFNTSxXQUFOLENBQWtCO0FBQUE7O0FBQzNCOzs7QUFHQUMsZUFBVztBQUNQQyxpQkFBU1IsTUFBTVMsU0FBTixDQUFnQkMsSUFEbEI7QUFFUEMsZUFBT1gsTUFBTVMsU0FBTixDQUFnQkcs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QkFBSXFDLFFBQVE7QUFDUkosMEJBQVUsVUFERjtBQUVSSywwQkFBVTtBQUZGLGFBQVo7O0FBS0EsbUJBQ0k7QUFBQTtBQUFBLGtCQUFLLElBQUksS0FBSzNCLEtBQUwsQ0FBVzRCLEVBQXBCLEVBQXdCLFdBQVcsS0FBSzVCLEtBQUwsQ0FBVzZCLFNBQTlDO0FBQ0k7QUFBQTtBQUFBLHNCQUFLLE9BQU9ILEtBQVo7QUFDSSxpREFBSyxPQUFPLEtBQUtaLFFBQUwsQ0FBYyxDQUFkLENBQVosR0FESjtBQUVJLGlEQUFLLE9BQU8sS0FBS0EsUUFBTCxDQUFjLENBQWQsQ0FBWixHQUZKO0FBR0ksaURBQUssT0FBTyxLQUFLQSxRQUFMLENBQWMsQ0FBZCxDQUFaLEdBSEo7QUFJSSxpREFBSyxPQUFPLEtBQUtBLFFBQUwsQ0FBYyxDQUFkLENBQVosR0FKSjtBQUtJLGlEQUFLLE9BQU8sS0FBS0EsUUFBTCxDQUFjLENBQWQsQ0FBWjtBQUxKO0FBREosYUFESjtBQVdIOztBQUVELGVBQU8sSUFBUDtBQUNILEtBL0gwQjs7QUFpSTNCZ0IsWUFBUSxrQkFBVztBQUNmLGVBQU8sS0FBS0wsWUFBTCxDQUFrQixLQUFLekIsS0FBTCxDQUFXWCxPQUE3QixDQUFQO0FBQ0g7QUFuSTBCLENBQWxCLENBQWI7O0FBc0lBMEMsT0FBT0MsT0FBUCxHQUFpQjlDLE1BQWpCIiwiZmlsZSI6IlBhY21hbkxvYWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgYXNzaWduID0gcmVxdWlyZSgnZG9ta2l0L2FwcGVuZFZlbmRvclByZWZpeCcpO1xudmFyIGluc2VydEtleWZyYW1lc1J1bGUgPSByZXF1aXJlKCdkb21raXQvaW5zZXJ0S2V5ZnJhbWVzUnVsZScpO1xuXG4vKipcbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cbnZhciBhbmltYXRpb25zID0ge307XG5cbnZhciBMb2FkZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAgLyoqXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICBwcm9wVHlwZXM6IHtcbiAgICAgICAgbG9hZGluZzogUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG4gICAgICAgIGNvbG9yOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBzaXplOiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuICAgICAgICBtYXJnaW46IFJlYWN0LlByb3BUeXBlcy5udW1iZXJcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsb2FkaW5nOiB0cnVlLFxuICAgICAgICAgICAgY29sb3I6ICcjZmZmZmZmJyxcbiAgICAgICAgICAgIHNpemU6IDI1LFxuICAgICAgICAgICAgbWFyZ2luOiAyXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBnZXRCYWxsU3R5bGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiB0aGlzLnByb3BzLmNvbG9yLFxuICAgICAgICAgICAgd2lkdGg6IHRoaXMucHJvcHMuc2l6ZSxcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5wcm9wcy5zaXplLFxuICAgICAgICAgICAgbWFyZ2luOiB0aGlzLnByb3BzLm1hcmdpbixcbiAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzEwMCUnLFxuICAgICAgICAgICAgdmVydGljYWxBbGlnbjogdGhpcy5wcm9wcy52ZXJ0aWNhbEFsaWduXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSAge051bWJlcn0gaVxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBnZXRBbmltYXRpb25TdHlsZTogZnVuY3Rpb24oaSkge1xuICAgICAgICB2YXIgc2l6ZSA9IHRoaXMucHJvcHMuc2l6ZTtcbiAgICAgICAgdmFyIGFuaW1hdGlvbk5hbWUgPSBhbmltYXRpb25zW3NpemVdO1xuXG4gICAgICAgIGlmICghIGFuaW1hdGlvbk5hbWUpIHtcbiAgICAgICAgICAgIHZhciBrZXlmcmFtZXMgPSB7XG4gICAgICAgICAgICAgICAgJzc1JSc6IHtcbiAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMC43XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnMTAwJSc6IHtcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlKCcgKyAoLTQgKiBzaXplKSArICdweCwnICsgKC1zaXplIC8gNCkgKyAncHgpJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBhbmltYXRpb25OYW1lID0gYW5pbWF0aW9uc1tzaXplXSA9IGluc2VydEtleWZyYW1lc1J1bGUoa2V5ZnJhbWVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBhbmltYXRpb24gPSBbYW5pbWF0aW9uTmFtZSwgJzFzJywgaSowLjI1ICsgJ3MnLCAnaW5maW5pdGUnLCAnbGluZWFyJ10uam9pbignICcpO1xuICAgICAgICB2YXIgYW5pbWF0aW9uRmlsbE1vZGUgPSAnYm90aCc7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGFuaW1hdGlvbjogYW5pbWF0aW9uLFxuICAgICAgICAgICAgYW5pbWF0aW9uRmlsbE1vZGU6IGFuaW1hdGlvbkZpbGxNb2RlXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSAge051bWJlcn0gaVxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBnZXRTdHlsZTogZnVuY3Rpb24oaSkge1xuICAgICAgICBpZiAoaSA9PSAxKSB7XG4gICAgICAgICAgICB2YXIgczEgPSAgdGhpcy5wcm9wcy5zaXplICsgJ3B4IHNvbGlkIHRyYW5zcGFyZW50JztcbiAgICAgICAgICAgIHZhciBzMiA9ICB0aGlzLnByb3BzLnNpemUgKyAncHggc29saWQgJyArIHRoaXMucHJvcHMuY29sb3I7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDAsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAwLFxuICAgICAgICAgICAgICAgIGJvcmRlclJpZ2h0OiBzMSxcbiAgICAgICAgICAgICAgICBib3JkZXJUb3A6IHMyLFxuICAgICAgICAgICAgICAgIGJvcmRlckxlZnQ6IHMyLFxuICAgICAgICAgICAgICAgIGJvcmRlckJvdHRvbTogczIsXG4gICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiB0aGlzLnByb3BzLnNpemUsXG5cdFx0XHRcdGJvcmRlcjogJzBweCBzb2xpZCB0cmFuc3BhcmVudCcgLy8gZml4IGZpcmVmb3gvY2hyb21lL29wZXJhIHJlbmRlcmluZ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhc3NpZ24oXG4gICAgICAgICAgICB0aGlzLmdldEJhbGxTdHlsZShpKSxcbiAgICAgICAgICAgIHRoaXMuZ2V0QW5pbWF0aW9uU3R5bGUoaSksXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDEwLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMTAsXG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlKDAsICcrIC10aGlzLnByb3BzLnNpemUgLyA0ICsgJ3B4KScsXG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgdG9wOiAyNSxcbiAgICAgICAgICAgICAgICBsZWZ0OiAxMDAsXG5cdFx0XHRcdGJvcmRlcjogJzBweCBzb2xpZCB0cmFuc3BhcmVudCcgLy8gZml4IGZpcmVmb3gvY2hyb21lL29wZXJhIHJlbmRlcmluZ1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gIHtCb29sZWFufSBsb2FkaW5nXG4gICAgICogQHJldHVybiB7UmVhY3RDb21wb25lbnQgfHwgbnVsbH1cbiAgICAgKi9cbiAgICByZW5kZXJMb2FkZXI6IGZ1bmN0aW9uKGxvYWRpbmcpIHtcbiAgICAgICAgaWYgKGxvYWRpbmcpIHtcbiAgICAgICAgICAgIHZhciBzdHlsZSA9IHtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogMFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8ZGl2IGlkPXt0aGlzLnByb3BzLmlkfSBjbGFzc05hbWU9e3RoaXMucHJvcHMuY2xhc3NOYW1lfT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17c3R5bGV9PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17dGhpcy5nZXRTdHlsZSgxKX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17dGhpcy5nZXRTdHlsZSgyKX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17dGhpcy5nZXRTdHlsZSgzKX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17dGhpcy5nZXRTdHlsZSg0KX0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17dGhpcy5nZXRTdHlsZSg1KX0vPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyTG9hZGVyKHRoaXMucHJvcHMubG9hZGluZyk7XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gTG9hZGVyO1xuIl19
},{"domkit/appendVendorPrefix":1,"domkit/insertKeyframesRule":5,"react":undefined}],15:[function(require,module,exports){
'use strict';

var React = require('react');
var assign = require('domkit/appendVendorPrefix');
var insertKeyframesRule = require('domkit/insertKeyframesRule');

/**
 * @type {Object}
 */
var keyframes = {
    '0%': {
        transform: 'scale(1)',
        opacity: 1
    },
    '45%': {
        transform: 'scale(0.1)',
        opacity: 0.7
    },
    '80%': {
        transform: 'scale(1)',
        opacity: 1
    }
};

/**
 * @type {String}
 */
var animationName = insertKeyframesRule(keyframes);

var Loader = React.createClass({
    displayName: 'Loader',

    /**
     * @type {Object}
     */
    propTypes: {
        loading: React.PropTypes.bool,
        color: React.PropTypes.string,
        size: React.PropTypes.string,
        margin: React.PropTypes.string
    },

    /**
     * @return {Object}
     */
    getDefaultProps: function getDefaultProps() {
        return {
            loading: true,
            color: '#ffffff',
            size: '15px',
            margin: '2px'
        };
    },

    /**
     * @return {Object}
     */
    getBallStyle: function getBallStyle() {
        return {
            backgroundColor: this.props.color,
            width: this.props.size,
            height: this.props.size,
            margin: this.props.margin,
            borderRadius: '100%',
            verticalAlign: this.props.verticalAlign
        };
    },

    /**
     * @param  {Number} i
     * @return {Object}
     */
    getAnimationStyle: function getAnimationStyle(i) {
        var animation = [animationName, '0.75s', i * 0.12 + 's', 'infinite', 'cubic-bezier(.2,.68,.18,1.08)'].join(' ');
        var animationFillMode = 'both';

        return {
            animation: animation,
            animationFillMode: animationFillMode
        };
    },

    /**
     * @param  {Number} i
     * @return {Object}
     */
    getStyle: function getStyle(i) {
        return assign(this.getBallStyle(i), this.getAnimationStyle(i), {
            display: 'inline-block',
            border: '0px solid transparent' // fix firefox/chrome/opera rendering
        });
    },

    /**
     * @param  {Boolean} loading
     * @return {ReactComponent || null}
     */
    renderLoader: function renderLoader(loading) {
        if (loading) {
            return React.createElement(
                'div',
                { id: this.props.id, className: this.props.className },
                React.createElement('div', { style: this.getStyle(1) }),
                React.createElement('div', { style: this.getStyle(2) }),
                React.createElement('div', { style: this.getStyle(3) })
            );
        }

        return null;
    },

    render: function render() {
        return this.renderLoader(this.props.loading);
    }
});

module.exports = Loader;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlB1bHNlTG9hZGVyLmpzIl0sIm5hbWVzIjpbIlJlYWN0IiwicmVxdWlyZSIsImFzc2lnbiIsImluc2VydEtleWZyYW1lc1J1bGUiLCJrZXlmcmFtZXMiLCJ0cmFuc2Zvcm0iLCJvcGFjaXR5IiwiYW5pbWF0aW9uTmFtZSIsIkxvYWRlciIsImNyZWF0ZUNsYXNzIiwicHJvcFR5cGVzIiwibG9hZGluZyIsIlByb3BUeXBlcyIsImJvb2wiLCJjb2xvciIsInN0cmluZyIsInNpemUiLCJtYXJnaW4iLCJnZXREZWZhdWx0UHJvcHMiLCJnZXRCYWxsU3R5bGUiLCJiYWNrZ3JvdW5kQ29sb3IiLCJwcm9wcyIsIndpZHRoIiwiaGVpZ2h0IiwiYm9yZGVyUmFkaXVzIiwidmVydGljYWxBbGlnbiIsImdldEFuaW1hdGlvblN0eWxlIiwiaSIsImFuaW1hdGlvbiIsImpvaW4iLCJhbmltYXRpb25GaWxsTW9kZSIsImdldFN0eWxlIiwiZGlzcGxheSIsImJvcmRlciIsInJlbmRlckxvYWRlciIsImlkIiwiY2xhc3NOYW1lIiwicmVuZGVyIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJQSxRQUFRQyxRQUFRLE9BQVIsQ0FBWjtBQUNBLElBQUlDLFNBQVNELFFBQVEsMkJBQVIsQ0FBYjtBQUNBLElBQUlFLHNCQUFzQkYsUUFBUSw0QkFBUixDQUExQjs7QUFFQTs7O0FBR0EsSUFBSUcsWUFBWTtBQUNaLFVBQU07QUFDRkMsbUJBQVcsVUFEVDtBQUVGQyxpQkFBUztBQUZQLEtBRE07QUFLWixXQUFPO0FBQ0hELG1CQUFXLFlBRFI7QUFFSEMsaUJBQVM7QUFGTixLQUxLO0FBU1osV0FBTztBQUNIRCxtQkFBVyxVQURSO0FBRUhDLGlCQUFTO0FBRk47QUFUSyxDQUFoQjs7QUFlQTs7O0FBR0EsSUFBSUMsZ0JBQWdCSixvQkFBb0JDLFNBQXBCLENBQXBCOztBQUVBLElBQUlJLFNBQVNSLE1BQU1TLFdBQU4sQ0FBa0I7QUFBQTs7QUFDM0I7OztBQUdBQyxlQUFXO0FBQ1BDLGlCQUFTWCxNQUFNWSxTQUFOLENBQWdCQyxJQURsQjtBQUVQQyxlQUFPZCxNQUFNWSxTQUFOLENBQWdCRyxNQUZoQjtBQUdQQyxjQUFNaEIsTUFBTVksU0FBTixDQUFnQkcsTUFIZjtBQUlQRSxnQkFBUWpCLE1BQU1ZLFNBQU4sQ0FBZ0JHO0FBSmpCLEtBSmdCOztBQVczQjs7O0FBR0FHLHFCQUFpQiwyQkFBVztBQUN4QixlQUFPO0FBQ0hQLHFCQUFTLElBRE47QUFFSEcsbUJBQU8sU0FGSjtBQUdIRSxrQkFBTSxNQUhIO0FBSUhDLG9CQUFRO0FBSkwsU0FBUDtBQU1ILEtBckIwQjs7QUF1QjNCOzs7QUFHQUUsa0JBQWMsd0JBQVc7QUFDckIsZUFBTztBQUNIQyw2QkFBaUIsS0FBS0MsS0FBTCxDQUFXUCxLQUR6QjtBQUVIUSxtQkFBTyxLQUFLRCxLQUFMLENBQVdMLElBRmY7QUFHSE8sb0JBQVEsS0FBS0YsS0FBTCxDQUFXTCxJQUhoQjtBQUlIQyxvQkFBUSxLQUFLSSxLQUFMLENBQVdKLE1BSmhCO0FBS0hPLDBCQUFjLE1BTFg7QUFNSEMsMkJBQWUsS0FBS0osS0FBTCxDQUFXSTtBQU52QixTQUFQO0FBUUgsS0FuQzBCOztBQXFDM0I7Ozs7QUFJQUMsdUJBQW1CLDJCQUFTQyxDQUFULEVBQVk7QUFDM0IsWUFBSUMsWUFBWSxDQUFDckIsYUFBRCxFQUFnQixPQUFoQixFQUEwQm9CLElBQUksSUFBTCxHQUFhLEdBQXRDLEVBQTJDLFVBQTNDLEVBQXVELCtCQUF2RCxFQUF3RkUsSUFBeEYsQ0FBNkYsR0FBN0YsQ0FBaEI7QUFDQSxZQUFJQyxvQkFBb0IsTUFBeEI7O0FBRUEsZUFBTztBQUNIRix1QkFBV0EsU0FEUjtBQUVIRSwrQkFBbUJBO0FBRmhCLFNBQVA7QUFJSCxLQWpEMEI7O0FBbUQzQjs7OztBQUlBQyxjQUFVLGtCQUFTSixDQUFULEVBQVk7QUFDbEIsZUFBT3pCLE9BQ0gsS0FBS2lCLFlBQUwsQ0FBa0JRLENBQWxCLENBREcsRUFFSCxLQUFLRCxpQkFBTCxDQUF1QkMsQ0FBdkIsQ0FGRyxFQUdIO0FBQ0lLLHFCQUFTLGNBRGI7QUFFUkMsb0JBQVEsdUJBRkEsQ0FFd0I7QUFGeEIsU0FIRyxDQUFQO0FBUUgsS0FoRTBCOztBQWtFM0I7Ozs7QUFJQUMsa0JBQWMsc0JBQVN2QixPQUFULEVBQWtCO0FBQzVCLFlBQUlBLE9BQUosRUFBYTtBQUNULG1CQUNJO0FBQUE7QUFBQSxrQkFBSyxJQUFJLEtBQUtVLEtBQUwsQ0FBV2MsRUFBcEIsRUFBd0IsV0FBVyxLQUFLZCxLQUFMLENBQVdlLFNBQTlDO0FBQ0ksNkNBQUssT0FBTyxLQUFLTCxRQUFMLENBQWMsQ0FBZCxDQUFaLEdBREo7QUFFSSw2Q0FBSyxPQUFPLEtBQUtBLFFBQUwsQ0FBYyxDQUFkLENBQVosR0FGSjtBQUdJLDZDQUFLLE9BQU8sS0FBS0EsUUFBTCxDQUFjLENBQWQsQ0FBWjtBQUhKLGFBREo7QUFPSDs7QUFFRCxlQUFPLElBQVA7QUFDSCxLQWxGMEI7O0FBb0YzQk0sWUFBUSxrQkFBVztBQUNmLGVBQU8sS0FBS0gsWUFBTCxDQUFrQixLQUFLYixLQUFMLENBQVdWLE9BQTdCLENBQVA7QUFDSDtBQXRGMEIsQ0FBbEIsQ0FBYjs7QUF5RkEyQixPQUFPQyxPQUFQLEdBQWlCL0IsTUFBakIiLCJmaWxlIjoiUHVsc2VMb2FkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIGFzc2lnbiA9IHJlcXVpcmUoJ2RvbWtpdC9hcHBlbmRWZW5kb3JQcmVmaXgnKTtcbnZhciBpbnNlcnRLZXlmcmFtZXNSdWxlID0gcmVxdWlyZSgnZG9ta2l0L2luc2VydEtleWZyYW1lc1J1bGUnKTtcblxuLyoqXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG52YXIga2V5ZnJhbWVzID0ge1xuICAgICcwJSc6IHtcbiAgICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoMSknLFxuICAgICAgICBvcGFjaXR5OiAxXG4gICAgfSxcbiAgICAnNDUlJzoge1xuICAgICAgICB0cmFuc2Zvcm06ICdzY2FsZSgwLjEpJyxcbiAgICAgICAgb3BhY2l0eTogMC43XG4gICAgfSxcbiAgICAnODAlJzoge1xuICAgICAgICB0cmFuc2Zvcm06ICdzY2FsZSgxKScsXG4gICAgICAgIG9wYWNpdHk6IDFcbiAgICB9XG59O1xuXG4vKipcbiAqIEB0eXBlIHtTdHJpbmd9XG4gKi9cbnZhciBhbmltYXRpb25OYW1lID0gaW5zZXJ0S2V5ZnJhbWVzUnVsZShrZXlmcmFtZXMpO1xuXG52YXIgTG9hZGVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgIC8qKlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgcHJvcFR5cGVzOiB7XG4gICAgICAgIGxvYWRpbmc6IFJlYWN0LlByb3BUeXBlcy5ib29sLFxuICAgICAgICBjb2xvcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgc2l6ZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgbWFyZ2luOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbG9hZGluZzogdHJ1ZSxcbiAgICAgICAgICAgIGNvbG9yOiAnI2ZmZmZmZicsXG4gICAgICAgICAgICBzaXplOiAnMTVweCcsXG4gICAgICAgICAgICBtYXJnaW46ICcycHgnXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBnZXRCYWxsU3R5bGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiB0aGlzLnByb3BzLmNvbG9yLFxuICAgICAgICAgICAgd2lkdGg6IHRoaXMucHJvcHMuc2l6ZSxcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5wcm9wcy5zaXplLFxuICAgICAgICAgICAgbWFyZ2luOiB0aGlzLnByb3BzLm1hcmdpbixcbiAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzEwMCUnLFxuICAgICAgICAgICAgdmVydGljYWxBbGlnbjogdGhpcy5wcm9wcy52ZXJ0aWNhbEFsaWduXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSAge051bWJlcn0gaVxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBnZXRBbmltYXRpb25TdHlsZTogZnVuY3Rpb24oaSkge1xuICAgICAgICB2YXIgYW5pbWF0aW9uID0gW2FuaW1hdGlvbk5hbWUsICcwLjc1cycsIChpICogMC4xMikgKyAncycsICdpbmZpbml0ZScsICdjdWJpYy1iZXppZXIoLjIsLjY4LC4xOCwxLjA4KSddLmpvaW4oJyAnKTtcbiAgICAgICAgdmFyIGFuaW1hdGlvbkZpbGxNb2RlID0gJ2JvdGgnO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBhbmltYXRpb246IGFuaW1hdGlvbixcbiAgICAgICAgICAgIGFuaW1hdGlvbkZpbGxNb2RlOiBhbmltYXRpb25GaWxsTW9kZVxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gIHtOdW1iZXJ9IGlcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgZ2V0U3R5bGU6IGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgcmV0dXJuIGFzc2lnbihcbiAgICAgICAgICAgIHRoaXMuZ2V0QmFsbFN0eWxlKGkpLFxuICAgICAgICAgICAgdGhpcy5nZXRBbmltYXRpb25TdHlsZShpKSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJyxcblx0XHRcdFx0Ym9yZGVyOiAnMHB4IHNvbGlkIHRyYW5zcGFyZW50JyAvLyBmaXggZmlyZWZveC9jaHJvbWUvb3BlcmEgcmVuZGVyaW5nXG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSAge0Jvb2xlYW59IGxvYWRpbmdcbiAgICAgKiBAcmV0dXJuIHtSZWFjdENvbXBvbmVudCB8fCBudWxsfVxuICAgICAqL1xuICAgIHJlbmRlckxvYWRlcjogZnVuY3Rpb24obG9hZGluZykge1xuICAgICAgICBpZiAobG9hZGluZykge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8ZGl2IGlkPXt0aGlzLnByb3BzLmlkfSBjbGFzc05hbWU9e3RoaXMucHJvcHMuY2xhc3NOYW1lfT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17dGhpcy5nZXRTdHlsZSgxKX0+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RoaXMuZ2V0U3R5bGUoMil9PjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt0aGlzLmdldFN0eWxlKDMpfT48L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyTG9hZGVyKHRoaXMucHJvcHMubG9hZGluZyk7XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gTG9hZGVyO1xuIl19
},{"domkit/appendVendorPrefix":1,"domkit/insertKeyframesRule":5,"react":undefined}],16:[function(require,module,exports){
'use strict';

var React = require('react');
var assign = require('domkit/appendVendorPrefix');
var insertKeyframesRule = require('domkit/insertKeyframesRule');

/**
 * @type {Object}
 */
var rightRotateKeyframes = {
    '0%': {
        transform: 'rotateX(0deg) rotateY(0deg) rotateZ(0deg)'

    },
    '100%': {
        transform: 'rotateX(180deg) rotateY(360deg) rotateZ(360deg)'
    }
};

/**
 * @type {Object}
 */
var leftRotateKeyframes = {
    '0%': {
        transform: 'rotateX(0deg) rotateY(0deg) rotateZ(0deg)'
    },
    '100%': {
        transform: 'rotateX(360deg) rotateY(180deg) rotateZ(360deg)'
    }
};

/**
 * @type {String}
 */
var rightRotateAnimationName = insertKeyframesRule(rightRotateKeyframes);

/**
 * @type {String}
 */
var leftRotateAnimationName = insertKeyframesRule(leftRotateKeyframes);

var Loader = React.createClass({
    displayName: 'Loader',

    /**
     * @type {Object}
     */
    propTypes: {
        loading: React.PropTypes.bool,
        color: React.PropTypes.string,
        size: React.PropTypes.string,
        margin: React.PropTypes.string
    },

    /**
     * @return {Object}
     */
    getDefaultProps: function getDefaultProps() {
        return {
            loading: true,
            color: '#ffffff',
            size: '60px'
        };
    },

    /**
     * @param {String} size
     * @return {Object}
     */
    getCircleStyle: function getCircleStyle(size) {
        return {
            width: size,
            height: size,
            border: size / 10 + 'px solid ' + this.props.color,
            opacity: 0.4,
            borderRadius: '100%',
            verticalAlign: this.props.verticalAlign
        };
    },

    /**
     * @param  {Number} i
     * @return {Object}
     */
    getAnimationStyle: function getAnimationStyle(i) {
        var animation = [i == 1 ? rightRotateAnimationName : leftRotateAnimationName, '2s', '0s', 'infinite', 'linear'].join(' ');
        var animationFillMode = 'forwards';
        var perspective = '800px';

        return {
            perspective: perspective,
            animation: animation,
            animationFillMode: animationFillMode
        };
    },

    /**
     * @param  {Number} i
     * @return {Object}
     */
    getStyle: function getStyle(i) {
        var size = parseInt(this.props.size);

        if (i) {
            return assign(this.getCircleStyle(size), this.getAnimationStyle(i), {
                position: 'absolute',
                top: 0,
                left: 0,
                border: '0px solid transparent' // fix firefox/chrome/opera rendering
            });
        }

        return {
            width: size,
            height: size,
            position: 'relative',
            border: '0px solid transparent' // fix firefox/chrome/opera rendering
        };
    },

    /**
     * @param  {Boolean} loading
     * @return {ReactComponent || null}
     */
    renderLoader: function renderLoader(loading) {
        if (loading) {
            return React.createElement(
                'div',
                { id: this.props.id, className: this.props.className },
                React.createElement(
                    'div',
                    { style: this.getStyle(0) },
                    React.createElement('div', { style: this.getStyle(1) }),
                    React.createElement('div', { style: this.getStyle(2) })
                )
            );
        }

        return null;
    },

    render: function render() {
        return this.renderLoader(this.props.loading);
    }
});

module.exports = Loader;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlJpbmdMb2FkZXIuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJyZXF1aXJlIiwiYXNzaWduIiwiaW5zZXJ0S2V5ZnJhbWVzUnVsZSIsInJpZ2h0Um90YXRlS2V5ZnJhbWVzIiwidHJhbnNmb3JtIiwibGVmdFJvdGF0ZUtleWZyYW1lcyIsInJpZ2h0Um90YXRlQW5pbWF0aW9uTmFtZSIsImxlZnRSb3RhdGVBbmltYXRpb25OYW1lIiwiTG9hZGVyIiwiY3JlYXRlQ2xhc3MiLCJwcm9wVHlwZXMiLCJsb2FkaW5nIiwiUHJvcFR5cGVzIiwiYm9vbCIsImNvbG9yIiwic3RyaW5nIiwic2l6ZSIsIm1hcmdpbiIsImdldERlZmF1bHRQcm9wcyIsImdldENpcmNsZVN0eWxlIiwid2lkdGgiLCJoZWlnaHQiLCJib3JkZXIiLCJwcm9wcyIsIm9wYWNpdHkiLCJib3JkZXJSYWRpdXMiLCJ2ZXJ0aWNhbEFsaWduIiwiZ2V0QW5pbWF0aW9uU3R5bGUiLCJpIiwiYW5pbWF0aW9uIiwiam9pbiIsImFuaW1hdGlvbkZpbGxNb2RlIiwicGVyc3BlY3RpdmUiLCJnZXRTdHlsZSIsInBhcnNlSW50IiwicG9zaXRpb24iLCJ0b3AiLCJsZWZ0IiwicmVuZGVyTG9hZGVyIiwiaWQiLCJjbGFzc05hbWUiLCJyZW5kZXIiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUlBLFFBQVFDLFFBQVEsT0FBUixDQUFaO0FBQ0EsSUFBSUMsU0FBU0QsUUFBUSwyQkFBUixDQUFiO0FBQ0EsSUFBSUUsc0JBQXNCRixRQUFRLDRCQUFSLENBQTFCOztBQUVBOzs7QUFHQSxJQUFJRyx1QkFBdUI7QUFDdkIsVUFBTTtBQUNGQyxtQkFBVzs7QUFEVCxLQURpQjtBQUt2QixZQUFRO0FBQ0pBLG1CQUFXO0FBRFA7QUFMZSxDQUEzQjs7QUFVQTs7O0FBR0EsSUFBSUMsc0JBQXNCO0FBQ3RCLFVBQU07QUFDRkQsbUJBQVc7QUFEVCxLQURnQjtBQUl0QixZQUFRO0FBQ0pBLG1CQUFXO0FB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QixDQUFQO0FBQ0g7QUF0RzBCLENBQWxCLENBQWI7O0FBeUdBK0IsT0FBT0MsT0FBUCxHQUFpQm5DLE1BQWpCIiwiZmlsZSI6IlJpbmdMb2FkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIGFzc2lnbiA9IHJlcXVpcmUoJ2RvbWtpdC9hcHBlbmRWZW5kb3JQcmVmaXgnKTtcbnZhciBpbnNlcnRLZXlmcmFtZXNSdWxlID0gcmVxdWlyZSgnZG9ta2l0L2luc2VydEtleWZyYW1lc1J1bGUnKTtcblxuLyoqXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG52YXIgcmlnaHRSb3RhdGVLZXlmcmFtZXMgPSB7XG4gICAgJzAlJzoge1xuICAgICAgICB0cmFuc2Zvcm06ICdyb3RhdGVYKDBkZWcpIHJvdGF0ZVkoMGRlZykgcm90YXRlWigwZGVnKSdcblxuICAgIH0sXG4gICAgJzEwMCUnOiB7XG4gICAgICAgIHRyYW5zZm9ybTogJ3JvdGF0ZVgoMTgwZGVnKSByb3RhdGVZKDM2MGRlZykgcm90YXRlWigzNjBkZWcpJ1xuICAgIH1cbn07XG5cbi8qKlxuICogQHR5cGUge09iamVjdH1cbiAqL1xudmFyIGxlZnRSb3RhdGVLZXlmcmFtZXMgPSB7XG4gICAgJzAlJzoge1xuICAgICAgICB0cmFuc2Zvcm06ICdyb3RhdGVYKDBkZWcpIHJvdGF0ZVkoMGRlZykgcm90YXRlWigwZGVnKSdcbiAgICB9LFxuICAgICcxMDAlJzoge1xuICAgICAgICB0cmFuc2Zvcm06ICdyb3RhdGVYKDM2MGRlZykgcm90YXRlWSgxODBkZWcpIHJvdGF0ZVooMzYwZGVnKSdcbiAgICB9XG59O1xuXG4vKipcbiAqIEB0eXBlIHtTdHJpbmd9XG4gKi9cbnZhciByaWdodFJvdGF0ZUFuaW1hdGlvbk5hbWUgPSBpbnNlcnRLZXlmcmFtZXNSdWxlKHJpZ2h0Um90YXRlS2V5ZnJhbWVzKTtcblxuLyoqXG4gKiBAdHlwZSB7U3RyaW5nfVxuICovXG52YXIgbGVmdFJvdGF0ZUFuaW1hdGlvbk5hbWUgPSBpbnNlcnRLZXlmcmFtZXNSdWxlKGxlZnRSb3RhdGVLZXlmcmFtZXMpO1xuXG52YXIgTG9hZGVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgIC8qKlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgcHJvcFR5cGVzOiB7XG4gICAgICAgIGxvYWRpbmc6IFJlYWN0LlByb3BUeXBlcy5ib29sLFxuICAgICAgICBjb2xvcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgc2l6ZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgbWFyZ2luOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbG9hZGluZzogdHJ1ZSxcbiAgICAgICAgICAgIGNvbG9yOiAnI2ZmZmZmZicsXG4gICAgICAgICAgICBzaXplOiAnNjBweCdcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHNpemVcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgZ2V0Q2lyY2xlU3R5bGU6IGZ1bmN0aW9uKHNpemUpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHdpZHRoOiBzaXplLFxuICAgICAgICAgICAgaGVpZ2h0OiBzaXplLFxuICAgICAgICAgICAgYm9yZGVyOiBzaXplLzEwICsncHggc29saWQgJyArIHRoaXMucHJvcHMuY29sb3IsXG4gICAgICAgICAgICBvcGFjaXR5OiAwLjQsXG4gICAgICAgICAgICBib3JkZXJSYWRpdXM6ICcxMDAlJyxcbiAgICAgICAgICAgIHZlcnRpY2FsQWxpZ246IHRoaXMucHJvcHMudmVydGljYWxBbGlnblxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gIHtOdW1iZXJ9IGlcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgZ2V0QW5pbWF0aW9uU3R5bGU6IGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgdmFyIGFuaW1hdGlvbiA9IFtpPT0xPyByaWdodFJvdGF0ZUFuaW1hdGlvbk5hbWU6IGxlZnRSb3RhdGVBbmltYXRpb25OYW1lLCAnMnMnLCAnMHMnLCAnaW5maW5pdGUnLCAnbGluZWFyJ10uam9pbignICcpO1xuICAgICAgICB2YXIgYW5pbWF0aW9uRmlsbE1vZGUgPSAnZm9yd2FyZHMnO1xuICAgICAgICB2YXIgcGVyc3BlY3RpdmUgPSAnODAwcHgnO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBwZXJzcGVjdGl2ZTogcGVyc3BlY3RpdmUsXG4gICAgICAgICAgICBhbmltYXRpb246IGFuaW1hdGlvbixcbiAgICAgICAgICAgIGFuaW1hdGlvbkZpbGxNb2RlOiBhbmltYXRpb25GaWxsTW9kZVxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gIHtOdW1iZXJ9IGlcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgZ2V0U3R5bGU6IGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgdmFyIHNpemUgPSBwYXJzZUludCh0aGlzLnByb3BzLnNpemUpO1xuXG4gICAgICAgIGlmIChpKSB7XG4gICAgICAgICAgICByZXR1cm4gYXNzaWduKFxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0Q2lyY2xlU3R5bGUoc2l6ZSksXG4gICAgICAgICAgICAgICAgdGhpcy5nZXRBbmltYXRpb25TdHlsZShpKSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IDAsXG5cdFx0XHRcdFx0Ym9yZGVyOiAnMHB4IHNvbGlkIHRyYW5zcGFyZW50JyAvLyBmaXggZmlyZWZveC9jaHJvbWUvb3BlcmEgcmVuZGVyaW5nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB3aWR0aDogc2l6ZSxcbiAgICAgICAgICAgIGhlaWdodDogc2l6ZSxcbiAgICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuXHRcdFx0Ym9yZGVyOiAnMHB4IHNvbGlkIHRyYW5zcGFyZW50JyAvLyBmaXggZmlyZWZveC9jaHJvbWUvb3BlcmEgcmVuZGVyaW5nXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSAge0Jvb2xlYW59IGxvYWRpbmdcbiAgICAgKiBAcmV0dXJuIHtSZWFjdENvbXBvbmVudCB8fCBudWxsfVxuICAgICAqL1xuICAgIHJlbmRlckxvYWRlcjogZnVuY3Rpb24obG9hZGluZykge1xuICAgICAgICBpZiAobG9hZGluZykge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8ZGl2IGlkPXt0aGlzLnByb3BzLmlkfSBjbGFzc05hbWU9e3RoaXMucHJvcHMuY2xhc3NOYW1lfT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17dGhpcy5nZXRTdHlsZSgwKX0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt0aGlzLmdldFN0eWxlKDEpfT48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RoaXMuZ2V0U3R5bGUoMil9PjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyTG9hZGVyKHRoaXMucHJvcHMubG9hZGluZyk7XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gTG9hZGVyO1xuIl19
},{"domkit/appendVendorPrefix":1,"domkit/insertKeyframesRule":5,"react":undefined}],17:[function(require,module,exports){
'use strict';

var React = require('react');
var assign = require('domkit/appendVendorPrefix');
var insertKeyframesRule = require('domkit/insertKeyframesRule');

/**
 * @type {Number}
 */
var riseAmount = 30;

/**
 * @type {Object}
 */
var keyframesEven = {
    '0%': {
        transform: 'scale(1.1)'
    },
    '25%': {
        transform: 'translateY(-' + riseAmount + 'px)'
    },
    '50%': {
        transform: 'scale(0.4)'
    },
    '75%': {
        transform: 'translateY(' + riseAmount + 'px)'
    },
    '100%': {
        transform: 'translateY(0) scale(1.0)'
    }
};

/**
 * @type {Object}
 */
var keyframesOdd = {
    '0%': {
        transform: 'scale(0.4)'
    },
    '25': {
        transform: 'translateY(' + riseAmount + 'px)'
    },
    '50%': {
        transform: 'scale(1.1)'
    },
    '75%': {
        transform: 'translateY(-' + riseAmount + 'px)'
    },
    '100%': {
        transform: 'translateY(0) scale(0.75)'
    }
};

/**
 * @type {String}
 */
var animationNameEven = insertKeyframesRule(keyframesEven);

/**
 * @type {String}
 */
var animationNameOdd = insertKeyframesRule(keyframesOdd);

var Loader = React.createClass({
    displayName: 'Loader',

    /**
     * @type {Object}
     */
    propTypes: {
        loading: React.PropTypes.bool,
        color: React.PropTypes.string,
        size: React.PropTypes.string,
        margin: React.PropTypes.string
    },

    /**
     * @return {Object}
     */
    getDefaultProps: function getDefaultProps() {
        return {
            loading: true,
            color: '#ffffff',
            size: '15px',
            margin: '2px'
        };
    },

    /**
     * @return {Object}
     */
    getBallStyle: function getBallStyle() {
        return {
            backgroundColor: this.props.color,
            width: this.props.size,
            height: this.props.size,
            margin: this.props.margin,
            borderRadius: '100%',
            verticalAlign: this.props.verticalAlign
        };
    },

    /**
     * @param  {Number} i
     * @return {Object}
     */
    getAnimationStyle: function getAnimationStyle(i) {
        var animation = [i % 2 == 0 ? animationNameEven : animationNameOdd, '1s', '0s', 'infinite', 'cubic-bezier(.15,.46,.9,.6)'].join(' ');
        var animationFillMode = 'both';

        return {
            animation: animation,
            animationFillMode: animationFillMode
        };
    },

    /**
     * @param  {Number} i
     * @return {Object}
     */
    getStyle: function getStyle(i) {
        return assign(this.getBallStyle(i), this.getAnimationStyle(i), {
            display: 'inline-block',
            border: '0px solid transparent' // fix firefox/chrome/opera rendering
        });
    },

    /**
     * @param  {Boolean} loading
     * @return {ReactComponent || null}
     */
    renderLoader: function renderLoader(loading) {
        if (loading) {
            return React.createElement(
                'div',
                { id: this.props.id, className: this.props.className },
                React.createElement('div', { style: this.getStyle(1) }),
                React.createElement('div', { style: this.getStyle(2) }),
                React.createElement('div', { style: this.getStyle(3) }),
                React.createElement('div', { style: this.getStyle(4) }),
                React.createElement('div', { style: this.getStyle(5) })
            );
        }

        return null;
    },

    render: function render() {
        return this.renderLoader(this.props.loading);
    }
});

module.exports = Loader;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlJpc2VMb2FkZXIuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJyZXF1aXJlIiwiYXNzaWduIiwiaW5zZXJ0S2V5ZnJhbWVzUnVsZSIsInJpc2VBbW91bnQiLCJrZXlmcmFtZXNFdmVuIiwidHJhbnNmb3JtIiwia2V5ZnJhbWVzT2RkIiwiYW5pbWF0aW9uTmFtZUV2ZW4iLCJhbmltYXRpb25OYW1lT2RkIiwiTG9hZGVyIiwiY3JlYXRlQ2xhc3MiLCJwcm9wVHlwZXMiLCJsb2FkaW5nIiwiUHJvcFR5cGVzIiwiYm9vbCIsImNvbG9yIiwic3RyaW5nIiwic2l6ZSIsIm1hcmdpbiIsImdldERlZmF1bHRQcm9wcyIsImdldEJhbGxTdHlsZSIsImJhY2tncm91bmRDb2xvciIsInByb3BzIiwid2lkdGgiLCJoZWlnaHQiLCJib3JkZXJSYWRpdXMiLCJ2ZXJ0aWNhbEFsaWduIiwiZ2V0QW5pbWF0aW9uU3R5bGUiLCJpIiwiYW5pbWF0aW9uIiwiam9pbiIsImFuaW1hdGlvbkZpbGxNb2RlIiwiZ2V0U3R5bGUiLCJkaXNwbGF5IiwiYm9yZGVyIiwicmVuZGVyTG9hZGVyIiwiaWQiLCJjbGFzc05hbWUiLCJyZW5kZXIiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUlBLFFBQVFDLFFBQVEsT0FBUixDQUFaO0FBQ0EsSUFBSUMsU0FBU0QsUUFBUSwyQkFBUixDQUFiO0FBQ0EsSUFBSUUsc0JBQXNCRixRQUFRLDRCQUFSLENBQTFCOztBQUVBOzs7QUFHQSxJQUFJRyxhQUFhLEVBQWpCOztBQUVBOzs7QUFHQSxJQUFJQyxnQkFBZ0I7QUFDaEIsVUFBTTtBQUNGQyxtQkFBVztBQURULEtBRFU7QUFJaEIsV0FBTztBQUNIQSxtQkFBVyxpQkFBaUJGLFVBQWpCLEdBQThCO0FBRHRDLEtBSlM7QUFPaEIsV0FBTztBQUNIRSxtQkFBVztBQURSLEtBUFM7QUFVaEIsV0FBTztBQUNIQSxtQkFBVyxnQkFBZ0JGLFVBQWhCLEdBQTZCO0FBRHJDLEtBVlM7QUFh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LENBQWQsQ0FBWjtBQUxKLGFBREo7QUFTSDs7QUFFRCxlQUFPLElBQVA7QUFDSCxLQXBGMEI7O0FBc0YzQk0sWUFBUSxrQkFBVztBQUNmLGVBQU8sS0FBS0gsWUFBTCxDQUFrQixLQUFLYixLQUFMLENBQVdWLE9BQTdCLENBQVA7QUFDSDtBQXhGMEIsQ0FBbEIsQ0FBYjs7QUEyRkEyQixPQUFPQyxPQUFQLEdBQWlCL0IsTUFBakIiLCJmaWxlIjoiUmlzZUxvYWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgYXNzaWduID0gcmVxdWlyZSgnZG9ta2l0L2FwcGVuZFZlbmRvclByZWZpeCcpO1xudmFyIGluc2VydEtleWZyYW1lc1J1bGUgPSByZXF1aXJlKCdkb21raXQvaW5zZXJ0S2V5ZnJhbWVzUnVsZScpO1xuXG4vKipcbiAqIEB0eXBlIHtOdW1iZXJ9XG4gKi9cbnZhciByaXNlQW1vdW50ID0gMzA7XG5cbi8qKlxuICogQHR5cGUge09iamVjdH1cbiAqL1xudmFyIGtleWZyYW1lc0V2ZW4gPSB7XG4gICAgJzAlJzoge1xuICAgICAgICB0cmFuc2Zvcm06ICdzY2FsZSgxLjEpJ1xuICAgIH0sXG4gICAgJzI1JSc6IHtcbiAgICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlWSgtJyArIHJpc2VBbW91bnQgKyAncHgpJ1xuICAgIH0sXG4gICAgJzUwJSc6IHtcbiAgICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoMC40KSdcbiAgICB9LFxuICAgICc3NSUnOiB7XG4gICAgICAgIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVkoJyArIHJpc2VBbW91bnQgKyAncHgpJ1xuICAgIH0sXG4gICAgJzEwMCUnOiB7XG4gICAgICAgIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVkoMCkgc2NhbGUoMS4wKSdcbiAgICB9XG59O1xuXG4vKipcbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cbnZhciBrZXlmcmFtZXNPZGQgPSB7XG4gICAgJzAlJzoge1xuICAgICAgICB0cmFuc2Zvcm06ICdzY2FsZSgwLjQpJ1xuICAgIH0sXG4gICAgJzI1Jzoge1xuICAgICAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKCcgKyByaXNlQW1vdW50ICsgJ3B4KSdcbiAgICB9LFxuICAgICc1MCUnOiB7XG4gICAgICAgIHRyYW5zZm9ybTogJ3NjYWxlKDEuMSknXG4gICAgfSxcbiAgICAnNzUlJzoge1xuICAgICAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKC0nICsgcmlzZUFtb3VudCArICdweCknXG4gICAgfSxcbiAgICAnMTAwJSc6IHtcbiAgICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlWSgwKSBzY2FsZSgwLjc1KSdcbiAgICB9XG59O1xuXG4vKipcbiAqIEB0eXBlIHtTdHJpbmd9XG4gKi9cbnZhciBhbmltYXRpb25OYW1lRXZlbiA9IGluc2VydEtleWZyYW1lc1J1bGUoa2V5ZnJhbWVzRXZlbik7XG5cbi8qKlxuICogQHR5cGUge1N0cmluZ31cbiAqL1xudmFyIGFuaW1hdGlvbk5hbWVPZGQgPSBpbnNlcnRLZXlmcmFtZXNSdWxlKGtleWZyYW1lc09kZCk7XG5cbnZhciBMb2FkZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAgLyoqXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICBwcm9wVHlwZXM6IHtcbiAgICAgICAgbG9hZGluZzogUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG4gICAgICAgIGNvbG9yOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBzaXplOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBtYXJnaW46IFJlYWN0LlByb3BUeXBlcy5zdHJpbmdcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsb2FkaW5nOiB0cnVlLFxuICAgICAgICAgICAgY29sb3I6ICcjZmZmZmZmJyxcbiAgICAgICAgICAgIHNpemU6ICcxNXB4JyxcbiAgICAgICAgICAgIG1hcmdpbjogJzJweCdcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIGdldEJhbGxTdHlsZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHRoaXMucHJvcHMuY29sb3IsXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5wcm9wcy5zaXplLFxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnByb3BzLnNpemUsXG4gICAgICAgICAgICBtYXJnaW46IHRoaXMucHJvcHMubWFyZ2luLFxuICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnMTAwJScsXG4gICAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiB0aGlzLnByb3BzLnZlcnRpY2FsQWxpZ25cbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtICB7TnVtYmVyfSBpXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIGdldEFuaW1hdGlvblN0eWxlOiBmdW5jdGlvbihpKSB7XG4gICAgICAgIHZhciBhbmltYXRpb24gPSBbaSUyPT0wPyBhbmltYXRpb25OYW1lRXZlbjogYW5pbWF0aW9uTmFtZU9kZCwgJzFzJywgJzBzJywgJ2luZmluaXRlJywgJ2N1YmljLWJlemllciguMTUsLjQ2LC45LC42KSddLmpvaW4oJyAnKTtcbiAgICAgICAgdmFyIGFuaW1hdGlvbkZpbGxNb2RlID0gJ2JvdGgnO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBhbmltYXRpb246IGFuaW1hdGlvbixcbiAgICAgICAgICAgIGFuaW1hdGlvbkZpbGxNb2RlOiBhbmltYXRpb25GaWxsTW9kZVxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gIHtOdW1iZXJ9IGlcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgZ2V0U3R5bGU6IGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgcmV0dXJuIGFzc2lnbihcbiAgICAgICAgICAgIHRoaXMuZ2V0QmFsbFN0eWxlKGkpLFxuICAgICAgICAgICAgdGhpcy5nZXRBbmltYXRpb25TdHlsZShpKSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJyxcblx0XHRcdFx0Ym9yZGVyOiAnMHB4IHNvbGlkIHRyYW5zcGFyZW50JyAvLyBmaXggZmlyZWZveC9jaHJvbWUvb3BlcmEgcmVuZGVyaW5nXG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSAge0Jvb2xlYW59IGxvYWRpbmdcbiAgICAgKiBAcmV0dXJuIHtSZWFjdENvbXBvbmVudCB8fCBudWxsfVxuICAgICAqL1xuICAgIHJlbmRlckxvYWRlcjogZnVuY3Rpb24obG9hZGluZykge1xuICAgICAgICBpZiAobG9hZGluZykge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8ZGl2IGlkPXt0aGlzLnByb3BzLmlkfSBjbGFzc05hbWU9e3RoaXMucHJvcHMuY2xhc3NOYW1lfT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17dGhpcy5nZXRTdHlsZSgxKX0+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RoaXMuZ2V0U3R5bGUoMil9PjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt0aGlzLmdldFN0eWxlKDMpfT48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17dGhpcy5nZXRTdHlsZSg0KX0+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RoaXMuZ2V0U3R5bGUoNSl9PjwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJMb2FkZXIodGhpcy5wcm9wcy5sb2FkaW5nKTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBMb2FkZXI7XG4iXX0=
},{"domkit/appendVendorPrefix":1,"domkit/insertKeyframesRule":5,"react":undefined}],18:[function(require,module,exports){
'use strict';

var React = require('react');
var assign = require('domkit/appendVendorPrefix');
var insertKeyframesRule = require('domkit/insertKeyframesRule');

/**
 * @type {Object}
 */
var keyframes = {
    '0%': {
        transform: 'rotate(0deg)'
    },
    '50%': {
        transform: 'rotate(180deg)'
    },
    '100%': {
        transform: 'rotate(360deg)'
    }
};

/**
 * @type {String}
 */
var animationName = insertKeyframesRule(keyframes);

var Loader = React.createClass({
    displayName: 'Loader',

    /**
     * @type {Object}
     */
    propTypes: {
        loading: React.PropTypes.bool,
        color: React.PropTypes.string,
        size: React.PropTypes.string,
        margin: React.PropTypes.string
    },

    /**
     * @return {Object}
     */
    getDefaultProps: function getDefaultProps() {
        return {
            loading: true,
            color: '#ffffff',
            size: '15px',
            margin: '2px'
        };
    },

    /**
     * @return {Object}
     */
    getBallStyle: function getBallStyle() {
        return {
            backgroundColor: this.props.color,
            width: this.props.size,
            height: this.props.size,
            margin: this.props.margin,
            borderRadius: '100%',
            verticalAlign: this.props.verticalAlign
        };
    },

    /**
     * @param  {Number} i
     * @return {Object}
     */
    getAnimationStyle: function getAnimationStyle(i) {
        var animation = [animationName, '1s', '0s', 'infinite', 'cubic-bezier(.7,-.13,.22,.86)'].join(' ');
        var animationFillMode = 'both';

        return {
            animation: animation,
            animationFillMode: animationFillMode
        };
    },

    /**
     * @param  {Number} i
     * @return {Object}
     */
    getStyle: function getStyle(i) {
        if (i) {
            return assign(this.getBallStyle(i), {
                opacity: '0.8',
                position: 'absolute',
                top: 0,
                left: i % 2 ? -28 : 25,
                border: '0px solid transparent' // fix firefox/chrome/opera rendering
            });
        }

        return assign(this.getBallStyle(i), this.getAnimationStyle(i), {
            display: 'inline-block',
            position: 'relative',
            border: '0px solid transparent' // fix firefox/chrome/opera rendering
        });
    },

    /**
     * @param  {Boolean} loading
     * @return {ReactComponent || null}
     */
    renderLoader: function renderLoader(loading) {
        if (loading) {
            return React.createElement(
                'div',
                { id: this.props.id, className: this.props.className },
                React.createElement(
                    'div',
                    { style: this.getStyle() },
                    React.createElement('div', { style: this.getStyle(1) }),
                    React.createElement('div', { style: this.getStyle(2) })
                )
            );
        }

        return null;
    },

    render: function render() {
        return this.renderLoader(this.props.loading);
    }
});

module.exports = Loader;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlJvdGF0ZUxvYWRlci5qcyJdLCJuYW1lcyI6WyJSZWFjdCIsInJlcXVpcmUiLCJhc3NpZ24iLCJpbnNlcnRLZXlmcmFtZXNSdWxlIiwia2V5ZnJhbWVzIiwidHJhbnNmb3JtIiwiYW5pbWF0aW9uTmFtZSIsIkxvYWRlciIsImNyZWF0ZUNsYXNzIiwicHJvcFR5cGVzIiwibG9hZGluZyIsIlByb3BUeXBlcyIsImJvb2wiLCJjb2xvciIsInN0cmluZyIsInNpemUiLCJtYXJnaW4iLCJnZXREZWZhdWx0UHJvcHMiLCJnZXRCYWxsU3R5bGUiLCJiYWNrZ3JvdW5kQ29sb3IiLCJwcm9wcyIsIndpZHRoIiwiaGVpZ2h0IiwiYm9yZGVyUmFkaXVzIiwidmVydGljYWxBbGlnbiIsImdldEFuaW1hdGlvblN0eWxlIiwiaSIsImFuaW1hdGlvbiIsImpvaW4iLCJhbmltYXRpb25GaWxsTW9kZSIsImdldFN0eWxlIiwib3BhY2l0eSIsInBvc2l0aW9uIiwidG9wIiwibGVmdCIsImJvcmRlciIsImRpc3BsYXkiLCJyZW5kZXJMb2FkZXIiLCJpZCIsImNsYXNzTmFtZSIsInJlbmRlciIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEsUUFBUUMsUUFBUSxPQUFSLENBQVo7QUFDQSxJQUFJQyxTQUFTRCxRQUFRLDJCQUFSLENBQWI7QUFDQSxJQUFJRSxzQkFBc0JGLFFBQVEsNEJBQVIsQ0FBMUI7O0FBRUE7OztBQUdBLElBQUlHLFlBQVk7QUFDWixVQUFNO0FBQ0ZDLG1CQUFXO0FBRFQsS0FETTtBQUlaLFdBQU87QUFDSEEsbUJBQVc7QUFEUixLQUpLO0FBT1osWUFBUTtBQUNKQSxtQkFBVztBQURQO0FBUEksQ0FBaEI7O0FBWUE7OztBQUdBLElBQUlDLGdCQUFnQkgsb0JBQW9CQyxTQUFwQixDQUFwQjs7QUFFQSxJQUFJRyxTQUFTUCxNQUFNUSxXQUFOLENBQWtCO0FBQUE7O0FBQzNCOzs7QUFHQUMsZUFBVztBQUNQQyxpQkFBU1YsTUFBTVcsU0FBTixDQUFnQkMsSUFEbEI7QUFFUEMsZUFBT2IsTUFBTVcsU0FBTixDQUFnQkcsTUFGaEI7QUFHUEMsY0FBTWYsTUFBTVcsU0FBTixDQUFnQkcsTUFIZjtBQUlQRSxnQkFBUWhCLE1BQU1XLFNBQU4sQ0FBZ0JHO0FBSmpCLEtBSmdCOztBQVczQjs7O0FBR0FHLHFCQUFpQiwyQkFBVztBQUN4QixlQUFPO0FBQ0hQLHFCQUFTLElBRE47QUFFSEcsbUJBQU8sU0FGSjtBQUdIRSxrQkFBTSxNQUhIO0FBSUhDLG9CQUFRO0FBSkwsU0FBUDtBQU1ILEtBckIwQjs7QUF1QjNCOzs7QUFHQUUsa0JBQWMsd0JBQVc7QUFDckIsZUFBTztBQUNIQyw2QkFBaUIsS0FBS0MsS0FBTCxDQUFXUCxLQUR6QjtBQUVIUSxtQkFBTyxLQUFLRCxLQUFMLENBQVdMLElBRmY7QUFHSE8sb0JBQVEsS0FBS0YsS0FBTCxDQUFXTCxJQUhoQjtBQUlIQyxvQkFBUSxLQUFLSSxLQUFMLENBQVdKLE1BSmhCO0FBS0hPLDBCQUFjLE1BTFg7QUFNSEMsMkJBQWUsS0FBS0osS0FBTCxDQUFXSTtBQU52QixTQUFQO0FBUUgsS0FuQzBCOztBQXFDM0I7Ozs7QUFJQUMsdUJBQW1CLDJCQUFTQyxDQUFULEVBQVk7QUFDM0IsWUFBSUMsWUFBWSxDQUFDckIsYUFBRCxFQUFnQixJQUFoQixFQUFzQixJQUF0QixFQUE0QixVQUE1QixFQUF3QywrQkFBeEMsRUFBeUVzQixJQUF6RSxDQUE4RSxHQUE5RSxDQUFoQjtBQUNBLFlBQUlDLG9CQUFvQixNQUF4Qjs7QUFFQSxlQUFPO0FBQ0hGLHVCQUFXQSxTQURSO0FBRUhFLCtCQUFtQkE7QUFGaEIsU0FBUDtBQUlILEtBakQwQjs7QUFtRDNCOzs7O0FBSUFDLGNBQVUsa0JBQVNKLENBQVQsRUFBWTtBQUNsQixZQUFJQSxDQUFKLEVBQU87QUFDSCxtQkFBT3hCLE9BQ0gsS0FBS2dCLFlBQUwsQ0FBa0JRLENBQWxCLENBREcsRUFFSDtBQUNJSyx5QkFBUyxLQURiO0FBRUlDLDBCQUFVLFVBRmQ7QUFHSUMscUJBQUssQ0FIVDtBQUlJQyxzQkFBTVIsSUFBRSxDQUFGLEdBQU0sQ0FBQyxFQUFQLEdBQVksRUFKdEI7QUFLWFMsd0JBQVEsdUJBTEcsQ0FLcUI7QUFMckIsYUFGRyxDQUFQO0FBVUg7O0FBRUQsZUFBT2pDLE9BQ0gsS0FBS2dCLFlBQUwsQ0FBa0JRLENBQWxCLENBREcsRUFFSCxLQUFLRCxpQkFBTCxDQUF1QkMsQ0FBdkIsQ0FGRyxFQUdIO0FBQ0lVLHFCQUFTLGNBRGI7QUFFSUosc0JBQVUsVUFGZDtBQUdSRyxvQkFBUSx1QkFIQSxDQUd3QjtBQUh4QixTQUhHLENBQVA7QUFTSCxLQTlFMEI7O0FBZ0YzQjs7OztBQUlBRSxrQkFBYyxzQkFBUzNCLE9BQVQsRUFBa0I7QUFDNUIsWUFBSUEsT0FBSixFQUFhO0FBQ1QsbUJBQ0k7QUFBQTtBQUFBLGtCQUFLLElBQUksS0FBS1UsS0FBTCxDQUFXa0IsRUFBcEIsRUFBd0IsV0FBVyxLQUFLbEIsS0FBTCxDQUFXbUIsU0FBOUM7QUFDSTtBQUFBO0FBQUEsc0JBQUssT0FBTyxLQUFLVCxRQUFMLEVBQVo7QUFDSSxpREFBSyxPQUFPLEtBQUtBLFFBQUwsQ0FBYyxDQUFkLENBQVosR0FESjtBQUVJLGlEQUFLLE9BQU8sS0FBS0EsUUFBTCxDQUFjLENBQWQsQ0FBWjtBQUZKO0FBREosYUFESjtBQVFIOztBQUVELGVBQU8sSUFBUDtBQUNILEtBakcwQjs7QUFtRzNCVSxZQUFRLGtCQUFXO0FBQ2YsZUFBTyxLQUFLSCxZQUFMLENBQWtCLEtBQUtqQixLQUFMLENBQVdWLE9BQTdCLENBQVA7QUFDSDtBQXJHMEIsQ0FBbEIsQ0FBYjs7QUF3R0ErQixPQUFPQyxPQUFQLEdBQWlCbkMsTUFBakIiLCJmaWxlIjoiUm90YXRlTG9hZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBhc3NpZ24gPSByZXF1aXJlKCdkb21raXQvYXBwZW5kVmVuZG9yUHJlZml4Jyk7XG52YXIgaW5zZXJ0S2V5ZnJhbWVzUnVsZSA9IHJlcXVpcmUoJ2RvbWtpdC9pbnNlcnRLZXlmcmFtZXNSdWxlJyk7XG5cbi8qKlxuICogQHR5cGUge09iamVjdH1cbiAqL1xudmFyIGtleWZyYW1lcyA9IHtcbiAgICAnMCUnOiB7XG4gICAgICAgIHRyYW5zZm9ybTogJ3JvdGF0ZSgwZGVnKSdcbiAgICB9LFxuICAgICc1MCUnOiB7XG4gICAgICAgIHRyYW5zZm9ybTogJ3JvdGF0ZSgxODBkZWcpJ1xuICAgIH0sXG4gICAgJzEwMCUnOiB7XG4gICAgICAgIHRyYW5zZm9ybTogJ3JvdGF0ZSgzNjBkZWcpJ1xuICAgIH1cbn07XG5cbi8qKlxuICogQHR5cGUge1N0cmluZ31cbiAqL1xudmFyIGFuaW1hdGlvbk5hbWUgPSBpbnNlcnRLZXlmcmFtZXNSdWxlKGtleWZyYW1lcyk7XG5cbnZhciBMb2FkZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAgLyoqXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICBwcm9wVHlwZXM6IHtcbiAgICAgICAgbG9hZGluZzogUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG4gICAgICAgIGNvbG9yOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBzaXplOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBtYXJnaW46IFJlYWN0LlByb3BUeXBlcy5zdHJpbmdcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsb2FkaW5nOiB0cnVlLFxuICAgICAgICAgICAgY29sb3I6ICcjZmZmZmZmJyxcbiAgICAgICAgICAgIHNpemU6ICcxNXB4JyxcbiAgICAgICAgICAgIG1hcmdpbjogJzJweCdcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIGdldEJhbGxTdHlsZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHRoaXMucHJvcHMuY29sb3IsXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5wcm9wcy5zaXplLFxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnByb3BzLnNpemUsXG4gICAgICAgICAgICBtYXJnaW46IHRoaXMucHJvcHMubWFyZ2luLFxuICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnMTAwJScsXG4gICAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiB0aGlzLnByb3BzLnZlcnRpY2FsQWxpZ25cbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtICB7TnVtYmVyfSBpXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIGdldEFuaW1hdGlvblN0eWxlOiBmdW5jdGlvbihpKSB7XG4gICAgICAgIHZhciBhbmltYXRpb24gPSBbYW5pbWF0aW9uTmFtZSwgJzFzJywgJzBzJywgJ2luZmluaXRlJywgJ2N1YmljLWJlemllciguNywtLjEzLC4yMiwuODYpJ10uam9pbignICcpO1xuICAgICAgICB2YXIgYW5pbWF0aW9uRmlsbE1vZGUgPSAnYm90aCc7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGFuaW1hdGlvbjogYW5pbWF0aW9uLFxuICAgICAgICAgICAgYW5pbWF0aW9uRmlsbE1vZGU6IGFuaW1hdGlvbkZpbGxNb2RlLFxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gIHtOdW1iZXJ9IGlcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgZ2V0U3R5bGU6IGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgaWYgKGkpIHtcbiAgICAgICAgICAgIHJldHVybiBhc3NpZ24oXG4gICAgICAgICAgICAgICAgdGhpcy5nZXRCYWxsU3R5bGUoaSksXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAnMC44JyxcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogaSUyID8gLTI4IDogMjUsXG5cdFx0XHRcdFx0Ym9yZGVyOiAnMHB4IHNvbGlkIHRyYW5zcGFyZW50JyAvLyBmaXggZmlyZWZveC9jaHJvbWUvb3BlcmEgcmVuZGVyaW5nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhc3NpZ24oXG4gICAgICAgICAgICB0aGlzLmdldEJhbGxTdHlsZShpKSxcbiAgICAgICAgICAgIHRoaXMuZ2V0QW5pbWF0aW9uU3R5bGUoaSksXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZGlzcGxheTogJ2lubGluZS1ibG9jaycsXG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG5cdFx0XHRcdGJvcmRlcjogJzBweCBzb2xpZCB0cmFuc3BhcmVudCcgLy8gZml4IGZpcmVmb3gvY2hyb21lL29wZXJhIHJlbmRlcmluZ1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gIHtCb29sZWFufSBsb2FkaW5nXG4gICAgICogQHJldHVybiB7UmVhY3RDb21wb25lbnQgfHwgbnVsbH1cbiAgICAgKi9cbiAgICByZW5kZXJMb2FkZXI6IGZ1bmN0aW9uKGxvYWRpbmcpIHtcbiAgICAgICAgaWYgKGxvYWRpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPGRpdiBpZD17dGhpcy5wcm9wcy5pZH0gY2xhc3NOYW1lPXt0aGlzLnByb3BzLmNsYXNzTmFtZX0+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RoaXMuZ2V0U3R5bGUoKX0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt0aGlzLmdldFN0eWxlKDEpfT48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RoaXMuZ2V0U3R5bGUoMil9PjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyTG9hZGVyKHRoaXMucHJvcHMubG9hZGluZyk7XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gTG9hZGVyO1xuIl19
},{"domkit/appendVendorPrefix":1,"domkit/insertKeyframesRule":5,"react":undefined}],19:[function(require,module,exports){
'use strict';

var React = require('react');
var assign = require('domkit/appendVendorPrefix');
var insertKeyframesRule = require('domkit/insertKeyframesRule');

/**
 * @type {Object}
 */
var keyframes = {
    '0%': {
        transform: 'scaley(1.0)'
    },
    '50%': {
        transform: 'scaley(0.4)'
    },
    '100%': {
        transform: 'scaley(1.0)'
    }
};

/**
 * @type {String}
 */
var animationName = insertKeyframesRule(keyframes);

var Loader = React.createClass({
    displayName: 'Loader',

    /**
     * @type {Object}
     */
    propTypes: {
        loading: React.PropTypes.bool,
        color: React.PropTypes.string,
        height: React.PropTypes.string,
        width: React.PropTypes.string,
        margin: React.PropTypes.string,
        radius: React.PropTypes.string
    },

    /**
     * @return {Object}
     */
    getDefaultProps: function getDefaultProps() {
        return {
            loading: true,
            color: '#ffffff',
            height: '35px',
            width: '4px',
            margin: '2px',
            radius: '2px'
        };
    },

    /**
     * @return {Object}
     */
    getLineStyle: function getLineStyle() {
        return {
            backgroundColor: this.props.color,
            height: this.props.height,
            width: this.props.width,
            margin: this.props.margin,
            borderRadius: this.props.radius,
            verticalAlign: this.props.verticalAlign
        };
    },

    /**
     * @param  {Number} i
     * @return {Object}
     */
    getAnimationStyle: function getAnimationStyle(i) {
        var animation = [animationName, '1s', i * 0.1 + 's', 'infinite', 'cubic-bezier(.2,.68,.18,1.08)'].join(' ');
        var animationFillMode = 'both';

        return {
            animation: animation,
            animationFillMode: animationFillMode
        };
    },

    /**
     * @param  {Number} i
     * @return {Object}
     */
    getStyle: function getStyle(i) {
        return assign(this.getLineStyle(i), this.getAnimationStyle(i), {
            display: 'inline-block',
            border: '0px solid transparent' // fix firefox/chrome/opera rendering
        });
    },

    /**
     * @param  {Boolean} loading
     * @return {ReactComponent || null}
     */
    renderLoader: function renderLoader(loading) {
        if (loading) {
            return React.createElement(
                'div',
                { id: this.props.id, className: this.props.className },
                React.createElement('div', { style: this.getStyle(1) }),
                React.createElement('div', { style: this.getStyle(2) }),
                React.createElement('div', { style: this.getStyle(3) }),
                React.createElement('div', { style: this.getStyle(4) }),
                React.createElement('div', { style: this.getStyle(5) })
            );
        }

        return null;
    },

    render: function render() {
        return this.renderLoader(this.props.loading);
    }
});

module.exports = Loader;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNjYWxlTG9hZGVyLmpzIl0sIm5hbWVzIjpbIlJlYWN0IiwicmVxdWlyZSIsImFzc2lnbiIsImluc2VydEtleWZyYW1lc1J1bGUiLCJrZXlmcmFtZXMiLCJ0cmFuc2Zvcm0iLCJhbmltYXRpb25OYW1lIiwiTG9hZGVyIiwiY3JlYXRlQ2xhc3MiLCJwcm9wVHlwZXMiLCJsb2FkaW5nIiwiUHJvcFR5cGVzIiwiYm9vbCIsImNvbG9yIiwic3RyaW5nIiwiaGVpZ2h0Iiwid2lkdGgiLCJtYXJnaW4iLCJyYWRpdXMiLCJnZXREZWZhdWx0UHJvcHMiLCJnZXRMaW5lU3R5bGUiLCJiYWNrZ3JvdW5kQ29sb3IiLCJwcm9wcyIsImJvcmRlclJhZGl1cyIsInZlcnRpY2FsQWxpZ24iLCJnZXRBbmltYXRpb25TdHlsZSIsImkiLCJhbmltYXRpb24iLCJqb2luIiwiYW5pbWF0aW9uRmlsbE1vZGUiLCJnZXRTdHlsZSIsImRpc3BsYXkiLCJib3JkZXIiLCJyZW5kZXJMb2FkZXIiLCJpZCIsImNsYXNzTmFtZSIsInJlbmRlciIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEsUUFBUUMsUUFBUSxPQUFSLENBQVo7QUFDQSxJQUFJQyxTQUFTRCxRQUFRLDJCQUFSLENBQWI7QUFDQSxJQUFJRSxzQkFBc0JGLFFBQVEsNEJBQVIsQ0FBMUI7O0FBRUE7OztBQUdBLElBQUlHLFlBQVk7QUFDWixVQUFNO0FBQ0ZDLG1CQUFXO0FBRFQsS0FETTtBQUlaLFdBQU87QUFDSEEsbUJBQVc7QUFEUixLQUpLO0FBT1osWUFBUTtBQUNKQSxtQkFBVztBQURQO0FBUEksQ0FBaEI7O0FBWUE7OztBQUdBLElBQUlDLGdCQUFnQkgsb0JBQW9CQyxTQUFwQixDQUFwQjs7QUFFQSxJQUFJRyxTQUFTUCxNQUFNUSxXQUFOLENBQWtCO0FBQUE7O0FBQzNCOzs7QUFHQUMsZUFBVztBQUNQQyxpQkFBU1YsTUFBTVcsU0FBTixDQUFnQkMsSUFEbEI7QUFFUEMsZUFBT2IsTUFBTVcsU0FBTixDQUFnQkcsTUFGaEI7QUFHUEMsZ0JBQVFmLE1BQU1XLFNBQU4sQ0FBZ0JHLE1BSGpCO0FBSVBFLGVBQU9oQixNQUFNVyxTQUFOLENBQWdCRyxNQUpoQjtBQUtQRyxnQkFBUWpCLE1BQU1XLFNBQU4sQ0FBZ0JHLE1BTGpCO0FBTVBJLGdCQUFRbEIsTUFBTVcsU0FBTixDQUFnQkc7QUFOakIsS0FKZ0I7O0FBYTNCOzs7QUFHQUsscUJBQWlCLDJCQUFXO0FBQ3hCLGVBQU87QUFDSFQscUJBQVMsSUFETjtBQUVIRyxtQkFBTyxTQUZKO0FBR0hFLG9CQUFRLE1BSEw7QUFJSEMsbUJBQU8sS0FKSjtBQUtIQyxvQkFBUSxLQUxMO0FBTUhDLG9CQUFRO0FBTkwsU0FBUDtBQVFILEtBekIwQjs7QUEyQjNCOzs7QUFHQUUsa0JBQWMsd0JBQVc7QUFDckIsZUFBTztBQUNIQyw2QkFBaUIsS0FBS0MsS0FBTCxDQUFXVCxLQUR6QjtBQUVIRSxvQkFBUSxLQUFLTyxLQUFMLENBQVdQLE1BRmhCO0FBR0hDLG1CQUFPLEtBQUtNLEtBQUwsQ0FBV04sS0FIZjtBQUlIQyxvQkFBUSxLQUFLSyxLQUFMLENBQVdMLE1BSmhCO0FBS0hNLDBCQUFjLEtBQUtELEtBQUwsQ0FBV0osTUFMdEI7QUFNSE0sMkJBQWUsS0FBS0YsS0FBTCxDQUFXRTtBQU52QixTQUFQO0FBUUgsS0F2QzBCOztBQXlDM0I7Ozs7QUFJQUMsdUJBQW1CLDJCQUFTQyxDQUFULEVBQVk7QUFDM0IsWUFBSUMsWUFBWSxDQUFDckIsYUFBRCxFQUFnQixJQUFoQixFQUF1Qm9CLElBQUksR0FBTCxHQUFZLEdBQWxDLEVBQXVDLFVBQXZDLEVBQW1ELCtCQUFuRCxFQUFvRkUsSUFBcEYsQ0FBeUYsR0FBekYsQ0FBaEI7QUFDQSxZQUFJQyxvQkFBb0IsTUFBeEI7O0FBRUEsZUFBTztBQUNIRix1QkFBV0EsU0FEUjtBQUVIRSwrQkFBbUJBO0FBRmhCLFNBQVA7QUFJSCxLQXJEMEI7O0FBdUQzQjs7OztBQUlBQyxjQUFVLGtCQUFTSixDQUFULEVBQVk7QUFDbEIsZUFBT3hCLE9BQ0gsS0FBS2tCLFlBQUwsQ0FBa0JNLENBQWxCLENBREcsRUFFSCxLQUFLRCxpQkFBTCxDQUF1QkMsQ0FBdkIsQ0FGRyxFQUdIO0FBQ0lLLHFCQUFTLGNBRGI7QUFFUkMsb0JBQVEsdUJBRkEsQ0FFd0I7QUFGeEIsU0FIRyxDQUFQO0FBUUgsS0FwRTBCOztBQXNFM0I7Ozs7QUFJQUMsa0JBQWMsc0JBQVN2QixPQUFULEVBQWtCO0FBQzVCLFlBQUlBLE9BQUosRUFBYTtBQUNULG1CQUNJO0FBQUE7QUFBQSxrQkFBSyxJQUFJLEtBQUtZLEtBQUwsQ0FBV1ksRUFBcEIsRUFBd0IsV0FBVyxLQUFLWixLQUFMLENBQVdhLFNBQTlDO0FBQ0ksNkNBQUssT0FBTyxLQUFLTCxRQUFMLENBQWMsQ0FBZCxDQUFaLEdBREo7QUFFSSw2Q0FBSyxPQUFPLEtBQUtBLFFBQUwsQ0FBYyxDQUFkLENBQVosR0FGSjtBQUdJLDZDQUFLLE9BQU8sS0FBS0EsUUFBTCxDQUFjLENBQWQsQ0FBWixHQUhKO0FBSUksNkNBQUssT0FBTyxLQUFLQSxRQUFMLENBQWMsQ0FBZCxDQUFaLEdBSko7QUFLSSw2Q0FBSyxPQUFPLEtBQUtBLFFBQUwsQ0FBYyxDQUFkLENBQVo7QUFMSixhQURKO0FBU0g7O0FBRUQsZUFBTyxJQUFQO0FBQ0gsS0F4RjBCOztBQTBGM0JNLFlBQVEsa0JBQVc7QUFDZixlQUFPLEtBQUtILFlBQUwsQ0FBa0IsS0FBS1gsS0FBTCxDQUFXWixPQUE3QixDQUFQO0FBQ0g7QUE1RjBCLENBQWxCLENBQWI7O0FBK0ZBMkIsT0FBT0MsT0FBUCxHQUFpQi9CLE1BQWpCIiwiZmlsZSI6IlNjYWxlTG9hZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBhc3NpZ24gPSByZXF1aXJlKCdkb21raXQvYXBwZW5kVmVuZG9yUHJlZml4Jyk7XG52YXIgaW5zZXJ0S2V5ZnJhbWVzUnVsZSA9IHJlcXVpcmUoJ2RvbWtpdC9pbnNlcnRLZXlmcmFtZXNSdWxlJyk7XG5cbi8qKlxuICogQHR5cGUge09iamVjdH1cbiAqL1xudmFyIGtleWZyYW1lcyA9IHtcbiAgICAnMCUnOiB7XG4gICAgICAgIHRyYW5zZm9ybTogJ3NjYWxleSgxLjApJ1xuICAgIH0sXG4gICAgJzUwJSc6IHtcbiAgICAgICAgdHJhbnNmb3JtOiAnc2NhbGV5KDAuNCknXG4gICAgfSxcbiAgICAnMTAwJSc6IHtcbiAgICAgICAgdHJhbnNmb3JtOiAnc2NhbGV5KDEuMCknXG4gICAgfVxufTtcblxuLyoqXG4gKiBAdHlwZSB7U3RyaW5nfVxuICovXG52YXIgYW5pbWF0aW9uTmFtZSA9IGluc2VydEtleWZyYW1lc1J1bGUoa2V5ZnJhbWVzKTtcblxudmFyIExvYWRlciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICAvKipcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHByb3BUeXBlczoge1xuICAgICAgICBsb2FkaW5nOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcbiAgICAgICAgY29sb3I6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIGhlaWdodDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgd2lkdGg6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIG1hcmdpbjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgcmFkaXVzOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbG9hZGluZzogdHJ1ZSxcbiAgICAgICAgICAgIGNvbG9yOiAnI2ZmZmZmZicsXG4gICAgICAgICAgICBoZWlnaHQ6ICczNXB4JyxcbiAgICAgICAgICAgIHdpZHRoOiAnNHB4JyxcbiAgICAgICAgICAgIG1hcmdpbjogJzJweCcsXG4gICAgICAgICAgICByYWRpdXM6ICcycHgnXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBnZXRMaW5lU3R5bGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiB0aGlzLnByb3BzLmNvbG9yLFxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnByb3BzLmhlaWdodCxcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLnByb3BzLndpZHRoLFxuICAgICAgICAgICAgbWFyZ2luOiB0aGlzLnByb3BzLm1hcmdpbixcbiAgICAgICAgICAgIGJvcmRlclJhZGl1czogdGhpcy5wcm9wcy5yYWRpdXMsXG4gICAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiB0aGlzLnByb3BzLnZlcnRpY2FsQWxpZ25cbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtICB7TnVtYmVyfSBpXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIGdldEFuaW1hdGlvblN0eWxlOiBmdW5jdGlvbihpKSB7XG4gICAgICAgIHZhciBhbmltYXRpb24gPSBbYW5pbWF0aW9uTmFtZSwgJzFzJywgKGkgKiAwLjEpICsgJ3MnLCAnaW5maW5pdGUnLCAnY3ViaWMtYmV6aWVyKC4yLC42OCwuMTgsMS4wOCknXS5qb2luKCcgJyk7XG4gICAgICAgIHZhciBhbmltYXRpb25GaWxsTW9kZSA9ICdib3RoJztcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYW5pbWF0aW9uOiBhbmltYXRpb24sXG4gICAgICAgICAgICBhbmltYXRpb25GaWxsTW9kZTogYW5pbWF0aW9uRmlsbE1vZGVcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtICB7TnVtYmVyfSBpXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIGdldFN0eWxlOiBmdW5jdGlvbihpKSB7XG4gICAgICAgIHJldHVybiBhc3NpZ24oXG4gICAgICAgICAgICB0aGlzLmdldExpbmVTdHlsZShpKSxcbiAgICAgICAgICAgIHRoaXMuZ2V0QW5pbWF0aW9uU3R5bGUoaSksXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZGlzcGxheTogJ2lubGluZS1ibG9jaycsXG5cdFx0XHRcdGJvcmRlcjogJzBweCBzb2xpZCB0cmFuc3BhcmVudCcgLy8gZml4IGZpcmVmb3gvY2hyb21lL29wZXJhIHJlbmRlcmluZ1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gIHtCb29sZWFufSBsb2FkaW5nXG4gICAgICogQHJldHVybiB7UmVhY3RDb21wb25lbnQgfHwgbnVsbH1cbiAgICAgKi9cbiAgICByZW5kZXJMb2FkZXI6IGZ1bmN0aW9uKGxvYWRpbmcpIHtcbiAgICAgICAgaWYgKGxvYWRpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPGRpdiBpZD17dGhpcy5wcm9wcy5pZH0gY2xhc3NOYW1lPXt0aGlzLnByb3BzLmNsYXNzTmFtZX0+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RoaXMuZ2V0U3R5bGUoMSl9PjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt0aGlzLmdldFN0eWxlKDIpfT48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17dGhpcy5nZXRTdHlsZSgzKX0+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RoaXMuZ2V0U3R5bGUoNCl9PjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt0aGlzLmdldFN0eWxlKDUpfT48L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyTG9hZGVyKHRoaXMucHJvcHMubG9hZGluZyk7XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gTG9hZGVyO1xuIl19
},{"domkit/appendVendorPrefix":1,"domkit/insertKeyframesRule":5,"react":undefined}],20:[function(require,module,exports){
'use strict';

var React = require('react');
var assign = require('domkit/appendVendorPrefix');
var insertKeyframesRule = require('domkit/insertKeyframesRule');

/**
 * @type {Object}
 */
var keyframes = {
    '25%': {
        transform: 'perspective(100px) rotateX(180deg) rotateY(0)'
    },
    '50%': {
        transform: 'perspective(100px) rotateX(180deg) rotateY(180deg)'
    },
    '75%': {
        transform: 'perspective(100px) rotateX(0) rotateY(180deg)'
    },
    '100%': {
        transform: 'perspective(100px) rotateX(0) rotateY(0)'
    }
};

/**
 * @type {String}
 */
var animationName = insertKeyframesRule(keyframes);

var Loader = React.createClass({
    displayName: 'Loader',

    /**
     * @type {Object}
     */
    propTypes: {
        loading: React.PropTypes.bool,
        color: React.PropTypes.string,
        size: React.PropTypes.string
    },

    /**
     * @return {Object}
     */
    getDefaultProps: function getDefaultProps() {
        return {
            loading: true,
            color: '#ffffff',
            size: '20px'
        };
    },

    /**
     * @return {Object}
     */
    getSharpStyle: function getSharpStyle() {
        return {
            width: 0,
            height: 0,
            borderLeft: this.props.size + ' solid transparent',
            borderRight: this.props.size + ' solid transparent',
            borderBottom: this.props.size + ' solid ' + this.props.color,
            verticalAlign: this.props.verticalAlign
        };
    },

    /**
     * @param  {Number} i
     * @return {Object}
     */
    getAnimationStyle: function getAnimationStyle(i) {
        var animation = [animationName, '3s', '0s', 'infinite', 'cubic-bezier(.09,.57,.49,.9)'].join(' ');
        var animationFillMode = 'both';

        return {
            animation: animation,
            animationFillMode: animationFillMode
        };
    },

    /**
     * @param  {Number} i
     * @return {Object}
     */
    getStyle: function getStyle(i) {
        return assign(this.getSharpStyle(i), this.getAnimationStyle(i), {
            display: 'inline-block',
            border: '0px solid transparent' // fix firefox/chrome/opera rendering
        });
    },

    /**
     * @param  {Boolean} loading
     * @return {ReactComponent || null}
     */
    renderLoader: function renderLoader(loading) {
        if (loading) {
            return React.createElement(
                'div',
                { id: this.props.id, className: this.props.className },
                React.createElement('div', { style: this.getStyle() })
            );
        };

        return null;
    },

    render: function render() {
        return this.renderLoader(this.props.loading);
    }
});

module.exports = Loader;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNrZXdMb2FkZXIuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJyZXF1aXJlIiwiYXNzaWduIiwiaW5zZXJ0S2V5ZnJhbWVzUnVsZSIsImtleWZyYW1lcyIsInRyYW5zZm9ybSIsImFuaW1hdGlvbk5hbWUiLCJMb2FkZXIiLCJjcmVhdGVDbGFzcyIsInByb3BUeXBlcyIsImxvYWRpbmciLCJQcm9wVHlwZXMiLCJib29sIiwiY29sb3IiLCJzdHJpbmciLCJzaXplIiwiZ2V0RGVmYXVsdFByb3BzIiwiZ2V0U2hhcnBTdHlsZSIsIndpZHRoIiwiaGVpZ2h0IiwiYm9yZGVyTGVmdCIsInByb3BzIiwiYm9yZGVyUmlnaHQiLCJib3JkZXJCb3R0b20iLCJ2ZXJ0aWNhbEFsaWduIiwiZ2V0QW5pbWF0aW9uU3R5bGUiLCJpIiwiYW5pbWF0aW9uIiwiam9pbiIsImFuaW1hdGlvbkZpbGxNb2RlIiwiZ2V0U3R5bGUiLCJkaXNwbGF5IiwiYm9yZGVyIiwicmVuZGVyTG9hZGVyIiwiaWQiLCJjbGFzc05hbWUiLCJyZW5kZXIiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUlBLFFBQVFDLFFBQVEsT0FBUixDQUFaO0FBQ0EsSUFBSUMsU0FBU0QsUUFBUSwyQkFBUixDQUFiO0FBQ0EsSUFBSUUsc0JBQXNCRixRQUFRLDRCQUFSLENBQTFCOztBQUVBOzs7QUFHQSxJQUFJRyxZQUFZO0FBQ1osV0FBTztBQUNIQyxtQkFBVztBQURSLEtBREs7QUFJWixXQUFPO0FBQ0hBLG1CQUFXO0FBRFIsS0FKSztBQU9aLFdBQU87QUFDSEEsbUJBQVc7QUFEUixLQVBLO0FBVVosWUFBUTtBQUNKQSxtQkFBVztBQURQO0FBVkksQ0FBaEI7O0FBZUE7OztBQUdBLElBQUlDLGdCQUFnQkgsb0JBQW9CQyxTQUFwQixDQUFwQjs7QUFFQSxJQUFJRyxTQUFTUCxNQUFNUSxXQUFOLENBQWtCO0FBQUE7O0FBQzNCOzs7QUFHQUMsZUFBVztBQUNQQyxpQkFBU1YsTUFBTVcsU0FBTixDQUFnQkMsSUFEbEI7QUFFUEMsZUFBT2IsTUFBTVcsU0FBTixDQUFnQkcsTUFGaEI7QUFHUEMsY0FBTWYsTUFBTVcsU0FBTixDQUFnQkc7QUFIZixLQUpnQjs7QUFVM0I7OztBQUdBRSxxQkFBaUIsMkJBQVc7QUFDeEIsZUFBTztBQUNITixxQkFBUyxJQUROO0FBRUhHLG1CQUFPLFNBRko7QUFHSEUsa0JBQU07QUFISCxTQUFQO0FBS0gsS0FuQjBCOztBQXFCM0I7OztBQUdBRSxtQkFBZSx5QkFBVztBQUN0QixlQUFPO0FBQ0hDLG1CQUFPLENBREo7QUFFSEMsb0JBQVEsQ0FGTDtBQUdIQyx3QkFBWSxLQUFLQyxLQUFMLENBQVdOLElBQVgsR0FBa0Isb0JBSDNCO0FBSUhPLHlCQUFhLEtBQUtELEtBQUwsQ0FBV04sSUFBWCxHQUFrQixvQkFKNUI7QUFLSFEsMEJBQWMsS0FBS0YsS0FBTCxDQUFXTixJQUFYLEdBQWtCLFNBQWxCLEdBQTZCLEtBQUtNLEtBQUwsQ0FBV1IsS0FMbkQ7QUFNSFcsMkJBQWUsS0FBS0gsS0FBTCxDQUFXRztBQU52QixTQUFQO0FBUUgsS0FqQzBCOztBQW1DM0I7Ozs7QUFJQUMsdUJBQW1CLDJCQUFTQyxDQUFULEVBQVk7QUFDM0IsWUFBSUMsWUFBWSxDQUFDckIsYUFBRCxFQUFnQixJQUFoQixFQUFzQixJQUF0QixFQUE0QixVQUE1QixFQUF3Qyw4QkFBeEMsRUFBd0VzQixJQUF4RSxDQUE2RSxHQUE3RSxDQUFoQjtBQUNBLFlBQUlDLG9CQUFvQixNQUF4Qjs7QUFFQSxlQUFPO0FBQ0hGLHVCQUFXQSxTQURSO0FBRUhFLCtCQUFtQkE7QUFGaEIsU0FBUDtBQUlILEtBL0MwQjs7QUFpRDNCOzs7O0FBSUFDLGNBQVUsa0JBQVNKLENBQVQsRUFBWTtBQUNsQixlQUFPeEIsT0FDSCxLQUFLZSxhQUFMLENBQW1CUyxDQUFuQixDQURHLEVBRUgsS0FBS0QsaUJBQUwsQ0FBdUJDLENBQXZCLENBRkcsRUFHSDtBQUNJSyxxQkFBUyxjQURiO0FBRVJDLG9CQUFRLHVCQUZBLENBRXdCO0FBRnhCLFNBSEcsQ0FBUDtBQVFILEtBOUQwQjs7QUFnRTNCOzs7O0FBSUFDLGtCQUFjLHNCQUFTdkIsT0FBVCxFQUFrQjtBQUM1QixZQUFJQSxPQUFKLEVBQWE7QUFDVCxtQkFDSTtBQUFBO0FBQUEsa0JBQUssSUFBSSxLQUFLVyxLQUFMLENBQVdhLEVBQXBCLEVBQXdCLFdBQVcsS0FBS2IsS0FBTCxDQUFXYyxTQUE5QztBQUNJLDZDQUFLLE9BQU8sS0FBS0wsUUFBTCxFQUFaO0FBREosYUFESjtBQUtIOztBQUVELGVBQU8sSUFBUDtBQUNILEtBOUUwQjs7QUFnRjNCTSxZQUFRLGtCQUFXO0FBQ2YsZUFBTyxLQUFLSCxZQUFMLENBQWtCLEtBQUtaLEtBQUwsQ0FBV1gsT0FBN0IsQ0FBUDtBQUNIO0FBbEYwQixDQUFsQixDQUFiOztBQXFGQTJCLE9BQU9DLE9BQVAsR0FBaUIvQixNQUFqQiIsImZpbGUiOiJTa2V3TG9hZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBhc3NpZ24gPSByZXF1aXJlKCdkb21raXQvYXBwZW5kVmVuZG9yUHJlZml4Jyk7XG52YXIgaW5zZXJ0S2V5ZnJhbWVzUnVsZSA9IHJlcXVpcmUoJ2RvbWtpdC9pbnNlcnRLZXlmcmFtZXNSdWxlJyk7XG5cbi8qKlxuICogQHR5cGUge09iamVjdH1cbiAqL1xudmFyIGtleWZyYW1lcyA9IHtcbiAgICAnMjUlJzoge1xuICAgICAgICB0cmFuc2Zvcm06ICdwZXJzcGVjdGl2ZSgxMDBweCkgcm90YXRlWCgxODBkZWcpIHJvdGF0ZVkoMCknXG4gICAgfSxcbiAgICAnNTAlJzoge1xuICAgICAgICB0cmFuc2Zvcm06ICdwZXJzcGVjdGl2ZSgxMDBweCkgcm90YXRlWCgxODBkZWcpIHJvdGF0ZVkoMTgwZGVnKSdcbiAgICB9LFxuICAgICc3NSUnOiB7XG4gICAgICAgIHRyYW5zZm9ybTogJ3BlcnNwZWN0aXZlKDEwMHB4KSByb3RhdGVYKDApIHJvdGF0ZVkoMTgwZGVnKSdcbiAgICB9LFxuICAgICcxMDAlJzoge1xuICAgICAgICB0cmFuc2Zvcm06ICdwZXJzcGVjdGl2ZSgxMDBweCkgcm90YXRlWCgwKSByb3RhdGVZKDApJ1xuICAgIH1cbn07XG5cbi8qKlxuICogQHR5cGUge1N0cmluZ31cbiAqL1xudmFyIGFuaW1hdGlvbk5hbWUgPSBpbnNlcnRLZXlmcmFtZXNSdWxlKGtleWZyYW1lcyk7XG5cbnZhciBMb2FkZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAgLyoqXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICBwcm9wVHlwZXM6IHtcbiAgICAgICAgbG9hZGluZzogUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG4gICAgICAgIGNvbG9yOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBzaXplOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbG9hZGluZzogdHJ1ZSxcbiAgICAgICAgICAgIGNvbG9yOiAnI2ZmZmZmZicsXG4gICAgICAgICAgICBzaXplOiAnMjBweCdcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIGdldFNoYXJwU3R5bGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgd2lkdGg6IDAsXG4gICAgICAgICAgICBoZWlnaHQ6IDAsXG4gICAgICAgICAgICBib3JkZXJMZWZ0OiB0aGlzLnByb3BzLnNpemUgKyAnIHNvbGlkIHRyYW5zcGFyZW50JyxcbiAgICAgICAgICAgIGJvcmRlclJpZ2h0OiB0aGlzLnByb3BzLnNpemUgKyAnIHNvbGlkIHRyYW5zcGFyZW50JyxcbiAgICAgICAgICAgIGJvcmRlckJvdHRvbTogdGhpcy5wcm9wcy5zaXplICsgJyBzb2xpZCAnKyB0aGlzLnByb3BzLmNvbG9yLFxuICAgICAgICAgICAgdmVydGljYWxBbGlnbjogdGhpcy5wcm9wcy52ZXJ0aWNhbEFsaWduXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSAge051bWJlcn0gaVxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBnZXRBbmltYXRpb25TdHlsZTogZnVuY3Rpb24oaSkge1xuICAgICAgICB2YXIgYW5pbWF0aW9uID0gW2FuaW1hdGlvbk5hbWUsICczcycsICcwcycsICdpbmZpbml0ZScsICdjdWJpYy1iZXppZXIoLjA5LC41NywuNDksLjkpJ10uam9pbignICcpO1xuICAgICAgICB2YXIgYW5pbWF0aW9uRmlsbE1vZGUgPSAnYm90aCc7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGFuaW1hdGlvbjogYW5pbWF0aW9uLFxuICAgICAgICAgICAgYW5pbWF0aW9uRmlsbE1vZGU6IGFuaW1hdGlvbkZpbGxNb2RlXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSAge051bWJlcn0gaVxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBnZXRTdHlsZTogZnVuY3Rpb24oaSkge1xuICAgICAgICByZXR1cm4gYXNzaWduKFxuICAgICAgICAgICAgdGhpcy5nZXRTaGFycFN0eWxlKGkpLFxuICAgICAgICAgICAgdGhpcy5nZXRBbmltYXRpb25TdHlsZShpKSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJyxcblx0XHRcdFx0Ym9yZGVyOiAnMHB4IHNvbGlkIHRyYW5zcGFyZW50JyAvLyBmaXggZmlyZWZveC9jaHJvbWUvb3BlcmEgcmVuZGVyaW5nXG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSAge0Jvb2xlYW59IGxvYWRpbmdcbiAgICAgKiBAcmV0dXJuIHtSZWFjdENvbXBvbmVudCB8fCBudWxsfVxuICAgICAqL1xuICAgIHJlbmRlckxvYWRlcjogZnVuY3Rpb24obG9hZGluZykge1xuICAgICAgICBpZiAobG9hZGluZykge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8ZGl2IGlkPXt0aGlzLnByb3BzLmlkfSBjbGFzc05hbWU9e3RoaXMucHJvcHMuY2xhc3NOYW1lfT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17dGhpcy5nZXRTdHlsZSgpfT48L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlckxvYWRlcih0aGlzLnByb3BzLmxvYWRpbmcpO1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IExvYWRlcjtcbiJdfQ==
},{"domkit/appendVendorPrefix":1,"domkit/insertKeyframesRule":5,"react":undefined}],21:[function(require,module,exports){
'use strict';

var React = require('react');
var assign = require('domkit/appendVendorPrefix');
var insertKeyframesRule = require('domkit/insertKeyframesRule');

/**
 * @type {Object}
 */
var keyframes = {
    '25%': {
        transform: 'rotateX(180deg) rotateY(0)'
    },
    '50%': {
        transform: 'rotateX(180deg) rotateY(180deg)'
    },
    '75%': {
        transform: 'rotateX(0) rotateY(180deg)'
    },
    '100%': {
        transform: 'rotateX(0) rotateY(0)'
    }
};

/**
 * @type {String}
 */
var animationName = insertKeyframesRule(keyframes);

var Loader = React.createClass({
    displayName: 'Loader',

    /**
     * @type {Object}
     */
    propTypes: {
        loading: React.PropTypes.bool,
        color: React.PropTypes.string,
        size: React.PropTypes.string,
        margin: React.PropTypes.string
    },

    /**
     * @return {Object}
     */
    getDefaultProps: function getDefaultProps() {
        return {
            loading: true,
            color: '#ffffff',
            size: '50px'
        };
    },

    /**
     * @return {Object}
     */
    getSquareStyle: function getSquareStyle() {
        return {
            backgroundColor: this.props.color,
            width: this.props.size,
            height: this.props.size,
            verticalAlign: this.props.verticalAlign
        };
    },

    /**
     * @param  {Number} i
     * @return {Object}
     */
    getAnimationStyle: function getAnimationStyle(i) {
        var animation = [animationName, '3s', '0s', 'infinite', 'cubic-bezier(.09,.57,.49,.9)'].join(' ');
        var animationFillMode = 'both';
        var perspective = '100px';

        return {
            perspective: perspective,
            animation: animation,
            animationFillMode: animationFillMode
        };
    },

    /**
     * @param  {Number} i
     * @return {Object}
     */
    getStyle: function getStyle(i) {
        return assign(this.getSquareStyle(i), this.getAnimationStyle(i), {
            display: 'inline-block',
            border: '0px solid transparent' // fix firefox/chrome/opera rendering
        });
    },

    /**
     * @param  {Boolean} loading
     * @return {ReactComponent || null}
     */
    renderLoader: function renderLoader(loading) {
        if (loading) {
            return React.createElement(
                'div',
                { id: this.props.id, className: this.props.className },
                React.createElement('div', { style: this.getStyle() })
            );
        }

        return null;
    },

    render: function render() {
        return this.renderLoader(this.props.loading);
    }
});

module.exports = Loader;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNxdWFyZUxvYWRlci5qcyJdLCJuYW1lcyI6WyJSZWFjdCIsInJlcXVpcmUiLCJhc3NpZ24iLCJpbnNlcnRLZXlmcmFtZXNSdWxlIiwia2V5ZnJhbWVzIiwidHJhbnNmb3JtIiwiYW5pbWF0aW9uTmFtZSIsIkxvYWRlciIsImNyZWF0ZUNsYXNzIiwicHJvcFR5cGVzIiwibG9hZGluZyIsIlByb3BUeXBlcyIsImJvb2wiLCJjb2xvciIsInN0cmluZyIsInNpemUiLCJtYXJnaW4iLCJnZXREZWZhdWx0UHJvcHMiLCJnZXRTcXVhcmVTdHlsZSIsImJhY2tncm91bmRDb2xvciIsInByb3BzIiwid2lkdGgiLCJoZWlnaHQiLCJ2ZXJ0aWNhbEFsaWduIiwiZ2V0QW5pbWF0aW9uU3R5bGUiLCJpIiwiYW5pbWF0aW9uIiwiam9pbiIsImFuaW1hdGlvbkZpbGxNb2RlIiwicGVyc3BlY3RpdmUiLCJnZXRTdHlsZSIsImRpc3BsYXkiLCJib3JkZXIiLCJyZW5kZXJMb2FkZXIiLCJpZCIsImNsYXNzTmFtZSIsInJlbmRlciIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEsUUFBUUMsUUFBUSxPQUFSLENBQVo7QUFDQSxJQUFJQyxTQUFTRCxRQUFRLDJCQUFSLENBQWI7QUFDQSxJQUFJRSxzQkFBc0JGLFFBQVEsNEJBQVIsQ0FBMUI7O0FBRUE7OztBQUdBLElBQUlHLFlBQVk7QUFDWixXQUFPO0FBQ0hDLG1CQUFXO0FBRFIsS0FESztBQUlaLFdBQU87QUFDSEEsbUJBQVc7QUFEUixLQUpLO0FBT1osV0FBTztBQUNIQSxtQkFBVztBQURSLEtBUEs7QUFVWixZQUFRO0FBQ0pBLG1CQUFXO0FBRFA7QUFWSSxDQUFoQjs7QUFlQTs7O0FBR0EsSUFBSUMsZ0JBQWdCSCxvQkFBb0JDLFNBQXBCLENBQXBCOztBQUVBLElBQUlHLFNBQVNQLE1BQU1RLFdBQU4sQ0FBa0I7QUFBQTs7QUFDM0I7OztBQUdBQyxlQUFXO0FBQ1BDLGlCQUFTVixNQUFNVyxTQUFOLENBQWdCQyxJQURsQjtBQUVQQyxlQUFPYixNQUFNVyxTQUFOLENBQWdCRyxNQUZoQjtBQUdQQyxjQUFNZixNQUFNVyxTQUFOLENBQWdCRyxNQUhmO0FBSVBFLGdCQUFRaEIsTUFBTVcsU0FBTixDQUFnQkc7QUFKakIsS0FKZ0I7O0FBVzNCOzs7QUFHQUcscUJBQWlCLDJCQUFXO0FBQ3hCLGVBQU87QUFDSFAscUJBQVMsSUFETjtBQUVIRyxtQkFBTyxTQUZKO0FBR0hFLGtCQUFNO0FBSEgsU0FBUDtBQUtILEtBcEIwQjs7QUFzQjNCOzs7QUFHQUcsb0JBQWdCLDBCQUFXO0FBQ3ZCLGVBQU87QUFDSEMsNkJBQWlCLEtBQUtDLEtBQUwsQ0FBV1AsS0FEekI7QUFFSFEsbUJBQU8sS0FBS0QsS0FBTCxDQUFXTCxJQUZmO0FBR0hPLG9CQUFRLEtBQUtGLEtBQUwsQ0FBV0wsSUFIaEI7QUFJSFEsMkJBQWUsS0FBS0gsS0FBTCxDQUFXRztBQUp2QixTQUFQO0FBTUgsS0FoQzBCOztBQWtDM0I7Ozs7QUFJQUMsdUJBQW1CLDJCQUFTQyxDQUFULEVBQVk7QUFDM0IsWUFBSUMsWUFBWSxDQUFDcEIsYUFBRCxFQUFnQixJQUFoQixFQUFzQixJQUF0QixFQUE0QixVQUE1QixFQUF3Qyw4QkFBeEMsRUFBd0VxQixJQUF4RSxDQUE2RSxHQUE3RSxDQUFoQjtBQUNBLFlBQUlDLG9CQUFvQixNQUF4QjtBQUNBLFlBQUlDLGNBQWMsT0FBbEI7O0FBRUEsZUFBTztBQUNIQSx5QkFBYUEsV0FEVjtBQUVISCx1QkFBV0EsU0FGUjtBQUdIRSwrQkFBbUJBO0FBSGhCLFNBQVA7QUFLSCxLQWhEMEI7O0FBa0QzQjs7OztBQUlBRSxjQUFVLGtCQUFTTCxDQUFULEVBQVk7QUFDbEIsZUFBT3ZCLE9BQ0gsS0FBS2dCLGNBQUwsQ0FBb0JPLENBQXBCLENBREcsRUFFSCxLQUFLRCxpQkFBTCxDQUF1QkMsQ0FBdkIsQ0FGRyxFQUdIO0FBQ0lNLHFCQUFTLGNBRGI7QUFFUkMsb0JBQVEsdUJBRkEsQ0FFd0I7QUFGeEIsU0FIRyxDQUFQO0FBUUgsS0EvRDBCOztBQWlFM0I7Ozs7QUFJQUMsa0JBQWMsc0JBQVN2QixPQUFULEVBQWtCO0FBQzVCLFlBQUlBLE9BQUosRUFBYTtBQUNULG1CQUNJO0FBQUE7QUFBQSxrQkFBSyxJQUFJLEtBQUtVLEtBQUwsQ0FBV2MsRUFBcEIsRUFBd0IsV0FBVyxLQUFLZCxLQUFMLENBQVdlLFNBQTlDO0FBQ0ksNkNBQUssT0FBTyxLQUFLTCxRQUFMLEVBQVo7QUFESixhQURKO0FBS0g7O0FBRUQsZUFBTyxJQUFQO0FBQ0gsS0EvRTBCOztBQWlGM0JNLFlBQVEsa0JBQVc7QUFDZixlQUFPLEtBQUtILFlBQUwsQ0FBa0IsS0FBS2IsS0FBTCxDQUFXVixPQUE3QixDQUFQO0FBQ0g7QUFuRjBCLENBQWxCLENBQWI7O0FBc0ZBMkIsT0FBT0MsT0FBUCxHQUFpQi9CLE1BQWpCIiwiZmlsZSI6IlNxdWFyZUxvYWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgYXNzaWduID0gcmVxdWlyZSgnZG9ta2l0L2FwcGVuZFZlbmRvclByZWZpeCcpO1xudmFyIGluc2VydEtleWZyYW1lc1J1bGUgPSByZXF1aXJlKCdkb21raXQvaW5zZXJ0S2V5ZnJhbWVzUnVsZScpO1xuXG4vKipcbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cbnZhciBrZXlmcmFtZXMgPSB7XG4gICAgJzI1JSc6IHtcbiAgICAgICAgdHJhbnNmb3JtOiAncm90YXRlWCgxODBkZWcpIHJvdGF0ZVkoMCknXG4gICAgfSxcbiAgICAnNTAlJzoge1xuICAgICAgICB0cmFuc2Zvcm06ICdyb3RhdGVYKDE4MGRlZykgcm90YXRlWSgxODBkZWcpJ1xuICAgIH0sXG4gICAgJzc1JSc6IHtcbiAgICAgICAgdHJhbnNmb3JtOiAncm90YXRlWCgwKSByb3RhdGVZKDE4MGRlZyknXG4gICAgfSxcbiAgICAnMTAwJSc6IHtcbiAgICAgICAgdHJhbnNmb3JtOiAncm90YXRlWCgwKSByb3RhdGVZKDApJ1xuICAgIH1cbn07XG5cbi8qKlxuICogQHR5cGUge1N0cmluZ31cbiAqL1xudmFyIGFuaW1hdGlvbk5hbWUgPSBpbnNlcnRLZXlmcmFtZXNSdWxlKGtleWZyYW1lcyk7XG5cbnZhciBMb2FkZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAgLyoqXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICBwcm9wVHlwZXM6IHtcbiAgICAgICAgbG9hZGluZzogUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG4gICAgICAgIGNvbG9yOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBzaXplOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBtYXJnaW46IFJlYWN0LlByb3BUeXBlcy5zdHJpbmdcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsb2FkaW5nOiB0cnVlLFxuICAgICAgICAgICAgY29sb3I6ICcjZmZmZmZmJyxcbiAgICAgICAgICAgIHNpemU6ICc1MHB4J1xuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgZ2V0U3F1YXJlU3R5bGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiB0aGlzLnByb3BzLmNvbG9yLFxuICAgICAgICAgICAgd2lkdGg6IHRoaXMucHJvcHMuc2l6ZSxcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5wcm9wcy5zaXplLFxuICAgICAgICAgICAgdmVydGljYWxBbGlnbjogdGhpcy5wcm9wcy52ZXJ0aWNhbEFsaWduXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSAge051bWJlcn0gaVxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBnZXRBbmltYXRpb25TdHlsZTogZnVuY3Rpb24oaSkge1xuICAgICAgICB2YXIgYW5pbWF0aW9uID0gW2FuaW1hdGlvbk5hbWUsICczcycsICcwcycsICdpbmZpbml0ZScsICdjdWJpYy1iZXppZXIoLjA5LC41NywuNDksLjkpJ10uam9pbignICcpO1xuICAgICAgICB2YXIgYW5pbWF0aW9uRmlsbE1vZGUgPSAnYm90aCc7XG4gICAgICAgIHZhciBwZXJzcGVjdGl2ZSA9ICcxMDBweCc7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHBlcnNwZWN0aXZlOiBwZXJzcGVjdGl2ZSxcbiAgICAgICAgICAgIGFuaW1hdGlvbjogYW5pbWF0aW9uLFxuICAgICAgICAgICAgYW5pbWF0aW9uRmlsbE1vZGU6IGFuaW1hdGlvbkZpbGxNb2RlXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSAge051bWJlcn0gaVxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBnZXRTdHlsZTogZnVuY3Rpb24oaSkge1xuICAgICAgICByZXR1cm4gYXNzaWduKFxuICAgICAgICAgICAgdGhpcy5nZXRTcXVhcmVTdHlsZShpKSxcbiAgICAgICAgICAgIHRoaXMuZ2V0QW5pbWF0aW9uU3R5bGUoaSksXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZGlzcGxheTogJ2lubGluZS1ibG9jaycsXG5cdFx0XHRcdGJvcmRlcjogJzBweCBzb2xpZCB0cmFuc3BhcmVudCcgLy8gZml4IGZpcmVmb3gvY2hyb21lL29wZXJhIHJlbmRlcmluZ1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gIHtCb29sZWFufSBsb2FkaW5nXG4gICAgICogQHJldHVybiB7UmVhY3RDb21wb25lbnQgfHwgbnVsbH1cbiAgICAgKi9cbiAgICByZW5kZXJMb2FkZXI6IGZ1bmN0aW9uKGxvYWRpbmcpIHtcbiAgICAgICAgaWYgKGxvYWRpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPGRpdiBpZD17dGhpcy5wcm9wcy5pZH0gY2xhc3NOYW1lPXt0aGlzLnByb3BzLmNsYXNzTmFtZX0+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RoaXMuZ2V0U3R5bGUoKX0+PC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlckxvYWRlcih0aGlzLnByb3BzLmxvYWRpbmcpO1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IExvYWRlcjtcbiJdfQ==
},{"domkit/appendVendorPrefix":1,"domkit/insertKeyframesRule":5,"react":undefined}],22:[function(require,module,exports){
'use strict';

var React = require('react');
var assign = require('domkit/appendVendorPrefix');
var insertKeyframesRule = require('domkit/insertKeyframesRule');

/**
 * @type {Object}
 */
var keyframes = {
    '33%': {
        transform: 'translateY(10px)'
    },
    '66%': {
        transform: 'translateY(-10px)'
    },
    '100%': {
        transform: 'translateY(0)'
    }
};

/**
 * @type {String}
 */
var animationName = insertKeyframesRule(keyframes);

var Loader = React.createClass({
    displayName: 'Loader',

    /**
     * @type {Object}
     */
    propTypes: {
        loading: React.PropTypes.bool,
        color: React.PropTypes.string,
        size: React.PropTypes.string,
        margin: React.PropTypes.string
    },

    /**
     * @return {Object}
     */
    getDefaultProps: function getDefaultProps() {
        return {
            loading: true,
            color: '#ffffff',
            size: '15px',
            margin: '2px'
        };
    },

    /**
     * @return {Object}
     */
    getBallStyle: function getBallStyle() {
        return {
            backgroundColor: this.props.color,
            width: this.props.size,
            height: this.props.size,
            margin: this.props.margin,
            borderRadius: '100%',
            verticalAlign: this.props.verticalAlign
        };
    },

    /**
     * @param  {Number} i
     * @return {Object}
     */
    getAnimationStyle: function getAnimationStyle(i) {
        var animation = [animationName, '0.6s', i * 0.07 + 's', 'infinite', 'ease-in-out'].join(' ');
        var animationFillMode = 'both';

        return {
            animation: animation,
            animationFillMode: animationFillMode
        };
    },

    /**
     * @param  {Number} i
     * @return {Object}
     */
    getStyle: function getStyle(i) {
        return assign(this.getBallStyle(i), this.getAnimationStyle(i), {
            display: 'inline-block',
            border: '0px solid transparent' // fix firefox/chrome/opera rendering
        });
    },

    /**
     * @param  {Boolean} loading
     * @return {ReactComponent || null}
     */
    renderLoader: function renderLoader(loading) {
        if (loading) {
            return React.createElement(
                'div',
                { id: this.props.id, className: this.props.className },
                React.createElement('div', { style: this.getStyle(1) }),
                React.createElement('div', { style: this.getStyle(2) }),
                React.createElement('div', { style: this.getStyle(3) })
            );
        };

        return null;
    },

    render: function render() {
        return this.renderLoader(this.props.loading);
    }
});

module.exports = Loader;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlN5bmNMb2FkZXIuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJyZXF1aXJlIiwiYXNzaWduIiwiaW5zZXJ0S2V5ZnJhbWVzUnVsZSIsImtleWZyYW1lcyIsInRyYW5zZm9ybSIsImFuaW1hdGlvbk5hbWUiLCJMb2FkZXIiLCJjcmVhdGVDbGFzcyIsInByb3BUeXBlcyIsImxvYWRpbmciLCJQcm9wVHlwZXMiLCJib29sIiwiY29sb3IiLCJzdHJpbmciLCJzaXplIiwibWFyZ2luIiwiZ2V0RGVmYXVsdFByb3BzIiwiZ2V0QmFsbFN0eWxlIiwiYmFja2dyb3VuZENvbG9yIiwicHJvcHMiLCJ3aWR0aCIsImhlaWdodCIsImJvcmRlclJhZGl1cyIsInZlcnRpY2FsQWxpZ24iLCJnZXRBbmltYXRpb25TdHlsZSIsImkiLCJhbmltYXRpb24iLCJqb2luIiwiYW5pbWF0aW9uRmlsbE1vZGUiLCJnZXRTdHlsZSIsImRpc3BsYXkiLCJib3JkZXIiLCJyZW5kZXJMb2FkZXIiLCJpZCIsImNsYXNzTmFtZSIsInJlbmRlciIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEsUUFBUUMsUUFBUSxPQUFSLENBQVo7QUFDQSxJQUFJQyxTQUFTRCxRQUFRLDJCQUFSLENBQWI7QUFDQSxJQUFJRSxzQkFBc0JGLFFBQVEsNEJBQVIsQ0FBMUI7O0FBRUE7OztBQUdBLElBQUlHLFlBQVk7QUFDWixXQUFPO0FBQ0hDLG1CQUFXO0FBRFIsS0FESztBQUlaLFdBQU87QUFDSEEsbUJBQVc7QUFEUixLQUpLO0FBT1osWUFBUTtBQUNKQSxtQkFBVztBQURQO0FBUEksQ0FBaEI7O0FBWUE7OztBQUdBLElBQUlDLGdCQUFnQkgsb0JBQW9CQyxTQUFwQixDQUFwQjs7QUFFQSxJQUFJRyxTQUFTUCxNQUFNUSxXQUFOLENBQWtCO0FBQUE7O0FBQzNCOzs7QUFHQUMsZUFBVztBQUNQQyxpQkFBU1YsTUFBTVcsU0FBTixDQUFnQkMsSUFEbEI7QUFFUEMsZUFBT2IsTUFBTVcsU0FBTixDQUFnQkcsTUFGaEI7QUFHUEMsY0FBTWYsTUFBTVcsU0FBTixDQUFnQkcsTUFIZjtBQUlQRSxnQkFBUWhCLE1BQU1XLFNBQU4sQ0FBZ0JHO0FBSmpCLEtBSmdCOztBQVczQjs7O0FBR0FHLHFCQUFpQiwyQkFBVztBQUN4QixlQUFPO0FBQ0hQLHFCQUFTLElBRE47QUFFSEcsbUJBQU8sU0FGSjtBQUdIRSxrQkFBTSxNQUhIO0FBSUhDLG9CQUFRO0FBSkwsU0FBUDtBQU1ILEtBckIwQjs7QUF1QjNCOzs7QUFHQUUsa0JBQWMsd0JBQVc7QUFDckIsZUFBTztBQUNIQyw2QkFBaUIsS0FBS0MsS0FBTCxDQUFXUCxLQUR6QjtBQUVIUSxtQkFBTyxLQUFLRCxLQUFMLENBQVdMLElBRmY7QUFHSE8sb0JBQVEsS0FBS0YsS0FBTCxDQUFXTCxJQUhoQjtBQUlIQyxvQkFBUSxLQUFLSSxLQUFMLENBQVdKLE1BSmhCO0FBS0hPLDBCQUFjLE1BTFg7QUFNSEMsMkJBQWUsS0FBS0osS0FBTCxDQUFXSTtBQU52QixTQUFQO0FBUUgsS0FuQzBCOztBQXFDM0I7Ozs7QUFJQUMsdUJBQW1CLDJCQUFTQyxDQUFULEVBQVk7QUFDM0IsWUFBSUMsWUFBWSxDQUFDckIsYUFBRCxFQUFnQixNQUFoQixFQUF5Qm9CLElBQUksSUFBTCxHQUFhLEdBQXJDLEVBQTBDLFVBQTFDLEVBQXNELGFBQXRELEVBQXFFRSxJQUFyRSxDQUEwRSxHQUExRSxDQUFoQjtBQUNBLFlBQUlDLG9CQUFvQixNQUF4Qjs7QUFFQSxlQUFPO0FBQ0hGLHVCQUFXQSxTQURSO0FBRUhFLCtCQUFtQkE7QUFGaEIsU0FBUDtBQUlILEtBakQwQjs7QUFtRDNCOzs7O0FBSUFDLGNBQVUsa0JBQVNKLENBQVQsRUFBWTtBQUNsQixlQUFPeEIsT0FDSCxLQUFLZ0IsWUFBTCxDQUFrQlEsQ0FBbEIsQ0FERyxFQUVILEtBQUtELGlCQUFMLENBQXVCQyxDQUF2QixDQUZHLEVBR0g7QUFDSUsscUJBQVMsY0FEYjtBQUVSQyxvQkFBUSx1QkFGQSxDQUV3QjtBQUZ4QixTQUhHLENBQVA7QUFRSCxLQWhFMEI7O0FBa0UzQjs7OztBQUlBQyxrQkFBYyxzQkFBU3ZCLE9BQVQsRUFBa0I7QUFDNUIsWUFBSUEsT0FBSixFQUFhO0FBQ1QsbUJBQ0k7QUFBQTtBQUFBLGtCQUFLLElBQUksS0FBS1UsS0FBTCxDQUFXYyxFQUFwQixFQUF3QixXQUFXLEtBQUtkLEtBQUwsQ0FBV2UsU0FBOUM7QUFDSSw2Q0FBSyxPQUFPLEtBQUtMLFFBQUwsQ0FBYyxDQUFkLENBQVosR0FESjtBQUVJLDZDQUFLLE9BQU8sS0FBS0EsUUFBTCxDQUFjLENBQWQsQ0FBWixHQUZKO0FBR0ksNkNBQUssT0FBTyxLQUFLQSxRQUFMLENBQWMsQ0FBZCxDQUFaO0FBSEosYUFESjtBQU9IOztBQUVELGVBQU8sSUFBUDtBQUNILEtBbEYwQjs7QUFvRjNCTSxZQUFRLGtCQUFXO0FBQ2YsZUFBTyxLQUFLSCxZQUFMLENBQWtCLEtBQUtiLEtBQUwsQ0FBV1YsT0FBN0IsQ0FBUDtBQUNIO0FBdEYwQixDQUFsQixDQUFiOztBQXlGQTJCLE9BQU9DLE9BQVAsR0FBaUIvQixNQUFqQiIsImZpbGUiOiJTeW5jTG9hZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBhc3NpZ24gPSByZXF1aXJlKCdkb21raXQvYXBwZW5kVmVuZG9yUHJlZml4Jyk7XG52YXIgaW5zZXJ0S2V5ZnJhbWVzUnVsZSA9IHJlcXVpcmUoJ2RvbWtpdC9pbnNlcnRLZXlmcmFtZXNSdWxlJyk7XG5cbi8qKlxuICogQHR5cGUge09iamVjdH1cbiAqL1xudmFyIGtleWZyYW1lcyA9IHtcbiAgICAnMzMlJzoge1xuICAgICAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKDEwcHgpJ1xuICAgIH0sXG4gICAgJzY2JSc6IHtcbiAgICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlWSgtMTBweCknXG4gICAgfSxcbiAgICAnMTAwJSc6IHtcbiAgICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlWSgwKSdcbiAgICB9XG59O1xuXG4vKipcbiAqIEB0eXBlIHtTdHJpbmd9XG4gKi9cbnZhciBhbmltYXRpb25OYW1lID0gaW5zZXJ0S2V5ZnJhbWVzUnVsZShrZXlmcmFtZXMpO1xuXG52YXIgTG9hZGVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgIC8qKlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgcHJvcFR5cGVzOiB7XG4gICAgICAgIGxvYWRpbmc6IFJlYWN0LlByb3BUeXBlcy5ib29sLFxuICAgICAgICBjb2xvcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgc2l6ZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgbWFyZ2luOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbG9hZGluZzogdHJ1ZSxcbiAgICAgICAgICAgIGNvbG9yOiAnI2ZmZmZmZicsXG4gICAgICAgICAgICBzaXplOiAnMTVweCcsXG4gICAgICAgICAgICBtYXJnaW46ICcycHgnXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBnZXRCYWxsU3R5bGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiB0aGlzLnByb3BzLmNvbG9yLFxuICAgICAgICAgICAgd2lkdGg6IHRoaXMucHJvcHMuc2l6ZSxcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5wcm9wcy5zaXplLFxuICAgICAgICAgICAgbWFyZ2luOiB0aGlzLnByb3BzLm1hcmdpbixcbiAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzEwMCUnLFxuICAgICAgICAgICAgdmVydGljYWxBbGlnbjogdGhpcy5wcm9wcy52ZXJ0aWNhbEFsaWduXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSAge051bWJlcn0gaVxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBnZXRBbmltYXRpb25TdHlsZTogZnVuY3Rpb24oaSkge1xuICAgICAgICB2YXIgYW5pbWF0aW9uID0gW2FuaW1hdGlvbk5hbWUsICcwLjZzJywgKGkgKiAwLjA3KSArICdzJywgJ2luZmluaXRlJywgJ2Vhc2UtaW4tb3V0J10uam9pbignICcpO1xuICAgICAgICB2YXIgYW5pbWF0aW9uRmlsbE1vZGUgPSAnYm90aCc7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGFuaW1hdGlvbjogYW5pbWF0aW9uLFxuICAgICAgICAgICAgYW5pbWF0aW9uRmlsbE1vZGU6IGFuaW1hdGlvbkZpbGxNb2RlXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSAge051bWJlcn0gaVxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBnZXRTdHlsZTogZnVuY3Rpb24oaSkge1xuICAgICAgICByZXR1cm4gYXNzaWduKFxuICAgICAgICAgICAgdGhpcy5nZXRCYWxsU3R5bGUoaSksXG4gICAgICAgICAgICB0aGlzLmdldEFuaW1hdGlvblN0eWxlKGkpLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLFxuXHRcdFx0XHRib3JkZXI6ICcwcHggc29saWQgdHJhbnNwYXJlbnQnIC8vIGZpeCBmaXJlZm94L2Nocm9tZS9vcGVyYSByZW5kZXJpbmdcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtICB7Qm9vbGVhbn0gbG9hZGluZ1xuICAgICAqIEByZXR1cm4ge1JlYWN0Q29tcG9uZW50IHx8IG51bGx9XG4gICAgICovXG4gICAgcmVuZGVyTG9hZGVyOiBmdW5jdGlvbihsb2FkaW5nKSB7XG4gICAgICAgIGlmIChsb2FkaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxkaXYgaWQ9e3RoaXMucHJvcHMuaWR9IGNsYXNzTmFtZT17dGhpcy5wcm9wcy5jbGFzc05hbWV9PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt0aGlzLmdldFN0eWxlKDEpfT48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17dGhpcy5nZXRTdHlsZSgyKX0+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RoaXMuZ2V0U3R5bGUoMyl9PjwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyTG9hZGVyKHRoaXMucHJvcHMubG9hZGluZyk7XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gTG9hZGVyO1xuIl19
},{"domkit/appendVendorPrefix":1,"domkit/insertKeyframesRule":5,"react":undefined}],"halogenium":[function(require,module,exports){
'use strict';

module.exports = {
    PulseLoader: require('./PulseLoader'),
    RotateLoader: require('./RotateLoader'),
    BeatLoader: require('./BeatLoader'),
    RiseLoader: require('./RiseLoader'),
    SyncLoader: require('./SyncLoader'),
    GridLoader: require('./GridLoader'),
    ClipLoader: require('./ClipLoader'),
    SquareLoader: require('./SquareLoader'),
    DotLoader: require('./DotLoader'),
    PacmanLoader: require('./PacmanLoader'),
    MoonLoader: require('./MoonLoader'),
    RingLoader: require('./RingLoader'),
    BounceLoader: require('./BounceLoader'),
    SkewLoader: require('./SkewLoader'),
    FadeLoader: require('./FadeLoader'),
    ScaleLoader: require('./ScaleLoader')
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkhhbG9nZW5pdW0uanMiXSwibmFtZXMiOlsibW9kdWxlIiwiZXhwb3J0cyIsIlB1bHNlTG9hZGVyIiwicmVxdWlyZSIsIlJvdGF0ZUxvYWRlciIsIkJlYXRMb2FkZXIiLCJSaXNlTG9hZGVyIiwiU3luY0xvYWRlciIsIkdyaWRMb2FkZXIiLCJDbGlwTG9hZGVyIiwiU3F1YXJlTG9hZGVyIiwiRG90TG9hZGVyIiwiUGFjbWFuTG9hZGVyIiwiTW9vbkxvYWRlciIsIlJpbmdMb2FkZXIiLCJCb3VuY2VMb2FkZXIiLCJTa2V3TG9hZGVyIiwiRmFkZUxvYWRlciIsIlNjYWxlTG9hZGVyIl0sIm1hcHBpbmdzIjoiOztBQUFBQSxPQUFPQyxPQUFQLEdBQWlCO0FBQ2JDLGlCQUFhQyxRQUFRLGVBQVIsQ0FEQTtBQUViQyxrQkFBY0QsUUFBUSxnQkFBUixDQUZEO0FBR2JFLGdCQUFZRixRQUFRLGNBQVIsQ0FIQztBQUliRyxnQkFBWUgsUUFBUSxjQUFSLENBSkM7QUFLYkksZ0JBQVlKLFFBQVEsY0FBUixDQUxDO0FBTWJLLGdCQUFZTCxRQUFRLGNBQVIsQ0FOQztBQU9iTSxnQkFBWU4sUUFBUSxjQUFSLENBUEM7QUFRYk8sa0JBQWNQLFFBQVEsZ0JBQVIsQ0FSRDtBQVNiUSxlQUFXUixRQUFRLGFBQVIsQ0FURTtBQVViUyxrQkFBY1QsUUFBUSxnQkFBUixDQVZEO0FBV2JVLGdCQUFZVixRQUFRLGNBQVIsQ0FYQztBQVliVyxnQkFBWVgsUUFBUSxjQUFSLENBWkM7QUFhYlksa0JBQWNaLFFBQVEsZ0JBQVIsQ0FiRDtBQWNiYSxnQkFBWWIsUUFBUSxjQUFSLENBZEM7QUFlYmMsZ0JBQVlkLFFBQVEsY0FBUixDQWZDO0FBZ0JiZSxpQkFBYWYsUUFBUSxlQUFSO0FBaEJBLENBQWpCIiwiZmlsZSI6IkhhbG9nZW5pdW0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBQdWxzZUxvYWRlcjogcmVxdWlyZSgnLi9QdWxzZUxvYWRlcicpLFxuICAgIFJvdGF0ZUxvYWRlcjogcmVxdWlyZSgnLi9Sb3RhdGVMb2FkZXInKSxcbiAgICBCZWF0TG9hZGVyOiByZXF1aXJlKCcuL0JlYXRMb2FkZXInKSxcbiAgICBSaXNlTG9hZGVyOiByZXF1aXJlKCcuL1Jpc2VMb2FkZXInKSxcbiAgICBTeW5jTG9hZGVyOiByZXF1aXJlKCcuL1N5bmNMb2FkZXInKSxcbiAgICBHcmlkTG9hZGVyOiByZXF1aXJlKCcuL0dyaWRMb2FkZXInKSxcbiAgICBDbGlwTG9hZGVyOiByZXF1aXJlKCcuL0NsaXBMb2FkZXInKSxcbiAgICBTcXVhcmVMb2FkZXI6IHJlcXVpcmUoJy4vU3F1YXJlTG9hZGVyJyksXG4gICAgRG90TG9hZGVyOiByZXF1aXJlKCcuL0RvdExvYWRlcicpLFxuICAgIFBhY21hbkxvYWRlcjogcmVxdWlyZSgnLi9QYWNtYW5Mb2FkZXInKSxcbiAgICBNb29uTG9hZGVyOiByZXF1aXJlKCcuL01vb25Mb2FkZXInKSxcbiAgICBSaW5nTG9hZGVyOiByZXF1aXJlKCcuL1JpbmdMb2FkZXInKSxcbiAgICBCb3VuY2VMb2FkZXI6IHJlcXVpcmUoJy4vQm91bmNlTG9hZGVyJyksXG4gICAgU2tld0xvYWRlcjogcmVxdWlyZSgnLi9Ta2V3TG9hZGVyJyksXG4gICAgRmFkZUxvYWRlcjogcmVxdWlyZSgnLi9GYWRlTG9hZGVyJyksXG4gICAgU2NhbGVMb2FkZXI6IHJlcXVpcmUoJy4vU2NhbGVMb2FkZXInKVxufTtcbiJdfQ==
},{"./BeatLoader":7,"./BounceLoader":8,"./ClipLoader":9,"./DotLoader":10,"./FadeLoader":11,"./GridLoader":12,"./MoonLoader":13,"./PacmanLoader":14,"./PulseLoader":15,"./RingLoader":16,"./RiseLoader":17,"./RotateLoader":18,"./ScaleLoader":19,"./SkewLoader":20,"./SquareLoader":21,"./SyncLoader":22}]},{},[]);
