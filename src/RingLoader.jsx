import React, { Component } from 'react'
import PropTypes from 'prop-types'
import assign from 'domkit/appendVendorPrefix'
import insertKeyframesRule from 'domkit/insertKeyframesRule'

/**
 * @type {Object}
 */
const rightRotateKeyframes = {
  '0%': {
    transform: 'rotateX(0deg) rotateY(0deg) rotateZ(0deg)',

  },
  '100%': {
    transform: 'rotateX(180deg) rotateY(360deg) rotateZ(360deg)',
  },
}

/**
 * @type {Object}
 */
const leftRotateKeyframes = {
  '0%': {
    transform: 'rotateX(0deg) rotateY(0deg) rotateZ(0deg)',
  },
  '100%': {
    transform: 'rotateX(360deg) rotateY(180deg) rotateZ(360deg)',
  },
}

/**
 * @type {String}
 */
const rightRotateAnimationName = insertKeyframesRule(rightRotateKeyframes)

/**
 * @type {String}
 */
const leftRotateAnimationName = insertKeyframesRule(leftRotateKeyframes)

const propTypes = {
  loading: PropTypes.bool,
  color: PropTypes.string,
  size: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
  margin: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
  verticalAlign: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
}

const ptKeys = Object.keys(propTypes)

export default class RingLoader extends Component {
  /**
   * @type {Object}
   */
  static propTypes = propTypes;

  static defaultProps = {
    loading: true,
    color: '#ffffff',
    size: '60px',
  }

  /**
   * @param {String} size
   * @return {Object}
   */
  getCircleStyle = size => ({
    width: size,
    height: size,
    border: `${size / 10}px solid ${this.props.color}`,
    opacity: 0.4,
    borderRadius: '100%',
    verticalAlign: this.props.verticalAlign,
  })

  /**
   * @param  {Number} i
   * @return {Object}
   */
  getAnimationStyle = i => {
    const animation = [
      (i | 0) === 1 ? rightRotateAnimationName : leftRotateAnimationName,
      '2s', '0s', 'infinite', 'linear',
    ].join(' ')

    const animationFillMode = 'forwards'
    const perspective = '800px'

    return {
      perspective,
      animation,
      animationFillMode,
    }
  }

  /**
   * @param  {Number} i
   * @return {Object}
   */
  getStyle = i => {
    const size = parseInt(this.props.size, 10)

    if (i) {
      return assign(
        {
          border: '0px solid transparent', // fix firefox/chrome/opera rendering
        },
        this.getCircleStyle(size),
        this.getAnimationStyle(i),
        {
          position: 'absolute',
          top: 0,
          left: 0,
        },
      )
    }

    return {
      width: size,
      height: size,
      position: 'relative',
      border: '0px solid transparent', // fix firefox/chrome/opera rendering
    }
  }

  /**
   * @param  {Boolean} loading
   * @return {ReactComponent || null}
   */
  renderLoader = loading => {
    if (loading) {
      const props = Object.assign({}, this.props)

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

  render() {
    return this.renderLoader(this.props.loading)
  }
}
