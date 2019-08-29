'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templateObject = _taggedTemplateLiteral(['\n  50% {\n    opacity: 0.3;\n  }\n\n  100% {\n    opacity: 1;\n  }\n'], ['\n  50% {\n    opacity: 0.3;\n  }\n\n  100% {\n    opacity: 1;\n  }\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  background-color: ', ';\n  height: ', ';\n  width: ', ';\n  margin: ', ';\n  border-radius: ', ';\n  vertical-align: ', ';\n  top: ', 'px;\n  left: ', 'px;\n  transform: ', ';\n  animation: ', ' 1.2s ', 's infinite ease-in-out;\n  animation-fill-mode: both;\n  position: absolute;\n  border: 0px solid transparent;\n'], ['\n  background-color: ', ';\n  height: ', ';\n  width: ', ';\n  margin: ', ';\n  border-radius: ', ';\n  vertical-align: ', ';\n  top: ', 'px;\n  left: ', 'px;\n  transform: ', ';\n  animation: ', ' 1.2s ', 's infinite ease-in-out;\n  animation-fill-mode: both;\n  position: absolute;\n  border: 0px solid transparent;\n']);

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
  height: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
  width: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
  margin: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
  radius: _propTypes2.default.string,
  verticalAlign: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string])
};

var ptKeys = Object.keys(propTypes);

var radius = 20;
var quarter = radius / 2 + radius / 5.5;

var lines = {
  l1: {
    top: radius,
    left: 0,
    transform: 'none'
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
    left: 0,
    transform: 'none'
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

var animation = (0, _styledComponents.keyframes)(_templateObject);

var getSize = function getSize(size) {
  return typeof size === 'number' ? size + 'px' : size;
};

var Line = _styledComponents2.default.div(_templateObject2, function (_ref) {
  var color = _ref.color;
  return color;
}, function (_ref2) {
  var height = _ref2.height;
  return getSize(height);
}, function (_ref3) {
  var width = _ref3.width;
  return getSize(width);
}, function (_ref4) {
  var margin = _ref4.margin;
  return getSize(margin);
}, function (_ref5) {
  var radius = _ref5.radius;
  return radius;
}, function (_ref6) {
  var verticalAlign = _ref6.verticalAlign;
  return getSize(verticalAlign);
}, function (_ref7) {
  var idx = _ref7.idx;
  return lines['l' + idx].top;
}, function (_ref8) {
  var idx = _ref8.idx;
  return lines['l' + idx].left;
}, function (_ref9) {
  var idx = _ref9.idx;
  return lines['l' + idx].transform;
}, animation, function (_ref10) {
  var idx = _ref10.idx;
  return idx * 0.12;
});

var FadeLoader = function (_Component) {
  _inherits(FadeLoader, _Component);

  function FadeLoader() {
    _classCallCheck(this, FadeLoader);

    return _possibleConstructorReturn(this, (FadeLoader.__proto__ || Object.getPrototypeOf(FadeLoader)).apply(this, arguments));
  }

  _createClass(FadeLoader, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var loading = this.props.loading;


      if (loading) {
        var style = {
          position: 'relative',
          fontSize: 0
        };

        var props = _extends({}, this.props);

        if (propTypes && ptKeys) {
          var klen = ptKeys.length;
          for (var i = 0; i < klen; i++) {
            delete props[ptKeys[i]];
          }
        }

        var lineProps = ptKeys.reduce(function (acc, key) {
          return key === 'loading' ? acc : _extends({}, acc, _defineProperty({}, key, _this2.props[key]));
        }, {});

        return _react2.default.createElement(
          'div',
          props,
          _react2.default.createElement(
            'div',
            { style: style },
            Array.from({ length: 8 }).map(function (_, i) {
              return _react2.default.createElement(Line, _extends({ key: i }, lineProps, { idx: i + 1 }));
            })
          )
        );
      }

      return null;
    }
  }]);

  return FadeLoader;
}(_react.Component);

FadeLoader.propTypes = propTypes;
FadeLoader.defaultProps = {
  loading: true,
  color: '#ffffff',
  height: '15px',
  width: '5px',
  margin: '2px',
  radius: '2px'
};
exports.default = FadeLoader;
module.exports = exports['default'];
//# sourceMappingURL=FadeLoader.js.map