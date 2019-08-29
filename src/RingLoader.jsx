import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled, { keyframes } from 'styled-components'

const propTypes = {
  loading: PropTypes.bool,
  color: PropTypes.string,
  size: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
  margin: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
  verticalAlign: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
}

const ptKeys = Object.keys(propTypes)

const getNumberSize = size => parseInt(size, 10)
const getSize = size => typeof size === 'number' ? `${size}px` : size

const rightRotateAnimation = keyframes`
  0% {
    transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
  }

  100% {
    transform: rotateX(180deg) rotateY(360deg) rotateZ(360deg);
  }
`

const leftRotateAnimation = keyframes`
  0% {
    transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
  }

  100% {
    transform: rotateX(360deg) rotateY(180deg) rotateZ(360deg);
  }
`

const Wrapper = styled.div`
  width: ${({ size }) => getSize(size)};
  height: ${({ size }) => getSize(size)};
  position: relative;
  border: 0px solid transparent;
`

const Circle = styled.div`
  border: 0px solid transparent;
  width: ${({ size }) => getSize(size)};
  height: ${({ size }) => getSize(size)};
  border: ${({ size }) => getNumberSize(size) / 10}px solid ${({ color }) => color};
  opacity: 0.4;
  border-radius: 100%;
  vertical-align: ${({ verticalAlign }) => getSize(verticalAlign)};
  perspective: 800px;
  animation: ${({ idx }) => idx === 1 ? rightRotateAnimation : leftRotateAnimation} 2s 0s infinite linear;
  animation-fill-mode: forwards;
  position: absolute;
  top: 0;
  left: 0;
`

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

  render() {
    const { loading, size } = this.props

    if (loading) {
      const props = Object.assign({}, this.props)

      if (propTypes && ptKeys) {
        const klen = ptKeys.length
        for (let i = 0; i < klen; i++) {
          delete props[ptKeys[i]]
        }
      }

      const circleProps = ptKeys.reduce((acc, key) => (key === 'loading' ? acc : {
        ...acc,
        [key]: this.props[key],
      }), {})

      return (
        <div {...props}>
          <Wrapper size={size}>
            <Circle {...circleProps} idx={1} />
            <Circle {...circleProps} idx={2} />
          </Wrapper>
        </div>
      )
    }

    return null
  }
}
