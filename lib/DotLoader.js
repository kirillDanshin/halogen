'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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
 * @type {Object}
 */
var rotateKeyframes = {
  '100%': {
    transform: 'rotate(360deg)'
  }

  /**
   * @type {Object}
   */
};var bounceKeyframes = {
  '0%, 100%': {
    transform: 'scale(0)'
  },
  '50%': {
    transform: 'scale(1.0)'
  }

  /**
   * @type {String}
   */
};var rotateAnimationName = (0, _insertKeyframesRule2.default)(rotateKeyframes);

/**
 * @type {String}
 */
var bounceAnimationName = (0, _insertKeyframesRule2.default)(bounceKeyframes);

var propTypes = {
  loading: _propTypes2.default.bool,
  color: _propTypes2.default.string,
  size: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
  margin: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
  verticalAlign: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string])
};

var ptKeys = Object.keys(propTypes);

var DotLoader = function (_Component) {
  _inherits(DotLoader, _Component);

  function DotLoader() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, DotLoader);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = DotLoader.__proto__ || Object.getPrototypeOf(DotLoader)).call.apply(_ref, [this].concat(args))), _this), _this.getBallStyle = function (size) {
      return {
        backgroundColor: _this.props.color,
        width: size,
        height: size,
        borderRadius: '100%',
        verticalAlign: _this.props.verticalAlign
      };
    }, _this.getAnimationStyle = function (i) {
      var animation = [i === 0 ? rotateAnimationName : bounceAnimationName, '2s', i === 2 ? '-1s' : '0s', 'infinite', 'linear'].join(' ');
      var animationFillMode = 'forwards';

      return {
        animation: animation,
        animationFillMode: animationFillMode
      };
    }, _this.getStyle = function (i) {
      var size = _this.props.size | 0;
      var ballSize = size / 2;

      if (i) {
        return (0, _appendVendorPrefix2.default)(_this.getBallStyle(ballSize), _this.getAnimationStyle(i), {
          position: 'absolute',
          top: i % 2 ? 0 : 'auto',
          bottom: i % 2 ? 'auto' : 0,
          border: '0px solid transparent' // fix firefox/chrome/opera rendering
        });
      }

      return (0, _appendVendorPrefix2.default)(_this.getAnimationStyle(i), {
        width: size,
        height: size,
        position: 'relative',
        border: '0px solid transparent' // fix firefox/chrome/opera rendering
      });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  /**
   * @param  {String} size
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


  _createClass(DotLoader, [{
    key: 'render',
    value: function render() {
      var loading = this.props.loading;


      if (loading) {
        var props = _extends({}, this.props);

        if (propTypes && ptKeys) {
          var klen = ptKeys.length;
          for (var i = 0; i < klen; i++) {
            delete props[ptKeys[i]];
          }
        }

        return _react2.default.createElement(
          'div',
          props,
          _react2.default.createElement(
            'div',
            { style: this.getStyle(0) },
            _react2.default.createElement('div', { style: this.getStyle(1) }),
            _react2.default.createElement('div', { style: this.getStyle(2) })
          )
        );
      }

      return null;
    }
  }]);

  return DotLoader;
}(_react.Component);

DotLoader.propTypes = propTypes;
DotLoader.defaultProps = {
  loading: true,
  color: '#ffffff',
  size: '60px' };
exports.default = DotLoader;
module.exports = exports['default'];
//# sourceMappingURL=DotLoader.js.map