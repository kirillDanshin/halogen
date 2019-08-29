'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templateObject = _taggedTemplateLiteral(['\n  0% {\n    transform: rotate(0deg) scale(1);\n  }\n\n  50% {\n    transform: rotate(180deg) scale(0.8);\n  }\n\n  100% {\n    transform: rotate(360deg) scale(1);\n  }\n'], ['\n  0% {\n    transform: rotate(0deg) scale(1);\n  }\n\n  50% {\n    transform: rotate(180deg) scale(0.8);\n  }\n\n  100% {\n    transform: rotate(360deg) scale(1);\n  }\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  width: ', ';\n  height: ', ';\n  border: 2px solid;\n  border-color: ', ';\n  border-bottom-color: transparent;\n  border-radius: 100%;\n  background: transparent !important;\n  vertical-align: ', ';\n  animation: ', ' 0.75s 0s infinite linear;\n  animation-fill-mode: both;\n  display: inline-block;\n'], ['\n  width: ', ';\n  height: ', ';\n  border: 2px solid;\n  border-color: ', ';\n  border-bottom-color: transparent;\n  border-radius: 100%;\n  background: transparent !important;\n  vertical-align: ', ';\n  animation: ', ' 0.75s 0s infinite linear;\n  animation-fill-mode: both;\n  display: inline-block;\n']);

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

var getSize = function getSize(size) {
  return typeof size === 'number' ? size + 'px' : size;
};

var animation = (0, _styledComponents.keyframes)(_templateObject);

var Circle = _styledComponents2.default.div(_templateObject2, function (_ref) {
  var size = _ref.size;
  return getSize(size);
}, function (_ref2) {
  var size = _ref2.size;
  return getSize(size);
}, function (_ref3) {
  var color = _ref3.color;
  return color;
}, function (_ref4) {
  var verticalAlign = _ref4.verticalAlign;
  return getSize(verticalAlign);
}, animation);

var ClipLoader = function (_Component) {
  _inherits(ClipLoader, _Component);

  function ClipLoader() {
    _classCallCheck(this, ClipLoader);

    return _possibleConstructorReturn(this, (ClipLoader.__proto__ || Object.getPrototypeOf(ClipLoader)).apply(this, arguments));
  }

  _createClass(ClipLoader, [{
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

        var circleProps = ptKeys.reduce(function (acc, key) {
          return key === 'loading' ? acc : _extends({}, acc, _defineProperty({}, key, _this2.props[key]));
        }, {});

        return _react2.default.createElement(
          'div',
          props,
          _react2.default.createElement(Circle, circleProps)
        );
      }

      return null;
    }
  }]);

  return ClipLoader;
}(_react.Component);

ClipLoader.propTypes = propTypes;
ClipLoader.defaultProps = {
  loading: true,
  color: '#ffffff',
  size: '35px'
};
exports.default = ClipLoader;
module.exports = exports['default'];
//# sourceMappingURL=ClipLoader.js.map