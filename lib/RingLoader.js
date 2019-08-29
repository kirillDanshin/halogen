'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templateObject = _taggedTemplateLiteral(['\n  0% {\n    transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);\n  }\n\n  100% {\n    transform: rotateX(180deg) rotateY(360deg) rotateZ(360deg);\n  }\n'], ['\n  0% {\n    transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);\n  }\n\n  100% {\n    transform: rotateX(180deg) rotateY(360deg) rotateZ(360deg);\n  }\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  0% {\n    transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);\n  }\n\n  100% {\n    transform: rotateX(360deg) rotateY(180deg) rotateZ(360deg);\n  }\n'], ['\n  0% {\n    transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);\n  }\n\n  100% {\n    transform: rotateX(360deg) rotateY(180deg) rotateZ(360deg);\n  }\n']),
    _templateObject3 = _taggedTemplateLiteral(['\n  width: ', ';\n  height: ', ';\n  position: relative;\n  border: 0px solid transparent;\n'], ['\n  width: ', ';\n  height: ', ';\n  position: relative;\n  border: 0px solid transparent;\n']),
    _templateObject4 = _taggedTemplateLiteral(['\n  border: 0px solid transparent;\n  width: ', ';\n  height: ', ';\n  border: ', 'px solid ', ';\n  opacity: 0.4;\n  border-radius: 100%;\n  vertical-align: ', ';\n  perspective: 800px;\n  animation: ', ' 2s 0s infinite linear;\n  animation-fill-mode: forwards;\n  position: absolute;\n  top: 0;\n  left: 0;\n'], ['\n  border: 0px solid transparent;\n  width: ', ';\n  height: ', ';\n  border: ', 'px solid ', ';\n  opacity: 0.4;\n  border-radius: 100%;\n  vertical-align: ', ';\n  perspective: 800px;\n  animation: ', ' 2s 0s infinite linear;\n  animation-fill-mode: forwards;\n  position: absolute;\n  top: 0;\n  left: 0;\n']);

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

var getNumberSize = function getNumberSize(size) {
  return parseInt(size, 10);
};
var getSize = function getSize(size) {
  return typeof size === 'number' ? size + 'px' : size;
};

var rightRotateAnimation = (0, _styledComponents.keyframes)(_templateObject);

var leftRotateAnimation = (0, _styledComponents.keyframes)(_templateObject2);

var Wrapper = _styledComponents2.default.div(_templateObject3, function (_ref) {
  var size = _ref.size;
  return getSize(size);
}, function (_ref2) {
  var size = _ref2.size;
  return getSize(size);
});

var Circle = _styledComponents2.default.div(_templateObject4, function (_ref3) {
  var size = _ref3.size;
  return getSize(size);
}, function (_ref4) {
  var size = _ref4.size;
  return getSize(size);
}, function (_ref5) {
  var size = _ref5.size;
  return getNumberSize(size) / 10;
}, function (_ref6) {
  var color = _ref6.color;
  return color;
}, function (_ref7) {
  var verticalAlign = _ref7.verticalAlign;
  return getSize(verticalAlign);
}, function (_ref8) {
  var idx = _ref8.idx;
  return idx === 1 ? rightRotateAnimation : leftRotateAnimation;
});

var RingLoader = function (_Component) {
  _inherits(RingLoader, _Component);

  function RingLoader() {
    _classCallCheck(this, RingLoader);

    return _possibleConstructorReturn(this, (RingLoader.__proto__ || Object.getPrototypeOf(RingLoader)).apply(this, arguments));
  }

  _createClass(RingLoader, [{
    key: 'render',

    /**
     * @type {Object}
     */
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          loading = _props.loading,
          size = _props.size;


      if (loading) {
        var props = Object.assign({}, this.props);

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
          _react2.default.createElement(
            Wrapper,
            { size: size },
            _react2.default.createElement(Circle, _extends({}, circleProps, { idx: 1 })),
            _react2.default.createElement(Circle, _extends({}, circleProps, { idx: 2 }))
          )
        );
      }

      return null;
    }
  }]);

  return RingLoader;
}(_react.Component);

RingLoader.propTypes = propTypes;
RingLoader.defaultProps = {
  loading: true,
  color: '#ffffff',
  size: '60px'
};
exports.default = RingLoader;
module.exports = exports['default'];
//# sourceMappingURL=RingLoader.js.map