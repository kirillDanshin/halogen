'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templateObject = _taggedTemplateLiteral(['\n  75% {\n    opacity: 0.7;\n  }\n\n  100% {\n    transform: translate(', 'px, ', 'px);\n  }\n'], ['\n  75% {\n    opacity: 0.7;\n  }\n\n  100% {\n    transform: translate(', 'px, ', 'px);\n  }\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  width: 0;\n  height: 0;\n  border-right: ', ' solid transparent;\n  border-top: ', ' solid ', ';\n  border-left: ', ' solid ', ';\n  border-bottom: ', ' solid ', ';\n  border-radius: ', ';\n'], ['\n  width: 0;\n  height: 0;\n  border-right: ', ' solid transparent;\n  border-top: ', ' solid ', ';\n  border-left: ', ' solid ', ';\n  border-bottom: ', ' solid ', ';\n  border-radius: ', ';\n']),
    _templateObject3 = _taggedTemplateLiteral(['\n  background-color: ', ';\n  margin: ', ';\n  border-radius: 100%;\n  vertical-align: ', ';\n  border: 0px solid transparent;\n  animation: ', ' 1s ', 's infinite linear;\n  animation-fill-mode: both;\n  width: ', 'px;\n  height: ', 'px;\n  transform: translate(0, -', 'px);\n  position: absolute;\n  top: ', ';\n  left: ', 'px;\n'], ['\n  background-color: ', ';\n  margin: ', ';\n  border-radius: 100%;\n  vertical-align: ', ';\n  border: 0px solid transparent;\n  animation: ', ' 1s ', 's infinite linear;\n  animation-fill-mode: both;\n  width: ', 'px;\n  height: ', 'px;\n  transform: translate(0, -', 'px);\n  position: absolute;\n  top: ', ';\n  left: ', 'px;\n']);

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
  return parseInt(size, 10) | 0;
};
var getSize = function getSize(size) {
  return typeof size === 'number' ? size + 'px' : size;
};

var getAnimation = function getAnimation(size) {
  return (0, _styledComponents.keyframes)(_templateObject, -4 * getNumberSize(size), -getNumberSize(size) / 4);
};

var Pacman = _styledComponents2.default.div(_templateObject2, function (_ref) {
  var size = _ref.size;
  return getSize(size);
}, function (_ref2) {
  var size = _ref2.size;
  return getSize(size);
}, function (_ref3) {
  var color = _ref3.color;
  return color;
}, function (_ref4) {
  var size = _ref4.size;
  return getSize(size);
}, function (_ref5) {
  var color = _ref5.color;
  return color;
}, function (_ref6) {
  var size = _ref6.size;
  return getSize(size);
}, function (_ref7) {
  var color = _ref7.color;
  return color;
}, function (_ref8) {
  var size = _ref8.size;
  return getSize(size);
});

var Ball = _styledComponents2.default.div(_templateObject3, function (_ref9) {
  var color = _ref9.color;
  return color;
}, function (_ref10) {
  var margin = _ref10.margin;
  return getSize(margin);
}, function (_ref11) {
  var verticalAlign = _ref11.verticalAlign;
  return getSize(verticalAlign);
}, function (_ref12) {
  var size = _ref12.size;
  return getAnimation(size);
}, function (_ref13) {
  var idx = _ref13.idx;
  return idx * 0.25;
}, function (_ref14) {
  var size = _ref14.size;
  return getNumberSize(size) / 2.5;
}, function (_ref15) {
  var size = _ref15.size;
  return getNumberSize(size) / 2.5;
}, function (_ref16) {
  var size = _ref16.size;
  return getNumberSize(size) / 5;
}, function (_ref17) {
  var size = _ref17.size;
  return getSize(size);
}, function (_ref18) {
  var size = _ref18.size;
  return getNumberSize(size) * 4;
});

var PacmanLoader = function (_Component) {
  _inherits(PacmanLoader, _Component);

  function PacmanLoader() {
    _classCallCheck(this, PacmanLoader);

    return _possibleConstructorReturn(this, (PacmanLoader.__proto__ || Object.getPrototypeOf(PacmanLoader)).apply(this, arguments));
  }

  _createClass(PacmanLoader, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          loading = _props.loading,
          size = _props.size,
          color = _props.color;


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

        var ballProps = ptKeys.reduce(function (acc, key) {
          return key === 'loading' ? acc : _extends({}, acc, _defineProperty({}, key, _this2.props[key]));
        }, {});

        return _react2.default.createElement(
          'div',
          props,
          _react2.default.createElement(
            'div',
            { style: style },
            _react2.default.createElement(Pacman, { size: size, color: color }),
            _react2.default.createElement(Ball, _extends({}, ballProps, { idx: 1 })),
            _react2.default.createElement(Ball, _extends({}, ballProps, { idx: 2 })),
            _react2.default.createElement(Ball, _extends({}, ballProps, { idx: 3 })),
            _react2.default.createElement(Ball, _extends({}, ballProps, { idx: 4 }))
          )
        );
      }

      return null;
    }

    /**
     * @return {Object}
     */

  }]);

  return PacmanLoader;
}(_react.Component);

PacmanLoader.propTypes = propTypes;
PacmanLoader.defaultProps = {
  loading: true,
  color: '#fff',
  size: 25,
  margin: 2
};
exports.default = PacmanLoader;
module.exports = exports['default'];
//# sourceMappingURL=PacmanLoader.js.map