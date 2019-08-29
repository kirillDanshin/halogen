import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled, { keyframes, css } from 'styled-components'

const propTypes = {
  loading: PropTypes.bool,
  color: PropTypes.string,
  size: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
  verticalAlign: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
}

const ptKeys = Object.keys(propTypes)

const getNumberSize = size => parseInt(size, 10) | 0
const getSize = size => typeof size === 'number' ? `${size}px` : size

const animation = keyframes`
  100% {
    transform: rotate(360deg);
  }
`

const Wrapper = styled.div`
  animation: ${animation} 0.6s 0s infinite linear;
  animation-fill-mode: forwards;
  position: relative;
  border: 0px solid transparent;
`

const Ball = styled.div`
  border: 0px solid transparent;
  width: ${({ size, idx }) => idx === 1 ? getNumberSize(size) / 7 : getNumberSize(size)}px;
  height: ${({ size, idx }) => idx === 1 ? getNumberSize(size) / 7 : getNumberSize(size)}px;
  border-radius: 100%;
  vertical-align: ${({ verticalAlign }) => getSize(verticalAlign)};
  ${({ idx }) => idx === 1 ? css`
    animation: ${animation} 0.6s 0s infinite linear;
    animation-fill-mode: forwards;
    background-color: ${({ color }) => color};
    opacity: 0.8;
    position: absolute;
    top: ${({ size }) => getNumberSize(size) / 2 - getNumberSize(size) / 14}px;
  ` : css`
    border: ${({ size, color }) => `${getNumberSize(size) / 7}px solid ${color}`};
    opacity: 0.1;
  `}
`

export default class MoonLoader extends Component {
  static propTypes = propTypes;

  static defaultProps = {
    loading: true,
    color: '#ffffff',
    size: '60px',
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

      const ballProps = ptKeys.reduce((acc, key) => (key === 'loading' ? acc : {
        ...acc,
        [key]: this.props[key],
      }), {})

      return (
        <div {...props}>
          <Wrapper>
            <Ball {...ballProps} idx={1} />
            <Ball {...ballProps} idx={2} />
          </Wrapper>
        </div>
      )
    }

    return null
  }
}
