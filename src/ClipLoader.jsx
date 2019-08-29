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
  0% {
    transform: rotate(0deg) scale(1);
  }

  50% {
    transform: rotate(180deg) scale(0.8);
  }

  100% {
    transform: rotate(360deg) scale(1);
  }
`

const Circle = styled.div`
  width: ${({ size }) => getSize(size)};
  height: ${({ size }) => getSize(size)};
  border: 2px solid;
  border-color: ${({ color }) => color};
  border-bottom-color: transparent;
  border-radius: 100%;
  background: transparent !important;
  vertical-align: ${({ verticalAlign }) => getSize(verticalAlign)};
  animation: ${animation} 0.75s 0s infinite linear;
  animation-fill-mode: both;
  display: inline-block;
`

export default class ClipLoader extends Component {
  static propTypes = propTypes;

  static defaultProps = {
    loading: true,
    color: '#ffffff',
    size: '35px',
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

      const circleProps = ptKeys.reduce((acc, key) => (key === 'loading' ? acc : {
        ...acc,
        [key]: this.props[key],
      }), {})

      return (
        <div {...props}>
          <Circle {...circleProps} />
        </div>
      )
    }

    return null
  }
}
