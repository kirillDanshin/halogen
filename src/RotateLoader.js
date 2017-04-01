var React = require('react');
var assign = require('domkit/appendVendorPrefix');
var insertKeyframesRule = require('domkit/insertKeyframesRule');

/**
 * @type {Object}
 */
var keyframes = {
    '0%': {
        transform: 'rotate(0deg)'
    },
    '50%': {
        transform: 'rotate(180deg)'
    },
    '100%': {
        transform: 'rotate(360deg)'
    }
};

/**
 * @type {String}
 */
var animationName = insertKeyframesRule(keyframes);

var propTypes = {
	loading: React.PropTypes.bool,
	color: React.PropTypes.string,
	size: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
	margin: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
};

var ptKeys = Object.keys(propTypes);

var RotateLoader = React.createClass({
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
        var animation = [animationName, '1s', '0s', 'infinite', 'cubic-bezier(.7,-.13,.22,.86)'].join(' ');
        var animationFillMode = 'both';

        return {
            animation: animation,
            animationFillMode: animationFillMode,
        };
    },

    /**
     * @param  {Number} i
     * @return {Object}
     */
    getStyle: function(i) {
        if (i) {
            return assign(
                this.getBallStyle(i),
                {
                    opacity: '0.8',
                    position: 'absolute',
                    top: 0,
                    left: i%2 ? -28 : 25,
					border: '0px solid transparent' // fix firefox/chrome/opera rendering
                }
            );
        }

        return assign(
            this.getBallStyle(i),
            this.getAnimationStyle(i),
            {
                display: 'inline-block',
                position: 'relative',
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
                    <div style={this.getStyle()}>
                        <div style={this.getStyle(1)}></div>
                        <div style={this.getStyle(2)}></div>
                    </div>
                </div>
            );
        }

        return null;
    },

    render: function() {
        return this.renderLoader(this.props.loading);
    }
});

module.exports = RotateLoader;
