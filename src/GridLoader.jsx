import React, { Component } from 'react';
import assign from 'domkit/appendVendorPrefix';
import insertKeyframesRule from 'domkit/insertKeyframesRule';

/**
 * @type {Object}
 */
const keyframes = {
	'0%': {
		transform: 'scale(1)',
	},
	'50%': {
		transform: 'scale(0.5)',
		opacity: 0.7,
	},
	'100%': {
		transform: 'scale(1)',
		opacity: 1,
	},
};

/**
 * @type {String}
 */
const animationName = insertKeyframesRule(keyframes);

/**
 * @param  {Number} top
 * @return {Number}
 */
function random(top) {
	return Math.random() * top;
}

const propTypes = {
	loading: React.PropTypes.bool,
	color: React.PropTypes.string,
	size: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
	margin: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
};

const ptKeys = Object.keys(propTypes);

export default class GridLoader extends Component {
	static propTypes: propTypes;

	getDefaultProps = () => ({
		loading: true,
		color: '#ffffff',
		size: '15px',
		margin: '2px',
	})

	getBallStyle = () => ({
		backgroundColor: this.props.color,
		width: this.props.size,
		height: this.props.size,
		margin: this.props.margin,
		borderRadius: '100%',
		verticalAlign: this.props.verticalAlign,
	})

	getAnimationStyle = () => {
		const animationDuration = `${(random(100) / 100) + 0.6}s`;
		const animationDelay = `${(random(100) / 100) - 0.2}s`;

		const animation = [
			animationName,
			animationDuration,
			animationDelay,
			'infinite',
			'ease',
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
			const style = {
				width: (parseFloat(this.props.size) * 3) + parseFloat(this.props.margin) * 6,
				fontSize: 0,
			};

			const props = { ...this.props };

			if (propTypes && ptKeys) {
				const klen = ptKeys.length;
				for (let i = 0; i < klen; i++) {
					delete props[ptKeys[i]];
				}
			}

			return (
				<div {...props}>
					<div style={style}>
						<div style={this.getStyle(1)} />
						<div style={this.getStyle(2)} />
						<div style={this.getStyle(3)} />
						<div style={this.getStyle(4)} />
						<div style={this.getStyle(5)} />
						<div style={this.getStyle(6)} />
						<div style={this.getStyle(7)} />
						<div style={this.getStyle(8)} />
						<div style={this.getStyle(9)} />
					</div>
				</div>
			);
		}

		return null;
	}
}
