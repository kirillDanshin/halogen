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

const getSize = size => typeof size === 'number' ? `${size}px` : size

const animation = keyframes`
  25% {
    transform: rotateX(180deg) rotateY(0);
  }

  50% {
    transform: rotateX(180deg) rotateY(180deg);
  }

  75% {
    transform: rotateX(0) rotateY(180deg);
  }

  100% {
    transform: rotateX(0) rotateY(0);
  }
`

const Square = styled.div`
  background-color: ${({ color }) => color};
  width: ${({ size }) => getSize(size)};
  height: ${({ size }) => getSize(size)};
  vertical-align: ${({ verticalAlign }) => getSize(verticalAlign)};
  perspective: 100px;
  animation: ${animation} 3s 0s infinite cubic-bezier(.09,.57,.49,.9);
  animation-fill-mode: both;
  display: inline-block;
  border: 0px solid transparent;
`

export default class SquareLoader extends Component {
    /**
     * @type {Object}
     */
  static propTypes = propTypes;

  static defaultProps = {
    loading: true,
    color: '#ffffff',
    size: '50px',
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

      const squareProps = ptKeys.reduce((acc, key) => (key === 'loading' ? acc : {
        ...acc,
        [key]: this.props[key],
      }), {})

      return (
        <div {...props}>
          <Square {...squareProps} />
        </div>
      )
    }

    return null
  }
}
