'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templateObject = _taggedTemplateLiteral(['\n  25% {\n    transform: rotateX(180deg) rotateY(0);\n  }\n\n  50% {\n    transform: rotateX(180deg) rotateY(180deg);\n  }\n\n  75% {\n    transform: rotateX(0) rotateY(180deg);\n  }\n\n  100% {\n    transform: rotateX(0) rotateY(0);\n  }\n'], ['\n  25% {\n    transform: rotateX(180deg) rotateY(0);\n  }\n\n  50% {\n    transform: rotateX(180deg) rotateY(180deg);\n  }\n\n  75% {\n    transform: rotateX(0) rotateY(180deg);\n  }\n\n  100% {\n    transform: rotateX(0) rotateY(0);\n  }\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  background-color: ', ';\n  width: ', ';\n  height: ', ';\n  vertical-align: ', ';\n  perspective: 100px;\n  animation: ', ' 3s 0s infinite cubic-bezier(.09,.57,.49,.9);\n  animation-fill-mode: both;\n  display: inline-block;\n  border: 0px solid transparent;\n'], ['\n  background-color: ', ';\n  width: ', ';\n  height: ', ';\n  vertical-align: ', ';\n  perspective: 100px;\n  animation: ', ' 3s 0s infinite cubic-bezier(.09,.57,.49,.9);\n  animation-fill-mode: both;\n  display: inline-block;\n  border: 0px solid transparent;\n']);

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

var Square = _styledComponents2.default.div(_templateObject2, function (_ref) {
  var color = _ref.color;
  return color;
}, function (_ref2) {
  var size = _ref2.size;
  return getSize(size);
}, function (_ref3) {
  var size = _ref3.size;
  return getSize(size);
}, function (_ref4) {
  var verticalAlign = _ref4.verticalAlign;
  return getSize(verticalAlign);
}, animation);

var SquareLoader = function (_Component) {
  _inherits(SquareLoader, _Component);

  function SquareLoader() {
    _classCallCheck(this, SquareLoader);

    return _possibleConstructorReturn(this, (SquareLoader.__proto__ || Object.getPrototypeOf(SquareLoader)).apply(this, arguments));
  }

  _createClass(SquareLoader, [{
    key: 'render',

    /**
     * @type {Object}
     */
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

        var squareProps = ptKeys.reduce(function (acc, key) {
          return key === 'loading' ? acc : _extends({}, acc, _defineProperty({}, key, _this2.props[key]));
        }, {});

        return _react2.default.createElement(
          'div',
          props,
          _react2.default.createElement(Square, squareProps)
        );
      }

      return null;
    }
  }]);

  return SquareLoader;
}(_react.Component);

SquareLoader.propTypes = propTypes;
SquareLoader.defaultProps = {
  loading: true,
  color: '#ffffff',
  size: '50px'
};
exports.default = SquareLoader;
module.exports = exports['default'];
//# sourceMappingURL=SquareLoader.js.map