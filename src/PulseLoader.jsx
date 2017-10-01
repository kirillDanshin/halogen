import React, { Component } from 'react';
import PropTypes from 'prop-types';
import assign from 'domkit/appendVendorPrefix';
import insertKeyframesRule from 'domkit/insertKeyframesRule';

/**
 * @type {Object}
 */
const keyframes = {
    '0%': {
        transform: 'scale(1)',
        opacity: 1
    },
    '45%': {
        transform: 'scale(0.1)',
        opacity: 0.7
    },
    '80%': {
        transform: 'scale(1)',
        opacity: 1
    }
};

/**
 * @type {String}
 */
const animationName = insertKeyframesRule(keyframes);

const propTypes = {
	loading: PropTypes.bool,
	color: PropTypes.string,
	size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	margin: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

const ptKeys = Object.keys(propTypes);

export default class PulseLoader extends Component {
    /**
     * @type {Object}
     */
    static propTypes = propTypes;

    static defaultProps = {
        loading: true,
        color: '#ffffff',
        size: '15px',
        margin: '2px'
    }

    /**
     * @return {Object}
     */
    getBallStyle = () => ({
        backgroundColor: this.props.color,
        width: this.props.size,
        height: this.props.size,
        margin: this.props.margin,
        borderRadius: '100%',
        verticalAlign: this.props.verticalAlign
    })

    /**
     * @param  {Number} i
     * @return {Object}
     */
    getAnimationStyle = i => {
        const animation = [animationName, '0.75s', (i * 0.12) + 's', 'infinite', 'cubic-bezier(.2,.68,.18,1.08)'].join(' ');
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
    getStyle = i => (assign(
        this.getBallStyle(i),
        this.getAnimationStyle(i),
        {
            display: 'inline-block',
            border: '0px solid transparent' // fix firefox/chrome/opera rendering
        }
    ))

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
                </div>
            );
        }

        return null;
    }

    render() {
        return this.renderLoader(this.props.loading);
    }
}

