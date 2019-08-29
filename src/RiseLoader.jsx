import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled, { keyframes } from 'styled-components'

/**
 * @type {Number}
 */
const riseAmount = 30

const propTypes = {
  loading: PropTypes.bool,
  color: PropTypes.string,
  size: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
  margin: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
  verticalAlign: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
}

const ptKeys = Object.keys(propTypes)

const getSize = size => typeof size === 'number' ? `${size}px` : size

const animationEven = keyframes`
  0% {
    transform: scale(1.1);
  }

  25% {
    transform: translateY(-${riseAmount}px);
  }

  50% {
    transform: scale(0.4);
  }

  75% {
    transform: translateY(${riseAmount}px);
  }

  100% {
    transform: translateY(0) scale(1.0);
  }
`

const animationOdd = keyframes`
  0% {
    transform: scale(0.4);
  }

  25% {
    transform: translateY(${riseAmount}px);
  }

  50% {
    transform: scale(1.1);
  }

  75% {
    transform: translateY(-${riseAmount}px);
  }

  100% {
    transform: translateY(0) scale(0.75);
  }
`

const Ball = styled.div`
  background-color: ${({ color }) => color};
  width: ${({ size }) => getSize(size)};
  height: ${({ size }) => getSize(size)};
  margin: ${({ margin }) => getSize(margin)};
  border-radius: 100%;
  vertical-align: ${({ verticalAlign }) => getSize(verticalAlign)};
  animation: ${({ idx }) => idx % 2 === 0 ? animationEven : animationOdd} 1s 0s infinite cubic-bezier(.15,.46,.9,.6);
  animation-fill-mode: both;
  display: inline-block;
  border: 0px solid transparent;
`

export default class RiseLoader extends Component {
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

  render() {
    const { loading } = this.props

    if (loading) {
      const props = Object.assign({}, this.props)

      if (propTypes && ptKeys) {
        const klen = ptKeys.length
        for (let i = 0; i < klen; i++) {
          delete props[ptKeys[i]]
        }
      }

      const ballProps = ptKeys.reduce((acc, key) => (key === 'loading' ? acc : {
        ...acc,
        [key]: this.props[key],
      }), {})

      return (
        <div {...props}>
          {
            Array.from({ length: 5 }).map((_, i) => (
              <Ball key={i} {...ballProps} idx={i + 1} />
            ))
          }
        </div>
      )
    }

    return null
  }
}
