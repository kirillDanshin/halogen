import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled, { keyframes } from 'styled-components'

const propTypes = {
  loading: PropTypes.bool,
  color: PropTypes.string,
  size: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
  verticalAlign: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
}

const ptKeys = Object.keys(propTypes)

const rotateAnimation = keyframes`
  100% {
    transform: rotate(360deg);
  }
`

const bounceAnimation = keyframes`
  0%, 100% {
    transform: scale(0);
  }

  50% {
    transform: scale(1.0);
  }
`

const getNumberSize = size => parseInt(size, 10) | 0
const getSize = size => typeof size === 'number' ? `${size}px` : size

const Wrapper = styled.div`
  animation: ${rotateAnimation} 2s 0s infinite linear;
  animation-fill-mode: forwards;
  width: ${({ size }) => getNumberSize(size)}px;
  height: ${({ size }) => getNumberSize(size)}px;
  position: relative;
  border: 0px solid transparent;
`

const Ball = styled.div`
  background-color: ${({ color }) => color};
  width: ${({ size }) => getNumberSize(size) / 2}px;
  height: ${({ size }) => getNumberSize(size) / 2}px;
  border-radius: 100%;
  vertical-align: ${({ verticalAlign }) => getSize(verticalAlign)};
  animation: ${bounceAnimation} 2s ${({ idx }) => (idx === 2 ? '-1s' : '0s')} infinite linear;
  animation-fill-mode: forwards;
  position: absolute;
  top: ${({ idx }) => (idx % 2 ? '0' : 'auto')};
  bottom: ${({ idx }) => (idx % 2 ? 'auto' : '0')};
  border: 0px solid transparent;
`

export default class DotLoader extends Component {
  static propTypes = propTypes;

  static defaultProps = {
    loading: true,
    color: '#ffffff',
    size: '60px',
  }

  render() {
    const { loading, size } = this.props

    if (loading) {
      const props = { ...this.props }

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
          <Wrapper size={size}>
            <Ball {...ballProps} idx={1} />
            <Ball {...ballProps} idx={2} />
          </Wrapper>
        </div>
      )
    }

    return null
  }
}
