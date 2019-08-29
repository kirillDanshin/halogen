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
  25% {
    transform: perspective(100px) rotateX(180deg) rotateY(0);
  }

  50% {
    transform: perspective(100px) rotateX(180deg) rotateY(180deg);
  }

  75% {
    transform: perspective(100px) rotateX(0) rotateY(180deg);
  }

  100% {
    transform: perspective(100px) rotateX(0) rotateY(0);
  }
`

const Sharp = styled.div`
  border: 0px solid transparent;
  width: 0;
  height: 0;
  border-left: ${({ size }) => getSize(size)} solid transparent;
  border-right: ${({ size }) => getSize(size)} solid transparent;
  border-bottom: ${({ size }) => getSize(size)} solid ${({ color }) => color};
  vertical-align: ${({ verticalAlign }) => getSize(verticalAlign)};
  animation: ${animation} 3s 0s infinite cubic-bezier(.09,.57,.49,.9);
  animation-fill-mode: both;
  display: inline-block;
`

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

      const sharpProps = ptKeys.reduce((acc, key) => (key === 'loading' ? acc : {
        ...acc,
        [key]: this.props[key],
      }), {})

      return (
        <div {...props}>
          <Sharp {...sharpProps} />
        </div>
      )
    }

    return null
  }
}
