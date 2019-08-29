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

const getSize = size => typeof size === 'number' ? `${size}px` : size

const animation = keyframes`
  0%, 100% {
    transform: scale(0);
  }

  50% {
    transform: scale(1.0);
  }
`

const Wrapper = styled.div`
  width: ${({ size }) => getSize(size)};
  height: ${({ size }) => getSize(size)};
  position: relative;
  border: 0px solid transparent;
`

const Ball = styled.div`
  background-color: ${({ color }) => color};
  width: ${({ size }) => getSize(size)};
  height: ${({ size }) => getSize(size)};
  border-radius: 100%;
  opacity: 0.6;
  position: absolute;
  top: 0;
  left: 0;
  vertical-align: ${({ verticalAlign }) => getSize(verticalAlign)};
  animation: ${animation} 2s ${({ idx }) => (idx === 1 ? '1s' : '0s')} infinite ease-in-out;
  animation-fill-mode: both;
  border: 0px solid transparent;
`

export default class BounceLoader extends Component {
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
