import React, { Component } from 'react';
import assign from 'domkit/appendVendorPrefix';
import insertKeyframesRule from 'domkit/insertKeyframesRule';

/**
 * @type {Object}
 */
const keyframes = {
    '25%': {
        transform: 'rotateX(180deg) rotateY(0)'
    },
    '50%': {
        transform: 'rotateX(180deg) rotateY(180deg)'
    },
    '75%': {
        transform: 'rotateX(0) rotateY(180deg)'
    },
    '100%': {
        transform: 'rotateX(0) rotateY(0)'
    }
};

/**
 * @type {String}
 */
const animationName = insertKeyframesRule(keyframes);

const propTypes = {
	loading: React.PropTypes.bool,
	color: React.PropTypes.string,
	size: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
	margin: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
};

const ptKeys = Object.keys(propTypes);

export default class SquareLoader extends Component {
    /**
     * @type {Object}
     */
    static propTypes = propTypes;

    /**
     * @return {Object}
     */
    getDefaultProps = () => ({
        loading: true,
        color: '#ffffff',
        size: '50px'
    })

    /**
     * @return {Object}
     */
    getSquareStyle = () => ({
        backgroundColor: this.props.color,
        width: this.props.size,
        height: this.props.size,
        verticalAlign: this.props.verticalAlign
    })

    /**
     * @param  {Number} i
     * @return {Object}
     */
    getAnimationStyle = i => {
        const animation = [animationName, '3s', '0s', 'infinite', 'cubic-bezier(.09,.57,.49,.9)'].join(' ');
        const animationFillMode = 'both';
        const perspective = '100px';

        return {
            perspective: perspective,
            animation: animation,
            animationFillMode: animationFillMode
        };
    }

    /**
     * @param  {Number} i
     * @return {Object}
     */
    getStyle = i => assign(
        this.getSquareStyle(i),
        this.getAnimationStyle(i),
        {
            display: 'inline-block',
            border: '0px solid transparent' // fix firefox/chrome/opera rendering
        }
    )

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
                    <div style={this.getStyle()}></div>
                </div>
            );
        }

        return null;
    }

    render() {
        return this.renderLoader(this.props.loading);
    }
}
