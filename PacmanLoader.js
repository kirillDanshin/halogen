'use strict';

var React = require('react');
var assign = require('domkit/appendVendorPrefix');
var insertKeyframesRule = require('domkit/insertKeyframesRule');

/**
 * @type {Object}
 */
var animations = {};

var Loader = React.createClass({
    displayName: 'Loader',

    /**
     * @type {Object}
     */
    propTypes: {
        loading: React.PropTypes.bool,
        color: React.PropTypes.string,
        size: React.PropTypes.number,
        margin: React.PropTypes.number
    },

    /**
     * @return {Object}
     */
    getDefaultProps: function getDefaultProps() {
        return {
            loading: true,
            color: '#ffffff',
            size: 25,
            margin: 2
        };
    },

    /**
     * @return {Object}
     */
    getBallStyle: function getBallStyle() {
        return {
            backgroundColor: this.props.color,
            width: this.props.size,
            height: this.props.size,
            margin: this.props.margin,
            borderRadius: '100%',
            verticalAlign: this.props.verticalAlign
        };
    },

    /**
     * @param  {Number} i
     * @return {Object}
     */
    getAnimationStyle: function getAnimationStyle(i) {
        var size = this.props.size;
        var animationName = animations[size];

        if (!animationName) {
            var keyframes = {
                '75%': {
                    opacity: 0.7
                },
                '100%': {
                    transform: 'translate(' + -4 * size + 'px,' + -size / 4 + 'px)'
                }
            };
            animationName = animations[size] = insertKeyframesRule(keyframes);
        }

        var animation = [animationName, '1s', i * 0.25 + 's', 'infinite', 'linear'].join(' ');
        var animationFillMode = 'both';

        return {
            animation: animation,
            animationFillMode: animationFillMode
        };
    },

    /**
     * @param  {Number} i
     * @return {Object}
     */
    getStyle: function getStyle(i) {
        if (i == 1) {
            var s1 = this.props.size + 'px solid transparent';
            var s2 = this.props.size + 'px solid ' + this.props.color;

            return {
                width: 0,
                height: 0,
                borderRight: s1,
                borderTop: s2,
                borderLeft: s2,
                borderBottom: s2,
                borderRadius: this.props.size,
                border: '0px solid transparent' // fix firefox/chrome/opera rendering
            };
        }

        return assign(this.getBallStyle(i), this.getAnimationStyle(i), {
            width: 10,
            height: 10,
            transform: 'translate(0, ' + -this.props.size / 4 + 'px)',
            position: 'absolute',
            top: 25,
            left: 100,
            border: '0px solid transparent' // fix firefox/chrome/opera rendering
        });
    },

    /**
     * @param  {Boolean} loading
     * @return {ReactComponent || null}
     */
    renderLoader: function renderLoader(loading) {
        if (loading) {
            var style = {
                position: 'relative',
                fontSize: 0
            };

            return React.createElement(
                'div',
                { id: this.props.id, className: this.props.className },
                React.createElement(
                    'div',
                    { style: style },
                    React.createElement('div', { style: this.getStyle(1) }),
                    React.createElement('div', { style: this.getStyle(2) }),
                    React.createElement('div', { style: this.getStyle(3) }),
                    React.createElement('div', { style: this.getStyle(4) }),
                    React.createElement('div', { style: this.getStyle(5) })
                )
            );
        }

        return null;
    },

    render: function render() {
        return this.renderLoader(this.props.loading);
    }
});

module.exports = Loader;