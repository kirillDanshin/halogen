'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _appendVendorPrefix = require('domkit/appendVendorPrefix');

var _appendVendorPrefix2 = _interopRequireDefault(_appendVendorPrefix);

var _insertKeyframesRule = require('domkit/insertKeyframesRule');

var _insertKeyframesRule2 = _interopRequireDefault(_insertKeyframesRule);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

  /**
   * @type {Object}
   */
};var keyframesOdd = {
  '0%': {
    transform: 'scale(0.4)'
  },
  25: {
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

  /**
   * @type {String}
   */
};var animationNameEven = (0, _insertKeyframesRule2.default)(keyframesEven);

/**
 * @type {String}
 */
var animationNameOdd = (0, _insertKeyframesRule2.default)(keyframesOdd);

var propTypes = {
  loading: _propTypes2.default.bool,
  color: _propTypes2.default.string,
  size: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
  margin: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
  verticalAlign: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string])
};

var ptKeys = Object.keys(propTypes);

var RiseLoader = function (_Component) {
  _inherits(RiseLoader, _Component);

  function RiseLoader() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, RiseLoader);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = RiseLoader.__proto__ || Object.getPrototypeOf(RiseLoader)).call.apply(_ref, [this].concat(args))), _this), _this.getBallStyle = function () {
      return {
        backgroundColor: _this.props.color,
        width: _this.props.size,
        height: _this.props.size,
        margin: _this.props.margin,
        borderRadius: '100%',
        verticalAlign: _this.props.verticalAlign
      };
    }, _this.getAnimationStyle = function (i) {
      var animation = [i % 2 === 0 ? animationNameEven : animationNameOdd, '1s', '0s', 'infinite', 'cubic-bezier(.15,.46,.9,.6)'].join(' ');
      var animationFillMode = 'both';

      return {
        animation: animation,
        animationFillMode: animationFillMode
      };
    }, _this.getStyle = function (i) {
      return (0, _appendVendorPrefix2.default)(_this.getBallStyle(i), _this.getAnimationStyle(i), {
        display: 'inline-block',
        border: '0px solid transparent' // fix firefox/chrome/opera rendering
      });
    }, _this.renderLoader = function (loading) {
      if (loading) {
        var props = Object.assign({}, _this.props);

        if (propTypes && ptKeys) {
          var klen = ptKeys.length;
          for (var i = 0; i < klen; i++) {
            delete props[ptKeys[i]];
          }
        }

        return _react2.default.createElement(
          'div',
          props,
          _react2.default.createElement('div', { style: _this.getStyle(1) }),
          _react2.default.createElement('div', { style: _this.getStyle(2) }),
          _react2.default.createElement('div', { style: _this.getStyle(3) }),
          _react2.default.createElement('div', { style: _this.getStyle(4) }),
          _react2.default.createElement('div', { style: _this.getStyle(5) })
        );
      }

      return null;
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }
  /**
   * @type {Object}
   */


  /**
   * @return {Object}
   */


  /**
   * @param  {Number} i
   * @return {Object}
   */


  /**
   * @param  {Number} i
   * @return {Object}
   */


  /**
   * @param  {Boolean} loading
   * @return {ReactComponent || null}
   */


  _createClass(RiseLoader, [{
    key: 'render',
    value: function render() {
      return this.renderLoader(this.props.loading);
    }
  }]);

  return RiseLoader;
}(_react.Component);

RiseLoader.propTypes = propTypes;
RiseLoader.defaultProps = {
  loading: true,
  color: '#ffffff',
  size: '15px',
  margin: '2px' };
exports.default = RiseLoader;
module.exports = exports['default'];
//# sourceMappingURL=RiseLoader.js.map