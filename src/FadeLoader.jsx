import React, { Component } from 'react'
import PropTypes from 'prop-types'
import assign from 'domkit/appendVendorPrefix'
import insertKeyframesRule from 'domkit/insertKeyframesRule'

/**
 * @type {Object}
 */
const keyframes = {
  '50%': {
    opacity: 0.3,
  },
  '100%': {
    opacity: 1,
  },
}

/**
 * @type {String}
 */
const animationName = insertKeyframesRule(keyframes)

const propTypes = {
  loading: PropTypes.bool,
  color: PropTypes.string,
  height: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
  width: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
  margin: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
  radius: PropTypes.string,
  verticalAlign: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
}

const ptKeys = Object.keys(propTypes)

export default class FadeLoader extends Component {
  static propTypes = propTypes;

  static defaultProps = {
    loading: true,
    color: '#ffffff',
    height: '15px',
    width: '5px',
    margin: '2px',
    radius: '2px',
  }

  getLineStyle = () => ({
    backgroundColor: this.props.color,
    height: this.props.height,
    width: this.props.width,
    margin: this.props.margin,
    borderRadius: this.props.radius,
    verticalAlign: this.props.verticalAlign,
  })

  /**
   * @param  {Number} i
   * @return {Object}
   */
  getAnimationStyle = i => {
    const animation = [
      animationName,
      '1.2s',
      `${i * 0.12}s`,
      'infinite',
      'ease-in-out',
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
  getPosStyle = i => {
    const radius = 20
    const quarter = (radius / 2) + (radius / 5.5)

    const lines = {
      l1: {
        top: radius,
        left: 0,
      },
      l2: {
        top: quarter,
        left: quarter,
        transform: 'rotate(-45deg)',
      },
      l3: {
        top: 0,
        left: radius,
        transform: 'rotate(90deg)',
      },
      l4: {
        top: -quarter,
        left: quarter,
        transform: 'rotate(45deg)',
      },
      l5: {
        top: -radius,
        left: 0,
      },
      l6: {
        top: -quarter,
        left: -quarter,
        transform: 'rotate(-45deg)',
      },
      l7: {
        top: 0,
        left: -radius,
        transform: 'rotate(90deg)',
      },
      l8: {
        top: quarter,
        left: -quarter,
        transform: 'rotate(45deg)',
      },
    }

    return lines[`l${i}`]
  }

  /**
   * @param  {Number} i
   * @return {Object}
   */
  getStyle = i => (
    assign(
      this.getLineStyle(i),
      this.getPosStyle(i),
      this.getAnimationStyle(i),
      {
        position: 'absolute',
        border: '0px solid transparent', // fix firefox/chrome/opera rendering
      },
    )
  )

  render() {
    const { loading } = this.props

    if (loading) {
      const style = {
        position: 'relative',
        fontSize: 0,
      }

      const props = { ...this.props }

      if (propTypes && ptKeys) {
        const klen = ptKeys.length
        for (let i = 0; i < klen; i++) {
          delete props[ptKeys[i]]
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
          </div>
        </div>
      )
    }

    return null
  }
}
