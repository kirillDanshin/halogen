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

var propTypes = {
    loading: React.PropTypes.bool,
    color: React.PropTypes.string,
    size: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
    margin: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string])
};

var ptKeys = Object.keys(propTypes);

var BeatLoader = React.createClass({
    displayName: 'BeatLoader',

    /**
     * @type {Object}
     */
    propTypes: propTypes,

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
            var props = Object.assign({}, this.props);

            if (propTypes && ptKeys) {
                var klen = ptKeys.length;
                for (var i = 0; i < klen; i++) {
                    delete props[ptKeys[i]];
                }
            }

            return React.createElement(
                'div',
                props,
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

module.exports = BeatLoader;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJlYXRMb2FkZXIuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJyZXF1aXJlIiwiYXNzaWduIiwiaW5zZXJ0S2V5ZnJhbWVzUnVsZSIsImtleWZyYW1lcyIsInRyYW5zZm9ybSIsIm9wYWNpdHkiLCJhbmltYXRpb25OYW1lIiwicHJvcFR5cGVzIiwibG9hZGluZyIsIlByb3BUeXBlcyIsImJvb2wiLCJjb2xvciIsInN0cmluZyIsInNpemUiLCJvbmVPZlR5cGUiLCJudW1iZXIiLCJtYXJnaW4iLCJwdEtleXMiLCJPYmplY3QiLCJrZXlzIiwiQmVhdExvYWRlciIsImNyZWF0ZUNsYXNzIiwiZ2V0RGVmYXVsdFByb3BzIiwiZ2V0QmFsbFN0eWxlIiwiYmFja2dyb3VuZENvbG9yIiwicHJvcHMiLCJ3aWR0aCIsImhlaWdodCIsImJvcmRlclJhZGl1cyIsInZlcnRpY2FsQWxpZ24iLCJnZXRBbmltYXRpb25TdHlsZSIsImkiLCJhbmltYXRpb24iLCJqb2luIiwiYW5pbWF0aW9uRmlsbE1vZGUiLCJnZXRTdHlsZSIsImRpc3BsYXkiLCJib3JkZXIiLCJyZW5kZXJMb2FkZXIiLCJrbGVuIiwibGVuZ3RoIiwicmVuZGVyIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJQSxRQUFRQyxRQUFRLE9BQVIsQ0FBWjtBQUNBLElBQUlDLFNBQVNELFFBQVEsMkJBQVIsQ0FBYjtBQUNBLElBQUlFLHNCQUFzQkYsUUFBUSw0QkFBUixDQUExQjs7QUFFQTs7O0FBR0EsSUFBSUcsWUFBWTtBQUNaLFdBQU87QUFDSEMsbUJBQVcsYUFEUjtBQUVIQyxpQkFBUztBQUZOLEtBREs7QUFLWixZQUFRO0FBQ0pELG1CQUFXLFVBRFA7QUFFSkMsaUJBQVM7QUFGTDtBQUxJLENBQWhCOztBQVdBLElBQUlDLGdCQUFnQkosb0JBQW9CQyxTQUFwQixDQUFwQjs7QUFFQSxJQUFJSSxZQUFZO0FBQ2ZDLGFBQVNULE1BQU1VLFNBQU4sQ0FBZ0JDLElBRFY7QUFFZkMsV0FB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LE9BQTdCLENBQVA7QUFDSDtBQTFGOEIsQ0FBbEIsQ0FBakI7O0FBNkZBa0MsT0FBT0MsT0FBUCxHQUFpQnZCLFVBQWpCIiwiZmlsZSI6IkJlYXRMb2FkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIGFzc2lnbiA9IHJlcXVpcmUoJ2RvbWtpdC9hcHBlbmRWZW5kb3JQcmVmaXgnKTtcbnZhciBpbnNlcnRLZXlmcmFtZXNSdWxlID0gcmVxdWlyZSgnZG9ta2l0L2luc2VydEtleWZyYW1lc1J1bGUnKTtcblxuLyoqXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG52YXIga2V5ZnJhbWVzID0ge1xuICAgICc1MCUnOiB7XG4gICAgICAgIHRyYW5zZm9ybTogJ3NjYWxlKDAuNzUpJyxcbiAgICAgICAgb3BhY2l0eTogMC4yXG4gICAgfSxcbiAgICAnMTAwJSc6IHtcbiAgICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoMSknLFxuICAgICAgICBvcGFjaXR5OiAxXG4gICAgfVxufTtcblxudmFyIGFuaW1hdGlvbk5hbWUgPSBpbnNlcnRLZXlmcmFtZXNSdWxlKGtleWZyYW1lcyk7XG5cbnZhciBwcm9wVHlwZXMgPSB7XG5cdGxvYWRpbmc6IFJlYWN0LlByb3BUeXBlcy5ib29sLFxuXHRjb2xvcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcblx0c2l6ZTogUmVhY3QuUHJvcFR5cGVzLm9uZU9mVHlwZShbUmVhY3QuUHJvcFR5cGVzLm51bWJlciwgUmVhY3QuUHJvcFR5cGVzLnN0cmluZ10pLFxuXHRtYXJnaW46IFJlYWN0LlByb3BUeXBlcy5vbmVPZlR5cGUoW1JlYWN0LlByb3BUeXBlcy5udW1iZXIsIFJlYWN0LlByb3BUeXBlcy5zdHJpbmddKSxcbn07XG5cbnZhciBwdEtleXMgPSBPYmplY3Qua2V5cyhwcm9wVHlwZXMpO1xuXG52YXIgQmVhdExvYWRlciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICAvKipcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHByb3BUeXBlczogcHJvcFR5cGVzLFxuXG4gICAgLyoqXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsb2FkaW5nOiB0cnVlLFxuICAgICAgICAgICAgY29sb3I6ICcjZmZmZmZmJyxcbiAgICAgICAgICAgIHNpemU6ICcxNXB4JyxcbiAgICAgICAgICAgIG1hcmdpbjogJzJweCdcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIGdldEJhbGxTdHlsZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHRoaXMucHJvcHMuY29sb3IsXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5wcm9wcy5zaXplLFxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnByb3BzLnNpemUsXG4gICAgICAgICAgICBtYXJnaW46IHRoaXMucHJvcHMubWFyZ2luLFxuICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnMTAwJScsXG4gICAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiB0aGlzLnByb3BzLnZlcnRpY2FsQWxpZ25cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gIHtOdW1iZXJ9IGlcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgZ2V0QW5pbWF0aW9uU3R5bGU6IGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgdmFyIGFuaW1hdGlvbiA9IFthbmltYXRpb25OYW1lLCAnMC43cycsIGklMj8gJzBzJzogJzAuMzVzJywgJ2luZmluaXRlJywgJ2xpbmVhciddLmpvaW4oJyAnKTtcbiAgICAgICAgdmFyIGFuaW1hdGlvbkZpbGxNb2RlID0gJ2JvdGgnO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBhbmltYXRpb246IGFuaW1hdGlvbixcbiAgICAgICAgICAgIGFuaW1hdGlvbkZpbGxNb2RlOiBhbmltYXRpb25GaWxsTW9kZVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSAge051bWJlcn0gaVxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBnZXRTdHlsZTogZnVuY3Rpb24oaSkge1xuICAgICAgICByZXR1cm4gYXNzaWduKFxuICAgICAgICAgICAgdGhpcy5nZXRCYWxsU3R5bGUoaSksXG4gICAgICAgICAgICB0aGlzLmdldEFuaW1hdGlvblN0eWxlKGkpLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLFxuXHRcdFx0XHRib3JkZXI6ICcwcHggc29saWQgdHJhbnNwYXJlbnQnIC8vIGZpeCBmaXJlZm94L2Nocm9tZS9vcGVyYSByZW5kZXJpbmdcbiAgICAgICAgICAgIH1cbiAgICAgICAgKVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gIHtCb29sZWFufSBsb2FkaW5nXG4gICAgICogQHJldHVybiB7UmVhY3RDb21wb25lbnQgfHwgbnVsbH1cbiAgICAgKi9cbiAgICByZW5kZXJMb2FkZXI6IGZ1bmN0aW9uKGxvYWRpbmcpIHtcbiAgICAgICAgaWYgKGxvYWRpbmcpIHtcblx0XHRcdHZhciBwcm9wcyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMucHJvcHMpO1xuXG5cdFx0XHRpZiAocHJvcFR5cGVzICYmIHB0S2V5cykge1xuXHRcdFx0XHR2YXIga2xlbiA9IHB0S2V5cy5sZW5ndGg7XG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwga2xlbjsgaSsrKSB7XG5cdFx0XHRcdFx0ZGVsZXRlIHByb3BzW3B0S2V5c1tpXV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuICAgICAgICAgICAgcmV0dXJuIChcblx0XHRcdFx0PGRpdiB7Li4ucHJvcHN9PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt0aGlzLmdldFN0eWxlKDEpfT48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17dGhpcy5nZXRTdHlsZSgyKX0+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RoaXMuZ2V0U3R5bGUoMyl9PjwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJMb2FkZXIodGhpcy5wcm9wcy5sb2FkaW5nKTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBCZWF0TG9hZGVyO1xuIl19
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

var propTypes = {
    loading: React.PropTypes.bool,
    color: React.PropTypes.string,
    size: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string])
};

var ptKeys = Object.keys(propTypes);

var BounceLoader = React.createClass({
    displayName: 'BounceLoader',

    /**
     * @type {Object}
     */
    propTypes: propTypes,

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
            var props = Object.assign({}, this.props);

            if (propTypes && ptKeys) {
                var klen = ptKeys.length;
                for (var i = 0; i < klen; i++) {
                    delete props[ptKeys[i]];
                }
            }

            return React.createElement(
                'div',
                props,
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

module.exports = BounceLoader;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJvdW5jZUxvYWRlci5qcyJdLCJuYW1lcyI6WyJSZWFjdCIsInJlcXVpcmUiLCJhc3NpZ24iLCJpbnNlcnRLZXlmcmFtZXNSdWxlIiwia2V5ZnJhbWVzIiwidHJhbnNmb3JtIiwiYW5pbWF0aW9uTmFtZSIsInByb3BUeXBlcyIsImxvYWRpbmciLCJQcm9wVHlwZXMiLCJib29sIiwiY29sb3IiLCJzdHJpbmciLCJzaXplIiwib25lT2ZUeXBlIiwibnVtYmVyIiwicHRLZXlzIiwiT2JqZWN0Iiwia2V5cyIsIkJvdW5jZUxvYWRlciIsImNyZWF0ZUNsYXNzIiwiZ2V0RGVmYXVsdFByb3BzIiwiZ2V0QmFsbFN0eWxlIiwiYmFja2dyb3VuZENvbG9yIiwicHJvcHMiLCJ3aWR0aCIsImhlaWdodCIsImJvcmRlclJhZGl1cyIsIm9wYWNpdHkiLCJwb3NpdGlvbiIsInRvcCIsImxlZnQiLCJ2ZXJ0aWNhbEFsaWduIiwiZ2V0QW5pbWF0aW9uU3R5bGUiLCJpIiwiYW5pbWF0aW9uIiwiam9pbiIsImFuaW1hdGlvbkZpbGxNb2RlIiwiZ2V0U3R5bGUiLCJib3JkZXIiLCJyZW5kZXJMb2FkZXIiLCJrbGVuIiwibGVuZ3RoIiwicmVuZGVyIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJQSxRQUFRQyxRQUFRLE9BQVIsQ0FBWjtBQUNBLElBQUlDLFNBQVNELFFBQVEsMkJBQVIsQ0FBYjtBQUNBLElBQUlFLHNCQUFzQkYsUUFBUSw0QkFBUixDQUExQjs7QUFFQTs7O0FBR0EsSUFBSUcsWUFBWTtBQUNaLGdCQUFZO0FBQ1JDLG1CQUFXO0FBREgsS0FEQTtBQUlaLFdBQU87QUFDSEEsbUJBQVc7QUFEUjtBQUpLLENBQWhCOztBQVNBOzs7QUFHQSxJQUFJQyxnQkFBZ0JILG9CQUFvQkMsU0FBcEIsQ0FBcEI7O0FBRUEsSUFBSUcsWUFBWTtBQUNmQyxhQUFTUixNQUFNUyxTQUFOLENBQWdCQyxJQURWO0FBRWZDLFdBQU9YLE1BQU1TLFNBQU4sQ0FB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S0FBS0gsWUFBTCxDQUFrQixLQUFLaEIsS0FBTCxDQUFXaEIsT0FBN0IsQ0FBUDtBQUNIO0FBdkdnQyxDQUFsQixDQUFuQjs7QUEwR0FvQyxPQUFPQyxPQUFQLEdBQWlCMUIsWUFBakIiLCJmaWxlIjoiQm91bmNlTG9hZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBhc3NpZ24gPSByZXF1aXJlKCdkb21raXQvYXBwZW5kVmVuZG9yUHJlZml4Jyk7XG52YXIgaW5zZXJ0S2V5ZnJhbWVzUnVsZSA9IHJlcXVpcmUoJ2RvbWtpdC9pbnNlcnRLZXlmcmFtZXNSdWxlJyk7XG5cbi8qKlxuICogQHR5cGUge09iamVjdH1cbiAqL1xudmFyIGtleWZyYW1lcyA9IHtcbiAgICAnMCUsIDEwMCUnOiB7XG4gICAgICAgIHRyYW5zZm9ybTogJ3NjYWxlKDApJ1xuICAgIH0sXG4gICAgJzUwJSc6IHtcbiAgICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoMS4wKSdcbiAgICB9XG59O1xuXG4vKipcbiAqIEB0eXBlIHtTdHJpbmd9XG4gKi9cbnZhciBhbmltYXRpb25OYW1lID0gaW5zZXJ0S2V5ZnJhbWVzUnVsZShrZXlmcmFtZXMpO1xuXG52YXIgcHJvcFR5cGVzID0ge1xuXHRsb2FkaW5nOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcblx0Y29sb3I6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdHNpemU6IFJlYWN0LlByb3BUeXBlcy5vbmVPZlR5cGUoW1JlYWN0LlByb3BUeXBlcy5udW1iZXIsIFJlYWN0LlByb3BUeXBlcy5zdHJpbmddKSxcbn07XG5cbnZhciBwdEtleXMgPSBPYmplY3Qua2V5cyhwcm9wVHlwZXMpO1xuXG52YXIgQm91bmNlTG9hZGVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgIC8qKlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgcHJvcFR5cGVzOiBwcm9wVHlwZXMsXG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGxvYWRpbmc6IHRydWUsXG4gICAgICAgICAgICBjb2xvcjogJyNmZmZmZmYnLFxuICAgICAgICAgICAgc2l6ZTogJzYwcHgnXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBnZXRCYWxsU3R5bGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiB0aGlzLnByb3BzLmNvbG9yLFxuICAgICAgICAgICAgd2lkdGg6IHRoaXMucHJvcHMuc2l6ZSxcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5wcm9wcy5zaXplLFxuICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnMTAwJScsXG4gICAgICAgICAgICBvcGFjaXR5OiAwLjYsXG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiB0aGlzLnByb3BzLnZlcnRpY2FsQWxpZ25cbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtICB7TnVtYmVyfSBpXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIGdldEFuaW1hdGlvblN0eWxlOiBmdW5jdGlvbihpKSB7XG4gICAgICAgIHZhciBhbmltYXRpb24gPSBbYW5pbWF0aW9uTmFtZSwgJzJzJywgaT09MT8gJzFzJzogJzBzJywgJ2luZmluaXRlJywgJ2Vhc2UtaW4tb3V0J10uam9pbignICcpO1xuICAgICAgICB2YXIgYW5pbWF0aW9uRmlsbE1vZGUgPSAnYm90aCc7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGFuaW1hdGlvbjogYW5pbWF0aW9uLFxuICAgICAgICAgICAgYW5pbWF0aW9uRmlsbE1vZGU6IGFuaW1hdGlvbkZpbGxNb2RlXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSAge051bWJlcn0gaVxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBnZXRTdHlsZTogZnVuY3Rpb24oaSkge1xuICAgICAgICBpZiAoaSkge1xuICAgICAgICAgICAgcmV0dXJuIGFzc2lnbihcbiAgICAgICAgICAgICAgICB0aGlzLmdldEJhbGxTdHlsZShpKSxcbiAgICAgICAgICAgICAgICB0aGlzLmdldEFuaW1hdGlvblN0eWxlKGkpLFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Ym9yZGVyOiAnMHB4IHNvbGlkIHRyYW5zcGFyZW50JyAvLyBmaXggZmlyZWZveC9jaHJvbWUvb3BlcmEgcmVuZGVyaW5nXG5cdFx0XHRcdH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYXNzaWduKFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLnByb3BzLnNpemUsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnByb3BzLnNpemUsXG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG5cdFx0XHRcdGJvcmRlcjogJzBweCBzb2xpZCB0cmFuc3BhcmVudCcgLy8gZml4IGZpcmVmb3gvY2hyb21lL29wZXJhIHJlbmRlcmluZ1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gIHtCb29sZWFufSBsb2FkaW5nXG4gICAgICogQHJldHVybiB7UmVhY3RDb21wb25lbnQgfHwgbnVsbH1cbiAgICAgKi9cbiAgICByZW5kZXJMb2FkZXI6IGZ1bmN0aW9uKGxvYWRpbmcpIHtcbiAgICAgICAgaWYgKGxvYWRpbmcpIHtcblx0XHRcdHZhciBwcm9wcyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMucHJvcHMpO1xuXG5cdFx0XHRpZiAocHJvcFR5cGVzICYmIHB0S2V5cykge1xuXHRcdFx0XHR2YXIga2xlbiA9IHB0S2V5cy5sZW5ndGg7XG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwga2xlbjsgaSsrKSB7XG5cdFx0XHRcdFx0ZGVsZXRlIHByb3BzW3B0S2V5c1tpXV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuICAgICAgICAgICAgcmV0dXJuIChcblx0XHRcdFx0PGRpdiB7Li4ucHJvcHN9PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt0aGlzLmdldFN0eWxlKCl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17dGhpcy5nZXRTdHlsZSgxKX0+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt0aGlzLmdldFN0eWxlKDIpfT48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlckxvYWRlcih0aGlzLnByb3BzLmxvYWRpbmcpO1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJvdW5jZUxvYWRlcjtcbiJdfQ==
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

var propTypes = {
    loading: React.PropTypes.bool,
    color: React.PropTypes.string,
    size: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string])
};

var ptKeys = Object.keys(propTypes);

var ClipLoader = React.createClass({
    displayName: 'ClipLoader',

    /**
     * @type {Object}
     */
    propTypes: propTypes,

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
        return assign({
            border: '0px solid transparent' // fix firefox/chrome/opera rendering
        }, this.getBallStyle(i), this.getAnimationStyle(i), {
            display: 'inline-block'
        });
    },

    /**
     * @param  {Boolean} loading
     * @return {ReactComponent || null}
     */
    renderLoader: function renderLoader(loading) {
        if (loading) {
            var props = Object.assign({}, this.props);

            if (propTypes && ptKeys) {
                var klen = ptKeys.length;
                for (var i = 0; i < klen; i++) {
                    delete props[ptKeys[i]];
                }
            }

            return React.createElement(
                'div',
                props,
                React.createElement('div', { style: this.getStyle() })
            );
        }

        return null;
    },

    render: function render() {
        return this.renderLoader(this.props.loading);
    }
});

module.exports = ClipLoader;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNsaXBMb2FkZXIuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJyZXF1aXJlIiwiYXNzaWduIiwiaW5zZXJ0S2V5ZnJhbWVzUnVsZSIsImtleWZyYW1lcyIsInRyYW5zZm9ybSIsImFuaW1hdGlvbk5hbWUiLCJwcm9wVHlwZXMiLCJsb2FkaW5nIiwiUHJvcFR5cGVzIiwiYm9vbCIsImNvbG9yIiwic3RyaW5nIiwic2l6ZSIsIm9uZU9mVHlwZSIsIm51bWJlciIsInB0S2V5cyIsIk9iamVjdCIsImtleXMiLCJDbGlwTG9hZGVyIiwiY3JlYXRlQ2xhc3MiLCJnZXREZWZhdWx0UHJvcHMiLCJnZXRCYWxsU3R5bGUiLCJ3aWR0aCIsInByb3BzIiwiaGVpZ2h0IiwiYm9yZGVyIiwiYm9yZGVyQ29sb3IiLCJib3JkZXJCb3R0b21Db2xvciIsImJvcmRlclJhZGl1cyIsImJhY2tncm91bmQiLCJ2ZXJ0aWNhbEFsaWduIiwiZ2V0QW5pbWF0aW9uU3R5bGUiLCJpIiwiYW5pbWF0aW9uIiwiam9pbiIsImFuaW1hdGlvbkZpbGxNb2RlIiwiZ2V0U3R5bGUiLCJkaXNwbGF5IiwicmVuZGVyTG9hZGVyIiwia2xlbiIsImxlbmd0aCIsInJlbmRlciIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEsUUFBUUMsUUFBUSxPQUFSLENBQVo7QUFDQSxJQUFJQyxTQUFTRCxRQUFRLDJCQUFSLENBQWI7QUFDQSxJQUFJRSxzQkFBc0JGLFFBQVEsNEJBQVIsQ0FBMUI7O0FBRUE7OztBQUdBLElBQUlHLFlBQVk7QUFDWixVQUFNO0FBQ0ZDLG1CQUFXO0FBRFQsS0FETTtBQUlaLFdBQU87QUFDSEEsbUJBQVc7QUFEUixLQUpLO0FBT1osWUFBUTtBQUNKQSxtQkFBVztBQURQO0FBUEksQ0FBaEI7O0FBWUE7OztBQUdBLElBQUlDLGdCQUFnQkgsb0JBQW9CQyxTQUFwQixDQUFwQjs7QUFFQSxJQUFJRyxZQUFZO0FBQ2ZDLGFBQVNSLE1BQU1TLFNBQU4sQ0FBZ0JDLElBRFY7QUFFZkMsV0FBT1gsTUFBTVMsU0FBTixDQUFnQkcsTUFGUjtBQUdmQyxVQUFNYixNQUFNUyxTQUFOLENBQWdCSyxTQUFoQixDQUEwQixDQUFDZCxNQUFNUyxTQUFOLENBQWdCTSxNQUFqQixFQUF5QmYsTUFBTVMsU0FBTixDQUFnQkcsTUFBekMsQ0FBMUI7QUFIUyxDQUFoQjs7QUFNQSxJQUFJSSxTQUFTQyxPQUFPQyxJQUFQLENBQVlYLFNBQVosQ0FBYjs7QUFFQSxJQUFJWSxhQUFhbkIsTUFBTW9CLFdBQU4sQ0FBa0I7QUFBQTs7QUFDL0I7OztBQUdBYixlQUFXQSxTQUpvQjs7QUFNL0I7OztBQUdBYyxxQkFBaUIsMkJBQVc7QUFDeEIsZUFBTztBQUNIYixxQkFBUyxJQUROO0FBRUhHLG1CQUFPLFNBRko7QUFHSEUsa0JBQU07QUFISCxTQUFQO0FBS0gsS0FmOEI7O0FBaUIvQjs7O0FBR0FTLGtCQUFjLHdCQUFXO0FBQ3JCLGVBQU87QUFDSEMsbUJBQU8sS0FBS0MsS0FBTCxDQUFXWCxJQURmO0FBRUhZLG9CQUFRLEtBQUtELEtBQUwsQ0FBV1gsSUFGaEI7QUFHSGEsb0JBQVEsV0FITDtBQUlIQyx5QkFBYSxLQUFLSCxLQUFMLENBQVdiLEtBSnJCO0FBS0hpQiwrQkFBbUIsYUFMaEI7QUFNSEMsMEJBQWMsTUFOWDtBQU9IQyx3QkFBWSx3QkFQVDtBQVFIQywyQkFBZSxLQUFLUCxLQUFMLENBQVdPO0FBUnZCLFNBQVA7QUFVSCxLQS9COEI7O0FBaUMvQjs7OztBQUlBQyx1QkFBbUIsMkJBQVNDLENBQVQsRUFBWTtBQUMzQixZQUFJQyxZQUFZLENBQUM1QixhQUFELEVBQWdCLE9BQWhCLEVBQXlCLElBQXpCLEVBQStCLFVBQS9CLEVBQTJDLFFBQTNDLEVBQXFENkIsSUFBckQsQ0FBMEQsR0FBMUQsQ0FBaEI7QUFDQSxZQUFJQyxvQkFBb0IsTUFBeEI7O0FBRUEsZUFBTztBQUNIRix1QkFBV0EsU0FEUjtBQUVIRSwrQkFBbUJBO0FBRmhCLFNBQVA7QUFJSCxLQTdDOEI7O0FBK0MvQjs7OztBQUlBQyxjQUFVLGtCQUFTSixDQUFULEVBQVk7QUFDbEIsZUFBTy9CLE9BQ1o7QUFDQ3dCLG9CQUFRLHVCQURULENBQ2lDO0FBRGpDLFNBRFksRUFJSCxLQUFLSixZQUFMLENBQWtCVyxDQUFsQixDQUpHLEVBS0gsS0FBS0QsaUJBQUwsQ0FBdUJDLENBQXZCLENBTEcsRUFNSDtBQUNJSyxxQkFBUztBQURiLFNBTkcsQ0FBUDtBQVVILEtBOUQ4Qjs7QUFnRS9COzs7O0FBSUFDLGtCQUFjLHNCQUFTL0IsT0FBVCxFQUFrQjtBQUM1QixZQUFJQSxPQUFKLEVBQWE7QUFDbEIsZ0JBQUlnQixRQUFRUCxPQUFPZixNQUFQLENBQWMsRUFBZCxFQUFrQixLQUFLc0IsS0FBdkIsQ0FBWjs7QUFFQSxnQkFBSWpCLGFBQWFTLE1BQWpCLEVBQXlCO0FBQ3hCLG9CQUFJd0IsT0FBT3hCLE9BQU95QixNQUFsQjtBQUNBLHFCQUFLLElBQUlSLElBQUksQ0FBYixFQUFnQkEsSUFBSU8sSUFBcEIsRUFBMEJQLEdBQTFCLEVBQStCO0FBQzlCLDJCQUFPVCxNQUFNUixPQUFPaUIsQ0FBUCxDQUFOLENBQVA7QUFDQTtBQUNEOztBQUVRLG1CQUNSO0FBQUE7QUFBU1QscUJBQVQ7QUFDZ0IsNkNBQUssT0FBTyxLQUFLYSxRQUFMLEVBQVo7QUFEaEIsYUFEUTtBQUtIOztBQUVELGVBQU8sSUFBUDtBQUNILEtBdkY4Qjs7QUF5Ri9CSyxZQUFRLGtCQUFXO0FBQ2YsZUFBTyxLQUFLSCxZQUFMLENBQWtCLEtBQUtmLEtBQUwsQ0FBV2hCLE9BQTdCLENBQVA7QUFDSDtBQTNGOEIsQ0FBbEIsQ0FBakI7O0FBOEZBbUMsT0FBT0MsT0FBUCxHQUFpQnpCLFVBQWpCIiwiZmlsZSI6IkNsaXBMb2FkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIGFzc2lnbiA9IHJlcXVpcmUoJ2RvbWtpdC9hcHBlbmRWZW5kb3JQcmVmaXgnKTtcbnZhciBpbnNlcnRLZXlmcmFtZXNSdWxlID0gcmVxdWlyZSgnZG9ta2l0L2luc2VydEtleWZyYW1lc1J1bGUnKTtcblxuLyoqXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG52YXIga2V5ZnJhbWVzID0ge1xuICAgICcwJSc6IHtcbiAgICAgICAgdHJhbnNmb3JtOiAncm90YXRlKDBkZWcpIHNjYWxlKDEpJ1xuICAgIH0sXG4gICAgJzUwJSc6IHtcbiAgICAgICAgdHJhbnNmb3JtOiAncm90YXRlKDE4MGRlZykgc2NhbGUoMC44KSdcbiAgICB9LFxuICAgICcxMDAlJzoge1xuICAgICAgICB0cmFuc2Zvcm06ICdyb3RhdGUoMzYwZGVnKSBzY2FsZSgxKSdcbiAgICB9XG59O1xuXG4vKipcbiAqIEB0eXBlIHtTdHJpbmd9XG4gKi9cbnZhciBhbmltYXRpb25OYW1lID0gaW5zZXJ0S2V5ZnJhbWVzUnVsZShrZXlmcmFtZXMpO1xuXG52YXIgcHJvcFR5cGVzID0ge1xuXHRsb2FkaW5nOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcblx0Y29sb3I6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdHNpemU6IFJlYWN0LlByb3BUeXBlcy5vbmVPZlR5cGUoW1JlYWN0LlByb3BUeXBlcy5udW1iZXIsIFJlYWN0LlByb3BUeXBlcy5zdHJpbmddKSxcbn07XG5cbnZhciBwdEtleXMgPSBPYmplY3Qua2V5cyhwcm9wVHlwZXMpO1xuXG52YXIgQ2xpcExvYWRlciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICAvKipcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHByb3BUeXBlczogcHJvcFR5cGVzLFxuXG4gICAgLyoqXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsb2FkaW5nOiB0cnVlLFxuICAgICAgICAgICAgY29sb3I6ICcjZmZmZmZmJyxcbiAgICAgICAgICAgIHNpemU6ICczNXB4J1xuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgZ2V0QmFsbFN0eWxlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLnByb3BzLnNpemUsXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMucHJvcHMuc2l6ZSxcbiAgICAgICAgICAgIGJvcmRlcjogJzJweCBzb2xpZCcsXG4gICAgICAgICAgICBib3JkZXJDb2xvcjogdGhpcy5wcm9wcy5jb2xvcixcbiAgICAgICAgICAgIGJvcmRlckJvdHRvbUNvbG9yOiAndHJhbnNwYXJlbnQnLFxuICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnMTAwJScsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAndHJhbnNwYXJlbnQgIWltcG9ydGFudCcsXG4gICAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiB0aGlzLnByb3BzLnZlcnRpY2FsQWxpZ25cbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtICB7TnVtYmVyfSBpXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIGdldEFuaW1hdGlvblN0eWxlOiBmdW5jdGlvbihpKSB7XG4gICAgICAgIHZhciBhbmltYXRpb24gPSBbYW5pbWF0aW9uTmFtZSwgJzAuNzVzJywgJzBzJywgJ2luZmluaXRlJywgJ2xpbmVhciddLmpvaW4oJyAnKTtcbiAgICAgICAgdmFyIGFuaW1hdGlvbkZpbGxNb2RlID0gJ2JvdGgnO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBhbmltYXRpb246IGFuaW1hdGlvbixcbiAgICAgICAgICAgIGFuaW1hdGlvbkZpbGxNb2RlOiBhbmltYXRpb25GaWxsTW9kZVxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gIHtOdW1iZXJ9IGlcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgZ2V0U3R5bGU6IGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgcmV0dXJuIGFzc2lnbihcblx0XHRcdHtcblx0XHRcdFx0Ym9yZGVyOiAnMHB4IHNvbGlkIHRyYW5zcGFyZW50JyAvLyBmaXggZmlyZWZveC9jaHJvbWUvb3BlcmEgcmVuZGVyaW5nXG5cdFx0XHR9LFxuICAgICAgICAgICAgdGhpcy5nZXRCYWxsU3R5bGUoaSksXG4gICAgICAgICAgICB0aGlzLmdldEFuaW1hdGlvblN0eWxlKGkpLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLFxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gIHtCb29sZWFufSBsb2FkaW5nXG4gICAgICogQHJldHVybiB7UmVhY3RDb21wb25lbnQgfHwgbnVsbH1cbiAgICAgKi9cbiAgICByZW5kZXJMb2FkZXI6IGZ1bmN0aW9uKGxvYWRpbmcpIHtcbiAgICAgICAgaWYgKGxvYWRpbmcpIHtcblx0XHRcdHZhciBwcm9wcyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMucHJvcHMpO1xuXG5cdFx0XHRpZiAocHJvcFR5cGVzICYmIHB0S2V5cykge1xuXHRcdFx0XHR2YXIga2xlbiA9IHB0S2V5cy5sZW5ndGg7XG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwga2xlbjsgaSsrKSB7XG5cdFx0XHRcdFx0ZGVsZXRlIHByb3BzW3B0S2V5c1tpXV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuICAgICAgICAgICAgcmV0dXJuIChcblx0XHRcdFx0PGRpdiB7Li4ucHJvcHN9PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt0aGlzLmdldFN0eWxlKCl9PjwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJMb2FkZXIodGhpcy5wcm9wcy5sb2FkaW5nKTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBDbGlwTG9hZGVyO1xuIl19
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

var propTypes = {
    loading: React.PropTypes.bool,
    color: React.PropTypes.string,
    size: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
    margin: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string])
};

