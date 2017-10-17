import React, { Component } from 'react'
import PropTypes from 'prop-types'
import assign from 'domkit/appendVendorPrefix'
import insertKeyframesRule from 'domkit/insertKeyframesRule'

/**
 * @type {Object}
 */
const keyframes = {
  '100%': {
    transform: 'rotate(360deg)',
  },
}

/**
 * @type {String}
 */
const animationName = insertKeyframesRule(keyframes)

const propTypes = {
  loading: PropTypes.bool,
  color: PropTypes.string,
  size: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
  margin: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
  verticalAlign: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
}

const ptKeys = Object.keys(propTypes)

export default class MoonLoader extends Component {
  static propTypes = propTypes;

  static defaultProps = {
    loading: true,
    color: '#ffffff',
    size: '60px',
  }

  /**
   * @param  {String} size
   * @return {Object}
   */
  getBallStyle = size => ({
    width: size,
    height: size,
    borderRadius: '100%',
    verticalAlign: this.props.verticalAlign,
  })

  getAnimationStyle = () => {
    const animation = [ animationName, '0.6s', '0s', 'infinite', 'linear' ].join(' ')
    const animationFillMode = 'forwards'

    return {
      animation,
      animationFillMode,
    }
  }

  /**
   * @param  {Number} i
   * @return {Object}
   */
  getStyle = i => {
    const size = parseInt(this.props.size, 10) | 0
    const moonSize = size / 7

    if (i === 1) {
      return assign(
        {
          border: '0px solid transparent', // fix firefox/chrome/opera rendering
        },
        this.getBallStyle(moonSize),
        this.getAnimationStyle(i),
        {
          backgroundColor: this.props.color,
          opacity: '0.8',
          position: 'absolute',
          top: size / 2 - moonSize / 2,
        },
      )
    } else if (i === 2) {
      return assign(
        {
          border: '0px solid transparent', // fix firefox/chrome/opera rendering
        },
        this.getBallStyle(size),
        {
          border: `${moonSize}px solid ${this.props.color}`,
          opacity: 0.1,
        },
      )
    }
    return assign(
      {
        border: '0px solid transparent', // fix firefox/chrome/opera rendering
      },
      this.getAnimationStyle(i),
      {
        position: 'relative',
      },
    )
  }

  render() {
    const { loading } = this.props

    if (loading) {
      const props = { ...this.props }

      if (propTypes && ptKeys) {
        const klen = ptKeys.length
        for (let i = 0; i < klen; i++) {
          delete props[ptKeys[i]]
        }
      }

      return (
        <div {...props}>
          <div style={this.getStyle(0)}>
            <div style={this.getStyle(1)} />
            <div style={this.getStyle(2)} />
          </div>
        </div>
      )
    }

    return null
  }
}
