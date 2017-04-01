var React = require('react');
var assign = require('domkit/appendVendorPrefix');
var insertKeyframesRule = require('domkit/insertKeyframesRule');

/**
 * @type {Object}
 */
var keyframes = {
    '25%': {
        transform: 'perspective(100px) rotateX(180deg) rotateY(0)'
    },
    '50%': {
        transform: 'perspective(100px) rotateX(180deg) rotateY(180deg)'
    },
    '75%': {
        transform: 'perspective(100px) rotateX(0) rotateY(180deg)'
    },
    '100%': {
        transform: 'perspective(100px) rotateX(0) rotateY(0)'
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
};

var ptKeys = Object.keys(propTypes);

var SkewLoader = React.createClass({
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
            size: '20px'
        };
    },

    /**
     * @return {Object}
     */
    getSharpStyle: function() {
        return {
            width: 0,
            height: 0,
            borderLeft: this.props.size + ' solid transparent',
            borderRight: this.props.size + ' solid transparent',
            borderBottom: this.props.size + ' solid '+ this.props.color,
            verticalAlign: this.props.verticalAlign
        };
    },

    /**
     * @param  {Number} i
     * @return {Object}
     */
    getAnimationStyle: function(i) {
        var animation = [animationName, '3s', '0s', 'infinite', 'cubic-bezier(.09,.57,.49,.9)'].join(' ');
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
			{
				border: '0px solid transparent' // fix firefox/chrome/opera rendering
			},
            this.getSharpStyle(i),
            this.getAnimationStyle(i),
            {
                display: 'inline-block'
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
                    <div style={this.getStyle()}></div>
                </div>
            );
        };

        return null;
    },

    render: function() {
        return this.renderLoader(this.props.loading);
    }
});

module.exports = SkewLoader;
