import React, { Component } from 'react'
import PropTypes from 'prop-types'
import assign from 'domkit/appendVendorPrefix'
import insertKeyframesRule from 'domkit/insertKeyframesRule'

/**
 * @type {Number}
 */
const riseAmount = 30

/**
 * @type {Object}
 */
const keyframesEven = {
  '0%': {
    transform: 'scale(1.1)',
  },
  '25%': {
    transform: `translateY(-${riseAmount}px)`,
  },
  '50%': {
    transform: 'scale(0.4)',
  },
  '75%': {
    transform: `translateY(${riseAmount}px)`,
  },
  '100%': {
    transform: 'translateY(0) scale(1.0)',
  },
}

/**
 * @type {Object}
 */
const keyframesOdd = {
  '0%': {
    transform: 'scale(0.4)',
  },
  25: {
    transform: `translateY(${riseAmount}px)`,
  },
  '50%': {
    transform: 'scale(1.1)',
  },
  '75%': {
    transform: `translateY(-${riseAmount}px)`,
  },
  '100%': {
    transform: 'translateY(0) scale(0.75)',
  },
}

/**
 * @type {String}
 */
const animationNameEven = insertKeyframesRule(keyframesEven)

/**
 * @type {String}
 */
const animationNameOdd = insertKeyframesRule(keyframesOdd)

const propTypes = {
  loading: PropTypes.bool,
  color: PropTypes.string,
  size: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
  margin: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
  verticalAlign: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
}

const ptKeys = Object.keys(propTypes)

export default class RiseLoader extends Component {
  /**
   * @type {Object}
   */
  propTypes = propTypes;

  static defaultProps = {
    loading: true,
    color: '#ffffff',
    size: '15px',
    margin: '2px',
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
    verticalAlign: this.props.verticalAlign,
  })

  /**
   * @param  {Number} i
   * @return {Object}
   */
  getAnimationStyle = i => {
    const animation = [
      i % 2 === 0 ? animationNameEven : animationNameOdd,
      '1s', '0s', 'infinite', 'cubic-bezier(.15,.46,.9,.6)',
    ].join(' ')
    const animationFillMode = 'both'

    return {
      animation,
      animationFillMode,
    }
  }

  /**
   * @param  {Number} i
   * @return {Object}
   */
  getStyle = i => assign(
    this.getBallStyle(i),
    this.getAnimationStyle(i),
    {
      display: 'inline-block',
      border: '0px solid transparent', // fix firefox/chrome/opera rendering
    },
  )

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
          <div style={this.getStyle(1)} />
          <div style={this.getStyle(2)} />
          <div style={this.getStyle(3)} />
          <div style={this.getStyle(4)} />
          <div style={this.getStyle(5)} />
        </div>
      )
    }

    return null
  }

  render() {
    return this.renderLoader(this.props.loading)
  }
}
