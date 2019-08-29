'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templateObject = _taggedTemplateLiteral(['\n  0% {\n    transform: rotate(0deg);\n  }\n\n  50% {\n    transform: rotate(180deg);\n  }\n\n  100% {\n    transform: rotate(360deg);\n  }\n'], ['\n  0% {\n    transform: rotate(0deg);\n  }\n\n  50% {\n    transform: rotate(180deg);\n  }\n\n  100% {\n    transform: rotate(360deg);\n  }\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  background-color: ', ';\n  width: ', ';\n  height: ', ';\n  margin: ', ';\n  border-radius: 100%;\n  vertical-align: ', ';\n  animation: ', ' 1s 0s infinite cubic-bezier(.7,-.13,.22,.86);\n  animation-fill-mode: both;\n  display: inline-block;\n  position: relative;\n  border: 0px solid transparent;\n'], ['\n  background-color: ', ';\n  width: ', ';\n  height: ', ';\n  margin: ', ';\n  border-radius: 100%;\n  vertical-align: ', ';\n  animation: ', ' 1s 0s infinite cubic-bezier(.7,-.13,.22,.86);\n  animation-fill-mode: both;\n  display: inline-block;\n  position: relative;\n  border: 0px solid transparent;\n']),
    _templateObject3 = _taggedTemplateLiteral(['\n  background-color: ', ';\n  width: ', ';\n  height: ', ';\n  margin: ', ';\n  border-radius: 100%;\n  vertical-align: ', ';\n  opacity: 0.8;\n  position: absolute;\n  top: 0;\n  left: ', 'px;\n  border: 0px solid transparent;\n'], ['\n  background-color: ', ';\n  width: ', ';\n  height: ', ';\n  margin: ', ';\n  border-radius: 100%;\n  vertical-align: ', ';\n  opacity: 0.8;\n  position: absolute;\n  top: 0;\n  left: ', 'px;\n  border: 0px solid transparent;\n']);

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
  margin: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
  verticalAlign: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string])
};

var ptKeys = Object.keys(propTypes);

var getSize = function getSize(size) {
  return typeof size === 'number' ? size + 'px' : size;
};

var animation = (0, _styledComponents.keyframes)(_templateObject);

var Wrapper = _styledComponents2.default.div(_templateObject2, function (_ref) {
  var color = _ref.color;
  return color;
}, function (_ref2) {
  var size = _ref2.size;
  return getSize(size);
}, function (_ref3) {
  var size = _ref3.size;
  return getSize(size);
}, function (_ref4) {
  var margin = _ref4.margin;
  return getSize(margin);
}, function (_ref5) {
  var verticalAlign = _ref5.verticalAlign;
  return getSize(verticalAlign);
}, animation);

var Ball = _styledComponents2.default.div(_templateObject3, function (_ref6) {
  var color = _ref6.color;
  return color;
}, function (_ref7) {
  var size = _ref7.size;
  return getSize(size);
}, function (_ref8) {
  var size = _ref8.size;
  return getSize(size);
}, function (_ref9) {
  var margin = _ref9.margin;
  return getSize(margin);
}, function (_ref10) {
  var verticalAlign = _ref10.verticalAlign;
  return getSize(verticalAlign);
}, function (_ref11) {
  var idx = _ref11.idx;
  return idx % 2 ? -28 : 25;
});

var RotateLoader = function (_Component) {
  _inherits(RotateLoader, _Component);

  function RotateLoader() {
    _classCallCheck(this, RotateLoader);

    return _possibleConstructorReturn(this, (RotateLoader.__proto__ || Object.getPrototypeOf(RotateLoader)).apply(this, arguments));
  }

  _createClass(RotateLoader, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var loading = this.props.loading;


      if (loading) {
        var props = Object.assign({}, this.props);

        if (propTypes && ptKeys) {
          var klen = ptKeys.length;
          for (var i = 0; i < klen; i++) {
            delete props[ptKeys[i]];
          }
        }

        var componentsProps = ptKeys.reduce(function (acc, key) {
          return key === 'loading' ? acc : _extends({}, acc, _defineProperty({}, key, _this2.props[key]));
        }, {});

        return _react2.default.createElement(
          'div',
          props,
          _react2.default.createElement(
            Wrapper,
            componentsProps,
            _react2.default.createElement(Ball, _extends({}, componentsProps, { idx: 1 })),
            _react2.default.createElement(Ball, _extends({}, componentsProps, { idx: 2 }))
          )
        );
      }

      return null;
    }
  }]);

  return RotateLoader;
}(_react.Component);

RotateLoader.propTypes = propTypes;
RotateLoader.defaultProps = {
  loading: true,
  color: '#ffffff',
  size: '15px',
  margin: '2px'
};
exports.default = RotateLoader;
module.exports = exports['default'];
//# sourceMappingURL=RotateLoader.js.map