var ptKeys = Object.keys(propTypes);

var DotLoader = React.createClass({
    displayName: 'DotLoader',

    /**
     * @type {Object}
     */
    propTypes: propTypes,

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
            var props = Object.assign({}, this.props);

            if (propTypes && ptKeys) {
                var klen = ptKeys.length;
                for (var i = 0; i < klen; i++) {
                    delete props[ptKeys[i]];
                }
            }

            return React.createElement(
                'div',
                props,
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

module.exports = DotLoader;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkRvdExvYWRlci5qcyJdLCJuYW1lcyI6WyJSZWFjdCIsInJlcXVpcmUiLCJhc3NpZ24iLCJpbnNlcnRLZXlmcmFtZXNSdWxlIiwicm90YXRlS2V5ZnJhbWVzIiwidHJhbnNmb3JtIiwiYm91bmNlS2V5ZnJhbWVzIiwicm90YXRlQW5pbWF0aW9uTmFtZSIsImJvdW5jZUFuaW1hdGlvbk5hbWUiLCJwcm9wVHlwZXMiLCJsb2FkaW5nIiwiUHJvcFR5cGVzIiwiYm9vbCIsImNvbG9yIiwic3RyaW5nIiwic2l6ZSIsIm9uZU9mVHlwZSIsIm51bWJlciIsIm1hcmdpbiIsInB0S2V5cyIsIk9iamVjdCIsImtleXMiLCJEb3RMb2FkZXIiLCJjcmVhdGVDbGFzcyIsImdldERlZmF1bHRQcm9wcyIsImdldEJhbGxTdHlsZSIsImJhY2tncm91bmRDb2xvciIsInByb3BzIiwid2lkdGgiLCJoZWlnaHQiLCJib3JkZXJSYWRpdXMiLCJ2ZXJ0aWNhbEFsaWduIiwiZ2V0QW5pbWF0aW9uU3R5bGUiLCJpIiwiYW5pbWF0aW9uIiwiam9pbiIsImFuaW1hdGlvbkZpbGxNb2RlIiwiZ2V0U3R5bGUiLCJwYXJzZUludCIsImJhbGxTaXplIiwicG9zaXRpb24iLCJ0b3AiLCJib3R0b20iLCJib3JkZXIiLCJyZW5kZXJMb2FkZXIiLCJrbGVuIiwibGVuZ3RoIiwicmVuZGVyIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJQSxRQUFRQyxRQUFRLE9BQVIsQ0FBWjtBQUNBLElBQUlDLFNBQVNELFFBQVEsMkJBQVIsQ0FBYjtBQUNBLElBQUlFLHNCQUFzQkYsUUFBUSw0QkFBUixDQUExQjs7QUFFQTs7O0FBR0EsSUFBSUcsa0JBQWtCO0FBQ2xCLFlBQVE7QUFDSkMsbUJBQVc7QUFEUDtBQURVLENBQXRCOztBQU1BOzs7QUFHQSxJQUFJQyxrQkFBa0I7QUFDbEIsZ0JBQVk7QUFDUkQsbUJBQVc7QUFESCxLQURNO0FBSWxCLFdBQU87QUFDSEEsbUJBQVc7QUFE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S3lCLEtBQXZCLENBQVo7O0FBRUEsZ0JBQUlsQixhQUFhVSxNQUFqQixFQUF5QjtBQUN4QixvQkFBSTBCLE9BQU8xQixPQUFPMkIsTUFBbEI7QUFDQSxxQkFBSyxJQUFJYixJQUFJLENBQWIsRUFBZ0JBLElBQUlZLElBQXBCLEVBQTBCWixHQUExQixFQUErQjtBQUM5QiwyQkFBT04sTUFBTVIsT0FBT2MsQ0FBUCxDQUFOLENBQVA7QUFDQTtBQUNEOztBQUVRLG1CQUNSO0FBQUE7QUFBU04scUJBQVQ7QUFDZ0I7QUFBQTtBQUFBLHNCQUFLLE9BQU8sS0FBS1UsUUFBTCxDQUFjLENBQWQsQ0FBWjtBQUNJLGlEQUFLLE9BQU8sS0FBS0EsUUFBTCxDQUFjLENBQWQsQ0FBWixHQURKO0FBRUksaURBQUssT0FBTyxLQUFLQSxRQUFMLENBQWMsQ0FBZCxDQUFaO0FBRko7QUFEaEIsYUFEUTtBQVFIOztBQUVELGVBQU8sSUFBUDtBQUNILEtBdkc2Qjs7QUF5RzlCVSxZQUFRLGtCQUFXO0FBQ2YsZUFBTyxLQUFLSCxZQUFMLENBQWtCLEtBQUtqQixLQUFMLENBQVdqQixPQUE3QixDQUFQO0FBQ0g7QUEzRzZCLENBQWxCLENBQWhCOztBQThHQXNDLE9BQU9DLE9BQVAsR0FBaUIzQixTQUFqQiIsImZpbGUiOiJEb3RMb2FkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIGFzc2lnbiA9IHJlcXVpcmUoJ2RvbWtpdC9hcHBlbmRWZW5kb3JQcmVmaXgnKTtcbnZhciBpbnNlcnRLZXlmcmFtZXNSdWxlID0gcmVxdWlyZSgnZG9ta2l0L2luc2VydEtleWZyYW1lc1J1bGUnKTtcblxuLyoqXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG52YXIgcm90YXRlS2V5ZnJhbWVzID0ge1xuICAgICcxMDAlJzoge1xuICAgICAgICB0cmFuc2Zvcm06ICdyb3RhdGUoMzYwZGVnKSdcbiAgICB9XG59O1xuXG4vKipcbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cbnZhciBib3VuY2VLZXlmcmFtZXMgPSB7XG4gICAgJzAlLCAxMDAlJzoge1xuICAgICAgICB0cmFuc2Zvcm06ICdzY2FsZSgwKSdcbiAgICB9LFxuICAgICc1MCUnOiB7XG4gICAgICAgIHRyYW5zZm9ybTogJ3NjYWxlKDEuMCknXG4gICAgfVxufTtcblxuLyoqXG4gKiBAdHlwZSB7U3RyaW5nfVxuICovXG52YXIgcm90YXRlQW5pbWF0aW9uTmFtZSA9IGluc2VydEtleWZyYW1lc1J1bGUocm90YXRlS2V5ZnJhbWVzKTtcblxuLyoqXG4gKiBAdHlwZSB7U3RyaW5nfVxuICovXG52YXIgYm91bmNlQW5pbWF0aW9uTmFtZSA9IGluc2VydEtleWZyYW1lc1J1bGUoYm91bmNlS2V5ZnJhbWVzKTtcblxudmFyIHByb3BUeXBlcyA9IHtcblx0bG9hZGluZzogUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG5cdGNvbG9yOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHRzaXplOiBSZWFjdC5Qcm9wVHlwZXMub25lT2ZUeXBlKFtSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLCBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXSksXG5cdG1hcmdpbjogUmVhY3QuUHJvcFR5cGVzLm9uZU9mVHlwZShbUmVhY3QuUHJvcFR5cGVzLm51bWJlciwgUmVhY3QuUHJvcFR5cGVzLnN0cmluZ10pLFxufTtcblxudmFyIHB0S2V5cyA9IE9iamVjdC5rZXlzKHByb3BUeXBlcyk7XG5cbnZhciBEb3RMb2FkZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAgLyoqXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICBwcm9wVHlwZXM6IHByb3BUeXBlcyxcblxuICAgIC8qKlxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbG9hZGluZzogdHJ1ZSxcbiAgICAgICAgICAgIGNvbG9yOiAnI2ZmZmZmZicsXG4gICAgICAgICAgICBzaXplOiAnNjBweCdcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtICB7U3RyaW5nfSBzaXplXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIGdldEJhbGxTdHlsZTogZnVuY3Rpb24oc2l6ZSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiB0aGlzLnByb3BzLmNvbG9yLFxuICAgICAgICAgICAgd2lkdGg6IHNpemUsXG4gICAgICAgICAgICBoZWlnaHQ6IHNpemUsXG4gICAgICAgICAgICBib3JkZXJSYWRpdXM6ICcxMDAlJyxcbiAgICAgICAgICAgIHZlcnRpY2FsQWxpZ246IHRoaXMucHJvcHMudmVydGljYWxBbGlnblxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gIHtOdW1iZXJ9IGlcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgZ2V0QW5pbWF0aW9uU3R5bGU6IGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgdmFyIGFuaW1hdGlvbiA9IFtpPT0wID8gcm90YXRlQW5pbWF0aW9uTmFtZSA6IGJvdW5jZUFuaW1hdGlvbk5hbWUsICcycycsIGk9PTI/ICctMXMnOiAnMHMnLCAnaW5maW5pdGUnLCAnbGluZWFyJ10uam9pbignICcpO1xuICAgICAgICB2YXIgYW5pbWF0aW9uRmlsbE1vZGUgPSAnZm9yd2FyZHMnO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBhbmltYXRpb246IGFuaW1hdGlvbixcbiAgICAgICAgICAgIGFuaW1hdGlvbkZpbGxNb2RlOiBhbmltYXRpb25GaWxsTW9kZVxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gIHtOdW1iZXJ9IGlcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgZ2V0U3R5bGU6IGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgdmFyIHNpemUgPSBwYXJzZUludCh0aGlzLnByb3BzLnNpemUpO1xuICAgICAgICB2YXIgYmFsbFNpemUgPSBzaXplLzI7XG5cbiAgICAgICAgaWYgKGkpIHtcbiAgICAgICAgICAgIHJldHVybiBhc3NpZ24oXG4gICAgICAgICAgICAgICAgdGhpcy5nZXRCYWxsU3R5bGUoYmFsbFNpemUpLFxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0QW5pbWF0aW9uU3R5bGUoaSksXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICAgICAgdG9wOiBpJTI/IDA6ICdhdXRvJyxcbiAgICAgICAgICAgICAgICAgICAgYm90dG9tOiBpJTI/ICdhdXRvJzogMCxcblx0XHRcdFx0XHRib3JkZXI6ICcwcHggc29saWQgdHJhbnNwYXJlbnQnIC8vIGZpeCBmaXJlZm94L2Nocm9tZS9vcGVyYSByZW5kZXJpbmdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFzc2lnbihcbiAgICAgICAgICAgIHRoaXMuZ2V0QW5pbWF0aW9uU3R5bGUoaSksXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IHNpemUsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBzaXplLFxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuXHRcdFx0XHRib3JkZXI6ICcwcHggc29saWQgdHJhbnNwYXJlbnQnIC8vIGZpeCBmaXJlZm94L2Nocm9tZS9vcGVyYSByZW5kZXJpbmdcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtICB7Qm9vbGVhbn0gbG9hZGluZ1xuICAgICAqIEByZXR1cm4ge1JlYWN0Q29tcG9uZW50IHx8IG51bGx9XG4gICAgICovXG4gICAgcmVuZGVyTG9hZGVyOiBmdW5jdGlvbihsb2FkaW5nKSB7XG4gICAgICAgIGlmIChsb2FkaW5nKSB7XG5cdFx0XHR2YXIgcHJvcHMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnByb3BzKTtcblxuXHRcdFx0aWYgKHByb3BUeXBlcyAmJiBwdEtleXMpIHtcblx0XHRcdFx0dmFyIGtsZW4gPSBwdEtleXMubGVuZ3RoO1xuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGtsZW47IGkrKykge1xuXHRcdFx0XHRcdGRlbGV0ZSBwcm9wc1twdEtleXNbaV1dO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cbiAgICAgICAgICAgIHJldHVybiAoXG5cdFx0XHRcdDxkaXYgey4uLnByb3BzfT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17dGhpcy5nZXRTdHlsZSgwKX0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt0aGlzLmdldFN0eWxlKDEpfT48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RoaXMuZ2V0U3R5bGUoMil9PjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyTG9hZGVyKHRoaXMucHJvcHMubG9hZGluZyk7XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gRG90TG9hZGVyO1xuIl19
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

var propTypes = {
    loading: React.PropTypes.bool,
    color: React.PropTypes.string,
    height: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
    width: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
    margin: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
    radius: React.PropTypes.string
};

var ptKeys = Object.keys(propTypes);

var FadeLoader = React.createClass({
    displayName: 'FadeLoader',

    /**
     * @type {Object}
     */
    propTypes: propTypes,

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
        var radius = 20;
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

            var props = Object.assign({}, this.props);

            if (propTypes && ptKeys) {
                var klen = ptKeys.length;
                for (var i = 0; i < klen; i++) {
                    delete props[ptKeys[i]];
                }
            }

            return React.createElement(
                'div',
                props,
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

module.exports = FadeLoader;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkZhZGVMb2FkZXIuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJyZXF1aXJlIiwiYXNzaWduIiwiaW5zZXJ0S2V5ZnJhbWVzUnVsZSIsImtleWZyYW1lcyIsIm9wYWNpdHkiLCJhbmltYXRpb25OYW1lIiwicHJvcFR5cGVzIiwibG9hZGluZyIsIlByb3BUeXBlcyIsImJvb2wiLCJjb2xvciIsInN0cmluZyIsImhlaWdodCIsIm9uZU9mVHlwZSIsIm51bWJlciIsIndpZHRoIiwibWFyZ2luIiwicmFkaXVzIiwicHRLZXlzIiwiT2JqZWN0Iiwia2V5cyIsIkZhZGVMb2FkZXIiLCJjcmVhdGVDbGFzcyIsImdldERlZmF1bHRQcm9wcyIsImdldExpbmVTdHlsZSIsImkiLCJiYWNrZ3JvdW5kQ29sb3IiLCJwcm9wcyIsImJvcmRlclJhZGl1cyIsInZlcnRpY2FsQWxpZ24iLCJnZXRBbmltYXRpb25TdHlsZSIsImFuaW1hdGlvbiIsImpvaW4iLCJhbmltYXRpb25GaWxsTW9kZSIsImdldFBvc1N0eWxlIiwicXVhcnRlciIsImxpbmVzIiwibDEiLCJ0b3AiLCJsZWZ0IiwibDIiLCJ0cmFuc2Zvcm0iLCJsMyIsImw0IiwibDUiLCJsNiIsImw3IiwibDgiLCJnZXRTdHlsZSIsInBvc2l0aW9uIiwiYm9yZGVyIiwicmVuZGVyTG9hZGVyIiwic3R5bGUiLCJmb250U2l6ZSIsImtsZW4iLCJsZW5ndGgiLCJyZW5kZXIiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUlBLFFBQVFDLFFBQVEsT0FBUixDQUFaO0FBQ0EsSUFBSUMsU0FBU0QsUUFBUSwyQkFBUixDQUFiO0FBQ0EsSUFBSUUsc0JBQXNCRixRQUFRLDRCQUFSLENBQTFCOztBQUVBOzs7QUFHQSxJQUFJRyxZQUFZO0FBQ1osV0FBTztBQUNIQyxpQkFBUztBQUROLEtBREs7QUFJWixZQUFRO0FBQ0pBLGlCQUFTO0FBREw7QUFKSSxDQUFoQjs7QUFTQTs7O0FBR0EsSUFBSUMsZ0JBQWdCSCxv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QUssT0FBT3lCLEtBQVo7QUFDSSxpREFBSyxPQUFPLEtBQUtKLFFBQUwsQ0FBYyxDQUFkLENBQVosR0FESjtBQUVJLGlEQUFLLE9BQU8sS0FBS0EsUUFBTCxDQUFjLENBQWQsQ0FBWixHQUZKO0FBR0ksaURBQUssT0FBTyxLQUFLQSxRQUFMLENBQWMsQ0FBZCxDQUFaLEdBSEo7QUFJSSxpREFBSyxPQUFPLEtBQUtBLFFBQUwsQ0FBYyxDQUFkLENBQVosR0FKSjtBQUtJLGlEQUFLLE9BQU8sS0FBS0EsUUFBTCxDQUFjLENBQWQsQ0FBWixHQUxKO0FBTUksaURBQUssT0FBTyxLQUFLQSxRQUFMLENBQWMsQ0FBZCxDQUFaLEdBTko7QUFPSSxpREFBSyxPQUFPLEtBQUtBLFFBQUwsQ0FBYyxDQUFkLENBQVosR0FQSjtBQVFJLGlEQUFLLE9BQU8sS0FBS0EsUUFBTCxDQUFjLENBQWQsQ0FBWjtBQVJKO0FBRGhCLGFBRFE7QUFjSDs7QUFFRCxlQUFPLElBQVA7QUFDSCxLQTFKOEI7O0FBNEovQlEsWUFBUSxrQkFBVztBQUNmLGVBQU8sS0FBS0wsWUFBTCxDQUFrQixLQUFLeEIsS0FBTCxDQUFXcEIsT0FBN0IsQ0FBUDtBQUNIO0FBOUo4QixDQUFsQixDQUFqQjs7QUFpS0FrRCxPQUFPQyxPQUFQLEdBQWlCckMsVUFBakIiLCJmaWxlIjoiRmFkZUxvYWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgYXNzaWduID0gcmVxdWlyZSgnZG9ta2l0L2FwcGVuZFZlbmRvclByZWZpeCcpO1xudmFyIGluc2VydEtleWZyYW1lc1J1bGUgPSByZXF1aXJlKCdkb21raXQvaW5zZXJ0S2V5ZnJhbWVzUnVsZScpO1xuXG4vKipcbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cbnZhciBrZXlmcmFtZXMgPSB7XG4gICAgJzUwJSc6IHtcbiAgICAgICAgb3BhY2l0eTogMC4zXG4gICAgfSxcbiAgICAnMTAwJSc6IHtcbiAgICAgICAgb3BhY2l0eTogMVxuICAgIH1cbn07XG5cbi8qKlxuICogQHR5cGUge1N0cmluZ31cbiAqL1xudmFyIGFuaW1hdGlvbk5hbWUgPSBpbnNlcnRLZXlmcmFtZXNSdWxlKGtleWZyYW1lcyk7XG5cbnZhciBwcm9wVHlwZXMgPSB7XG5cdGxvYWRpbmc6IFJlYWN0LlByb3BUeXBlcy5ib29sLFxuXHRjb2xvcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcblx0aGVpZ2h0OiBSZWFjdC5Qcm9wVHlwZXMub25lT2ZUeXBlKFtSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLCBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXSksXG5cdHdpZHRoOiBSZWFjdC5Qcm9wVHlwZXMub25lT2ZUeXBlKFtSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLCBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXSksXG5cdG1hcmdpbjogUmVhY3QuUHJvcFR5cGVzLm9uZU9mVHlwZShbUmVhY3QuUHJvcFR5cGVzLm51bWJlciwgUmVhY3QuUHJvcFR5cGVzLnN0cmluZ10pLFxuXHRyYWRpdXM6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmdcbn07XG5cbnZhciBwdEtleXMgPSBPYmplY3Qua2V5cyhwcm9wVHlwZXMpO1xuXG52YXIgRmFkZUxvYWRlciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICAvKipcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHByb3BUeXBlczogcHJvcFR5cGVzLFxuXG4gICAgLyoqXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsb2FkaW5nOiB0cnVlLFxuICAgICAgICAgICAgY29sb3I6ICcjZmZmZmZmJyxcbiAgICAgICAgICAgIGhlaWdodDogJzE1cHgnLFxuICAgICAgICAgICAgd2lkdGg6ICc1cHgnLFxuICAgICAgICAgICAgbWFyZ2luOiAnMnB4JyxcbiAgICAgICAgICAgIHJhZGl1czogJzJweCdcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtICB7TnVtYmVyfSBpXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIGdldExpbmVTdHlsZTogZnVuY3Rpb24oaSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiB0aGlzLnByb3BzLmNvbG9yLFxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnByb3BzLmhlaWdodCxcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLnByb3BzLndpZHRoLFxuICAgICAgICAgICAgbWFyZ2luOiB0aGlzLnByb3BzLm1hcmdpbixcbiAgICAgICAgICAgIGJvcmRlclJhZGl1czogdGhpcy5wcm9wcy5yYWRpdXMsXG4gICAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiB0aGlzLnByb3BzLnZlcnRpY2FsQWxpZ25cbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtICB7TnVtYmVyfSBpXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIGdldEFuaW1hdGlvblN0eWxlOiBmdW5jdGlvbihpKSB7XG4gICAgICAgIHZhciBhbmltYXRpb24gPSBbYW5pbWF0aW9uTmFtZSwgJzEuMnMnLCAoaSAqIDAuMTIpICsgJ3MnLCAnaW5maW5pdGUnLCAnZWFzZS1pbi1vdXQnXS5qb2luKCcgJyk7XG4gICAgICAgIHZhciBhbmltYXRpb25GaWxsTW9kZSA9ICdib3RoJztcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYW5pbWF0aW9uOiBhbmltYXRpb24sXG4gICAgICAgICAgICBhbmltYXRpb25GaWxsTW9kZTogYW5pbWF0aW9uRmlsbE1vZGVcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtICB7TnVtYmVyfSBpXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIGdldFBvc1N0eWxlOiBmdW5jdGlvbihpKSB7XG4gICAgICAgIHZhciByYWRpdXMgPSAyMDtcbiAgICAgICAgdmFyIHF1YXJ0ZXIgPSAocmFkaXVzIC8gMikgKyAocmFkaXVzIC8gNS41KTtcblxuICAgICAgICB2YXIgbGluZXMgPSB7XG4gICAgICAgICAgICBsMToge1xuICAgICAgICAgICAgICAgIHRvcDogcmFkaXVzLFxuICAgICAgICAgICAgICAgIGxlZnQ6IDBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBsMjoge1xuICAgICAgICAgICAgICAgIHRvcDogcXVhcnRlcixcbiAgICAgICAgICAgICAgICBsZWZ0OiBxdWFydGVyLFxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogJ3JvdGF0ZSgtNDVkZWcpJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGwzOiB7XG4gICAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICAgIGxlZnQ6IHJhZGl1cyxcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm06ICdyb3RhdGUoOTBkZWcpJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGw0OiB7XG4gICAgICAgICAgICAgICAgdG9wOiAtcXVhcnRlcixcbiAgICAgICAgICAgICAgICBsZWZ0OiBxdWFydGVyLFxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogJ3JvdGF0ZSg0NWRlZyknXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbDU6IHtcbiAgICAgICAgICAgICAgICB0b3A6IC1yYWRpdXMsXG4gICAgICAgICAgICAgICAgbGVmdDogMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGw2OiB7XG4gICAgICAgICAgICAgICAgdG9wOiAtcXVhcnRlcixcbiAgICAgICAgICAgICAgICBsZWZ0OiAtcXVhcnRlcixcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm06ICdyb3RhdGUoLTQ1ZGVnKSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBsNzoge1xuICAgICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgICBsZWZ0OiAtcmFkaXVzLFxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogJ3JvdGF0ZSg5MGRlZyknXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbDg6IHtcbiAgICAgICAgICAgICAgICB0b3A6IHF1YXJ0ZXIsXG4gICAgICAgICAgICAgICAgbGVmdDogLXF1YXJ0ZXIsXG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOiAncm90YXRlKDQ1ZGVnKSdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbGluZXNbJ2wnK2ldO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gIHtOdW1iZXJ9IGlcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgZ2V0U3R5bGU6IGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgcmV0dXJuIGFzc2lnbihcbiAgICAgICAgICAgIHRoaXMuZ2V0TGluZVN0eWxlKGkpLFxuICAgICAgICAgICAgdGhpcy5nZXRQb3NTdHlsZShpKSxcbiAgICAgICAgICAgIHRoaXMuZ2V0QW5pbWF0aW9uU3R5bGUoaSksXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG5cdFx0XHRcdGJvcmRlcjogJzBweCBzb2xpZCB0cmFuc3BhcmVudCcgLy8gZml4IGZpcmVmb3gvY2hyb21lL29wZXJhIHJlbmRlcmluZ1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gIHtCb29sZWFufSBsb2FkaW5nXG4gICAgICogQHJldHVybiB7UmVhY3RDb21wb25lbnQgfHwgbnVsbH1cbiAgICAgKi9cbiAgICByZW5kZXJMb2FkZXI6IGZ1bmN0aW9uKGxvYWRpbmcpIHtcbiAgICAgICAgaWYgKGxvYWRpbmcpIHtcbiAgICAgICAgICAgIHZhciBzdHlsZSA9IHtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogMFxuICAgICAgICAgICAgfTtcblxuXHRcdFx0dmFyIHByb3BzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5wcm9wcyk7XG5cblx0XHRcdGlmIChwcm9wVHlwZXMgJiYgcHRLZXlzKSB7XG5cdFx0XHRcdHZhciBrbGVuID0gcHRLZXlzLmxlbmd0aDtcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBrbGVuOyBpKyspIHtcblx0XHRcdFx0XHRkZWxldGUgcHJvcHNbcHRLZXlzW2ldXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG4gICAgICAgICAgICByZXR1cm4gKFxuXHRcdFx0XHQ8ZGl2IHsuLi5wcm9wc30+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3N0eWxlfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RoaXMuZ2V0U3R5bGUoMSl9PjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17dGhpcy5nZXRTdHlsZSgyKX0+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt0aGlzLmdldFN0eWxlKDMpfT48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RoaXMuZ2V0U3R5bGUoNCl9PjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17dGhpcy5nZXRTdHlsZSg1KX0+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt0aGlzLmdldFN0eWxlKDYpfT48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RoaXMuZ2V0U3R5bGUoNyl9PjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17dGhpcy5nZXRTdHlsZSg4KX0+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJMb2FkZXIodGhpcy5wcm9wcy5sb2FkaW5nKTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBGYWRlTG9hZGVyO1xuIl19
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

var propTypes = {
    loading: React.PropTypes.bool,
    color: React.PropTypes.string,
    size: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
    margin: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string])
};

var ptKeys = Object.keys(propTypes);

var GridLoader = React.createClass({
    displayName: 'GridLoader',

    /**
     * @type {Object}
     */
    propTypes: propTypes,

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

            var props = Object.assign({}, this.props);

            if (propTypes && ptKeys) {
                var klen = ptKeys.length;
                for (var i = 0; i < klen; i++) {
                    delete props[ptKeys[i]];
                }
            }

            return React.createElement(
                'div',
                props,
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

module.exports = GridLoader;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkdyaWRMb2FkZXIuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJyZXF1aXJlIiwiYXNzaWduIiwiaW5zZXJ0S2V5ZnJhbWVzUnVsZSIsImtleWZyYW1lcyIsInRyYW5zZm9ybSIsIm9wYWNpdHkiLCJhbmltYXRpb25OYW1lIiwicmFuZG9tIiwidG9wIiwiTWF0aCIsInByb3BUeXBlcyIsImxvYWRpbmciLCJQcm9wVHlwZXMiLCJib29sIiwiY29sb3IiLCJzdHJpbmciLCJzaXplIiwib25lT2ZUeXBlIiwibnVtYmVyIiwibWFyZ2luIiwicHRLZXlzIiwiT2JqZWN0Iiwia2V5cyIsIkdyaWRMb2FkZXIiLCJjcmVhdGVDbGFzcyIsImdldERlZmF1bHRQcm9wcyIsImdldEJhbGxTdHlsZSIsImJhY2tncm91bmRDb2xvciIsInByb3BzIiwid2lkdGgiLCJoZWlnaHQiLCJib3JkZXJSYWRpdXMiLCJ2ZXJ0aWNhbEFsaWduIiwiZ2V0QW5pbWF0aW9uU3R5bGUiLCJpIiwiYW5pbWF0aW9uRHVyYXRpb24iLCJhbmltYXRpb25EZWxheSIsImFuaW1hdGlvbiIsImpvaW4iLCJhbmltYXRpb25GaWxsTW9kZSIsImdldFN0eWxlIiwiZGlzcGxheSIsImJvcmRlciIsInJlbmRlckxvYWRlciIsInN0eWxlIiwicGFyc2VGbG9hdCIsImZvbnRTaXplIiwia2xlbiIsImxlbmd0aCIsInJlbmRlciIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEsUUFBUUMsUUFBUSxPQUFSLENBQVo7QUFDQSxJQUFJQyxTQUFTRCxRQUFRLDJCQUFSLENBQWI7QUFDQSxJQUFJRSxzQkFBc0JGLFFBQVEsNEJBQVIsQ0FBMUI7O0FBRUE7OztBQUdBLElBQUlHLFlBQVk7QUFDWixVQUFNO0FBQ0ZDLG1CQUFXO0FBRFQsS0FETTtBQUlaLFdBQU87QUFDSEEsbUJBQVcsWUFEUjtBQUVIQyxpQkFBUztBQUZOLEtBSks7QUFRWixZQUFRO0FBQ0pELG1CQUFXLFVBRFA7QUFFSkMs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dmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBhc3NpZ24gPSByZXF1aXJlKCdkb21raXQvYXBwZW5kVmVuZG9yUHJlZml4Jyk7XG52YXIgaW5zZXJ0S2V5ZnJhbWVzUnVsZSA9IHJlcXVpcmUoJ2RvbWtpdC9pbnNlcnRLZXlmcmFtZXNSdWxlJyk7XG5cbi8qKlxuICogQHR5cGUge09iamVjdH1cbiAqL1xudmFyIGtleWZyYW1lcyA9IHtcbiAgICAnMCUnOiB7XG4gICAgICAgIHRyYW5zZm9ybTogJ3NjYWxlKDEpJ1xuICAgIH0sXG4gICAgJzUwJSc6IHtcbiAgICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoMC41KScsXG4gICAgICAgIG9wYWNpdHk6IDAuN1xuICAgIH0sXG4gICAgJzEwMCUnOiB7XG4gICAgICAgIHRyYW5zZm9ybTogJ3NjYWxlKDEpJyxcbiAgICAgICAgb3BhY2l0eTogMVxuICAgIH1cbn07XG5cbi8qKlxuICogQHR5cGUge1N0cmluZ31cbiAqL1xudmFyIGFuaW1hdGlvbk5hbWUgPSBpbnNlcnRLZXlmcmFtZXNSdWxlKGtleWZyYW1lcyk7XG5cbi8qKlxuICogQHBhcmFtICB7TnVtYmVyfSB0b3BcbiAqIEByZXR1cm4ge051bWJlcn1cbiAqL1xuZnVuY3Rpb24gcmFuZG9tKHRvcCkge1xuICAgIHJldHVybiBNYXRoLnJhbmRvbSgpICogdG9wXG59XG5cbnZhciBwcm9wVHlwZXMgPSB7XG5cdGxvYWRpbmc6IFJlYWN0LlByb3BUeXBlcy5ib29sLFxuXHRjb2xvcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcblx0c2l6ZTogUmVhY3QuUHJvcFR5cGVzLm9uZU9mVHlwZShbUmVhY3QuUHJvcFR5cGVzLm51bWJlciwgUmVhY3QuUHJvcFR5cGVzLnN0cmluZ10pLFxuXHRtYXJnaW46IFJlYWN0LlByb3BUeXBlcy5vbmVPZlR5cGUoW1JlYWN0LlByb3BUeXBlcy5udW1iZXIsIFJlYWN0LlByb3BUeXBlcy5zdHJpbmddKSxcbn07XG5cbnZhciBwdEtleXMgPSBPYmplY3Qua2V5cyhwcm9wVHlwZXMpO1xuXG52YXIgR3JpZExvYWRlciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICAvKipcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHByb3BUeXBlczogcHJvcFR5cGVzLFxuXG4gICAgLyoqXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsb2FkaW5nOiB0cnVlLFxuICAgICAgICAgICAgY29sb3I6ICcjZmZmZmZmJyxcbiAgICAgICAgICAgIHNpemU6ICcxNXB4JyxcbiAgICAgICAgICAgIG1hcmdpbjogJzJweCdcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIGdldEJhbGxTdHlsZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHRoaXMucHJvcHMuY29sb3IsXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5wcm9wcy5zaXplLFxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnByb3BzLnNpemUsXG4gICAgICAgICAgICBtYXJnaW46IHRoaXMucHJvcHMubWFyZ2luLFxuICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnMTAwJScsXG4gICAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiB0aGlzLnByb3BzLnZlcnRpY2FsQWxpZ25cbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtICB7TnVtYmVyfSBpXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIGdldEFuaW1hdGlvblN0eWxlOiBmdW5jdGlvbihpKSB7XG4gICAgICAgIHZhciBhbmltYXRpb25EdXJhdGlvbiA9ICgocmFuZG9tKDEwMCkgLyAxMDApICsgMC42KSArICdzJztcbiAgICAgICAgdmFyIGFuaW1hdGlvbkRlbGF5ID0gKChyYW5kb20oMTAwKSAvIDEwMCkgLSAwLjIpICsgJ3MnO1xuXG4gICAgICAgIHZhciBhbmltYXRpb24gPSBbYW5pbWF0aW9uTmFtZSwgYW5pbWF0aW9uRHVyYXRpb24sIGFuaW1hdGlvbkRlbGF5LCAnaW5maW5pdGUnLCAnZWFzZSddLmpvaW4oJyAnKTtcbiAgICAgICAgdmFyIGFuaW1hdGlvbkZpbGxNb2RlID0gJ2JvdGgnO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBhbmltYXRpb246IGFuaW1hdGlvbixcbiAgICAgICAgICAgIGFuaW1hdGlvbkZpbGxNb2RlOiBhbmltYXRpb25GaWxsTW9kZVxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gIHtOdW1iZXJ9IGlcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgZ2V0U3R5bGU6IGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgcmV0dXJuIGFzc2lnbihcbiAgICAgICAgICAgIHRoaXMuZ2V0QmFsbFN0eWxlKGkpLFxuICAgICAgICAgICAgdGhpcy5nZXRBbmltYXRpb25TdHlsZShpKSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJyxcblx0XHRcdFx0Ym9yZGVyOiAnMHB4IHNvbGlkIHRyYW5zcGFyZW50JyAvLyBmaXggZmlyZWZveC9jaHJvbWUvb3BlcmEgcmVuZGVyaW5nXG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSAge0Jvb2xlYW59IGxvYWRpbmdcbiAgICAgKiBAcmV0dXJuIHtSZWFjdENvbXBvbmVudCB8fCBudWxsfVxuICAgICAqL1xuICAgIHJlbmRlckxvYWRlcjogZnVuY3Rpb24obG9hZGluZykge1xuICAgICAgICBpZiAobG9hZGluZykge1xuICAgICAgICAgICAgdmFyIHN0eWxlID0ge1xuICAgICAgICAgICAgICAgIHdpZHRoOiAocGFyc2VGbG9hdCh0aGlzLnByb3BzLnNpemUpICogMykgKyBwYXJzZUZsb2F0KHRoaXMucHJvcHMubWFyZ2luKSAqIDYsXG4gICAgICAgICAgICAgICAgZm9udFNpemU6IDBcbiAgICAgICAgICAgIH07XG5cblx0XHRcdHZhciBwcm9wcyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMucHJvcHMpO1xuXG5cdFx0XHRpZiAocHJvcFR5cGVzICYmIHB0S2V5cykge1xuXHRcdFx0XHR2YXIga2xlbiA9IHB0S2V5cy5sZW5ndGg7XG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwga2xlbjsgaSsrKSB7XG5cdFx0XHRcdFx0ZGVsZXRlIHByb3BzW3B0S2V5c1tpXV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuICAgICAgICAgICAgcmV0dXJuIChcblx0XHRcdFx0PGRpdiB7Li4ucHJvcHN9PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtzdHlsZX0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt0aGlzLmdldFN0eWxlKDEpfT48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RoaXMuZ2V0U3R5bGUoMil9PjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17dGhpcy5nZXRTdHlsZSgzKX0+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt0aGlzLmdldFN0eWxlKDQpfT48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RoaXMuZ2V0U3R5bGUoNSl9PjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17dGhpcy5nZXRTdHlsZSg2KX0+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt0aGlzLmdldFN0eWxlKDcpfT48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RoaXMuZ2V0U3R5bGUoOCl9PjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17dGhpcy5nZXRTdHlsZSg5KX0+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJMb2FkZXIodGhpcy5wcm9wcy5sb2FkaW5nKTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBHcmlkTG9hZGVyO1xuIl19
},{"domkit/appendVendorPrefix":1,"domkit/insertKeyframesRule":5,"react":undefined}],13:[function(require,module,exports){
'use strict';

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

var propTypes = {
    loading: React.PropTypes.bool,
    color: React.PropTypes.string,
    size: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
    margin: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string])
};

var ptKeys = Object.keys(propTypes);

var MoonLoader = React.createClass({
    displayName: 'MoonLoader',

    /**
     * @type {Object}
     */
    propTypes: propTypes,

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
            return assign({
                border: '0px solid transparent' // fix firefox/chrome/opera rendering
            }, this.getBallStyle(moonSize), this.getAnimationStyle(i), {
                backgroundColor: this.props.color,
                opacity: '0.8',
                position: 'absolute',
                top: size / 2 - moonSize / 2
            });
        } else if (i == 2) {
            return assign({
                border: '0px solid transparent' // fix firefox/chrome/opera rendering
            }, this.getBallStyle(size), {
                border: moonSize + 'px solid ' + this.props.color,
                opacity: 0.1
            });
        } else {
            return assign({
                border: '0px solid transparent' // fix firefox/chrome/opera rendering
            }, this.getAnimationStyle(i), {
                position: 'relative'
            });
        }
    },

    /**
     * @param  {Boolean} loading
     * @return {ReactComponent || null}
     */
    renderLoader: function renderLoader(loading) {
        if (loading) {
            var props = Object.assign({}, this.props);

            if (propTypes && ptKeys) {
                var klen = ptKeys.length;
                for (var i = 0; i < klen; i++) {
                    delete props[ptKeys[i]];
                }
            }

            return React.createElement(
                'div',
                props,
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

module.exports = MoonLoader;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1vb25Mb2FkZXIuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJyZXF1aXJlIiwiYXNzaWduIiwiaW5zZXJ0S2V5ZnJhbWVzUnVsZSIsImtleWZyYW1lcyIsInRyYW5zZm9ybSIsImFuaW1hdGlvbk5hbWUiLCJwcm9wVHlwZXMiLCJsb2FkaW5nIiwiUHJvcFR5cGVzIiwiYm9vbCIsImNvbG9yIiwic3RyaW5nIiwic2l6ZSIsIm9uZU9mVHlwZSIsIm51bWJlciIsIm1hcmdpbiIsInB0S2V5cyIsIk9iamVjdCIsImtleXMiLCJNb29uTG9hZGVyIiwiY3JlYXRlQ2xhc3MiLCJnZXREZWZhdWx0UHJvcHMiLCJnZXRCYWxsU3R5bGUiLCJ3aWR0aCIsImhlaWdodCIsImJvcmRlclJhZGl1cyIsInZlcnRpY2FsQWxpZ24iLCJwcm9wcyIsImdldEFuaW1hdGlvblN0eWxlIiwiaSIsImFuaW1hdGlvbiIsImpvaW4iLCJhbmltYXRpb25GaWxsTW9kZSIsImdldFN0eWxlIiwicGFyc2VJbnQiLCJtb29uU2l6ZSIsImJvcmRlciIsImJhY2tncm91bmRDb2xvciIsIm9wYWNpdHkiLCJwb3NpdGlvbiIsInRvcCIsInJlbmRlckxvYWRlciIsImtsZW4iLCJsZW5ndGgiLCJyZW5kZXIiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUlBLFFBQVFDLFFBQVEsT0FBUixDQUFaO0FBQ0EsSUFBSUMsU0FBU0QsUUFBUSwyQkFBUixDQUFiO0FBQ0EsSUFBSUUsc0JBQXNCRixRQUFRLDRCQUFSLENBQTFCOztBQUVBOzs7QUFHQSxJQUFJRyxZQUFZO0FBQ1osWUFBUTtBQUNKQyxtQkFBVztBQURQO0FBREksQ0FBaEI7O0FBTUE7OztBQUdBLElBQUlDLGdCQUFnQkgsb0JBQW9CQyxTQUFwQixDQUFwQjs7QUFFQSxJQUFJRyxZQUFZO0FBQ2ZDLGFBQVNSLE1BQU1TLFNBQU4sQ0FBZ0JDLElBRFY7QUFFZkMsV0FBT1gsTUFBTVMsU0FBTixDQUFnQkcsTUFGUjtBQUdm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MkIsTUFBbEI7QUFDQSxxQkFBSyxJQUFJZCxJQUFJLENBQWIsRUFBZ0JBLElBQUlhLElBQXBCLEVBQTBCYixHQUExQixFQUErQjtBQUM5QiwyQkFBT0YsTUFBTVgsT0FBT2EsQ0FBUCxDQUFOLENBQVA7QUFDQTtBQUNEOztBQUVRLG1CQUNSO0FBQUE7QUFBU0YscUJBQVQ7QUFDZ0I7QUFBQTtBQUFBLHNCQUFLLE9BQU8sS0FBS00sUUFBTCxDQUFjLENBQWQsQ0FBWjtBQUNJLGlEQUFLLE9BQU8sS0FBS0EsUUFBTCxDQUFjLENBQWQsQ0FBWixHQURKO0FBRUksaURBQUssT0FBTyxLQUFLQSxRQUFMLENBQWMsQ0FBZCxDQUFaO0FBRko7QUFEaEIsYUFEUTtBQVFIOztBQUVELGVBQU8sSUFBUDtBQUNILEtBcEg4Qjs7QUFzSC9CVyxZQUFRLGtCQUFXO0FBQ2YsZUFBTyxLQUFLSCxZQUFMLENBQWtCLEtBQUtkLEtBQUwsQ0FBV3BCLE9BQTdCLENBQVA7QUFDSDtBQXhIOEIsQ0FBbEIsQ0FBakI7O0FBMkhBc0MsT0FBT0MsT0FBUCxHQUFpQjNCLFVBQWpCIiwiZmlsZSI6Ik1vb25Mb2FkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIGFzc2lnbiA9IHJlcXVpcmUoJ2RvbWtpdC9hcHBlbmRWZW5kb3JQcmVmaXgnKTtcbnZhciBpbnNlcnRLZXlmcmFtZXNSdWxlID0gcmVxdWlyZSgnZG9ta2l0L2luc2VydEtleWZyYW1lc1J1bGUnKTtcblxuLyoqXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG52YXIga2V5ZnJhbWVzID0ge1xuICAgICcxMDAlJzoge1xuICAgICAgICB0cmFuc2Zvcm06ICdyb3RhdGUoMzYwZGVnKSdcbiAgICB9XG59O1xuXG4vKipcbiAqIEB0eXBlIHtTdHJpbmd9XG4gKi9cbnZhciBhbmltYXRpb25OYW1lID0gaW5zZXJ0S2V5ZnJhbWVzUnVsZShrZXlmcmFtZXMpO1xuXG52YXIgcHJvcFR5cGVzID0ge1xuXHRsb2FkaW5nOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcblx0Y29sb3I6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdHNpemU6IFJlYWN0LlByb3BUeXBlcy5vbmVPZlR5cGUoW1JlYWN0LlByb3BUeXBlcy5udW1iZXIsIFJlYWN0LlByb3BUeXBlcy5zdHJpbmddKSxcblx0bWFyZ2luOiBSZWFjdC5Qcm9wVHlwZXMub25lT2ZUeXBlKFtSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLCBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXSksXG59O1xuXG52YXIgcHRLZXlzID0gT2JqZWN0LmtleXMocHJvcFR5cGVzKTtcblxudmFyIE1vb25Mb2FkZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAgLyoqXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICBwcm9wVHlwZXM6IHByb3BUeXBlcyxcblxuICAgIC8qKlxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbG9hZGluZzogdHJ1ZSxcbiAgICAgICAgICAgIGNvbG9yOiAnI2ZmZmZmZicsXG4gICAgICAgICAgICBzaXplOiAnNjBweCdcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtICB7U3RyaW5nfSBzaXplXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIGdldEJhbGxTdHlsZTogZnVuY3Rpb24oc2l6ZSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgd2lkdGg6IHNpemUsXG4gICAgICAgICAgICBoZWlnaHQ6IHNpemUsXG4gICAgICAgICAgICBib3JkZXJSYWRpdXM6ICcxMDAlJyxcbiAgICAgICAgICAgIHZlcnRpY2FsQWxpZ246IHRoaXMucHJvcHMudmVydGljYWxBbGlnblxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gIHtOdW1iZXJ9IGlcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgZ2V0QW5pbWF0aW9uU3R5bGU6IGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgdmFyIGFuaW1hdGlvbiA9IFthbmltYXRpb25OYW1lLCAnMC42cycsICcwcycsICdpbmZpbml0ZScsICdsaW5lYXInXS5qb2luKCcgJyk7XG4gICAgICAgIHZhciBhbmltYXRpb25GaWxsTW9kZSA9ICdmb3J3YXJkcyc7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGFuaW1hdGlvbjogYW5pbWF0aW9uLFxuICAgICAgICAgICAgYW5pbWF0aW9uRmlsbE1vZGU6IGFuaW1hdGlvbkZpbGxNb2RlXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSAge051bWJlcn0gaVxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBnZXRTdHlsZTogZnVuY3Rpb24oaSkge1xuICAgICAgICB2YXIgc2l6ZSA9IHBhcnNlSW50KHRoaXMucHJvcHMuc2l6ZSk7XG4gICAgICAgIHZhciBtb29uU2l6ZSA9IHNpemUvNztcblxuICAgICAgICBpZiAoaSA9PSAxKSB7XG4gICAgICAgICAgICByZXR1cm4gYXNzaWduKFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Ym9yZGVyOiAnMHB4IHNvbGlkIHRyYW5zcGFyZW50JyAvLyBmaXggZmlyZWZveC9jaHJvbWUvb3BlcmEgcmVuZGVyaW5nXG5cdFx0XHRcdH0sXG4gICAgICAgICAgICAgICAgdGhpcy5nZXRCYWxsU3R5bGUobW9vblNpemUpLFxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0QW5pbWF0aW9uU3R5bGUoaSksXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHRoaXMucHJvcHMuY29sb3IsXG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6ICcwLjgnLFxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICAgICAgdG9wOiBzaXplLzIgLSBtb29uU2l6ZS8yLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSBpZiAoaSA9PSAyKSB7XG4gICAgICAgICAgICByZXR1cm4gYXNzaWduKFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Ym9yZGVyOiAnMHB4IHNvbGlkIHRyYW5zcGFyZW50JyAvLyBmaXggZmlyZWZveC9jaHJvbWUvb3BlcmEgcmVuZGVyaW5nXG5cdFx0XHRcdH0sXG4gICAgICAgICAgICAgICAgdGhpcy5nZXRCYWxsU3R5bGUoc2l6ZSksXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBib3JkZXI6IG1vb25TaXplICsncHggc29saWQgJyArIHRoaXMucHJvcHMuY29sb3IsXG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDAuMSxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGFzc2lnbihcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGJvcmRlcjogJzBweCBzb2xpZCB0cmFuc3BhcmVudCcgLy8gZml4IGZpcmVmb3gvY2hyb21lL29wZXJhIHJlbmRlcmluZ1xuXHRcdFx0XHR9LFxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0QW5pbWF0aW9uU3R5bGUoaSksXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSAge0Jvb2xlYW59IGxvYWRpbmdcbiAgICAgKiBAcmV0dXJuIHtSZWFjdENvbXBvbmVudCB8fCBudWxsfVxuICAgICAqL1xuICAgIHJlbmRlckxvYWRlcjogZnVuY3Rpb24obG9hZGluZykge1xuICAgICAgICBpZiAobG9hZGluZykge1xuXHRcdFx0dmFyIHByb3BzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5wcm9wcyk7XG5cblx0XHRcdGlmIChwcm9wVHlwZXMgJiYgcHRLZXlzKSB7XG5cdFx0XHRcdHZhciBrbGVuID0gcHRLZXlzLmxlbmd0aDtcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBrbGVuOyBpKyspIHtcblx0XHRcdFx0XHRkZWxldGUgcHJvcHNbcHRLZXlzW2ldXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG4gICAgICAgICAgICByZXR1cm4gKFxuXHRcdFx0XHQ8ZGl2IHsuLi5wcm9wc30+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RoaXMuZ2V0U3R5bGUoMCl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17dGhpcy5nZXRTdHlsZSgxKX0+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt0aGlzLmdldFN0eWxlKDIpfT48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlckxvYWRlcih0aGlzLnByb3BzLmxvYWRpbmcpO1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1vb25Mb2FkZXI7XG4iXX0=
},{"domkit/appendVendorPrefix":1,"domkit/insertKeyframesRule":5,"react":undefined}],14:[function(require,module,exports){
'use strict';

var React = require('react');
var assign = require('domkit/appendVendorPrefix');
var insertKeyframesRule = require('domkit/insertKeyframesRule');

/**
 * @type {Object}
 */
var animations = {};

var propTypes = {
    loading: React.PropTypes.bool,
    color: React.PropTypes.string,
    size: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
    margin: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string])
};

var ptKeys = Object.keys(propTypes);

var PacmanLoader = React.createClass({
    displayName: 'PacmanLoader',

    /**
     * @type {Object}
     */
    propTypes: propTypes,

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
            verticalAlign: this.props.verticalAlign,
            border: '0px solid transparent' // fix firefox/chrome/opera rendering
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
                borderRadius: this.props.size
            };
        }

        return assign(this.getBallStyle(i), this.getAnimationStyle(i), {
            width: 10,
            height: 10,
            transform: 'translate(0, ' + -this.props.size / 4 + 'px)',
            position: 'absolute',
            top: 25,
            left: 100
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
            var props = Object.assign({}, this.props);

            if (propTypes && ptKeys) {
                var klen = ptKeys.length;
                for (var i = 0; i < klen; i++) {
                    delete props[ptKeys[i]];
                }
            }

            return React.createElement(
                'div',
                props,
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

module.exports = PacmanLoader;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBhY21hbkxvYWRlci5qcyJdLCJuYW1lcyI6WyJSZWFjdCIsInJlcXVpcmUiLCJhc3NpZ24iLCJpbnNlcnRLZXlmcmFtZXNSdWxlIiwiYW5pbWF0aW9ucyIsInByb3BUeXBlcyIsImxvYWRpbmciLCJQcm9wVHlwZXMiLCJib29sIiwiY29sb3IiLCJzdHJpbmciLCJzaXplIiwib25lT2ZUeXBlIiwibnVtYmVyIiwibWFyZ2luIiwicHRLZXlzIiwiT2JqZWN0Iiwia2V5cyIsIlBhY21hbkxvYWRlciIsImNyZWF0ZUNsYXNzIiwiZ2V0RGVmYXVsdFByb3BzIiwiZ2V0QmFsbFN0eWxlIiwiYmFja2dyb3VuZENvbG9yIiwicHJvcHMiLCJ3aWR0aCIsImhlaWdodCIsImJvcmRlclJhZGl1cyIsInZlcnRpY2FsQWxpZ24iLCJib3JkZXIiLCJnZXRBbmltYXRpb25TdHlsZSIsImkiLCJhbmltYXRpb25OYW1lIiwia2V5ZnJhbWVzIiwib3BhY2l0eSIsInRyYW5zZm9ybSIsImFuaW1hdGlvbiIsImpvaW4iLCJhbmltYXRpb25GaWxsTW9kZSIsImdldFN0eWxlIiwiczEiLCJzMiIsImJvcmRlclJpZ2h0IiwiYm9yZGVyVG9wIiwiYm9yZGVyTGVmdCIsImJvcmRlckJvdHRvbSIsInBvc2l0aW9uIiwidG9wIiwibGVmdCIsInJlbmRlckxvYWRlciIsInN0eWxlIiwiZm9udFNpemUiLCJrbGVuIiwibGVuZ3RoIiwicmVuZGVyIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJQSxRQUFRQyxRQUFRLE9BQVIsQ0FBWjtBQUNBLElBQUlDLFNBQVNELFFBQVEsMkJBQVIsQ0FBYjtBQUNBLElBQUlFLHNCQUFzQkYsUUFBUSw0QkFBUixDQUExQjs7QUFFQTs7O0FBR0EsSUFBSUcsYUFBYSxFQUFqQjs7QUFFQSxJQUFJQyxZQUFZO0FBQ2ZDLGFBQVNOLE1BQU1PLFNBQU4sQ0FBZ0JDLElBRFY7QUFFZkMsV0FBT1QsTUFBTU8sU0FBTixDQUFnQkcsTUFG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VztBQUNmLGVBQU8sS0FBS0wsWUFBTCxDQUFrQixLQUFLekIsS0FBTCxDQUFXakIsT0FBN0IsQ0FBUDtBQUNIO0FBcklnQyxDQUFsQixDQUFuQjs7QUF3SUFnRCxPQUFPQyxPQUFQLEdBQWlCckMsWUFBakIiLCJmaWxlIjoiUGFjbWFuTG9hZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBhc3NpZ24gPSByZXF1aXJlKCdkb21raXQvYXBwZW5kVmVuZG9yUHJlZml4Jyk7XG52YXIgaW5zZXJ0S2V5ZnJhbWVzUnVsZSA9IHJlcXVpcmUoJ2RvbWtpdC9pbnNlcnRLZXlmcmFtZXNSdWxlJyk7XG5cbi8qKlxuICogQHR5cGUge09iamVjdH1cbiAqL1xudmFyIGFuaW1hdGlvbnMgPSB7fTtcblxudmFyIHByb3BUeXBlcyA9IHtcblx0bG9hZGluZzogUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG5cdGNvbG9yOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuXHRzaXplOiBSZWFjdC5Qcm9wVHlwZXMub25lT2ZUeXBlKFtSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLCBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXSksXG5cdG1hcmdpbjogUmVhY3QuUHJvcFR5cGVzLm9uZU9mVHlwZShbUmVhY3QuUHJvcFR5cGVzLm51bWJlciwgUmVhY3QuUHJvcFR5cGVzLnN0cmluZ10pLFxufTtcblxudmFyIHB0S2V5cyA9IE9iamVjdC5rZXlzKHByb3BUeXBlcyk7XG5cbnZhciBQYWNtYW5Mb2FkZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAgLyoqXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICBwcm9wVHlwZXM6IHByb3BUeXBlcyxcblxuICAgIC8qKlxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbG9hZGluZzogdHJ1ZSxcbiAgICAgICAgICAgIGNvbG9yOiAnI2ZmZmZmZicsXG4gICAgICAgICAgICBzaXplOiAyNSxcbiAgICAgICAgICAgIG1hcmdpbjogMlxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgZ2V0QmFsbFN0eWxlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogdGhpcy5wcm9wcy5jb2xvcixcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLnByb3BzLnNpemUsXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMucHJvcHMuc2l6ZSxcbiAgICAgICAgICAgIG1hcmdpbjogdGhpcy5wcm9wcy5tYXJnaW4sXG4gICAgICAgICAgICBib3JkZXJSYWRpdXM6ICcxMDAlJyxcbiAgICAgICAgICAgIHZlcnRpY2FsQWxpZ246IHRoaXMucHJvcHMudmVydGljYWxBbGlnbixcblx0XHRcdGJvcmRlcjogJzBweCBzb2xpZCB0cmFuc3BhcmVudCcgLy8gZml4IGZpcmVmb3gvY2hyb21lL29wZXJhIHJlbmRlcmluZ1xuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gIHtOdW1iZXJ9IGlcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgZ2V0QW5pbWF0aW9uU3R5bGU6IGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgdmFyIHNpemUgPSB0aGlzLnByb3BzLnNpemU7XG4gICAgICAgIHZhciBhbmltYXRpb25OYW1lID0gYW5pbWF0aW9uc1tzaXplXTtcblxuICAgICAgICBpZiAoISBhbmltYXRpb25OYW1lKSB7XG4gICAgICAgICAgICB2YXIga2V5ZnJhbWVzID0ge1xuICAgICAgICAgICAgICAgICc3NSUnOiB7XG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDAuN1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJzEwMCUnOiB7XG4gICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZSgnICsgKC00ICogc2l6ZSkgKyAncHgsJyArICgtc2l6ZSAvIDQpICsgJ3B4KSdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgYW5pbWF0aW9uTmFtZSA9IGFuaW1hdGlvbnNbc2l6ZV0gPSBpbnNlcnRLZXlmcmFtZXNSdWxlKGtleWZyYW1lcyk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYW5pbWF0aW9uID0gW2FuaW1hdGlvbk5hbWUsICcxcycsIGkqMC4yNSArICdzJywgJ2luZmluaXRlJywgJ2xpbmVhciddLmpvaW4oJyAnKTtcbiAgICAgICAgdmFyIGFuaW1hdGlvbkZpbGxNb2RlID0gJ2JvdGgnO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBhbmltYXRpb246IGFuaW1hdGlvbixcbiAgICAgICAgICAgIGFuaW1hdGlvbkZpbGxNb2RlOiBhbmltYXRpb25GaWxsTW9kZVxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gIHtOdW1iZXJ9IGlcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgZ2V0U3R5bGU6IGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgaWYgKGkgPT0gMSkge1xuICAgICAgICAgICAgdmFyIHMxID0gIHRoaXMucHJvcHMuc2l6ZSArICdweCBzb2xpZCB0cmFuc3BhcmVudCc7XG4gICAgICAgICAgICB2YXIgczIgPSAgdGhpcy5wcm9wcy5zaXplICsgJ3B4IHNvbGlkICcgKyB0aGlzLnByb3BzLmNvbG9yO1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHdpZHRoOiAwLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMCxcbiAgICAgICAgICAgICAgICBib3JkZXJSaWdodDogczEsXG4gICAgICAgICAgICAgICAgYm9yZGVyVG9wOiBzMixcbiAgICAgICAgICAgICAgICBib3JkZXJMZWZ0OiBzMixcbiAgICAgICAgICAgICAgICBib3JkZXJCb3R0b206IHMyLFxuICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogdGhpcy5wcm9wcy5zaXplLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhc3NpZ24oXG4gICAgICAgICAgICB0aGlzLmdldEJhbGxTdHlsZShpKSxcbiAgICAgICAgICAgIHRoaXMuZ2V0QW5pbWF0aW9uU3R5bGUoaSksXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDEwLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMTAsXG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlKDAsICcrIC10aGlzLnByb3BzLnNpemUgLyA0ICsgJ3B4KScsXG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgdG9wOiAyNSxcbiAgICAgICAgICAgICAgICBsZWZ0OiAxMDAsXG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSAge0Jvb2xlYW59IGxvYWRpbmdcbiAgICAgKiBAcmV0dXJuIHtSZWFjdENvbXBvbmVudCB8fCBudWxsfVxuICAgICAqL1xuICAgIHJlbmRlckxvYWRlcjogZnVuY3Rpb24obG9hZGluZykge1xuICAgICAgICBpZiAobG9hZGluZykge1xuICAgICAgICAgICAgdmFyIHN0eWxlID0ge1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgICAgICAgIGZvbnRTaXplOiAwXG4gICAgICAgICAgICB9O1xuXHRcdFx0dmFyIHByb3BzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5wcm9wcyk7XG5cblx0XHRcdGlmIChwcm9wVHlwZXMgJiYgcHRLZXlzKSB7XG5cdFx0XHRcdHZhciBrbGVuID0gcHRLZXlzLmxlbmd0aDtcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBrbGVuOyBpKyspIHtcblx0XHRcdFx0XHRkZWxldGUgcHJvcHNbcHRLZXlzW2ldXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG4gICAgICAgICAgICByZXR1cm4gKFxuXHRcdFx0XHQ8ZGl2IHsuLi5wcm9wc30+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3N0eWxlfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RoaXMuZ2V0U3R5bGUoMSl9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RoaXMuZ2V0U3R5bGUoMil9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RoaXMuZ2V0U3R5bGUoMyl9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RoaXMuZ2V0U3R5bGUoNCl9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RoaXMuZ2V0U3R5bGUoNSl9Lz5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlckxvYWRlcih0aGlzLnByb3BzLmxvYWRpbmcpO1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBhY21hbkxvYWRlcjtcbiJdfQ==
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

var propTypes = {
    loading: React.PropTypes.bool,
    color: React.PropTypes.string,
    size: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
    margin: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string])
};

var ptKeys = Object.keys(propTypes);

var PulseLoader = React.createClass({
    displayName: 'PulseLoader',

    /**
     * @type {Object}
     */
    propTypes: propTypes,

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
            var props = Object.assign({}, this.props);

            if (propTypes && ptKeys) {
                var klen = ptKeys.length;
                for (var i = 0; i < klen; i++) {
                    delete props[ptKeys[i]];
                }
            }

            return React.createElement(
                'div',
                props,
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

module.exports = PulseLoader;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlB1bHNlTG9hZGVyLmpzIl0sIm5hbWVzIjpbIlJlYWN0IiwicmVxdWlyZSIsImFzc2lnbiIsImluc2VydEtleWZyYW1lc1J1bGUiLCJrZXlmcmFtZXMiLCJ0cmFuc2Zvcm0iLCJvcGFjaXR5IiwiYW5pbWF0aW9uTmFtZSIsInByb3BUeXBlcyIsImxvYWRpbmciLCJQcm9wVHlwZXMiLCJib29sIiwiY29sb3IiLCJzdHJpbmciLCJzaXplIiwib25lT2ZUeXBlIiwibnVtYmVyIiwibWFyZ2luIiwicHRLZXlzIiwiT2JqZWN0Iiwia2V5cyIsIlB1bHNlTG9hZGVyIiwiY3JlYXRlQ2xhc3MiLCJnZXREZWZhdWx0UHJvcHMiLCJnZXRCYWxsU3R5bGUiLCJiYWNrZ3JvdW5kQ29sb3IiLCJwcm9wcyIsIndpZHRoIiwiaGVpZ2h0IiwiYm9yZGVyUmFkaXVzIiwidmVydGljYWxBbGlnbiIsImdldEFuaW1hdGlvblN0eWxlIiwiaSIsImFuaW1hdGlvbiIsImpvaW4iLCJhbmltYXRpb25GaWxsTW9kZSIsImdldFN0eWxlIiwiZGlzcGxheSIsImJvcmRlciIsInJlbmRlckxvYWRlciIsImtsZW4iLCJsZW5ndGgiLCJyZW5kZXIiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUlBLFFBQVFDLFFBQVEsT0FBUixDQUFaO0FBQ0EsSUFBSUMsU0FBU0QsUUFBUSwyQkFBUixDQUFiO0FBQ0EsSUFBSUUsc0JBQXNCRixRQUFRLDRCQUFSLENBQTFCOztBQUVBOzs7QUFHQSxJQUFJRyxZQUFZO0FBQ1osVUFBTTtBQUNGQyxtQkFBVyxVQURUO0FBRUZDLGlCQUFTO0FBRlAsS0FETTtBQUtaLFdBQU87QUFDSEQsbUJBQVcsWUFEUjtBQUVIQyxpQkFBUztBQUZOLEtBTEs7QUFTWixXQUFPO0FBQ0hELG1CQUFXLFVBRFI7QUFFSEMsaUJBQVM7QUFGTjtBQVRLLENBQWhCOztBQWVBOzs7QUFHQSxJQUFJQyxnQkFBZ0JKLG9CQUFvQkMsU0FBcEIsQ0FBcEI7O0FB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QkFBVztBQUNmLGVBQU8sS0FBS0gsWUFBTCxDQUFrQixLQUFLYixLQUFMLENBQVdqQixPQUE3QixDQUFQO0FBQ0g7QUExRitCLENBQWxCLENBQWxCOztBQTZGQWtDLE9BQU9DLE9BQVAsR0FBaUJ2QixXQUFqQiIsImZpbGUiOiJQdWxzZUxvYWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgYXNzaWduID0gcmVxdWlyZSgnZG9ta2l0L2FwcGVuZFZlbmRvclByZWZpeCcpO1xudmFyIGluc2VydEtleWZyYW1lc1J1bGUgPSByZXF1aXJlKCdkb21raXQvaW5zZXJ0S2V5ZnJhbWVzUnVsZScpO1xuXG4vKipcbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cbnZhciBrZXlmcmFtZXMgPSB7XG4gICAgJzAlJzoge1xuICAgICAgICB0cmFuc2Zvcm06ICdzY2FsZSgxKScsXG4gICAgICAgIG9wYWNpdHk6IDFcbiAgICB9LFxuICAgICc0NSUnOiB7XG4gICAgICAgIHRyYW5zZm9ybTogJ3NjYWxlKDAuMSknLFxuICAgICAgICBvcGFjaXR5OiAwLjdcbiAgICB9LFxuICAgICc4MCUnOiB7XG4gICAgICAgIHRyYW5zZm9ybTogJ3NjYWxlKDEpJyxcbiAgICAgICAgb3BhY2l0eTogMVxuICAgIH1cbn07XG5cbi8qKlxuICogQHR5cGUge1N0cmluZ31cbiAqL1xudmFyIGFuaW1hdGlvbk5hbWUgPSBpbnNlcnRLZXlmcmFtZXNSdWxlKGtleWZyYW1lcyk7XG5cbnZhciBwcm9wVHlwZXMgPSB7XG5cdGxvYWRpbmc6IFJlYWN0LlByb3BUeXBlcy5ib29sLFxuXHRjb2xvcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcblx0c2l6ZTogUmVhY3QuUHJvcFR5cGVzLm9uZU9mVHlwZShbUmVhY3QuUHJvcFR5cGVzLm51bWJlciwgUmVhY3QuUHJvcFR5cGVzLnN0cmluZ10pLFxuXHRtYXJnaW46IFJlYWN0LlByb3BUeXBlcy5vbmVPZlR5cGUoW1JlYWN0LlByb3BUeXBlcy5udW1iZXIsIFJlYWN0LlByb3BUeXBlcy5zdHJpbmddKSxcbn07XG5cbnZhciBwdEtleXMgPSBPYmplY3Qua2V5cyhwcm9wVHlwZXMpO1xuXG52YXIgUHVsc2VMb2FkZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAgLyoqXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICBwcm9wVHlwZXM6IHByb3BUeXBlcyxcblxuICAgIC8qKlxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbG9hZGluZzogdHJ1ZSxcbiAgICAgICAgICAgIGNvbG9yOiAnI2ZmZmZmZicsXG4gICAgICAgICAgICBzaXplOiAnMTVweCcsXG4gICAgICAgICAgICBtYXJnaW46ICcycHgnXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBnZXRCYWxsU3R5bGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiB0aGlzLnByb3BzLmNvbG9yLFxuICAgICAgICAgICAgd2lkdGg6IHRoaXMucHJvcHMuc2l6ZSxcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5wcm9wcy5zaXplLFxuICAgICAgICAgICAgbWFyZ2luOiB0aGlzLnByb3BzLm1hcmdpbixcbiAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzEwMCUnLFxuICAgICAgICAgICAgdmVydGljYWxBbGlnbjogdGhpcy5wcm9wcy52ZXJ0aWNhbEFsaWduXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSAge051bWJlcn0gaVxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBnZXRBbmltYXRpb25TdHlsZTogZnVuY3Rpb24oaSkge1xuICAgICAgICB2YXIgYW5pbWF0aW9uID0gW2FuaW1hdGlvbk5hbWUsICcwLjc1cycsIChpICogMC4xMikgKyAncycsICdpbmZpbml0ZScsICdjdWJpYy1iZXppZXIoLjIsLjY4LC4xOCwxLjA4KSddLmpvaW4oJyAnKTtcbiAgICAgICAgdmFyIGFuaW1hdGlvbkZpbGxNb2RlID0gJ2JvdGgnO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBhbmltYXRpb246IGFuaW1hdGlvbixcbiAgICAgICAgICAgIGFuaW1hdGlvbkZpbGxNb2RlOiBhbmltYXRpb25GaWxsTW9kZVxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gIHtOdW1iZXJ9IGlcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgZ2V0U3R5bGU6IGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgcmV0dXJuIGFzc2lnbihcbiAgICAgICAgICAgIHRoaXMuZ2V0QmFsbFN0eWxlKGkpLFxuICAgICAgICAgICAgdGhpcy5nZXRBbmltYXRpb25TdHlsZShpKSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJyxcblx0XHRcdFx0Ym9yZGVyOiAnMHB4IHNvbGlkIHRyYW5zcGFyZW50JyAvLyBmaXggZmlyZWZveC9jaHJvbWUvb3BlcmEgcmVuZGVyaW5nXG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSAge0Jvb2xlYW59IGxvYWRpbmdcbiAgICAgKiBAcmV0dXJuIHtSZWFjdENvbXBvbmVudCB8fCBudWxsfVxuICAgICAqL1xuICAgIHJlbmRlckxvYWRlcjogZnVuY3Rpb24obG9hZGluZykge1xuICAgICAgICBpZiAobG9hZGluZykge1xuXHRcdFx0dmFyIHByb3BzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5wcm9wcyk7XG5cblx0XHRcdGlmIChwcm9wVHlwZXMgJiYgcHRLZXlzKSB7XG5cdFx0XHRcdHZhciBrbGVuID0gcHRLZXlzLmxlbmd0aDtcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBrbGVuOyBpKyspIHtcblx0XHRcdFx0XHRkZWxldGUgcHJvcHNbcHRLZXlzW2ldXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG4gICAgICAgICAgICByZXR1cm4gKFxuXHRcdFx0XHQ8ZGl2IHsuLi5wcm9wc30+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RoaXMuZ2V0U3R5bGUoMSl9PjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt0aGlzLmdldFN0eWxlKDIpfT48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17dGhpcy5nZXRTdHlsZSgzKX0+PC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlckxvYWRlcih0aGlzLnByb3BzLmxvYWRpbmcpO1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFB1bHNlTG9hZGVyO1xuIl19
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

var propTypes = {
    loading: React.PropTypes.bool,
    color: React.PropTypes.string,
    size: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
    margin: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string])
};

var ptKeys = Object.keys(propTypes);

var RingLoader = React.createClass({
    displayName: 'RingLoader',

    /**
     * @type {Object}
     */
    propTypes: propTypes,

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
            return assign({
                border: '0px solid transparent' // fix firefox/chrome/opera rendering
            }, this.getCircleStyle(size), this.getAnimationStyle(i), {
                position: 'absolute',
                top: 0,
                left: 0
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
            var props = Object.assign({}, this.props);

            if (propTypes && ptKeys) {
                var klen = ptKeys.length;
                for (var i = 0; i < klen; i++) {
                    delete props[ptKeys[i]];
                }
            }

            return React.createElement(
                'div',
                props,
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

module.exports = RingLoader;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlJpbmdMb2FkZXIuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJyZXF1aXJlIiwiYXNzaWduIiwiaW5zZXJ0S2V5ZnJhbWVzUnVsZSIsInJpZ2h0Um90YXRlS2V5ZnJhbWVzIiwidHJhbnNmb3JtIiwibGVmdFJvdGF0ZUtleWZyYW1lcyIsInJpZ2h0Um90YXRlQW5pbWF0aW9uTmFtZSIsImxlZnRSb3RhdGVBbmltYXRpb25OYW1lIiwicHJvcFR5cGVzIiwibG9hZGluZyIsIlByb3BUeXBlcyIsImJvb2wiLCJjb2xvciIsInN0cmluZyIsInNpemUiLCJvbmVPZlR5cGUiLCJudW1iZXIiLCJtYXJnaW4iLCJwdEtleXMiLCJPYmplY3QiLCJrZXlzIiwiUmluZ0xvYWRlciIsImNyZWF0ZUNsYXNzIiwiZ2V0RGVmYXVsdFByb3BzIiwiZ2V0Q2lyY2xlU3R5bGUiLCJ3aWR0aCIsImhlaWdodCIsImJvcmRlciIsInByb3BzIiwib3BhY2l0eSIsImJvcmRlclJhZGl1cyIsInZlcnRpY2FsQWxpZ24iLCJnZXRBbmltYXRpb25TdHlsZSIsImkiLCJhbmltYXRpb24iLCJqb2luIiwiYW5pbWF0aW9uRmlsbE1vZGUiLCJwZXJzcGVjdGl2ZSIsImdldFN0eWxlIiwicGFyc2VJbnQiLCJwb3NpdGlvbiIsInRvcCIsImxlZnQiLCJyZW5kZXJMb2FkZXIiLCJrbGVuIiwibGVuZ3RoIiwicmVuZGVyIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJQSxRQUFRQyxRQUFRLE9BQVIsQ0FBWjtBQUNBLElBQUlDLFNBQVNELFFBQVEsMkJBQVIsQ0FBYjtBQUNBLElBQUlFLHNCQUFzQkYsUUFBUSw0QkFBUixDQUExQjs7QUFFQTs7O0FBR0EsSUFBSUcsdUJBQXVCO0FBQ3ZCLFVBQU07QUFDRkMsbUJBQVc7O0FBRFQsS0FEaUI7QUFLdkIsWUFBUTtBQUNKQSxtQkFBVztBQURQO0FBTGUsQ0FBM0I7O0FBVUE7OztBQUdBLElBQUlDLHNCQUFzQjtBQUN0QixVQUFN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dkIsQ0FBWjs7QUFFQSxnQkFBSXBCLGFBQWFVLE1BQWpCLEVBQXlCO0FBQ3hCLG9CQUFJMEIsT0FBTzFCLE9BQU8yQixNQUFsQjtBQUNBLHFCQUFLLElBQUlaLElBQUksQ0FBYixFQUFnQkEsSUFBSVcsSUFBcEIsRUFBMEJYLEdBQTFCLEVBQStCO0FBQzlCLDJCQUFPTCxNQUFNVixPQUFPZSxDQUFQLENBQU4sQ0FBUDtBQUNBO0FBQ0Q7O0FBRVEsbUJBQ1I7QUFBQTtBQUFTTCxxQkFBVDtBQUNnQjtBQUFBO0FBQUEsc0JBQUssT0FBTyxLQUFLVSxRQUFMLENBQWMsQ0FBZCxDQUFaO0FBQ0ksaURBQUssT0FBTyxLQUFLQSxRQUFMLENBQWMsQ0FBZCxDQUFaLEdBREo7QUFFSSxpREFBSyxPQUFPLEtBQUtBLFFBQUwsQ0FBYyxDQUFkLENBQVo7QUFGSjtBQURoQixhQURRO0FBUUg7O0FBRUQsZUFBTyxJQUFQO0FBQ0gsS0F4RzhCOztBQTBHL0JRLFlBQVEsa0JBQVc7QUFDZixlQUFPLEtBQUtILFlBQUwsQ0FBa0IsS0FBS2YsS0FBTCxDQUFXbkIsT0FBN0IsQ0FBUDtBQUNIO0FBNUc4QixDQUFsQixDQUFqQjs7QUErR0FzQyxPQUFPQyxPQUFQLEdBQWlCM0IsVUFBakIiLCJmaWxlIjoiUmluZ0xvYWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgYXNzaWduID0gcmVxdWlyZSgnZG9ta2l0L2FwcGVuZFZlbmRvclByZWZpeCcpO1xudmFyIGluc2VydEtleWZyYW1lc1J1bGUgPSByZXF1aXJlKCdkb21raXQvaW5zZXJ0S2V5ZnJhbWVzUnVsZScpO1xuXG4vKipcbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cbnZhciByaWdodFJvdGF0ZUtleWZyYW1lcyA9IHtcbiAgICAnMCUnOiB7XG4gICAgICAgIHRyYW5zZm9ybTogJ3JvdGF0ZVgoMGRlZykgcm90YXRlWSgwZGVnKSByb3RhdGVaKDBkZWcpJ1xuXG4gICAgfSxcbiAgICAnMTAwJSc6IHtcbiAgICAgICAgdHJhbnNmb3JtOiAncm90YXRlWCgxODBkZWcpIHJvdGF0ZVkoMzYwZGVnKSByb3RhdGVaKDM2MGRlZyknXG4gICAgfVxufTtcblxuLyoqXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG52YXIgbGVmdFJvdGF0ZUtleWZyYW1lcyA9IHtcbiAgICAnMCUnOiB7XG4gICAgICAgIHRyYW5zZm9ybTogJ3JvdGF0ZVgoMGRlZykgcm90YXRlWSgwZGVnKSByb3RhdGVaKDBkZWcpJ1xuICAgIH0sXG4gICAgJzEwMCUnOiB7XG4gICAgICAgIHRyYW5zZm9ybTogJ3JvdGF0ZVgoMzYwZGVnKSByb3RhdGVZKDE4MGRlZykgcm90YXRlWigzNjBkZWcpJ1xuICAgIH1cbn07XG5cbi8qKlxuICogQHR5cGUge1N0cmluZ31cbiAqL1xudmFyIHJpZ2h0Um90YXRlQW5pbWF0aW9uTmFtZSA9IGluc2VydEtleWZyYW1lc1J1bGUocmlnaHRSb3RhdGVLZXlmcmFtZXMpO1xuXG4vKipcbiAqIEB0eXBlIHtTdHJpbmd9XG4gKi9cbnZhciBsZWZ0Um90YXRlQW5pbWF0aW9uTmFtZSA9IGluc2VydEtleWZyYW1lc1J1bGUobGVmdFJvdGF0ZUtleWZyYW1lcyk7XG5cbnZhciBwcm9wVHlwZXMgPSB7XG5cdGxvYWRpbmc6IFJlYWN0LlByb3BUeXBlcy5ib29sLFxuXHRjb2xvcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcblx0c2l6ZTogUmVhY3QuUHJvcFR5cGVzLm9uZU9mVHlwZShbUmVhY3QuUHJvcFR5cGVzLm51bWJlciwgUmVhY3QuUHJvcFR5cGVzLnN0cmluZ10pLFxuXHRtYXJnaW46IFJlYWN0LlByb3BUeXBlcy5vbmVPZlR5cGUoW1JlYWN0LlByb3BUeXBlcy5udW1iZXIsIFJlYWN0LlByb3BUeXBlcy5zdHJpbmddKSxcbn07XG5cbnZhciBwdEtleXMgPSBPYmplY3Qua2V5cyhwcm9wVHlwZXMpO1xuXG52YXIgUmluZ0xvYWRlciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICAvKipcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHByb3BUeXBlczogcHJvcFR5cGVzLFxuXG4gICAgLyoqXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsb2FkaW5nOiB0cnVlLFxuICAgICAgICAgICAgY29sb3I6ICcjZmZmZmZmJyxcbiAgICAgICAgICAgIHNpemU6ICc2MHB4J1xuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc2l6ZVxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBnZXRDaXJjbGVTdHlsZTogZnVuY3Rpb24oc2l6ZSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgd2lkdGg6IHNpemUsXG4gICAgICAgICAgICBoZWlnaHQ6IHNpemUsXG4gICAgICAgICAgICBib3JkZXI6IHNpemUvMTAgKydweCBzb2xpZCAnICsgdGhpcy5wcm9wcy5jb2xvcixcbiAgICAgICAgICAgIG9wYWNpdHk6IDAuNCxcbiAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzEwMCUnLFxuICAgICAgICAgICAgdmVydGljYWxBbGlnbjogdGhpcy5wcm9wcy52ZXJ0aWNhbEFsaWduXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSAge051bWJlcn0gaVxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBnZXRBbmltYXRpb25TdHlsZTogZnVuY3Rpb24oaSkge1xuICAgICAgICB2YXIgYW5pbWF0aW9uID0gW2k9PTE/IHJpZ2h0Um90YXRlQW5pbWF0aW9uTmFtZTogbGVmdFJvdGF0ZUFuaW1hdGlvbk5hbWUsICcycycsICcwcycsICdpbmZpbml0ZScsICdsaW5lYXInXS5qb2luKCcgJyk7XG4gICAgICAgIHZhciBhbmltYXRpb25GaWxsTW9kZSA9ICdmb3J3YXJkcyc7XG4gICAgICAgIHZhciBwZXJzcGVjdGl2ZSA9ICc4MDBweCc7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHBlcnNwZWN0aXZlOiBwZXJzcGVjdGl2ZSxcbiAgICAgICAgICAgIGFuaW1hdGlvbjogYW5pbWF0aW9uLFxuICAgICAgICAgICAgYW5pbWF0aW9uRmlsbE1vZGU6IGFuaW1hdGlvbkZpbGxNb2RlXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSAge051bWJlcn0gaVxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBnZXRTdHlsZTogZnVuY3Rpb24oaSkge1xuICAgICAgICB2YXIgc2l6ZSA9IHBhcnNlSW50KHRoaXMucHJvcHMuc2l6ZSk7XG5cbiAgICAgICAgaWYgKGkpIHtcbiAgICAgICAgICAgIHJldHVybiBhc3NpZ24oXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRib3JkZXI6ICcwcHggc29saWQgdHJhbnNwYXJlbnQnIC8vIGZpeCBmaXJlZm94L2Nocm9tZS9vcGVyYSByZW5kZXJpbmdcblx0XHRcdFx0fSxcbiAgICAgICAgICAgICAgICB0aGlzLmdldENpcmNsZVN0eWxlKHNpemUpLFxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0QW5pbWF0aW9uU3R5bGUoaSksXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgd2lkdGg6IHNpemUsXG4gICAgICAgICAgICBoZWlnaHQ6IHNpemUsXG4gICAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcblx0XHRcdGJvcmRlcjogJzBweCBzb2xpZCB0cmFuc3BhcmVudCcgLy8gZml4IGZpcmVmb3gvY2hyb21lL29wZXJhIHJlbmRlcmluZ1xuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gIHtCb29sZWFufSBsb2FkaW5nXG4gICAgICogQHJldHVybiB7UmVhY3RDb21wb25lbnQgfHwgbnVsbH1cbiAgICAgKi9cbiAgICByZW5kZXJMb2FkZXI6IGZ1bmN0aW9uKGxvYWRpbmcpIHtcbiAgICAgICAgaWYgKGxvYWRpbmcpIHtcblx0XHRcdHZhciBwcm9wcyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMucHJvcHMpO1xuXG5cdFx0XHRpZiAocHJvcFR5cGVzICYmIHB0S2V5cykge1xuXHRcdFx0XHR2YXIga2xlbiA9IHB0S2V5cy5sZW5ndGg7XG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwga2xlbjsgaSsrKSB7XG5cdFx0XHRcdFx0ZGVsZXRlIHByb3BzW3B0S2V5c1tpXV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuICAgICAgICAgICAgcmV0dXJuIChcblx0XHRcdFx0PGRpdiB7Li4ucHJvcHN9PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt0aGlzLmdldFN0eWxlKDApfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RoaXMuZ2V0U3R5bGUoMSl9PjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17dGhpcy5nZXRTdHlsZSgyKX0+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJMb2FkZXIodGhpcy5wcm9wcy5sb2FkaW5nKTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBSaW5nTG9hZGVyO1xuIl19
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

var propTypes = {
    loading: React.PropTypes.bool,
    color: React.PropTypes.string,
    size: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
    margin: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string])
};

var ptKeys = Object.keys(propTypes);

var RiseLoader = React.createClass({
    displayName: 'RiseLoader',

    /**
     * @type {Object}
     */
    propTypes: propTypes,

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
            var props = Object.assign({}, this.props);

            if (propTypes && ptKeys) {
                var klen = ptKeys.length;
                for (var i = 0; i < klen; i++) {
                    delete props[ptKeys[i]];
                }
            }

            return React.createElement(
                'div',
                props,
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

module.exports = RiseLoader;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlJpc2VMb2FkZXIuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJyZXF1aXJlIiwiYXNzaWduIiwiaW5zZXJ0S2V5ZnJhbWVzUnVsZSIsInJpc2VBbW91bnQiLCJrZXlmcmFtZXNFdmVuIiwidHJhbnNmb3JtIiwia2V5ZnJhbWVzT2RkIiwiYW5pbWF0aW9uTmFtZUV2ZW4iLCJhbmltYXRpb25OYW1lT2RkIiwicHJvcFR5cGVzIiwibG9hZGluZyIsIlByb3BUeXBlcyIsImJvb2wiLCJjb2xvciIsInN0cmluZyIsInNpemUiLCJvbmVPZlR5cGUiLCJudW1iZXIiLCJtYXJnaW4iLCJwdEtleXMiLCJPYmplY3QiLCJrZXlzIiwiUmlzZUxvYWRlciIsImNyZWF0ZUNsYXNzIiwiZ2V0RGVmYXVsdFByb3BzIiwiZ2V0QmFsbFN0eWxlIiwiYmFja2dyb3VuZENvbG9yIiwicHJvcHMiLCJ3aWR0aCIsImhlaWdodCIsImJvcmRlclJhZGl1cyIsInZlcnRpY2FsQWxpZ24iLCJnZXRBbmltYXRpb25TdHlsZSIsImkiLCJhbmltYXRpb24iLCJqb2luIiwiYW5pbWF0aW9uRmlsbE1vZGUiLCJnZXRTdHlsZSIsImRpc3BsYXkiLCJib3JkZXIiLCJyZW5kZXJMb2FkZXIiLCJrbGVuIiwibGVuZ3RoIiwicmVuZGVyIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJQSxRQUFRQyxRQUFRLE9BQVIsQ0FBWjtBQUNBLElBQUlDLFNBQVNELFFBQVEsMkJBQVIsQ0FBYjtBQUNBLElBQUlFLHNCQUFzQkYsUUFBUSw0QkFBUixDQUExQjs7QUFFQTs7O0FBR0EsSUFBSUcsYUFBYSxFQUFqQjs7QUFFQTs7O0FBR0EsSUFBSUMsZ0JBQWdCO0FBQ2hCLFVBQU07QUFDRkMsbUJBQVc7QUFEVCxLQURVO0FBSWhCLFdBQU87QUFDSEEsbUJBQVcsaUJBQWlCRixVQUFqQixHQUE4QjtBQUR0QyxLQUpTO0FBT2hCLFdBQU87QUFDSEUsbUJBQVc7QUFEUixLQVBTO0FBVWhCLFdB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Q0FBYyxFQUFkLEVBQWtCLEtBQUswQixLQUF2QixDQUFaOztBQUVBLGdCQUFJbEIsYUFBYVUsTUFBakIsRUFBeUI7QUFDeEIsb0JBQUlzQixPQUFPdEIsT0FBT3VCLE1BQWxCO0FBQ0EscUJBQUssSUFBSVQsSUFBSSxDQUFiLEVBQWdCQSxJQUFJUSxJQUFwQixFQUEwQlIsR0FBMUIsRUFBK0I7QUFDOUIsMkJBQU9OLE1BQU1SLE9BQU9jLENBQVAsQ0FBTixDQUFQO0FBQ0E7QUFDRDs7QUFFUSxtQkFDUjtBQUFBO0FBQVNOLHFCQUFUO0FBQ2dCLDZDQUFLLE9BQU8sS0FBS1UsUUFBTCxDQUFjLENBQWQsQ0FBWixHQURoQjtBQUVnQiw2Q0FBSyxPQUFPLEtBQUtBLFFBQUwsQ0FBYyxDQUFkLENBQVosR0FGaEI7QUFHZ0IsNkNBQUssT0FBTyxLQUFLQSxRQUFMLENBQWMsQ0FBZCxDQUFaLEdBSGhCO0FBSWdCLDZDQUFLLE9BQU8sS0FBS0EsUUFBTCxDQUFjLENBQWQsQ0FBWixHQUpoQjtBQUtnQiw2Q0FBSyxPQUFPLEtBQUtBLFFBQUwsQ0FBYyxDQUFkLENBQVo7QUFMaEIsYUFEUTtBQVNIOztBQUVELGVBQU8sSUFBUDtBQUNILEtBeEY4Qjs7QUEwRi9CTSxZQUFRLGtCQUFXO0FBQ2YsZUFBTyxLQUFLSCxZQUFMLENBQWtCLEtBQUtiLEtBQUwsQ0FBV2pCLE9BQTdCLENBQVA7QUFDSDtBQTVGOEIsQ0FBbEIsQ0FBakI7O0FBK0ZBa0MsT0FBT0MsT0FBUCxHQUFpQnZCLFVBQWpCIiwiZmlsZSI6IlJpc2VMb2FkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIGFzc2lnbiA9IHJlcXVpcmUoJ2RvbWtpdC9hcHBlbmRWZW5kb3JQcmVmaXgnKTtcbnZhciBpbnNlcnRLZXlmcmFtZXNSdWxlID0gcmVxdWlyZSgnZG9ta2l0L2luc2VydEtleWZyYW1lc1J1bGUnKTtcblxuLyoqXG4gKiBAdHlwZSB7TnVtYmVyfVxuICovXG52YXIgcmlzZUFtb3VudCA9IDMwO1xuXG4vKipcbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cbnZhciBrZXlmcmFtZXNFdmVuID0ge1xuICAgICcwJSc6IHtcbiAgICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoMS4xKSdcbiAgICB9LFxuICAgICcyNSUnOiB7XG4gICAgICAgIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVkoLScgKyByaXNlQW1vdW50ICsgJ3B4KSdcbiAgICB9LFxuICAgICc1MCUnOiB7XG4gICAgICAgIHRyYW5zZm9ybTogJ3NjYWxlKDAuNCknXG4gICAgfSxcbiAgICAnNzUlJzoge1xuICAgICAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKCcgKyByaXNlQW1vdW50ICsgJ3B4KSdcbiAgICB9LFxuICAgICcxMDAlJzoge1xuICAgICAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKDApIHNjYWxlKDEuMCknXG4gICAgfVxufTtcblxuLyoqXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG52YXIga2V5ZnJhbWVzT2RkID0ge1xuICAgICcwJSc6IHtcbiAgICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoMC40KSdcbiAgICB9LFxuICAgICcyNSc6IHtcbiAgICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlWSgnICsgcmlzZUFtb3VudCArICdweCknXG4gICAgfSxcbiAgICAnNTAlJzoge1xuICAgICAgICB0cmFuc2Zvcm06ICdzY2FsZSgxLjEpJ1xuICAgIH0sXG4gICAgJzc1JSc6IHtcbiAgICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlWSgtJyArIHJpc2VBbW91bnQgKyAncHgpJ1xuICAgIH0sXG4gICAgJzEwMCUnOiB7XG4gICAgICAgIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVkoMCkgc2NhbGUoMC43NSknXG4gICAgfVxufTtcblxuLyoqXG4gKiBAdHlwZSB7U3RyaW5nfVxuICovXG52YXIgYW5pbWF0aW9uTmFtZUV2ZW4gPSBpbnNlcnRLZXlmcmFtZXNSdWxlKGtleWZyYW1lc0V2ZW4pO1xuXG4vKipcbiAqIEB0eXBlIHtTdHJpbmd9XG4gKi9cbnZhciBhbmltYXRpb25OYW1lT2RkID0gaW5zZXJ0S2V5ZnJhbWVzUnVsZShrZXlmcmFtZXNPZGQpO1xuXG52YXIgcHJvcFR5cGVzID0ge1xuXHRsb2FkaW5nOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcblx0Y29sb3I6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdHNpemU6IFJlYWN0LlByb3BUeXBlcy5vbmVPZlR5cGUoW1JlYWN0LlByb3BUeXBlcy5udW1iZXIsIFJlYWN0LlByb3BUeXBlcy5zdHJpbmddKSxcblx0bWFyZ2luOiBSZWFjdC5Qcm9wVHlwZXMub25lT2ZUeXBlKFtSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLCBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXSksXG59O1xuXG52YXIgcHRLZXlzID0gT2JqZWN0LmtleXMocHJvcFR5cGVzKTtcblxudmFyIFJpc2VMb2FkZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAgLyoqXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICBwcm9wVHlwZXM6IHByb3BUeXBlcyxcblxuICAgIC8qKlxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbG9hZGluZzogdHJ1ZSxcbiAgICAgICAgICAgIGNvbG9yOiAnI2ZmZmZmZicsXG4gICAgICAgICAgICBzaXplOiAnMTVweCcsXG4gICAgICAgICAgICBtYXJnaW46ICcycHgnXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBnZXRCYWxsU3R5bGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiB0aGlzLnByb3BzLmNvbG9yLFxuICAgICAgICAgICAgd2lkdGg6IHRoaXMucHJvcHMuc2l6ZSxcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5wcm9wcy5zaXplLFxuICAgICAgICAgICAgbWFyZ2luOiB0aGlzLnByb3BzLm1hcmdpbixcbiAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzEwMCUnLFxuICAgICAgICAgICAgdmVydGljYWxBbGlnbjogdGhpcy5wcm9wcy52ZXJ0aWNhbEFsaWduXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSAge051bWJlcn0gaVxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBnZXRBbmltYXRpb25TdHlsZTogZnVuY3Rpb24oaSkge1xuICAgICAgICB2YXIgYW5pbWF0aW9uID0gW2klMj09MD8gYW5pbWF0aW9uTmFtZUV2ZW46IGFuaW1hdGlvbk5hbWVPZGQsICcxcycsICcwcycsICdpbmZpbml0ZScsICdjdWJpYy1iZXppZXIoLjE1LC40NiwuOSwuNiknXS5qb2luKCcgJyk7XG4gICAgICAgIHZhciBhbmltYXRpb25GaWxsTW9kZSA9ICdib3RoJztcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYW5pbWF0aW9uOiBhbmltYXRpb24sXG4gICAgICAgICAgICBhbmltYXRpb25GaWxsTW9kZTogYW5pbWF0aW9uRmlsbE1vZGVcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtICB7TnVtYmVyfSBpXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIGdldFN0eWxlOiBmdW5jdGlvbihpKSB7XG4gICAgICAgIHJldHVybiBhc3NpZ24oXG4gICAgICAgICAgICB0aGlzLmdldEJhbGxTdHlsZShpKSxcbiAgICAgICAgICAgIHRoaXMuZ2V0QW5pbWF0aW9uU3R5bGUoaSksXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZGlzcGxheTogJ2lubGluZS1ibG9jaycsXG5cdFx0XHRcdGJvcmRlcjogJzBweCBzb2xpZCB0cmFuc3BhcmVudCcgLy8gZml4IGZpcmVmb3gvY2hyb21lL29wZXJhIHJlbmRlcmluZ1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gIHtCb29sZWFufSBsb2FkaW5nXG4gICAgICogQHJldHVybiB7UmVhY3RDb21wb25lbnQgfHwgbnVsbH1cbiAgICAgKi9cbiAgICByZW5kZXJMb2FkZXI6IGZ1bmN0aW9uKGxvYWRpbmcpIHtcbiAgICAgICAgaWYgKGxvYWRpbmcpIHtcblx0XHRcdHZhciBwcm9wcyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMucHJvcHMpO1xuXG5cdFx0XHRpZiAocHJvcFR5cGVzICYmIHB0S2V5cykge1xuXHRcdFx0XHR2YXIga2xlbiA9IHB0S2V5cy5sZW5ndGg7XG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwga2xlbjsgaSsrKSB7XG5cdFx0XHRcdFx0ZGVsZXRlIHByb3BzW3B0S2V5c1tpXV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuICAgICAgICAgICAgcmV0dXJuIChcblx0XHRcdFx0PGRpdiB7Li4ucHJvcHN9PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt0aGlzLmdldFN0eWxlKDEpfT48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17dGhpcy5nZXRTdHlsZSgyKX0+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RoaXMuZ2V0U3R5bGUoMyl9PjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt0aGlzLmdldFN0eWxlKDQpfT48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17dGhpcy5nZXRTdHlsZSg1KX0+PC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlckxvYWRlcih0aGlzLnByb3BzLmxvYWRpbmcpO1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJpc2VMb2FkZXI7XG4iXX0=
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

var propTypes = {
    loading: React.PropTypes.bool,
    color: React.PropTypes.string,
    size: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
    margin: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string])
};

var ptKeys = Object.keys(propTypes);

var RotateLoader = React.createClass({
    displayName: 'RotateLoader',

    /**
     * @type {Object}
     */
    propTypes: propTypes,

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
            var props = Object.assign({}, this.props);

            if (propTypes && ptKeys) {
                var klen = ptKeys.length;
                for (var i = 0; i < klen; i++) {
                    delete props[ptKeys[i]];
                }
            }

            return React.createElement(
                'div',
                props,
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

module.exports = RotateLoader;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlJvdGF0ZUxvYWRlci5qcyJdLCJuYW1lcyI6WyJSZWFjdCIsInJlcXVpcmUiLCJhc3NpZ24iLCJpbnNlcnRLZXlmcmFtZXNSdWxlIiwia2V5ZnJhbWVzIiwidHJhbnNmb3JtIiwiYW5pbWF0aW9uTmFtZSIsInByb3BUeXBlcyIsImxvYWRpbmciLCJQcm9wVHlwZXMiLCJib29sIiwiY29sb3IiLCJzdHJpbmciLCJzaXplIiwib25lT2ZUeXBlIiwibnVtYmVyIiwibWFyZ2luIiwicHRLZXlzIiwiT2JqZWN0Iiwia2V5cyIsIlJvdGF0ZUxvYWRlciIsImNyZWF0ZUNsYXNzIiwiZ2V0RGVmYXVsdFByb3BzIiwiZ2V0QmFsbFN0eWxlIiwiYmFja2dyb3VuZENvbG9yIiwicHJvcHMiLCJ3aWR0aCIsImhlaWdodCIsImJvcmRlclJhZGl1cyIsInZlcnRpY2FsQWxpZ24iLCJnZXRBbmltYXRpb25TdHlsZSIsImkiLCJhbmltYXRpb24iLCJqb2luIiwiYW5pbWF0aW9uRmlsbE1vZGUiLCJnZXRTdHlsZSIsIm9wYWNpdHkiLCJwb3NpdGlvbiIsInRvcCIsImxlZnQiLCJib3JkZXIiLCJkaXNwbGF5IiwicmVuZGVyTG9hZGVyIiwia2xlbiIsImxlbmd0aCIsInJlbmRlciIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEsUUFBUUMsUUFBUSxPQUFSLENBQVo7QUFDQSxJQUFJQyxTQUFTRCxRQUFRLDJCQUFSLENBQWI7QUFDQSxJQUFJRSxzQkFBc0JGLFFBQVEsNEJBQVIsQ0FBMUI7O0FBRUE7OztBQUdBLElBQUlHLFlBQVk7QUFDWixVQUFNO0FBQ0ZDLG1CQUFXO0FBRFQsS0FETTtBQUlaLFdBQU87QUFDSEEsbUJBQVc7QUFEUixLQUpLO0FBT1osWUFBUTtBQUNKQSxtQkFBVztBQURQO0FBUEksQ0FBaEI7O0FBWUE7OztBQUdBLElBQUlDLGdCQUFnQkgsb0JBQW9CQyxTQUFwQixDQUFwQjs7QUFFQSxJQUFJRyxZQUFZO0FBQ2ZDLGFBQVNSLE1BQU1TLFNBQU4sQ0FBZ0JDLElBRFY7QUFFZkMsV0FBT1gsTUFBTVMsU0FBTixDQUFnQkcsTUFGUjtBQUdmQyxVQUFNYixNQUFNUyxTQUFOLENBQWdCSyxTQUFoQixDQUEwQixDQUFDZCxNQUFNUyxTQUFOLENBQWdCTSxNQUFqQixFQUF5QmYsTUFBTVMsU0FBTixDQUFnQkcsTUFBekMsQ0FBMUIsQ0FIUztBQUlmSSxZQUFRaEIsTUFBTVMsU0FBTixDQUFnQkssU0FBaEIsQ0FBMEIsQ0FBQ2QsTUFBTVMsU0FBTixDQUFnQk0sTUFBakIsRUFBeUJmLE1BQU1TLFNBQU4sQ0FBZ0JHLE1BQXpDLENBQTFCO0FBSk8sQ0FBaEI7O0FBT0EsSUFBSUssU0FBU0MsT0FBT0MsSUFBUCxDQUFZWixTQUFaLENBQWI7O0FBRUEsSUFBSWEsZUFBZXBCLE1BQU1xQixXQUFOLENBQWtCO0FBQUE7O0FBQ2pDOzs7QUFHQWQsZUFBV0EsU0FKc0I7O0FBTWpDOzs7QUFHQWUscUJBQWlCLDJCQUFXO0FBQ3hCLGVBQU87QUFDSGQscUJBQVMsSUFETjtBQUVIRyxtQkFBTyxTQUZKO0FBR0hFLGtCQUFNLE1BSEg7QUFJSEcsb0JBQVE7QUFKTCxTQUFQO0FBTUgsS0FoQmdDOztBQWtCakM7OztBQUdBTyxrQkFBYyx3QkFBVztBQUNyQixlQUFPO0FBQ0hDLDZCQUFpQixLQUFLQyxLQUFMLENBQVdkLEtBRHpCO0FBRUhlLG1CQUFPLEtBQUtELEtBQUwsQ0FBV1osSUFGZjtBQUdIYyxvQkFBUSxLQUFLRixLQUFMLENBQVdaLElBSGhCO0FBSUhHLG9CQUFRLEtBQUtTLEtBQUwsQ0FBV1QsTUFKaEI7QUFLSFksMEJBQWMsTUFMWDtBQU1IQywyQkFBZSxLQUFLSixLQUFMLENBQVdJO0FBTnZCLFNBQVA7QUFRSCxLQTlCZ0M7O0FBZ0NqQzs7OztBQUlBQyx1QkFBbUIsMkJBQVNDLENBQVQsRUFBWTtBQUMzQixZQUFJQyxZQUFZLENBQUMxQixhQUFELEVBQWdCLElBQWhCLEVBQXNCLElBQXRCLEVBQTRCLFVBQTVCLEVBQXdDLCtCQUF4QyxFQUF5RTJCLElBQXpFLENBQThFLEdBQTlFLENBQWhCO0FBQ0EsWUFBSUMsb0JBQW9CLE1BQXhCOztBQUVBLGVBQU87QUFDSEYsdUJBQVdBLFNBRFI7QUFFSEUsK0JBQW1CQTtBQUZoQixTQUFQO0FBSUgsS0E1Q2dDOztBQThDakM7Ozs7QUFJQUMsY0FBVSxrQkFBU0osQ0FBVCxFQUFZO0FBQ2xCLFlBQUlBLENBQUosRUFBTztBQUNILG1CQUFPN0IsT0FDSCxLQUFLcUIsWUFBTCxDQUFrQlEsQ0FBbEIsQ0FERyxFQUVIO0FBQ0lLLHlCQUFTLEtBRGI7QUFFSUMsMEJBQVUsVUFGZDtBQUdJQyxxQkFBSyxDQUhUO0FBSUlDLHNCQUFNUixJQUFFLENBQUYsR0FBTSxDQUFDLEVBQVAsR0FBWSxFQUp0QjtBQUtYUyx3QkFBUSx1QkFMRyxDQUtxQjtBQUxyQixhQUZHLENBQVA7QUFVSDs7QUFFRCxlQUFPdEMsT0FDSCxLQUFLcUIsWUFBTCxDQUFrQlEsQ0FBbEIsQ0FERyxFQUVILEtBQUtELGlCQUFMLENBQXVCQyxDQUF2QixDQUZHLEVBR0g7QUFDSVUscUJBQVMsY0FEYjtBQUVJSixzQkFBVSxVQUZkO0FBR1JHLG9CQUFRLHVCQUhBLENBR3dCO0FBSHhCLFNBSEcsQ0FBUDtBQVNILEtBekVnQzs7QUEyRWpDOzs7O0FBSUFFLGtCQUFjLHNCQUFTbEMsT0FBVCxFQUFrQjtBQUM1QixZQUFJQSxPQUFKLEVBQWE7QUFDbEIsZ0JBQUlpQixRQUFRUCxPQUFPaEIsTUFBUCxDQUFjLEVBQWQsRUFBa0IsS0FBS3VCLEtBQXZCLENBQVo7O0FBRUEsZ0JBQUlsQixhQUFhVSxNQUFqQixFQUF5QjtBQUN4QixvQkFBSTBCLE9BQU8xQixPQUFPMkIsTUFBbEI7QUFDQSxxQkFBSyxJQUFJYixJQUFJLENBQWIsRUFBZ0JBLElBQUlZLElBQXBCLEVBQTBCWixHQUExQixFQUErQjtBQUM5QiwyQkFBT04sTUFBTVIsT0FBT2MsQ0FBUCxDQUFOLENBQVA7QUFDQTtBQUNEOztBQUVRLG1CQUNSO0FBQUE7QUFBU04scUJBQVQ7QUFDZ0I7QUFBQTtBQUFBLHNCQUFLLE9BQU8sS0FBS1UsUUFBTCxFQUFaO0FBQ0ksaURBQUssT0FBTyxLQUFLQSxRQUFMLENBQWMsQ0FBZCxDQUFaLEdBREo7QUFFSSxpREFBSyxPQUFPLEtBQUtBLFFBQUwsQ0FBYyxDQUFkLENBQVo7QUFGSjtBQURoQixhQURRO0FBUUg7O0FBRUQsZUFBTyxJQUFQO0FBQ0gsS0FyR2dDOztBQXVHakNVLFlBQVEsa0JBQVc7QUFDZixlQUFPLEtBQUtILFlBQUwsQ0FBa0IsS0FBS2pCLEtBQUwsQ0FBV2pCLE9BQTdCLENBQVA7QUFDSDtBQXpHZ0MsQ0FBbEIsQ0FBbkI7O0FBNEdBc0MsT0FBT0MsT0FBUCxHQUFpQjNCLFlBQWpCIiwiZmlsZSI6IlJvdGF0ZUxvYWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgYXNzaWduID0gcmVxdWlyZSgnZG9ta2l0L2FwcGVuZFZlbmRvclByZWZpeCcpO1xudmFyIGluc2VydEtleWZyYW1lc1J1bGUgPSByZXF1aXJlKCdkb21raXQvaW5zZXJ0S2V5ZnJhbWVzUnVsZScpO1xuXG4vKipcbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cbnZhciBrZXlmcmFtZXMgPSB7XG4gICAgJzAlJzoge1xuICAgICAgICB0cmFuc2Zvcm06ICdyb3RhdGUoMGRlZyknXG4gICAgfSxcbiAgICAnNTAlJzoge1xuICAgICAgICB0cmFuc2Zvcm06ICdyb3RhdGUoMTgwZGVnKSdcbiAgICB9LFxuICAgICcxMDAlJzoge1xuICAgICAgICB0cmFuc2Zvcm06ICdyb3RhdGUoMzYwZGVnKSdcbiAgICB9XG59O1xuXG4vKipcbiAqIEB0eXBlIHtTdHJpbmd9XG4gKi9cbnZhciBhbmltYXRpb25OYW1lID0gaW5zZXJ0S2V5ZnJhbWVzUnVsZShrZXlmcmFtZXMpO1xuXG52YXIgcHJvcFR5cGVzID0ge1xuXHRsb2FkaW5nOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcblx0Y29sb3I6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdHNpemU6IFJlYWN0LlByb3BUeXBlcy5vbmVPZlR5cGUoW1JlYWN0LlByb3BUeXBlcy5udW1iZXIsIFJlYWN0LlByb3BUeXBlcy5zdHJpbmddKSxcblx0bWFyZ2luOiBSZWFjdC5Qcm9wVHlwZXMub25lT2ZUeXBlKFtSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLCBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXSksXG59O1xuXG52YXIgcHRLZXlzID0gT2JqZWN0LmtleXMocHJvcFR5cGVzKTtcblxudmFyIFJvdGF0ZUxvYWRlciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICAvKipcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHByb3BUeXBlczogcHJvcFR5cGVzLFxuXG4gICAgLyoqXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsb2FkaW5nOiB0cnVlLFxuICAgICAgICAgICAgY29sb3I6ICcjZmZmZmZmJyxcbiAgICAgICAgICAgIHNpemU6ICcxNXB4JyxcbiAgICAgICAgICAgIG1hcmdpbjogJzJweCdcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIGdldEJhbGxTdHlsZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHRoaXMucHJvcHMuY29sb3IsXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5wcm9wcy5zaXplLFxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnByb3BzLnNpemUsXG4gICAgICAgICAgICBtYXJnaW46IHRoaXMucHJvcHMubWFyZ2luLFxuICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnMTAwJScsXG4gICAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiB0aGlzLnByb3BzLnZlcnRpY2FsQWxpZ25cbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtICB7TnVtYmVyfSBpXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIGdldEFuaW1hdGlvblN0eWxlOiBmdW5jdGlvbihpKSB7XG4gICAgICAgIHZhciBhbmltYXRpb24gPSBbYW5pbWF0aW9uTmFtZSwgJzFzJywgJzBzJywgJ2luZmluaXRlJywgJ2N1YmljLWJlemllciguNywtLjEzLC4yMiwuODYpJ10uam9pbignICcpO1xuICAgICAgICB2YXIgYW5pbWF0aW9uRmlsbE1vZGUgPSAnYm90aCc7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGFuaW1hdGlvbjogYW5pbWF0aW9uLFxuICAgICAgICAgICAgYW5pbWF0aW9uRmlsbE1vZGU6IGFuaW1hdGlvbkZpbGxNb2RlLFxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gIHtOdW1iZXJ9IGlcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgZ2V0U3R5bGU6IGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgaWYgKGkpIHtcbiAgICAgICAgICAgIHJldHVybiBhc3NpZ24oXG4gICAgICAgICAgICAgICAgdGhpcy5nZXRCYWxsU3R5bGUoaSksXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAnMC44JyxcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogaSUyID8gLTI4IDogMjUsXG5cdFx0XHRcdFx0Ym9yZGVyOiAnMHB4IHNvbGlkIHRyYW5zcGFyZW50JyAvLyBmaXggZmlyZWZveC9jaHJvbWUvb3BlcmEgcmVuZGVyaW5nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhc3NpZ24oXG4gICAgICAgICAgICB0aGlzLmdldEJhbGxTdHlsZShpKSxcbiAgICAgICAgICAgIHRoaXMuZ2V0QW5pbWF0aW9uU3R5bGUoaSksXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZGlzcGxheTogJ2lubGluZS1ibG9jaycsXG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG5cdFx0XHRcdGJvcmRlcjogJzBweCBzb2xpZCB0cmFuc3BhcmVudCcgLy8gZml4IGZpcmVmb3gvY2hyb21lL29wZXJhIHJlbmRlcmluZ1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gIHtCb29sZWFufSBsb2FkaW5nXG4gICAgICogQHJldHVybiB7UmVhY3RDb21wb25lbnQgfHwgbnVsbH1cbiAgICAgKi9cbiAgICByZW5kZXJMb2FkZXI6IGZ1bmN0aW9uKGxvYWRpbmcpIHtcbiAgICAgICAgaWYgKGxvYWRpbmcpIHtcblx0XHRcdHZhciBwcm9wcyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMucHJvcHMpO1xuXG5cdFx0XHRpZiAocHJvcFR5cGVzICYmIHB0S2V5cykge1xuXHRcdFx0XHR2YXIga2xlbiA9IHB0S2V5cy5sZW5ndGg7XG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwga2xlbjsgaSsrKSB7XG5cdFx0XHRcdFx0ZGVsZXRlIHByb3BzW3B0S2V5c1tpXV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuICAgICAgICAgICAgcmV0dXJuIChcblx0XHRcdFx0PGRpdiB7Li4ucHJvcHN9PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt0aGlzLmdldFN0eWxlKCl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17dGhpcy5nZXRTdHlsZSgxKX0+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt0aGlzLmdldFN0eWxlKDIpfT48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlckxvYWRlcih0aGlzLnByb3BzLmxvYWRpbmcpO1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJvdGF0ZUxvYWRlcjtcbiJdfQ==
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

var propTypes = {
    loading: React.PropTypes.bool,
    color: React.PropTypes.string,
    height: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
    width: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
    margin: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
    radius: React.PropTypes.string
};

var ptKeys = Object.keys(propTypes);

var ScaleLoader = React.createClass({
    displayName: 'ScaleLoader',

    /**
     * @type {Object}
     */
    propTypes: propTypes,

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
            var props = Object.assign({}, this.props);

            if (propTypes && ptKeys) {
                var klen = ptKeys.length;
                for (var i = 0; i < klen; i++) {
                    delete props[ptKeys[i]];
                }
            }

            return React.createElement(
                'div',
                props,
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

module.exports = ScaleLoader;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNjYWxlTG9hZGVyLmpzIl0sIm5hbWVzIjpbIlJlYWN0IiwicmVxdWlyZSIsImFzc2lnbiIsImluc2VydEtleWZyYW1lc1J1bGUiLCJrZXlmcmFtZXMiLCJ0cmFuc2Zvcm0iLCJhbmltYXRpb25OYW1lIiwicHJvcFR5cGVzIiwibG9hZGluZyIsIlByb3BUeXBlcyIsImJvb2wiLCJjb2xvciIsInN0cmluZyIsImhlaWdodCIsIm9uZU9mVHlwZSIsIm51bWJlciIsIndpZHRoIiwibWFyZ2luIiwicmFkaXVzIiwicHRLZXlzIiwiT2JqZWN0Iiwia2V5cyIsIlNjYWxlTG9hZGVyIiwiY3JlYXRlQ2xhc3MiLCJnZXREZWZhdWx0UHJvcHMiLCJnZXRMaW5lU3R5bGUiLCJiYWNrZ3JvdW5kQ29sb3IiLCJwcm9wcyIsImJvcmRlclJhZGl1cyIsInZlcnRpY2FsQWxpZ24iLCJnZXRBbmltYXRpb25TdHlsZSIsImkiLCJhbmltYXRpb24iLCJqb2luIiwiYW5pbWF0aW9uRmlsbE1vZGUiLCJnZXRTdHlsZSIsImRpc3BsYXkiLCJib3JkZXIiLCJyZW5kZXJMb2FkZXIiLCJrbGVuIiwibGVuZ3RoIiwicmVuZGVyIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJQSxRQUFRQyxRQUFRLE9BQVIsQ0FBWjtBQUNBLElBQUlDLFNBQVNELFFBQVEsMkJBQVIsQ0FBYjtBQUNBLElBQUlFLHNCQUFzQkYsUUFBUSw0QkFBUixDQUExQjs7QUFFQTs7O0FBR0EsSUFBSUcsWUFBWTtBQUNaLFVBQU07QUFDRkMsbUJBQVc7QUFEVCxLQURNO0FBSVosV0FBTztBQUNIQSxtQkFBVztBQURSLEtBSks7QUFPWixZQUFRO0FBQ0pBLG1CQUFXO0FBRFA7QUFQSSxDQUFoQjs7QUFZQTs7O0FBR0EsSUFBSUMsZ0JBQWdCSCxvQkFBb0JDLFNBQXBCLENBQXBCOztBQUVBLElBQUlHLFlBQVk7QUFDZkMsYUFBU1IsTUFBTVMsU0FBTixDQUFnQkMsSUFEVjtBQUVmQyxXQUFP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LDZDQUFLLE9BQU8sS0FBS0EsUUFBTCxDQUFjLENBQWQsQ0FBWixHQUZoQjtBQUdnQiw2Q0FBSyxPQUFPLEtBQUtBLFFBQUwsQ0FBYyxDQUFkLENBQVosR0FIaEI7QUFJZ0IsNkNBQUssT0FBTyxLQUFLQSxRQUFMLENBQWMsQ0FBZCxDQUFaLEdBSmhCO0FBS2dCLDZDQUFLLE9BQU8sS0FBS0EsUUFBTCxDQUFjLENBQWQsQ0FBWjtBQUxoQixhQURRO0FBU0g7O0FBRUQsZUFBTyxJQUFQO0FBQ0gsS0ExRitCOztBQTRGaENNLFlBQVEsa0JBQVc7QUFDZixlQUFPLEtBQUtILFlBQUwsQ0FBa0IsS0FBS1gsS0FBTCxDQUFXbkIsT0FBN0IsQ0FBUDtBQUNIO0FBOUYrQixDQUFsQixDQUFsQjs7QUFpR0FrQyxPQUFPQyxPQUFQLEdBQWlCckIsV0FBakIiLCJmaWxlIjoiU2NhbGVMb2FkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIGFzc2lnbiA9IHJlcXVpcmUoJ2RvbWtpdC9hcHBlbmRWZW5kb3JQcmVmaXgnKTtcbnZhciBpbnNlcnRLZXlmcmFtZXNSdWxlID0gcmVxdWlyZSgnZG9ta2l0L2luc2VydEtleWZyYW1lc1J1bGUnKTtcblxuLyoqXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG52YXIga2V5ZnJhbWVzID0ge1xuICAgICcwJSc6IHtcbiAgICAgICAgdHJhbnNmb3JtOiAnc2NhbGV5KDEuMCknXG4gICAgfSxcbiAgICAnNTAlJzoge1xuICAgICAgICB0cmFuc2Zvcm06ICdzY2FsZXkoMC40KSdcbiAgICB9LFxuICAgICcxMDAlJzoge1xuICAgICAgICB0cmFuc2Zvcm06ICdzY2FsZXkoMS4wKSdcbiAgICB9XG59O1xuXG4vKipcbiAqIEB0eXBlIHtTdHJpbmd9XG4gKi9cbnZhciBhbmltYXRpb25OYW1lID0gaW5zZXJ0S2V5ZnJhbWVzUnVsZShrZXlmcmFtZXMpO1xuXG52YXIgcHJvcFR5cGVzID0ge1xuXHRsb2FkaW5nOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcblx0Y29sb3I6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdGhlaWdodDogUmVhY3QuUHJvcFR5cGVzLm9uZU9mVHlwZShbUmVhY3QuUHJvcFR5cGVzLm51bWJlciwgUmVhY3QuUHJvcFR5cGVzLnN0cmluZ10pLFxuXHR3aWR0aDogUmVhY3QuUHJvcFR5cGVzLm9uZU9mVHlwZShbUmVhY3QuUHJvcFR5cGVzLm51bWJlciwgUmVhY3QuUHJvcFR5cGVzLnN0cmluZ10pLFxuXHRtYXJnaW46IFJlYWN0LlByb3BUeXBlcy5vbmVPZlR5cGUoW1JlYWN0LlByb3BUeXBlcy5udW1iZXIsIFJlYWN0LlByb3BUeXBlcy5zdHJpbmddKSxcblx0cmFkaXVzOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXG59O1xuXG52YXIgcHRLZXlzID0gT2JqZWN0LmtleXMocHJvcFR5cGVzKTtcblxudmFyIFNjYWxlTG9hZGVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgIC8qKlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgcHJvcFR5cGVzOiBwcm9wVHlwZXMsXG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGxvYWRpbmc6IHRydWUsXG4gICAgICAgICAgICBjb2xvcjogJyNmZmZmZmYnLFxuICAgICAgICAgICAgaGVpZ2h0OiAnMzVweCcsXG4gICAgICAgICAgICB3aWR0aDogJzRweCcsXG4gICAgICAgICAgICBtYXJnaW46ICcycHgnLFxuICAgICAgICAgICAgcmFkaXVzOiAnMnB4J1xuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgZ2V0TGluZVN0eWxlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogdGhpcy5wcm9wcy5jb2xvcixcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5wcm9wcy5oZWlnaHQsXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5wcm9wcy53aWR0aCxcbiAgICAgICAgICAgIG1hcmdpbjogdGhpcy5wcm9wcy5tYXJnaW4sXG4gICAgICAgICAgICBib3JkZXJSYWRpdXM6IHRoaXMucHJvcHMucmFkaXVzLFxuICAgICAgICAgICAgdmVydGljYWxBbGlnbjogdGhpcy5wcm9wcy52ZXJ0aWNhbEFsaWduXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSAge051bWJlcn0gaVxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBnZXRBbmltYXRpb25TdHlsZTogZnVuY3Rpb24oaSkge1xuICAgICAgICB2YXIgYW5pbWF0aW9uID0gW2FuaW1hdGlvbk5hbWUsICcxcycsIChpICogMC4xKSArICdzJywgJ2luZmluaXRlJywgJ2N1YmljLWJlemllciguMiwuNjgsLjE4LDEuMDgpJ10uam9pbignICcpO1xuICAgICAgICB2YXIgYW5pbWF0aW9uRmlsbE1vZGUgPSAnYm90aCc7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGFuaW1hdGlvbjogYW5pbWF0aW9uLFxuICAgICAgICAgICAgYW5pbWF0aW9uRmlsbE1vZGU6IGFuaW1hdGlvbkZpbGxNb2RlXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSAge051bWJlcn0gaVxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBnZXRTdHlsZTogZnVuY3Rpb24oaSkge1xuICAgICAgICByZXR1cm4gYXNzaWduKFxuICAgICAgICAgICAgdGhpcy5nZXRMaW5lU3R5bGUoaSksXG4gICAgICAgICAgICB0aGlzLmdldEFuaW1hdGlvblN0eWxlKGkpLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLFxuXHRcdFx0XHRib3JkZXI6ICcwcHggc29saWQgdHJhbnNwYXJlbnQnIC8vIGZpeCBmaXJlZm94L2Nocm9tZS9vcGVyYSByZW5kZXJpbmdcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtICB7Qm9vbGVhbn0gbG9hZGluZ1xuICAgICAqIEByZXR1cm4ge1JlYWN0Q29tcG9uZW50IHx8IG51bGx9XG4gICAgICovXG4gICAgcmVuZGVyTG9hZGVyOiBmdW5jdGlvbihsb2FkaW5nKSB7XG4gICAgICAgIGlmIChsb2FkaW5nKSB7XG5cdFx0XHR2YXIgcHJvcHMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnByb3BzKTtcblxuXHRcdFx0aWYgKHByb3BUeXBlcyAmJiBwdEtleXMpIHtcblx0XHRcdFx0dmFyIGtsZW4gPSBwdEtleXMubGVuZ3RoO1xuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGtsZW47IGkrKykge1xuXHRcdFx0XHRcdGRlbGV0ZSBwcm9wc1twdEtleXNbaV1dO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cbiAgICAgICAgICAgIHJldHVybiAoXG5cdFx0XHRcdDxkaXYgey4uLnByb3BzfT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17dGhpcy5nZXRTdHlsZSgxKX0+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RoaXMuZ2V0U3R5bGUoMil9PjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt0aGlzLmdldFN0eWxlKDMpfT48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17dGhpcy5nZXRTdHlsZSg0KX0+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RoaXMuZ2V0U3R5bGUoNSl9PjwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJMb2FkZXIodGhpcy5wcm9wcy5sb2FkaW5nKTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBTY2FsZUxvYWRlcjtcbiJdfQ==
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

var propTypes = {
    loading: React.PropTypes.bool,
    color: React.PropTypes.string,
    size: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string])
};

var ptKeys = Object.keys(propTypes);

var SkewLoader = React.createClass({
    displayName: 'SkewLoader',

    /**
     * @type {Object}
     */
    propTypes: propTypes,

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
        return assign({
            border: '0px solid transparent' // fix firefox/chrome/opera rendering
        }, this.getSharpStyle(i), this.getAnimationStyle(i), {
            display: 'inline-block'
        });
    },

    /**
     * @param  {Boolean} loading
     * @return {ReactComponent || null}
     */
    renderLoader: function renderLoader(loading) {
        if (loading) {
            var props = Object.assign({}, this.props);

            if (propTypes && ptKeys) {
                var klen = ptKeys.length;
                for (var i = 0; i < klen; i++) {
                    delete props[ptKeys[i]];
                }
            }

            return React.createElement(
                'div',
                props,
                React.createElement('div', { style: this.getStyle() })
            );
        };

        return null;
    },

    render: function render() {
        return this.renderLoader(this.props.loading);
    }
});

module.exports = SkewLoader;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNrZXdMb2FkZXIuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJyZXF1aXJlIiwiYXNzaWduIiwiaW5zZXJ0S2V5ZnJhbWVzUnVsZSIsImtleWZyYW1lcyIsInRyYW5zZm9ybSIsImFuaW1hdGlvbk5hbWUiLCJwcm9wVHlwZXMiLCJsb2FkaW5nIiwiUHJvcFR5cGVzIiwiYm9vbCIsImNvbG9yIiwic3RyaW5nIiwic2l6ZSIsIm9uZU9mVHlwZSIsIm51bWJlciIsInB0S2V5cyIsIk9iamVjdCIsImtleXMiLCJTa2V3TG9hZGVyIiwiY3JlYXRlQ2xhc3MiLCJnZXREZWZhdWx0UHJvcHMiLCJnZXRTaGFycFN0eWxlIiwid2lkdGgiLCJoZWlnaHQiLCJib3JkZXJMZWZ0IiwicHJvcHMiLCJib3JkZXJSaWdodCIsImJvcmRlckJvdHRvbSIsInZlcnRpY2FsQWxpZ24iLCJnZXRBbmltYXRpb25TdHlsZSIsImkiLCJhbmltYXRpb24iLCJqb2luIiwiYW5pbWF0aW9uRmlsbE1vZGUiLCJnZXRTdHlsZSIsImJvcmRlciIsImRpc3BsYXkiLCJyZW5kZXJMb2FkZXIiLCJrbGVuIiwibGVuZ3RoIiwicmVuZGVyIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJQSxRQUFRQyxRQUFRLE9BQVIsQ0FBWjtBQUNBLElBQUlDLFNBQVNELFFBQVEsMkJBQVIsQ0FBYjtBQUNBLElBQUlFLHNCQUFzQkYsUUFBUSw0QkFBUixDQUExQjs7QUFFQTs7O0FBR0EsSUFBSUcsWUFBWTtBQUNaLFdBQU87QUFDSEMsbUJBQVc7QUFEUixLQURLO0FBSVosV0FBTztBQUNIQSxtQkFBVztBQURSLEtBSks7QUFPWixXQUFPO0FBQ0hBLG1CQUFXO0FBRFIsS0FQSztBQVVaLFlBQVE7QUFDSkEsbUJBQVc7QUFEUDtBQVZJLENBQWhCOztBQWVBOzs7QUFHQSxJQUFJQyxnQkFBZ0JILG9CQUFvQkMsU0FBcEIsQ0FBcEI7O0FBRUEsSUFBSUcsWUFBWTtBQUNmQyxhQUFTUixNQUFNUyxTQUFOLENBQWdCQyxJQURWO0FBRWZDLFdBQU9YLE1BQU1TLFNBQU4sQ0FBZ0JHLE1BRlI7QUFHZkMsVUFBTWIsTUFBTVMsU0FBTixDQUFnQkssU0FBaEIsQ0FBMEIsQ0FBQ2QsTUFBTVMsU0FBTixDQUFnQk0sTUFBakIsRUFBeUJmLE1BQU1TLFNBQU4sQ0FBZ0JHLE1BQXpDLENBQTFCO0FBSFMsQ0FBaEI7O0FBTUEsSUFBSUksU0FBU0MsT0FBT0MsSUFBUCxDQUFZWCxTQUFaLENBQWI7O0FBRUEsSUFBSVksYUFBYW5CLE1BQU1vQixXQUFOLENBQWtCO0FBQUE7O0FBQy9COzs7QUFHQWIsZUFBV0EsU0FKb0I7O0FBTS9COzs7QUFHQWMscUJBQWlCLDJCQUFXO0FBQ3hCLGVBQU87QUFDSGIscUJBQVMsSUFETjtBQUVIRyxtQkFBTyxTQUZKO0FBR0hFLGtCQUFNO0FBSEgsU0FBUDtBQUtILEtBZjhCOztBQWlCL0I7OztBQUdBUyxtQkFBZSx5QkFBVztBQUN0QixlQUFPO0FBQ0hDLG1CQUFPLENBREo7QUFFSEMsb0JBQVEsQ0FGTDtBQUdIQyx3QkFBWSxLQUFLQyxLQUFMLENBQVdiLElBQVgsR0FBa0Isb0JBSDNCO0FBSUhjLHlCQUFhLEtBQUtELEtBQUwsQ0FBV2IsSUFBWCxHQUFrQixvQkFKNUI7QUFLSGUsMEJBQWMsS0FBS0YsS0FBTCxDQUFXYixJQUFYLEdBQWtCLFNBQWxCLEdBQTZCLEtBQUthLEtBQUwsQ0FBV2YsS0FMbkQ7QUFNSGtCLDJCQUFlLEtBQUtILEtBQUwsQ0FBV0c7QUFOdkIsU0FBUDtBQVFILEtBN0I4Qjs7QUErQi9COzs7O0FBSUFDLHVCQUFtQiwyQkFBU0MsQ0FBVCxFQUFZO0FBQzNCLFlBQUlDLFlBQVksQ0FBQzFCLGFBQUQsRUFBZ0IsSUFBaEIsRUFBc0IsSUFBdEIsRUFBNEIsVUFBNUIsRUFBd0MsOEJBQXhDLEVBQXdFMkIsSUFBeEUsQ0FBNkUsR0FBN0UsQ0FBaEI7QUFDQSxZQUFJQyxvQkFBb0IsTUFBeEI7O0FBRUEsZUFBTztBQUNIRix1QkFBV0EsU0FEUjtBQUVIRSwrQkFBbUJBO0FBRmhCLFNBQVA7QUFJSCxLQTNDOEI7O0FBNkMvQjs7OztBQUlBQyxjQUFVLGtCQUFTSixDQUFULEVBQVk7QUFDbEIsZUFBTzdCLE9BQ1o7QUFDQ2tDLG9CQUFRLHVCQURULENBQ2lDO0FBRGpDLFNBRFksRUFJSCxLQUFLZCxhQUFMLENBQW1CUyxDQUFuQixDQUpHLEVBS0gsS0FBS0QsaUJBQUwsQ0FBdUJDLENBQXZCLENBTEcsRUFNSDtBQUNJTSxxQkFBUztBQURiLFNBTkcsQ0FBUDtBQVVILEtBNUQ4Qjs7QUE4RC9COzs7O0FBSUFDLGtCQUFjLHNCQUFTOUIsT0FBVCxFQUFrQjtBQUM1QixZQUFJQSxPQUFKLEVBQWE7QUFDbEIsZ0JBQUlrQixRQUFRVCxPQUFPZixNQUFQLENBQWMsRUFBZCxFQUFrQixLQUFLd0IsS0FBdkIsQ0FBWjs7QUFFQSxnQkFBSW5CLGFBQWFTLE1BQWpCLEVBQXlCO0FBQ3hCLG9CQUFJdUIsT0FBT3ZCLE9BQU93QixNQUFsQjtBQUNBLHFCQUFLLElBQUlULElBQUksQ0FBYixFQUFnQkEsSUFBSVEsSUFBcEIsRUFBMEJSLEdBQTFCLEVBQStCO0FBQzlCLDJCQUFPTCxNQUFNVixPQUFPZSxDQUFQLENBQU4sQ0FBUDtBQUNBO0FBQ0Q7O0FBRVEsbUJBQ1I7QUFBQTtBQUFTTCxxQkFBVDtBQUNnQiw2Q0FBSyxPQUFPLEtBQUtTLFFBQUwsRUFBWjtBQURoQixhQURRO0FBS0g7O0FBRUQsZUFBTyxJQUFQO0FBQ0gsS0FyRjhCOztBQXVGL0JNLFlBQVEsa0JBQVc7QUFDZixlQUFPLEtBQUtILFlBQUwsQ0FBa0IsS0FBS1osS0FBTCxDQUFXbEIsT0FBN0IsQ0FBUDtBQUNIO0FBekY4QixDQUFsQixDQUFqQjs7QUE0RkFrQyxPQUFPQyxPQUFQLEdBQWlCeEIsVUFBakIiLCJmaWxlIjoiU2tld0xvYWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgYXNzaWduID0gcmVxdWlyZSgnZG9ta2l0L2FwcGVuZFZlbmRvclByZWZpeCcpO1xudmFyIGluc2VydEtleWZyYW1lc1J1bGUgPSByZXF1aXJlKCdkb21raXQvaW5zZXJ0S2V5ZnJhbWVzUnVsZScpO1xuXG4vKipcbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cbnZhciBrZXlmcmFtZXMgPSB7XG4gICAgJzI1JSc6IHtcbiAgICAgICAgdHJhbnNmb3JtOiAncGVyc3BlY3RpdmUoMTAwcHgpIHJvdGF0ZVgoMTgwZGVnKSByb3RhdGVZKDApJ1xuICAgIH0sXG4gICAgJzUwJSc6IHtcbiAgICAgICAgdHJhbnNmb3JtOiAncGVyc3BlY3RpdmUoMTAwcHgpIHJvdGF0ZVgoMTgwZGVnKSByb3RhdGVZKDE4MGRlZyknXG4gICAgfSxcbiAgICAnNzUlJzoge1xuICAgICAgICB0cmFuc2Zvcm06ICdwZXJzcGVjdGl2ZSgxMDBweCkgcm90YXRlWCgwKSByb3RhdGVZKDE4MGRlZyknXG4gICAgfSxcbiAgICAnMTAwJSc6IHtcbiAgICAgICAgdHJhbnNmb3JtOiAncGVyc3BlY3RpdmUoMTAwcHgpIHJvdGF0ZVgoMCkgcm90YXRlWSgwKSdcbiAgICB9XG59O1xuXG4vKipcbiAqIEB0eXBlIHtTdHJpbmd9XG4gKi9cbnZhciBhbmltYXRpb25OYW1lID0gaW5zZXJ0S2V5ZnJhbWVzUnVsZShrZXlmcmFtZXMpO1xuXG52YXIgcHJvcFR5cGVzID0ge1xuXHRsb2FkaW5nOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcblx0Y29sb3I6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdHNpemU6IFJlYWN0LlByb3BUeXBlcy5vbmVPZlR5cGUoW1JlYWN0LlByb3BUeXBlcy5udW1iZXIsIFJlYWN0LlByb3BUeXBlcy5zdHJpbmddKSxcbn07XG5cbnZhciBwdEtleXMgPSBPYmplY3Qua2V5cyhwcm9wVHlwZXMpO1xuXG52YXIgU2tld0xvYWRlciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICAvKipcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHByb3BUeXBlczogcHJvcFR5cGVzLFxuXG4gICAgLyoqXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsb2FkaW5nOiB0cnVlLFxuICAgICAgICAgICAgY29sb3I6ICcjZmZmZmZmJyxcbiAgICAgICAgICAgIHNpemU6ICcyMHB4J1xuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgZ2V0U2hhcnBTdHlsZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB3aWR0aDogMCxcbiAgICAgICAgICAgIGhlaWdodDogMCxcbiAgICAgICAgICAgIGJvcmRlckxlZnQ6IHRoaXMucHJvcHMuc2l6ZSArICcgc29saWQgdHJhbnNwYXJlbnQnLFxuICAgICAgICAgICAgYm9yZGVyUmlnaHQ6IHRoaXMucHJvcHMuc2l6ZSArICcgc29saWQgdHJhbnNwYXJlbnQnLFxuICAgICAgICAgICAgYm9yZGVyQm90dG9tOiB0aGlzLnByb3BzLnNpemUgKyAnIHNvbGlkICcrIHRoaXMucHJvcHMuY29sb3IsXG4gICAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiB0aGlzLnByb3BzLnZlcnRpY2FsQWxpZ25cbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtICB7TnVtYmVyfSBpXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIGdldEFuaW1hdGlvblN0eWxlOiBmdW5jdGlvbihpKSB7XG4gICAgICAgIHZhciBhbmltYXRpb24gPSBbYW5pbWF0aW9uTmFtZSwgJzNzJywgJzBzJywgJ2luZmluaXRlJywgJ2N1YmljLWJlemllciguMDksLjU3LC40OSwuOSknXS5qb2luKCcgJyk7XG4gICAgICAgIHZhciBhbmltYXRpb25GaWxsTW9kZSA9ICdib3RoJztcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYW5pbWF0aW9uOiBhbmltYXRpb24sXG4gICAgICAgICAgICBhbmltYXRpb25GaWxsTW9kZTogYW5pbWF0aW9uRmlsbE1vZGVcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtICB7TnVtYmVyfSBpXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIGdldFN0eWxlOiBmdW5jdGlvbihpKSB7XG4gICAgICAgIHJldHVybiBhc3NpZ24oXG5cdFx0XHR7XG5cdFx0XHRcdGJvcmRlcjogJzBweCBzb2xpZCB0cmFuc3BhcmVudCcgLy8gZml4IGZpcmVmb3gvY2hyb21lL29wZXJhIHJlbmRlcmluZ1xuXHRcdFx0fSxcbiAgICAgICAgICAgIHRoaXMuZ2V0U2hhcnBTdHlsZShpKSxcbiAgICAgICAgICAgIHRoaXMuZ2V0QW5pbWF0aW9uU3R5bGUoaSksXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZGlzcGxheTogJ2lubGluZS1ibG9jaydcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtICB7Qm9vbGVhbn0gbG9hZGluZ1xuICAgICAqIEByZXR1cm4ge1JlYWN0Q29tcG9uZW50IHx8IG51bGx9XG4gICAgICovXG4gICAgcmVuZGVyTG9hZGVyOiBmdW5jdGlvbihsb2FkaW5nKSB7XG4gICAgICAgIGlmIChsb2FkaW5nKSB7XG5cdFx0XHR2YXIgcHJvcHMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnByb3BzKTtcblxuXHRcdFx0aWYgKHByb3BUeXBlcyAmJiBwdEtleXMpIHtcblx0XHRcdFx0dmFyIGtsZW4gPSBwdEtleXMubGVuZ3RoO1xuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGtsZW47IGkrKykge1xuXHRcdFx0XHRcdGRlbGV0ZSBwcm9wc1twdEtleXNbaV1dO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cbiAgICAgICAgICAgIHJldHVybiAoXG5cdFx0XHRcdDxkaXYgey4uLnByb3BzfT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17dGhpcy5nZXRTdHlsZSgpfT48L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlckxvYWRlcih0aGlzLnByb3BzLmxvYWRpbmcpO1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNrZXdMb2FkZXI7XG4iXX0=
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

var propTypes = {
    loading: React.PropTypes.bool,
    color: React.PropTypes.string,
    size: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
    margin: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string])
};

var ptKeys = Object.keys(propTypes);

var SquareLoader = React.createClass({
    displayName: 'SquareLoader',

    /**
     * @type {Object}
     */
    propTypes: propTypes,

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
            var props = Object.assign({}, this.props);

            if (propTypes && ptKeys) {
                var klen = ptKeys.length;
                for (var i = 0; i < klen; i++) {
                    delete props[ptKeys[i]];
                }
            }

            return React.createElement(
                'div',
                props,
                React.createElement('div', { style: this.getStyle() })
            );
        }

        return null;
    },

    render: function render() {
        return this.renderLoader(this.props.loading);
    }
});

module.exports = SquareLoader;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNxdWFyZUxvYWRlci5qcyJdLCJuYW1lcyI6WyJSZWFjdCIsInJlcXVpcmUiLCJhc3NpZ24iLCJpbnNlcnRLZXlmcmFtZXNSdWxlIiwia2V5ZnJhbWVzIiwidHJhbnNmb3JtIiwiYW5pbWF0aW9uTmFtZSIsInByb3BUeXBlcyIsImxvYWRpbmciLCJQcm9wVHlwZXMiLCJib29sIiwiY29sb3IiLCJzdHJpbmciLCJzaXplIiwib25lT2ZUeXBlIiwibnVtYmVyIiwibWFyZ2luIiwicHRLZXlzIiwiT2JqZWN0Iiwia2V5cyIsIlNxdWFyZUxvYWRlciIsImNyZWF0ZUNsYXNzIiwiZ2V0RGVmYXVsdFByb3BzIiwiZ2V0U3F1YXJlU3R5bGUiLCJiYWNrZ3JvdW5kQ29sb3IiLCJwcm9wcyIsIndpZHRoIiwiaGVpZ2h0IiwidmVydGljYWxBbGlnbiIsImdldEFuaW1hdGlvblN0eWxlIiwiaSIsImFuaW1hdGlvbiIsImpvaW4iLCJhbmltYXRpb25GaWxsTW9kZSIsInBlcnNwZWN0aXZlIiwiZ2V0U3R5bGUiLCJkaXNwbGF5IiwiYm9yZGVyIiwicmVuZGVyTG9hZGVyIiwia2xlbiIsImxlbmd0aCIsInJlbmRlciIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEsUUFBUUMsUUFBUSxPQUFSLENBQVo7QUFDQSxJQUFJQyxTQUFTRCxRQUFRLDJCQUFSLENBQWI7QUFDQSxJQUFJRSxzQkFBc0JGLFFBQVEsNEJBQVIsQ0FBMUI7O0FBRUE7OztBQUdBLElBQUlHLFlBQVk7QUFDWixXQUFPO0FBQ0hDLG1CQUFXO0FBRFIsS0FESztBQUlaLFdBQU87QUFDSEEsbUJBQVc7QUFEUixLQUpLO0FBT1osV0FBTztBQUNIQSxtQkFBVztBQURSLEtBUEs7QUFVWixZQUFRO0FBQ0pBLG1CQUFXO0FBRFA7QUFWSSxDQUFoQjs7QUFlQTs7O0FBR0EsSUFBSUMsZ0JBQWdCSCxvQkFBb0JDLFNBQXBCLENBQXBCOztBQUVBLElBQUlHLFlBQVk7QUFDZkMsYUFBU1IsTUFBTVMsU0FBTixDQUFnQkMsSUFEVjtBQUVmQyxXQUFPWCxNQUFNUyxTQUFOLENBQWdCRyxNQUZSO0FBR2ZDLFVBQU1iLE1BQU1TLFNBQU4sQ0FBZ0JLLFNBQWhCLENBQTBCLENBQUNkLE1BQU1TLFNBQU4sQ0FBZ0JNLE1BQWpCLEVBQXlCZixNQUFNUyxTQUFOLENBQWdCRyxNQUF6QyxDQUExQixDQUhTO0FBSWZJLFlBQVFoQixNQUFNUyxTQUFOLENBQWdCSyxTQUFoQixDQUEwQixDQUFDZCxNQUFNUyxTQUFOLENBQWdCTSxNQUFqQixFQUF5QmYsTUFBTVMsU0FBTixDQUFnQkcsTUFBekMsQ0FBMUI7QUFKTyxDQUFoQjs7QUFPQSxJQUFJSyxTQUFTQyxPQUFPQyxJQUFQLENBQVlaLFNBQVosQ0FBYjs7QUFFQSxJQUFJYSxlQUFlcEIsTUFBTXFCLFdBQU4sQ0FBa0I7QUFBQTs7QUFDakM7OztBQUdBZCxlQUFXQSxTQUpzQjs7QUFNakM7OztBQUdBZSxxQkFBaUIsMkJBQVc7QUFDeEIsZUFBTztBQUNIZCxxQkFBUyxJQUROO0FBRUhHLG1CQUFPLFNBRko7QUFHSEUsa0JBQU07QUFISCxTQUFQO0FBS0gsS0FmZ0M7O0FBaUJqQzs7O0FBR0FVLG9CQUFnQiwwQkFBVztBQUN2QixlQUFPO0FBQ0hDLDZCQUFpQixLQUFLQyxLQUFMLENBQVdkLEtBRHpCO0FBRUhlLG1CQUFPLEtBQUtELEtBQUwsQ0FBV1osSUFGZjtBQUdIYyxvQkFBUSxLQUFLRixLQUFMLENBQVdaLElBSGhCO0FBSUhlLDJCQUFlLEtBQUtILEtBQUwsQ0FBV0c7QUFKdkIsU0FBUDtBQU1ILEtBM0JnQzs7QUE2QmpDOzs7O0FBSUFDLHVCQUFtQiwyQkFBU0MsQ0FBVCxFQUFZO0FBQzNCLFlBQUlDLFlBQVksQ0FBQ3pCLGFBQUQsRUFBZ0IsSUFBaEIsRUFBc0IsSUFBdEIsRUFBNEIsVUFBNUIsRUFBd0MsOEJBQXhDLEVBQXdFMEIsSUFBeEUsQ0FBNkUsR0FBN0UsQ0FBaEI7QUFDQSxZQUFJQyxvQkFBb0IsTUFBeEI7QUFDQSxZQUFJQyxjQUFjLE9BQWxCOztBQUVBLGVBQU87QUFDSEEseUJBQWFBLFdBRFY7QUFFSEgsdUJBQVdBLFNBRlI7QUFHSEUsK0JBQW1CQTtBQUhoQixTQUFQO0FBS0gsS0EzQ2dDOztBQTZDakM7Ozs7QUFJQUUsY0FBVSxrQkFBU0wsQ0FBVCxFQUFZO0FBQ2xCLGVBQU81QixPQUNILEtBQUtxQixjQUFMLENBQW9CTyxDQUFwQixDQURHLEVBRUgsS0FBS0QsaUJBQUwsQ0FBdUJDLENBQXZCLENBRkcsRUFHSDtBQUNJTSxxQkFBUyxjQURiO0FBRVJDLG9CQUFRLHVCQUZBLENBRXdCO0FBRnhCLFNBSEcsQ0FBUDtBQVFILEtBMURnQzs7QUE0RGpDOzs7O0FBSUFDLGtCQUFjLHNCQUFTOUIsT0FBVCxFQUFrQjtBQUM1QixZQUFJQSxPQUFKLEVBQWE7QUFDbEIsZ0JBQUlpQixRQUFRUCxPQUFPaEIsTUFBUCxDQUFjLEVBQWQsRUFBa0IsS0FBS3VCLEtBQXZCLENBQVo7O0FBRUEsZ0JBQUlsQixhQUFhVSxNQUFqQixFQUF5QjtBQUN4QixvQkFBSXNCLE9BQU90QixPQUFPdUIsTUFBbEI7QUFDQSxxQkFBSyxJQUFJVixJQUFJLENBQWIsRUFBZ0JBLElBQUlTLElBQXBCLEVBQTBCVCxHQUExQixFQUErQjtBQUM5QiwyQkFBT0wsTUFBTVIsT0FBT2EsQ0FBUCxDQUFOLENBQVA7QUFDQTtBQUNEOztBQUVRLG1CQUNSO0FBQUE7QUFBU0wscUJBQVQ7QUFDZ0IsNkNBQUssT0FBTyxLQUFLVSxRQUFMLEVBQVo7QUFEaEIsYUFEUTtBQUtIOztBQUVELGVBQU8sSUFBUDtBQUNILEtBbkZnQzs7QUFxRmpDTSxZQUFRLGtCQUFXO0FBQ2YsZUFBTyxLQUFLSCxZQUFMLENBQWtCLEtBQUtiLEtBQUwsQ0FBV2pCLE9BQTdCLENBQVA7QUFDSDtBQXZGZ0MsQ0FBbEIsQ0FBbkI7O0FBMEZBa0MsT0FBT0MsT0FBUCxHQUFpQnZCLFlBQWpCIiwiZmlsZSI6IlNxdWFyZUxvYWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgYXNzaWduID0gcmVxdWlyZSgnZG9ta2l0L2FwcGVuZFZlbmRvclByZWZpeCcpO1xudmFyIGluc2VydEtleWZyYW1lc1J1bGUgPSByZXF1aXJlKCdkb21raXQvaW5zZXJ0S2V5ZnJhbWVzUnVsZScpO1xuXG4vKipcbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cbnZhciBrZXlmcmFtZXMgPSB7XG4gICAgJzI1JSc6IHtcbiAgICAgICAgdHJhbnNmb3JtOiAncm90YXRlWCgxODBkZWcpIHJvdGF0ZVkoMCknXG4gICAgfSxcbiAgICAnNTAlJzoge1xuICAgICAgICB0cmFuc2Zvcm06ICdyb3RhdGVYKDE4MGRlZykgcm90YXRlWSgxODBkZWcpJ1xuICAgIH0sXG4gICAgJzc1JSc6IHtcbiAgICAgICAgdHJhbnNmb3JtOiAncm90YXRlWCgwKSByb3RhdGVZKDE4MGRlZyknXG4gICAgfSxcbiAgICAnMTAwJSc6IHtcbiAgICAgICAgdHJhbnNmb3JtOiAncm90YXRlWCgwKSByb3RhdGVZKDApJ1xuICAgIH1cbn07XG5cbi8qKlxuICogQHR5cGUge1N0cmluZ31cbiAqL1xudmFyIGFuaW1hdGlvbk5hbWUgPSBpbnNlcnRLZXlmcmFtZXNSdWxlKGtleWZyYW1lcyk7XG5cbnZhciBwcm9wVHlwZXMgPSB7XG5cdGxvYWRpbmc6IFJlYWN0LlByb3BUeXBlcy5ib29sLFxuXHRjb2xvcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcblx0c2l6ZTogUmVhY3QuUHJvcFR5cGVzLm9uZU9mVHlwZShbUmVhY3QuUHJvcFR5cGVzLm51bWJlciwgUmVhY3QuUHJvcFR5cGVzLnN0cmluZ10pLFxuXHRtYXJnaW46IFJlYWN0LlByb3BUeXBlcy5vbmVPZlR5cGUoW1JlYWN0LlByb3BUeXBlcy5udW1iZXIsIFJlYWN0LlByb3BUeXBlcy5zdHJpbmddKSxcbn07XG5cbnZhciBwdEtleXMgPSBPYmplY3Qua2V5cyhwcm9wVHlwZXMpO1xuXG52YXIgU3F1YXJlTG9hZGVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgIC8qKlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgcHJvcFR5cGVzOiBwcm9wVHlwZXMsXG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICovXG4gICAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGxvYWRpbmc6IHRydWUsXG4gICAgICAgICAgICBjb2xvcjogJyNmZmZmZmYnLFxuICAgICAgICAgICAgc2l6ZTogJzUwcHgnXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBnZXRTcXVhcmVTdHlsZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHRoaXMucHJvcHMuY29sb3IsXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5wcm9wcy5zaXplLFxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnByb3BzLnNpemUsXG4gICAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiB0aGlzLnByb3BzLnZlcnRpY2FsQWxpZ25cbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtICB7TnVtYmVyfSBpXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIGdldEFuaW1hdGlvblN0eWxlOiBmdW5jdGlvbihpKSB7XG4gICAgICAgIHZhciBhbmltYXRpb24gPSBbYW5pbWF0aW9uTmFtZSwgJzNzJywgJzBzJywgJ2luZmluaXRlJywgJ2N1YmljLWJlemllciguMDksLjU3LC40OSwuOSknXS5qb2luKCcgJyk7XG4gICAgICAgIHZhciBhbmltYXRpb25GaWxsTW9kZSA9ICdib3RoJztcbiAgICAgICAgdmFyIHBlcnNwZWN0aXZlID0gJzEwMHB4JztcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcGVyc3BlY3RpdmU6IHBlcnNwZWN0aXZlLFxuICAgICAgICAgICAgYW5pbWF0aW9uOiBhbmltYXRpb24sXG4gICAgICAgICAgICBhbmltYXRpb25GaWxsTW9kZTogYW5pbWF0aW9uRmlsbE1vZGVcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtICB7TnVtYmVyfSBpXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIGdldFN0eWxlOiBmdW5jdGlvbihpKSB7XG4gICAgICAgIHJldHVybiBhc3NpZ24oXG4gICAgICAgICAgICB0aGlzLmdldFNxdWFyZVN0eWxlKGkpLFxuICAgICAgICAgICAgdGhpcy5nZXRBbmltYXRpb25TdHlsZShpKSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJyxcblx0XHRcdFx0Ym9yZGVyOiAnMHB4IHNvbGlkIHRyYW5zcGFyZW50JyAvLyBmaXggZmlyZWZveC9jaHJvbWUvb3BlcmEgcmVuZGVyaW5nXG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSAge0Jvb2xlYW59IGxvYWRpbmdcbiAgICAgKiBAcmV0dXJuIHtSZWFjdENvbXBvbmVudCB8fCBudWxsfVxuICAgICAqL1xuICAgIHJlbmRlckxvYWRlcjogZnVuY3Rpb24obG9hZGluZykge1xuICAgICAgICBpZiAobG9hZGluZykge1xuXHRcdFx0dmFyIHByb3BzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5wcm9wcyk7XG5cblx0XHRcdGlmIChwcm9wVHlwZXMgJiYgcHRLZXlzKSB7XG5cdFx0XHRcdHZhciBrbGVuID0gcHRLZXlzLmxlbmd0aDtcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBrbGVuOyBpKyspIHtcblx0XHRcdFx0XHRkZWxldGUgcHJvcHNbcHRLZXlzW2ldXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG4gICAgICAgICAgICByZXR1cm4gKFxuXHRcdFx0XHQ8ZGl2IHsuLi5wcm9wc30+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RoaXMuZ2V0U3R5bGUoKX0+PC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlckxvYWRlcih0aGlzLnByb3BzLmxvYWRpbmcpO1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNxdWFyZUxvYWRlcjtcbiJdfQ==
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

var propTypes = {
    loading: React.PropTypes.bool,
    color: React.PropTypes.string,
    size: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
    margin: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string])
};

var ptKeys = Object.keys(propTypes);

var SyncLoader = React.createClass({
    displayName: 'SyncLoader',

    /**
     * @type {Object}
     */
    propTypes: propTypes,

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
            var props = Object.assign({}, this.props);

            if (propTypes && ptKeys) {
                var klen = ptKeys.length;
                for (var i = 0; i < klen; i++) {
                    delete props[ptKeys[i]];
                }
            }

            return React.createElement(
                'div',
                props,
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

module.exports = SyncLoader;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlN5bmNMb2FkZXIuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJyZXF1aXJlIiwiYXNzaWduIiwiaW5zZXJ0S2V5ZnJhbWVzUnVsZSIsImtleWZyYW1lcyIsInRyYW5zZm9ybSIsImFuaW1hdGlvbk5hbWUiLCJwcm9wVHlwZXMiLCJsb2FkaW5nIiwiUHJvcFR5cGVzIiwiYm9vbCIsImNvbG9yIiwic3RyaW5nIiwic2l6ZSIsIm9uZU9mVHlwZSIsIm51bWJlciIsIm1hcmdpbiIsInB0S2V5cyIsIk9iamVjdCIsImtleXMiLCJTeW5jTG9hZGVyIiwiY3JlYXRlQ2xhc3MiLCJnZXREZWZhdWx0UHJvcHMiLCJnZXRCYWxsU3R5bGUiLCJiYWNrZ3JvdW5kQ29sb3IiLCJwcm9wcyIsIndpZHRoIiwiaGVpZ2h0IiwiYm9yZGVyUmFkaXVzIiwidmVydGljYWxBbGlnbiIsImdldEFuaW1hdGlvblN0eWxlIiwiaSIsImFuaW1hdGlvbiIsImpvaW4iLCJhbmltYXRpb25GaWxsTW9kZSIsImdldFN0eWxlIiwiZGlzcGxheSIsImJvcmRlciIsInJlbmRlckxvYWRlciIsImtsZW4iLCJsZW5ndGgiLCJyZW5kZXIiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUlBLFFBQVFDLFFBQVEsT0FBUixDQUFaO0FBQ0EsSUFBSUMsU0FBU0QsUUFBUSwyQkFBUixDQUFiO0FBQ0EsSUFBSUUsc0JBQXNCRixRQUFRLDRCQUFSLENBQTFCOztBQUVBOzs7QUFHQSxJQUFJRyxZQUFZO0FBQ1osV0FBTztBQUNIQyxtQkFBVztBQURSLEtBREs7QUFJWixXQUFPO0FBQ0hBLG1CQUFXO0FBRFIsS0FKSztBQU9aLFlBQVE7QUFDSkEsbUJBQVc7QUFEUDtBQVBJLENBQWhCOztBQVlBOzs7QUFHQSxJQUFJQyxnQkFBZ0JILG9CQUFvQkMsU0FBcEIsQ0FBcEI7O0FBRUEsSUFBSUcsWUFBWTtBQUNmQyxhQUFTUixNQUFNUyxTQUFOLENBQWdCQyxJQURWO0FBRWZDLFdBQU9YLE1B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QUExRjhCLENBQWxCLENBQWpCOztBQTZGQWtDLE9BQU9DLE9BQVAsR0FBaUJ2QixVQUFqQiIsImZpbGUiOiJTeW5jTG9hZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBhc3NpZ24gPSByZXF1aXJlKCdkb21raXQvYXBwZW5kVmVuZG9yUHJlZml4Jyk7XG52YXIgaW5zZXJ0S2V5ZnJhbWVzUnVsZSA9IHJlcXVpcmUoJ2RvbWtpdC9pbnNlcnRLZXlmcmFtZXNSdWxlJyk7XG5cbi8qKlxuICogQHR5cGUge09iamVjdH1cbiAqL1xudmFyIGtleWZyYW1lcyA9IHtcbiAgICAnMzMlJzoge1xuICAgICAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKDEwcHgpJ1xuICAgIH0sXG4gICAgJzY2JSc6IHtcbiAgICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlWSgtMTBweCknXG4gICAgfSxcbiAgICAnMTAwJSc6IHtcbiAgICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlWSgwKSdcbiAgICB9XG59O1xuXG4vKipcbiAqIEB0eXBlIHtTdHJpbmd9XG4gKi9cbnZhciBhbmltYXRpb25OYW1lID0gaW5zZXJ0S2V5ZnJhbWVzUnVsZShrZXlmcmFtZXMpO1xuXG52YXIgcHJvcFR5cGVzID0ge1xuXHRsb2FkaW5nOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcblx0Y29sb3I6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG5cdHNpemU6IFJlYWN0LlByb3BUeXBlcy5vbmVPZlR5cGUoW1JlYWN0LlByb3BUeXBlcy5udW1iZXIsIFJlYWN0LlByb3BUeXBlcy5zdHJpbmddKSxcblx0bWFyZ2luOiBSZWFjdC5Qcm9wVHlwZXMub25lT2ZUeXBlKFtSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLCBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXSksXG59O1xuXG52YXIgcHRLZXlzID0gT2JqZWN0LmtleXMocHJvcFR5cGVzKTtcblxudmFyIFN5bmNMb2FkZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAgLyoqXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICBwcm9wVHlwZXM6IHByb3BUeXBlcyxcblxuICAgIC8qKlxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbG9hZGluZzogdHJ1ZSxcbiAgICAgICAgICAgIGNvbG9yOiAnI2ZmZmZmZicsXG4gICAgICAgICAgICBzaXplOiAnMTVweCcsXG4gICAgICAgICAgICBtYXJnaW46ICcycHgnXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBnZXRCYWxsU3R5bGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiB0aGlzLnByb3BzLmNvbG9yLFxuICAgICAgICAgICAgd2lkdGg6IHRoaXMucHJvcHMuc2l6ZSxcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5wcm9wcy5zaXplLFxuICAgICAgICAgICAgbWFyZ2luOiB0aGlzLnByb3BzLm1hcmdpbixcbiAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzEwMCUnLFxuICAgICAgICAgICAgdmVydGljYWxBbGlnbjogdGhpcy5wcm9wcy52ZXJ0aWNhbEFsaWduXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSAge051bWJlcn0gaVxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBnZXRBbmltYXRpb25TdHlsZTogZnVuY3Rpb24oaSkge1xuICAgICAgICB2YXIgYW5pbWF0aW9uID0gW2FuaW1hdGlvbk5hbWUsICcwLjZzJywgKGkgKiAwLjA3KSArICdzJywgJ2luZmluaXRlJywgJ2Vhc2UtaW4tb3V0J10uam9pbignICcpO1xuICAgICAgICB2YXIgYW5pbWF0aW9uRmlsbE1vZGUgPSAnYm90aCc7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGFuaW1hdGlvbjogYW5pbWF0aW9uLFxuICAgICAgICAgICAgYW5pbWF0aW9uRmlsbE1vZGU6IGFuaW1hdGlvbkZpbGxNb2RlXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSAge051bWJlcn0gaVxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBnZXRTdHlsZTogZnVuY3Rpb24oaSkge1xuICAgICAgICByZXR1cm4gYXNzaWduKFxuICAgICAgICAgICAgdGhpcy5nZXRCYWxsU3R5bGUoaSksXG4gICAgICAgICAgICB0aGlzLmdldEFuaW1hdGlvblN0eWxlKGkpLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLFxuXHRcdFx0XHRib3JkZXI6ICcwcHggc29saWQgdHJhbnNwYXJlbnQnIC8vIGZpeCBmaXJlZm94L2Nocm9tZS9vcGVyYSByZW5kZXJpbmdcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtICB7Qm9vbGVhbn0gbG9hZGluZ1xuICAgICAqIEByZXR1cm4ge1JlYWN0Q29tcG9uZW50IHx8IG51bGx9XG4gICAgICovXG4gICAgcmVuZGVyTG9hZGVyOiBmdW5jdGlvbihsb2FkaW5nKSB7XG4gICAgICAgIGlmIChsb2FkaW5nKSB7XG5cdFx0XHR2YXIgcHJvcHMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnByb3BzKTtcblxuXHRcdFx0aWYgKHByb3BUeXBlcyAmJiBwdEtleXMpIHtcblx0XHRcdFx0dmFyIGtsZW4gPSBwdEtleXMubGVuZ3RoO1xuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGtsZW47IGkrKykge1xuXHRcdFx0XHRcdGRlbGV0ZSBwcm9wc1twdEtleXNbaV1dO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cbiAgICAgICAgICAgIHJldHVybiAoXG5cdFx0XHRcdDxkaXYgey4uLnByb3BzfT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17dGhpcy5nZXRTdHlsZSgxKX0+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3RoaXMuZ2V0U3R5bGUoMil9PjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt0aGlzLmdldFN0eWxlKDMpfT48L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlckxvYWRlcih0aGlzLnByb3BzLmxvYWRpbmcpO1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN5bmNMb2FkZXI7XG4iXX0=
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
