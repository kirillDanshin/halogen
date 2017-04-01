'use strict';

var React = require('react');
var assign = require('domkit/appendVendorPrefix');
var insertKeyframesRule = require('domkit/insertKeyframesRule');

/**
 * @type {Object}
 */
var rightRotateKeyframes = {
    '0%': {
        transform: 'rotateX(0deg) rotateY(0deg) rotateZ(0deg)'

    },
    '100%': {
        transform: 'rotateX(180deg) rotateY(360deg) rotateZ(360deg)'
    }
};

/**
 * @type {Object}
 */
var leftRotateKeyframes = {
    '0%': {
        transform: 'rotateX(0deg) rotateY(0deg) rotateZ(0deg)'
    },
    '100%': {
        transform: 'rotateX(360deg) rotateY(180deg) rotateZ(360deg)'
    }
};

/**
 * @type {String}
 */
var rightRotateAnimationName = insertKeyframesRule(rightRotateKeyframes);

/**
 * @type {String}
 */
var leftRotateAnimationName = insertKeyframesRule(leftRotateKeyframes);

var propTypes = {
    loading: React.PropTypes.bool,
    color: React.PropTypes.string,
    size: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
    margin: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string])
};

var ptKeys = Object.keys(propTypes);

var RingLoader = React.createClass({
    displayName: 'RingLoader',

    /**
     * @type {Object}
     */
    propTypes: propTypes,

    /**
     * @return {Object}
     */
    getDefaultProps: function getDefaultProps() {
        return {
            loading: true,
            color: '#ffffff',
            size: '60px'
        };
    },

    /**
     * @param {String} size
     * @return {Object}
     */
    getCircleStyle: function getCircleStyle(size) {
        return {
            width: size,
            height: size,
            border: size / 10 + 'px solid ' + this.props.color,
            opacity: 0.4,
            borderRadius: '100%',
            verticalAlign: this.props.verticalAlign
        };
    },

    /**
     * @param  {Number} i
     * @return {Object}
     */
    getAnimationStyle: function getAnimationStyle(i) {
        var animation = [i == 1 ? rightRotateAnimationName : leftRotateAnimationName, '2s', '0s', 'infinite', 'linear'].join(' ');
        var animationFillMode = 'forwards';
        var perspective = '800px';

        return {
            perspective: perspective,
            animation: animation,
            animationFillMode: animationFillMode
        };
    },

    /**
     * @param  {Number} i
     * @return {Object}
     */
    getStyle: function getStyle(i) {
        var size = parseInt(this.props.size);

        if (i) {
            return assign({
                border: '0px solid transparent' // fix firefox/chrome/opera rendering
            }, this.getCircleStyle(size), this.getAnimationStyle(i), {
                position: 'absolute',
                top: 0,
                left: 0
            });
        }

        return {
            width: size,
            height: size,
            position: 'relative',
            border: '0px solid transparent' // fix firefox/chrome/opera rendering
        };
    },

    /**
     * @param  {Boolean} loading
     * @return {ReactComponent || null}
     */
    renderLoader: function renderLoader(loading) {
        if (loading) {
            var props = Object.assign({}, this.props);

            if (propTypes && ptKeys) {
                var klen = ptKeys.length;
                for (var i = 0; i < klen; i++) {
                    delete props[ptKeys[i]];
                }
            }

            return React.createElement(
                'div',
                props,
                React.createElement(
                    'div',
                    { style: this.getStyle(0) },
                    React.createElement('div', { style: this.getStyle(1) }),
                    React.createElement('div', { style: this.getStyle(2) })
                )
            );
        }

        return null;
    },

    render: function render() {
        return this.renderLoader(this.props.loading);
    }
});

module.exports = RingLoader;