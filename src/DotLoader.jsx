import React, { Component } from 'react'
import PropTypes from 'prop-types'
import assign from 'domkit/appendVendorPrefix'
import insertKeyframesRule from 'domkit/insertKeyframesRule'

/**
 * @type {Object}
 */
const rotateKeyframes = {
  '100%': {
    transform: 'rotate(360deg)',
  },
}

/**
 * @type {Object}
 */
const bounceKeyframes = {
  '0%, 100%': {
    transform: 'scale(0)',
  },
  '50%': {
    transform: 'scale(1.0)',
  },
}

/**
 * @type {String}
 */
const rotateAnimationName = insertKeyframesRule(rotateKeyframes)

/**
 * @type {String}
 */
const bounceAnimationName = insertKeyframesRule(bounceKeyframes)

const propTypes = {
  loading: PropTypes.bool,
  color: PropTypes.string,
  size: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
  margin: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
  verticalAlign: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
}

const ptKeys = Object.keys(propTypes)

export default class DotLoader extends Component {
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
    backgroundColor: this.props.color,
    width: size,
    height: size,
    borderRadius: '100%',
    verticalAlign: this.props.verticalAlign,
  })

  /**
   * @param  {Number} i
   * @return {Object}
   */
  getAnimationStyle = i => {
    const animation = [
      i === 0 ? rotateAnimationName : bounceAnimationName,
      '2s',
      i === 2 ? '-1s' : '0s',
      'infinite',
      'linear',
    ].join(' ')
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
    const size = parseInt(this.props.size)
    const ballSize = size / 2

    if (i) {
      return assign(
        this.getBallStyle(ballSize),
        this.getAnimationStyle(i),
        {
          position: 'absolute',
          top: i % 2 ? 0 : 'auto',
          bottom: i % 2 ? 'auto' : 0,
          border: '0px solid transparent', // fix firefox/chrome/opera rendering
        },
      )
    }

    return assign(
      this.getAnimationStyle(i),
      {
        width: size,
        height: size,
        position: 'relative',
        border: '0px solid transparent', // fix firefox/chrome/opera rendering
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
