import React, { Component } from 'react';
import assign from 'domkit/appendVendorPrefix';
import insertKeyframesRule from 'domkit/insertKeyframesRule';

/**
 * @type {Object}
 */
const keyframes = {
	'0%': {
		transform: 'rotate(0deg) scale(1)',
	},
	'50%': {
		transform: 'rotate(180deg) scale(0.8)',
	},
	'100%': {
		transform: 'rotate(360deg) scale(1)',
	},
};

/**
 * @type {String}
 */
const animationName = insertKeyframesRule(keyframes);

const propTypes = {
	loading: React.PropTypes.bool,
	color: React.PropTypes.string,
	size: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
};

const ptKeys = Object.keys(propTypes);

export default class ClipLoader extends Component {
	static propTypes: propTypes;

	getDefaultProps = () => ({
		loading: true,
		color: '#ffffff',
		size: '35px',
	})

	getBallStyle = () => (
		{
			width: this.props.size,
			height: this.props.size,
			border: '2px solid',
			borderColor: this.props.color,
			borderBottomColor: 'transparent',
			borderRadius: '100%',
			background: 'transparent !important',
			verticalAlign: this.props.verticalAlign,
		}
	)

	getAnimationStyle = () => {
		const animation = [animationName, '0.75s', '0s', 'infinite', 'linear'].join(' ');
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
			{
				border: '0px solid transparent', // fix firefox/chrome/opera rendering
			},
			this.getBallStyle(i),
			this.getAnimationStyle(),
			{
				display: 'inline-block',
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
					<div style={this.getStyle()} />
				</div>
			);
		}

		return null;
	}
}
