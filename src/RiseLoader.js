var React = require('react');
var assign = require('domkit/appendVendorPrefix');
var insertKeyframesRule = require('domkit/insertKeyframesRule');

/**
 * @type {Number}
 */
var riseAmount = 30;

/**
 * @type {Object}
 */
var keyframesEven = {
    '0%': {
        transform: 'scale(1.1)'
    },
    '25%': {
        transform: 'translateY(-' + riseAmount + 'px)'
    },
    '50%': {
        transform: 'scale(0.4)'
    },
    '75%': {
        transform: 'translateY(' + riseAmount + 'px)'
    },
    '100%': {
        transform: 'translateY(0) scale(1.0)'
    }
};

/**
 * @type {Object}
 */
var keyframesOdd = {
    '0%': {
        transform: 'scale(0.4)'
    },
    '25': {
        transform: 'translateY(' + riseAmount + 'px)'
    },
    '50%': {
        transform: 'scale(1.1)'
    },
    '75%': {
        transform: 'translateY(-' + riseAmount + 'px)'
    },
    '100%': {
        transform: 'translateY(0) scale(0.75)'
    }
};

/**
 * @type {String}
 */
var animationNameEven = insertKeyframesRule(keyframesEven);

/**
 * @type {String}
 */
var animationNameOdd = insertKeyframesRule(keyframesOdd);

var propTypes = {
	loading: React.PropTypes.bool,
	color: React.PropTypes.string,
	size: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
	margin: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
};

var ptKeys = Object.keys(propTypes);

var RiseLoader = React.createClass({
    /**
     * @type {Object}
     */
    propTypes: propTypes,

    /**
     * @return {Object}
     */
    getDefaultProps: function() {
        return {
            loading: true,
            color: '#ffffff',
            size: '15px',
            margin: '2px'
        };
    },

    /**
     * @return {Object}
     */
    getBallStyle: function() {
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
    getAnimationStyle: function(i) {
        var animation = [i%2==0? animationNameEven: animationNameOdd, '1s', '0s', 'infinite', 'cubic-bezier(.15,.46,.9,.6)'].join(' ');
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
    getStyle: function(i) {
        return assign(
            this.getBallStyle(i),
            this.getAnimationStyle(i),
            {
                display: 'inline-block',
				border: '0px solid transparent' // fix firefox/chrome/opera rendering
            }
        );
    },

    /**
     * @param  {Boolean} loading
     * @return {ReactComponent || null}
     */
    renderLoader: function(loading) {
        if (loading) {
			var props = Object.assign({}, this.props);

			if (propTypes && ptKeys) {
				var klen = ptKeys.length;
				for (var i = 0; i < klen; i++) {
					delete props[ptKeys[i]];
				}
			}

            return (
				<div {...props}>
                    <div style={this.getStyle(1)}></div>
                    <div style={this.getStyle(2)}></div>
                    <div style={this.getStyle(3)}></div>
                    <div style={this.getStyle(4)}></div>
                    <div style={this.getStyle(5)}></div>
                </div>
            );
        }

        return null;
    },

    render: function() {
        return this.renderLoader(this.props.loading);
    }
});

module.exports = RiseLoader;
