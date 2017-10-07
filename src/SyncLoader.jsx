import React, { Component } from 'react'
import PropTypes from 'prop-types'
import assign from 'domkit/appendVendorPrefix'
import insertKeyframesRule from 'domkit/insertKeyframesRule'

/**
 * @type {Object}
 */
const keyframes = {
  '33%': {
    transform: 'translateY(10px)',
  },
  '66%': {
    transform: 'translateY(-10px)',
  },
  '100%': {
    transform: 'translateY(0)',
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

export default class SyncLoader extends Component {
  /**
   * @type {Object}
   */
  static propTypes = propTypes;

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
    const animation = [ animationName, '0.6s', `${i * 0.07}s`, 'infinite', 'ease-in-out' ].join(' ')
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
        </div>
      )
    }

    return null
  }

  render() {
    return this.renderLoader(this.props.loading)
  }
}
