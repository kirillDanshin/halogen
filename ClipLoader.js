'use strict';

var React = require('react');
var assign = require('domkit/appendVendorPrefix');
var insertKeyframesRule = require('domkit/insertKeyframesRule');

/**
 * @type {Object}
 */
var keyframes = {
    '0%': {
        transform: 'rotate(0deg) scale(1)'
    },
    '50%': {
        transform: 'rotate(180deg) scale(0.8)'
    },
    '100%': {
        transform: 'rotate(360deg) scale(1)'
    }
};

/**
 * @type {String}
 */
var animationName = insertKeyframesRule(keyframes);

var Loader = React.createClass({
    displayName: 'Loader',

    /**
     * @type {Object}
     */
    propTypes: {
        loading: React.PropTypes.bool,
        color: React.PropTypes.string,
        size: React.PropTypes.string
    },

    /**
     * @return {Object}
     */
    getDefaultProps: function getDefaultProps() {
        return {
            loading: true,
            color: '#ffffff',
            size: '35px'
        };
    },

    /**
     * @return {Object}
     */
    getBallStyle: function getBallStyle() {
        return {
            width: this.props.size,
            height: this.props.size,
            border: '2px solid',
            borderColor: this.props.color,
            borderBottomColor: 'transparent',
            borderRadius: '100%',
            background: 'transparent !important',
            verticalAlign: this.props.verticalAlign
        };
    },

    /**
     * @param  {Number} i
     * @return {Object}
     */
    getAnimationStyle: function getAnimationStyle(i) {
        var animation = [animationName, '0.75s', '0s', 'infinite', 'linear'].join(' ');
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
        return assign(this.getBallStyle(i), this.getAnimationStyle(i), {
            display: 'inline-block',
            border: '0px solid transparent' // fix firefox/chrome/opera rendering
        });
    },

    /**
     * @param  {Boolean} loading
     * @return {ReactComponent || null}
     */
    renderLoader: function renderLoader(loading) {
        if (loading) {
            return React.createElement(
                'div',
                { id: this.props.id, className: this.props.className },
                React.createElement('div', { style: this.getStyle() })
            );
        }

        return null;
    },

    render: function render() {
        return this.renderLoader(this.props.loading);
    }
});

module.exports = Loader;