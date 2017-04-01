var React = require('react');
var assign = require('domkit/appendVendorPrefix');
var insertKeyframesRule = require('domkit/insertKeyframesRule');

/**
 * @type {Object}
 */
var animations = {};

var propTypes = {
	loading: React.PropTypes.bool,
	color: React.PropTypes.string,
	size: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
	margin: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
};

var ptKeys = Object.keys(propTypes);

var PacmanLoader = React.createClass({
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
            size: 25,
            margin: 2
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
            verticalAlign: this.props.verticalAlign,
			border: '0px solid transparent' // fix firefox/chrome/opera rendering
        };
    },

    /**
     * @param  {Number} i
     * @return {Object}
     */
    getAnimationStyle: function(i) {
        var size = this.props.size;
        var animationName = animations[size];

        if (! animationName) {
            var keyframes = {
                '75%': {
                    opacity: 0.7
                },
                '100%': {
                    transform: 'translate(' + (-4 * size) + 'px,' + (-size / 4) + 'px)'
                }
            };
            animationName = animations[size] = insertKeyframesRule(keyframes);
        }

        var animation = [animationName, '1s', i*0.25 + 's', 'infinite', 'linear'].join(' ');
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
        if (i == 1) {
            var s1 =  this.props.size + 'px solid transparent';
            var s2 =  this.props.size + 'px solid ' + this.props.color;

            return {
                width: 0,
                height: 0,
                borderRight: s1,
                borderTop: s2,
                borderLeft: s2,
                borderBottom: s2,
                borderRadius: this.props.size,
            };
        }

        return assign(
            this.getBallStyle(i),
            this.getAnimationStyle(i),
            {
                width: 10,
                height: 10,
                transform: 'translate(0, '+ -this.props.size / 4 + 'px)',
                position: 'absolute',
                top: 25,
                left: 100,
            }
        );
    },

    /**
     * @param  {Boolean} loading
     * @return {ReactComponent || null}
     */
    renderLoader: function(loading) {
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

            return (
				<div {...props}>
                    <div style={style}>
                        <div style={this.getStyle(1)}/>
                        <div style={this.getStyle(2)}/>
                        <div style={this.getStyle(3)}/>
                        <div style={this.getStyle(4)}/>
                        <div style={this.getStyle(5)}/>
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

module.exports = PacmanLoader;
