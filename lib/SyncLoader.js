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

  /**
   * @type {String}
   */
};var animationName = (0, _insertKeyframesRule2.default)(keyframes);

var propTypes = {
  loading: _propTypes2.default.bool,
  color: _propTypes2.default.string,
  size: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
  margin: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
  verticalAlign: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string])
};

var ptKeys = Object.keys(propTypes);

var SyncLoader = function (_Component) {
  _inherits(SyncLoader, _Component);

  function SyncLoader() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, SyncLoader);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = SyncLoader.__proto__ || Object.getPrototypeOf(SyncLoader)).call.apply(_ref, [this].concat(args))), _this), _this.getBallStyle = function () {
      return {
        backgroundColor: _this.props.color,
        width: _this.props.size,
        height: _this.props.size,
        margin: _this.props.margin,
        borderRadius: '100%',
        verticalAlign: _this.props.verticalAlign
      };
    }, _this.getAnimationStyle = function (i) {
      var animation = [animationName, '0.6s', i * 0.07 + 's', 'infinite', 'ease-in-out'].join(' ');
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
          _react2.default.createElement('div', { style: _this.getStyle(3) })
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


  _createClass(SyncLoader, [{
    key: 'render',
    value: function render() {
      return this.renderLoader(this.props.loading);
    }
  }]);

  return SyncLoader;
}(_react.Component);

SyncLoader.propTypes = propTypes;
SyncLoader.defaultProps = {
  loading: true,
  color: '#ffffff',
  size: '15px',
  margin: '2px' };
exports.default = SyncLoader;
module.exports = exports['default'];
//# sourceMappingURL=SyncLoader.js.map