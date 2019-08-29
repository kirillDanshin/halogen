'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templateObject = _taggedTemplateLiteral(['\n  100% {\n    transform: rotate(360deg);\n  }\n'], ['\n  100% {\n    transform: rotate(360deg);\n  }\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  animation: ', ' 0.6s 0s infinite linear;\n  animation-fill-mode: forwards;\n  position: relative;\n  border: 0px solid transparent;\n'], ['\n  animation: ', ' 0.6s 0s infinite linear;\n  animation-fill-mode: forwards;\n  position: relative;\n  border: 0px solid transparent;\n']),
    _templateObject3 = _taggedTemplateLiteral(['\n  border: 0px solid transparent;\n  width: ', 'px;\n  height: ', 'px;\n  border-radius: 100%;\n  vertical-align: ', ';\n  ', '\n'], ['\n  border: 0px solid transparent;\n  width: ', 'px;\n  height: ', 'px;\n  border-radius: 100%;\n  vertical-align: ', ';\n  ', '\n']),
    _templateObject4 = _taggedTemplateLiteral(['\n    animation: ', ' 0.6s 0s infinite linear;\n    animation-fill-mode: forwards;\n    background-color: ', ';\n    opacity: 0.8;\n    position: absolute;\n    top: ', 'px;\n  '], ['\n    animation: ', ' 0.6s 0s infinite linear;\n    animation-fill-mode: forwards;\n    background-color: ', ';\n    opacity: 0.8;\n    position: absolute;\n    top: ', 'px;\n  ']),
    _templateObject5 = _taggedTemplateLiteral(['\n    border: ', ';\n    opacity: 0.1;\n  '], ['\n    border: ', ';\n    opacity: 0.1;\n  ']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var propTypes = {
  loading: _propTypes2.default.bool,
  color: _propTypes2.default.string,
  size: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
  verticalAlign: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string])
};

var ptKeys = Object.keys(propTypes);

var getNumberSize = function getNumberSize(size) {
  return parseInt(size, 10) | 0;
};
var getSize = function getSize(size) {
  return typeof size === 'number' ? size + 'px' : size;
};

var animation = (0, _styledComponents.keyframes)(_templateObject);

var Wrapper = _styledComponents2.default.div(_templateObject2, animation);

var Ball = _styledComponents2.default.div(_templateObject3, function (_ref) {
  var size = _ref.size,
      idx = _ref.idx;
  return idx === 1 ? getNumberSize(size) / 7 : getNumberSize(size);
}, function (_ref2) {
  var size = _ref2.size,
      idx = _ref2.idx;
  return idx === 1 ? getNumberSize(size) / 7 : getNumberSize(size);
}, function (_ref3) {
  var verticalAlign = _ref3.verticalAlign;
  return getSize(verticalAlign);
}, function (_ref4) {
  var idx = _ref4.idx;
  return idx === 1 ? (0, _styledComponents.css)(_templateObject4, animation, function (_ref5) {
    var color = _ref5.color;
    return color;
  }, function (_ref6) {
    var size = _ref6.size;
    return getNumberSize(size) / 2 - getNumberSize(size) / 14;
  }) : (0, _styledComponents.css)(_templateObject5, function (_ref7) {
    var size = _ref7.size,
        color = _ref7.color;
    return getNumberSize(size) / 7 + 'px solid ' + color;
  });
});

var MoonLoader = function (_Component) {
  _inherits(MoonLoader, _Component);

  function MoonLoader() {
    _classCallCheck(this, MoonLoader);

    return _possibleConstructorReturn(this, (MoonLoader.__proto__ || Object.getPrototypeOf(MoonLoader)).apply(this, arguments));
  }

  _createClass(MoonLoader, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var loading = this.props.loading;


      if (loading) {
        var props = _extends({}, this.props);

        if (propTypes && ptKeys) {
          var klen = ptKeys.length;
          for (var i = 0; i < klen; i++) {
            delete props[ptKeys[i]];
          }
        }

        var ballProps = ptKeys.reduce(function (acc, key) {
          return key === 'loading' ? acc : _extends({}, acc, _defineProperty({}, key, _this2.props[key]));
        }, {});

        return _react2.default.createElement(
          'div',
          props,
          _react2.default.createElement(
            Wrapper,
            null,
            _react2.default.createElement(Ball, _extends({}, ballProps, { idx: 1 })),
            _react2.default.createElement(Ball, _extends({}, ballProps, { idx: 2 }))
          )
        );
      }

      return null;
    }
  }]);

  return MoonLoader;
}(_react.Component);

MoonLoader.propTypes = propTypes;
MoonLoader.defaultProps = {
  loading: true,
  color: '#ffffff',
  size: '60px'
};
exports.default = MoonLoader;
module.exports = exports['default'];
//# sourceMappingURL=MoonLoader.js.map