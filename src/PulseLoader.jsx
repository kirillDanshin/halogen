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
  0% {
    transform: scale(1);
    opacity: 1;
  }

  45% {
    transform: scale(0.1);
    opacity: 0.7;
  }

  80% {
    transform: scale(1);
    opacity: 1;
  }
`

const Ball = styled.div`
  background-color: ${({ color }) => color};
  width: ${({ size }) => getSize(size)};
  height: ${({ size }) => getSize(size)};
  margin: ${({ margin }) => getSize(margin)};
  border-radius: 100%;
  vertical-align: ${({ verticalAlign }) => getSize(verticalAlign)};
  animation: ${animation} 0.75s ${({ idx }) => (idx * 0.12)}s infinite cubic-bezier(.2,.68,.18,1.08);
  animation-fill-mode: both;
  display: inline-block;
  border: 0px solid transparent;
`

export default class PulseLoader extends Component {
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
          <Ball {...ballProps} idx={1} />
          <Ball {...ballProps} idx={2} />
          <Ball {...ballProps} idx={3} />
        </div>
      )
    }

    return null
  }
}

