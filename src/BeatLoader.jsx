import React, { Component } from 'react';
import assign from 'domkit/appendVendorPrefix';
import insertKeyframesRule from 'domkit/insertKeyframesRule';

/**
 * @type {Object}
 */
const keyframes = {
	'50%': {
		transform: 'scale(0.75)',
		opacity: 0.2,
	},
	'100%': {
		transform: 'scale(1)',
		opacity: 1,
	},
};

const animationName = insertKeyframesRule(keyframes);

const propTypes = {
	loading: React.PropTypes.bool,
	color: React.PropTypes.string,
	size: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
	margin: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
};

const ptKeys = Object.keys(propTypes);

export default class BeatLoader extends Component {
	static propTypes = propTypes;

    /**
     * @return {Object}
     */
	getDefaultProps = () => ({
		loading: true,
		color: '#ffffff',
		size: '15px',
		margin: '2px',
	})

    /**
     * @return {Object}
     */
	getBallStyle = () => ({
		backgroundColor: this.props.color,
		width: this.props.size,
		height: this.props.size,
		margin: this.props.margin,
		borderRadius: '100%',
		verticalAlign: this.props.verticalAlign,
	})

    /**
     * @param  {Number} i
     * @return {Object}
     */
	getAnimationStyle = i => {
		const animation = [
			animationName,
			'0.7s',
			`${i % 2 ? 0 : 0.35}s`,
			'infinite',
			'linear',
		].join(' ');
		const animationFillMode = 'both';

		return {
			animation,
			animationFillMode,
		};
	}

    /**
     * @param  {Number} i
     * @return {Object}
     */
	getStyle = i => (
		assign(
			this.getBallStyle(i),
			this.getAnimationStyle(i),
			{
				display: 'inline-block',
				border: '0px solid transparent', // fix firefox/chrome/opera rendering
			}
		)
	)

	render() {
		const { loading } = this.props;

		if (loading) {
			const props = { ...this.props };

			if (propTypes && ptKeys) {
				const klen = ptKeys.length;
				for (let i = 0; i < klen; i++) {
					delete props[ptKeys[i]];
				}
			}

			return (
				<div {...props}>
					<div style={this.getStyle(1)} />
					<div style={this.getStyle(2)} />
					<div style={this.getStyle(3)} />
				</div>
			);
		}

		return null;
	}
}
