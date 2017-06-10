import React, { Component } from 'react';
import assign from 'domkit/appendVendorPrefix';
import insertKeyframesRule from 'domkit/insertKeyframesRule';

const keyframes = {
	'0%, 100%': {
		transform: 'scale(0)',
	},
	'50%': {
		transform: 'scale(1.0)',
	},
};

const animationName = insertKeyframesRule(keyframes);

const propTypes = {
	loading: React.PropTypes.bool,
	color: React.PropTypes.string,
	size: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
};

const ptKeys = Object.keys(propTypes);

export default class BounceLoader extends Component {
	static propTypes = propTypes;

	getDefaultProps = () => ({
		loading: true,
		color: '#ffffff',
		size: '60px',
	})

	getBallStyle = () => ({
		backgroundColor: this.props.color,
		width: this.props.size,
		height: this.props.size,
		borderRadius: '100%',
		opacity: 0.6,
		position: 'absolute',
		top: 0,
		left: 0,
		verticalAlign: this.props.verticalAlign,
	})

    /**
     * @param  {Number} i
     * @return {Object}
     */
	getAnimationStyle = i => {
		const animation = [
			animationName,
			'2s',
			i === 1 ? '1s' : '0s',
			'infinite',
			'ease-in-out',
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
	getStyle = i => {
		if (i) {
			return assign(
				this.getBallStyle(i),
				this.getAnimationStyle(i),
				{
					border: '0px solid transparent', // fix firefox/chrome/opera rendering
				}
			);
		}

		return assign(
			{
				width: this.props.size,
				height: this.props.size,
				position: 'relative',
				border: '0px solid transparent', // fix firefox/chrome/opera rendering
			}
		);
	}

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
					<div style={this.getStyle()}>
						<div style={this.getStyle(1)} />
						<div style={this.getStyle(2)} />
					</div>
				</div>
			);
		}

		return null;
	}
}
