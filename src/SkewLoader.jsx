import React, { Component } from 'react'
import PropTypes from 'prop-types'
import assign from 'domkit/appendVendorPrefix'
import insertKeyframesRule from 'domkit/insertKeyframesRule'

/**
 * @type {Object}
 */
const keyframes = {
  '25%': {
    transform: 'perspective(100px) rotateX(180deg) rotateY(0)',
  },
  '50%': {
    transform: 'perspective(100px) rotateX(180deg) rotateY(180deg)',
  },
  '75%': {
    transform: 'perspective(100px) rotateX(0) rotateY(180deg)',
  },
  '100%': {
    transform: 'perspective(100px) rotateX(0) rotateY(0)',
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
  verticalAlign: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
}

const ptKeys = Object.keys(propTypes)

export default class SkewLoader extends Component {
  /**
   * @type {Object}
   */
  static propTypes = propTypes;

  static defaultProps = {
    loading: true,
    color: '#fff',
    size: '20px',
  }

  /**
   * @return {Object}
   */
  getSharpStyle = () => ({
    width: 0,
    height: 0,
    borderLeft: `${this.props.size} solid transparent`,
    borderRight: `${this.props.size} solid transparent`,
    borderBottom: `${this.props.size} solid ${this.props.color}`,
    verticalAlign: this.props.verticalAlign,
  })

  /**
   * @param  {Number} i
   * @return {Object}
   */
  getAnimationStyle = () => {
    const animation = [ animationName, '3s', '0s', 'infinite', 'cubic-bezier(.09,.57,.49,.9)' ].join(' ')
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
    {
      border: '0px solid transparent', // fix firefox/chrome/opera rendering
    },
    this.getSharpStyle(i),
    this.getAnimationStyle(i),
    {
      display: 'inline-block',
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
          <div style={this.getStyle()} />
        </div>
      )
    }

    return null
  }

  render() {
    return this.renderLoader(this.props.loading)
  }
}
