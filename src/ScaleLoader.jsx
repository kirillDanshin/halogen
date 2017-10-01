import React, { Component } from 'react';
import PropTypes from 'prop-types';
import assign from 'domkit/appendVendorPrefix';
import insertKeyframesRule from 'domkit/insertKeyframesRule';

/**
 * @type {Object}
 */
const keyframes = {
    '0%': {
        transform: 'scaley(1.0)'
    },
    '50%': {
        transform: 'scaley(0.4)'
    },
    '100%': {
        transform: 'scaley(1.0)'
    }
};

/**
 * @type {String}
 */
const animationName = insertKeyframesRule(keyframes);

const propTypes = {
	loading: PropTypes.bool,
	color: PropTypes.string,
	height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	margin: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	radius: PropTypes.string
};

const ptKeys = Object.keys(propTypes);

export default class ScaleLoader extends Component {
    /**
     * @type {Object}
     */
    static propTypes = propTypes;

    static defaultProps = {
        loading: true,
        color: '#ffffff',
        height: '35px',
        width: '4px',
        margin: '2px',
        radius: '2px'
    }

    /**
     * @return {Object}
     */
    getLineStyle = () => ({
        backgroundColor: this.props.color,
        height: this.props.height,
        width: this.props.width,
        margin: this.props.margin,
        borderRadius: this.props.radius,
        verticalAlign: this.props.verticalAlign,
    })

    /**
     * @param  {Number} i
     * @return {Object}
     */
    getAnimationStyle = i => {
        const animation = [animationName, '1s', (i * 0.1) + 's', 'infinite', 'cubic-bezier(.2,.68,.18,1.08)'].join(' ');
        const animationFillMode = 'both';

        return {
            animation: animation,
            animationFillMode: animationFillMode
        };
    }

    /**
     * @param  {Number} i
     * @return {Object}
     */
    getStyle = i => assign(
        this.getLineStyle(i),
        this.getAnimationStyle(i),
        {
            display: 'inline-block',
            border: '0px solid transparent' // fix firefox/chrome/opera rendering
        }
    );

    /**
     * @param  {Boolean} loading
     * @return {ReactComponent || null}
     */
    renderLoader = loading => {
        if (loading) {
			const props = Object.assign({}, this.props);

			if (propTypes && ptKeys) {
				const klen = ptKeys.length;
				for (let i = 0; i < klen; i++) {
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
    }

    render() {
        return this.renderLoader(this.props.loading);
    }
}
